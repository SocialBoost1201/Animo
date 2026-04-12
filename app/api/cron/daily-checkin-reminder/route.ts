import { NextResponse } from 'next/server'
import { createClient as createSupabaseClient } from '@supabase/supabase-js'
import { Resend } from 'resend'
import { sendLineGroupMessage } from '@/lib/line'

/**
 * 本日確認 自動メール送信 Cron
 *
 * Vercel Cron: 0 8 * * 1-6  (UTC 08:00 = JST 17:00, 月〜土)
 * vercel.json に以下を追記すること
 * { "path": "/api/cron/daily-checkin-reminder", "schedule": "0 8 * * 1-6" }
 *
 * 処理フロー:
 * 1. JST 日曜かどうかを確認し、日曜なら早期終了
 * 2. 当日出勤予定のキャストを抽出（承認済みシフトから）
 * 3. checkin_mail_logs で同日送信済みキャストを除外
 * 4. メールアドレスを Auth Admin API から取得
 * 5. Resend でメール送信
 * 6. checkin_mail_logs に結果を記録
 */
export async function GET(request: Request) {
  // ── セキュリティ: Vercel が付与する Authorization ヘッダーを検証 ──
  const authHeader = request.headers.get('authorization')
  if (
    process.env.CRON_SECRET &&
    authHeader !== `Bearer ${process.env.CRON_SECRET}`
  ) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    // ── 1. JST 日付を計算（UTC+9）──
    const nowUtc = new Date()
    const jstOffset = 9 * 60 * 60 * 1000
    const nowJst = new Date(nowUtc.getTime() + jstOffset)
    const dayOfWeekJst = nowJst.getUTCDay() // 0=日, 1=月, ..., 6=土

    if (dayOfWeekJst === 0) {
      return NextResponse.json({ skipped: true, reason: '日曜日は送信しません' })
    }

    // JST の今日の日付文字列（YYYY-MM-DD）
    const todayJst = nowJst.toISOString().split('T')[0]

    // ── Service Role クライアント（RLS をバイパス） ──
    const supabaseAdmin = createSupabaseClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    )

    // ── 2. 当日出勤予定キャストを抽出 ──
    // 当該日の属する週の月曜日（target_week_monday）を算出
    const diffToMonday = nowJst.getUTCDate() - dayOfWeekJst + (dayOfWeekJst === 0 ? -6 : 1)
    const mondayJst = new Date(nowJst)
    mondayJst.setUTCDate(diffToMonday)
    const targetWeekMonday = mondayJst.toISOString().split('T')[0]

    // shift_submissions.shifts_data は { [date]: { type, start, end } } 形式の JSON
    const { data: currentWeekShifts, error: shiftsError } = await supabaseAdmin
      .from('shift_submissions')
      .select('cast_id, shifts_data, casts(id, stage_name, auth_user_id, is_active)')
      .eq('target_week_monday', targetWeekMonday)
      .eq('status', 'approved')

    if (shiftsError) throw new Error(`シフト取得エラー: ${shiftsError.message}`)

    const todayCasts: { cast_id: string; auth_user_id: string; stage_name: string }[] = []

    for (const row of currentWeekShifts ?? []) {
      const shiftsData = row.shifts_data as Record<string, { type: string }> | null
      if (!shiftsData || !shiftsData[todayJst]) continue
      if (shiftsData[todayJst].type !== 'work') continue

      const cast = row.casts as unknown as {
        id: string
        stage_name: string
        auth_user_id: string | null
        is_active: boolean
      } | null
      if (!cast || !cast.is_active || !cast.auth_user_id) continue

      todayCasts.push({
        cast_id: cast.id,
        auth_user_id: cast.auth_user_id,
        stage_name: cast.stage_name,
      })
    }

    if (todayCasts.length === 0) {
      return NextResponse.json({
        success: true,
        date: todayJst,
        message: '本日出勤予定のキャストがいません',
        sentCount: 0,
      })
    }

    // ── 3. 同日送信済みキャストを除外 ──
    const { data: alreadySent } = await supabaseAdmin
      .from('checkin_mail_logs')
      .select('cast_id')
      .eq('sent_date', todayJst)

    const alreadySentIds = new Set((alreadySent ?? []).map((r: { cast_id: string }) => r.cast_id))

    const targets = todayCasts.filter((c) => !alreadySentIds.has(c.cast_id))

    if (targets.length === 0) {
      return NextResponse.json({
        success: true,
        date: todayJst,
        message: '全員に送信済みです（二重送信スキップ）',
        sentCount: 0,
      })
    }

    // ── 4. Auth Admin API からメールアドレスを取得 ──
    const { data: usersData, error: usersError } = await supabaseAdmin.auth.admin.listUsers({
      perPage: 1000,
    })
    if (usersError) throw new Error(`Auth ユーザー取得エラー: ${usersError.message}`)

    const emailMap = new Map(usersData.users.map((u) => [u.id, u.email]))

    // ── 5. Resend でメール送信 + ログ記録 ──
    const resend = new Resend(process.env.RESEND_API_KEY!)
    const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://club-animo.jp'
    const dashboardUrl = `${appUrl}/cast/dashboard`

    const results = { sent: 0, failed: 0, skipped: 0 }

    for (const target of targets) {
      const email = emailMap.get(target.auth_user_id)
      if (!email) {
        results.skipped++
        continue
      }

      let status: 'sent' | 'failed' = 'failed'

      try {
        await resend.emails.send({
          from: `Club Animo <${process.env.RESEND_FROM_EMAIL ?? 'noreply@club-animo.com'}>`,
          to: email,
          subject: '【Club Animo】本日の確認をお願いします',
          html: buildEmailHtml(target.stage_name, dashboardUrl),
        })
        status = 'sent'
        results.sent++
      } catch (mailErr) {
        console.error(`メール送信失敗 cast_id=${target.cast_id}`, mailErr)
        results.failed++
      }

      // ── 6. 送信ログを記録（upsert で二重防止） ──
      await supabaseAdmin
        .from('checkin_mail_logs')
        .upsert(
          {
            cast_id: target.cast_id,
            sent_date: todayJst,
            sent_at: new Date().toISOString(),
            email,
            status,
          },
          { onConflict: 'cast_id,sent_date' }
        )
    }

    let lineReminderSent = false
    if ((alreadySent ?? []).length === 0) {
      const lineMessage = [
        '【本日の出勤確認と来店予定確認】',
        '本日出勤予定のキャストは、19:00までに提出をお願いします。',
        '',
        '提出内容',
        '・本日の出勤確認',
        '・来店予定 / 同伴予定',
        '',
        `提出URL: ${dashboardUrl}`,
      ].join('\n')

      const lineResult = await sendLineGroupMessage(lineMessage)
      if (!lineResult.ok) {
        console.warn('[LINE] daily-checkin-reminder のグループ通知に失敗しました', lineResult)
      } else {
        lineReminderSent = true
      }
    }

    return NextResponse.json({
      success: true,
      date: todayJst,
      targets: targets.length,
      lineReminderSent,
      ...results,
    })
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : String(error)
    console.error('Cron daily-checkin-reminder エラー:', message)
    return NextResponse.json({ error: message }, { status: 500 })
  }
}

