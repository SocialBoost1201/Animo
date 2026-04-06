import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { Resend } from 'resend';

function getErrorMessage(error: unknown, fallback: string) {
  return error instanceof Error ? error.message : fallback;
}

// Vercel Cronから呼び出されるAPI（毎週木曜・金曜の指定時刻に実行）
export async function GET(request: Request) {
  // クロンの認証ハッシュ（セキュリティ）を確認
  const authHeader = request.headers.get('authorization');
  if (
    process.env.CRON_SECRET &&
    authHeader !== `Bearer ${process.env.CRON_SECRET}`
  ) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const supabase = await createClient();

    // 次回月曜日を算出（このスクリプトは木〜金に実行される想定のため、そのまま+7日をベースにするか日付計算）
    const now = new Date();
    // 基準日を「今日+3日（金曜なら月曜、木曜なら日曜）」などとするよりも、
    // Date.now() + 7 days の getWeeklyMonday() と同じ計算をAPI内で行う
    const day = now.getDay();
    const diffToMonday = now.getDate() - day + (day === 0 ? -6 : 1);
    const thisMonday = new Date(now.setDate(diffToMonday));
    thisMonday.setHours(0, 0, 0, 0);
    
    // 来週の月曜日
    const nextMonday = new Date(thisMonday);
    nextMonday.setDate(nextMonday.getDate() + 7);
    const targetWeekMonday = new Date(nextMonday.getTime() - nextMonday.getTimezoneOffset() * 60000).toISOString().split('T')[0];

    // アクティブキャストを取得し、アカウント紐付け(auth_user_id)のあるユーザーを抽出
    const { data: casts, error: castsError } = await supabase
      .from('casts')
      .select('id, stage_name, auth_user_id')
      .eq('is_active', true)
      .not('auth_user_id', 'is', null);

    if (castsError || !casts) {
      throw new Error('Failed to fetch casts');
    }

    // 次週のシフト提出データを取得
    const { data: submissions, error: subError } = await supabase
      .from('shift_submissions')
      .select('cast_id, status')
      .eq('target_week_monday', targetWeekMonday);

    if (subError) throw new Error(subError.message);

    // 提出がない、または rejected のキャストをフィルタリング
    const unsubmittedCasts = casts.filter(cast => {
      const sub = submissions?.find(s => s.cast_id === cast.id);
      return !sub || sub.status === 'rejected';
    });

    if (unsubmittedCasts.length === 0) {
      return NextResponse.json({ success: true, message: 'All casts have submitted shifts.' });
    }

    // 未提出全員のメールアドレスを取得するために Admin Auth API を使用（Service Roleが必要）
    // NOTE: Cron API内からは service_role 権限で Supabase にアクセスする必要があるため、Supabase client を専用キーで作り直す
    const { createClient: createSupabaseClient } = await import('@supabase/supabase-js');
    const supabaseAdmin = createSupabaseClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    );
    
    const { data: usersData, error: usersError } = await supabaseAdmin.auth.admin.listUsers();
    if (usersError) throw new Error('Failed to list auth users');

    const resend = new Resend(process.env.RESEND_API_KEY!);
    const errors: Array<{ castId: string; error: unknown }> = [];

    // メール送信ループ
    for (const cast of unsubmittedCasts) {
      const authUser = usersData.users.find(u => u.id === cast.auth_user_id);
      if (authUser && authUser.email) {
        try {
          await resend.emails.send({
            from: 'Animo Notification <onboarding@resend.dev>',
            to: authUser.email,
            subject: '[シフトを提出してください]',
            html: `
              <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 24px;">
                <p>シフトの提出期限が近づいております。<br>本日の23：55分までに提出しないと罰金が発生してしますので、急いで提出してください。</p>
                <div style="margin-top: 24px;">
                  <a href="${process.env.NEXT_PUBLIC_APP_URL}/cast/dashboard" style="color: #0066cc; text-decoration: underline;">
                    ${process.env.NEXT_PUBLIC_APP_URL}/cast/dashboard
                  </a>
                </div>
              </div>
            `,
          });
        } catch (e) {
          errors.push({ castId: cast.id, error: e });
        }
      }
    }

    return NextResponse.json({ 
      success: true, 
      targetWeek: targetWeekMonday,
      notifiedCount: unsubmittedCasts.length,
      errors 
    });

  } catch (error: unknown) {
    console.error('Cron Error:', error);
    return NextResponse.json({ error: getErrorMessage(error, 'Internal Server Error') }, { status: 500 });
  }
}