// ── メール HTML テンプレート ──
function buildEmailHtml(stageName: string, dashboardUrl: string): string {
  return `
<!DOCTYPE html>
<html lang="ja">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>本日の確認</title>
</head>
<body style="margin:0; padding:0; background-color:#f5f5f5; font-family:'Helvetica Neue',Helvetica,Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="padding:32px 16px;">
    <tr>
      <td align="center">
        <table width="100%" style="max-width:520px; background:#ffffff; border-radius:8px; overflow:hidden; box-shadow:0 2px 8px rgba(0,0,0,0.08);">
          
          <!-- ヘッダー -->
          <tr>
            <td style="background-color:#171717; padding:28px 32px;">
              <p style="margin:0; font-size: 12px; letter-spacing:0.3em; color:#B39257; text-transform:uppercase;">Club Animo</p>
              <p style="margin:8px 0 0; font-size:20px; color:#ffffff; font-weight:bold; letter-spacing:0.05em;">本日の確認をお願いします</p>
            </td>
          </tr>

          <!-- 本文 -->
          <tr>
            <td style="padding:32px;">
              <p style="margin:0 0 16px; font-size:15px; color:#333; line-height:1.8;">
                ${stageName} さん、こんにちは。<br>
                本日の出勤前に、以下の確認フォームへの入力をお願いします。
              </p>

              <!-- 確認内容 -->
              <table width="100%" cellpadding="0" cellspacing="0" style="background:#f9f9f9; border-radius:6px; margin:20px 0;">
                <tr>
                  <td style="padding:20px;">
                    <p style="margin:0 0 12px; font-size: 12px; font-weight:bold; letter-spacing:0.2em; color:#999; text-transform:uppercase;">確認内容</p>
                    <ul style="margin:0; padding:0 0 0 18px; font-size:14px; color:#444; line-height:2;">
                      <li>出勤予定に変更はありますか？</li>
                      <li>来店予定（お客様のご来店）はありますか？</li>
                      <li>同伴のご予定はありますか？</li>
                    </ul>
                  </td>
                </tr>
              </table>

              <!-- 来店予定入力案内 -->
              <table width="100%" cellpadding="0" cellspacing="0" style="border:1px solid #e8d5a3; border-radius:6px; margin:20px 0;">
                <tr>
                  <td style="padding:20px;">
                    <p style="margin:0 0 12px; font-size: 12px; font-weight:bold; letter-spacing:0.2em; color:#B39257; text-transform:uppercase;">来店予定がある場合</p>
                    <ul style="margin:0; padding:0 0 0 18px; font-size:14px; color:#444; line-height:2;">
                      <li>来店時間</li>
                      <li>お客様名</li>
                      <li>種別：<strong>同伴</strong> または <strong>来店予定</strong></li>
                    </ul>
                    <p style="margin:12px 0 0; font-size:12px; color:#888;">
                      ※ 複数件ある場合は1件ずつ入力してください。
                    </p>
                  </td>
                </tr>
              </table>

              <!-- CTAボタン -->
              <table width="100%" cellpadding="0" cellspacing="0" style="margin:28px 0 0;">
                <tr>
                  <td align="center">
                    <a href="${dashboardUrl}"
                       style="display:inline-block; background-color:#171717; color:#ffffff; font-size:14px; font-weight:bold; letter-spacing:0.15em; text-decoration:none; padding:16px 48px; border-radius:4px;">
                      確認フォームを開く
                    </a>
                  </td>
                </tr>
              </table>

            </td>
          </tr>

          <!-- フッター -->
          <tr>
            <td style="padding:20px 32px; border-top:1px solid #f0f0f0;">
              <p style="margin:0; font-size: 12px; color:#bbb; line-height:1.8; text-align:center;">
                このメールは Club Animo のシステムから自動送信されています。<br>
                ログインがまだの場合は
                <a href="${dashboardUrl.replace('/cast/dashboard', '/cast/login')}" style="color:#B39257;">こちらからログイン</a>
                してください。
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>
  `.trim()
}
