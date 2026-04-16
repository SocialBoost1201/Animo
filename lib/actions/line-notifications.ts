'use server'

import { revalidatePath } from 'next/cache'
import { createServiceClient } from '@/lib/supabase/service'
import { sendLineGroupMessage, sendLineMessage } from '@/lib/line'

// ── 型定義 ──────────────────────────────────────────────────────────────────

export type ScheduleType = 'daily' | 'weekly' | 'monthly' | 'once'
export type TargetType = 'group' | 'individual'
export type NotificationStatus = 'sent' | 'failed' | 'skipped'

export type LineNotification = {
  id: string
  name: string
  content: string
  target_type: TargetType
  target_id: string | null
  schedule_type: ScheduleType
  schedule_time: string          // "HH:MM"
  schedule_days: number[] | null  // 0=日〜6=土
  schedule_dates: number[] | null // 1〜31
  schedule_once_at: string | null
  is_enabled: boolean
  last_sent_at: string | null
  created_at: string
  updated_at: string
}

export type LineNotificationLog = {
  id: string
  notification_id: string
  sent_at: string
  status: NotificationStatus
  message_preview: string | null
  error_reason: string | null
}

export type CreateLineNotificationInput = {
  name: string
  content: string
  target_type: TargetType
  target_id?: string
  schedule_type: ScheduleType
  schedule_time: string
  schedule_days?: number[]
  schedule_dates?: number[]
  schedule_once_at?: string
}

// ── LINE連携済みキャスト一覧（個別通知の送信先選択用） ───────────────────────

export type LinkedCast = {
  cast_id: string
  stage_name: string
  line_user_id: string
}

export async function getLinkedCasts(): Promise<LinkedCast[]> {
  const supabase = createServiceClient()
  const { data, error } = await supabase
    .from('cast_private_info')
    .select('cast_id, line_user_id, casts!inner(stage_name)')
    .not('line_user_id', 'is', null)
    .order('cast_id')

  if (error) return []

  return (data ?? []).map((row) => ({
    cast_id: row.cast_id,
    stage_name: (row.casts as unknown as { stage_name: string }).stage_name,
    line_user_id: row.line_user_id as string,
  }))
}

// ── 一覧取得 ────────────────────────────────────────────────────────────────

export async function getLineNotifications(): Promise<LineNotification[]> {
  const supabase = createServiceClient()
  const { data, error } = await supabase
    .from('line_notifications')
    .select('*')
    .order('created_at', { ascending: false })

  if (error) throw new Error(error.message)
  return (data ?? []) as LineNotification[]
}

// ── 送信ログ取得（直近20件） ─────────────────────────────────────────────────

export async function getLineNotificationLogs(
  notificationId: string
): Promise<LineNotificationLog[]> {
  const supabase = createServiceClient()
  const { data, error } = await supabase
    .from('line_notification_logs')
    .select('*')
    .eq('notification_id', notificationId)
    .order('sent_at', { ascending: false })
    .limit(20)

  if (error) throw new Error(error.message)
  return (data ?? []) as LineNotificationLog[]
}

// ── 新規作成 ────────────────────────────────────────────────────────────────

export async function createLineNotification(
  input: CreateLineNotificationInput
): Promise<{ data?: LineNotification; error?: string }> {
  const supabase = createServiceClient()

  const payload = {
    name: input.name.trim(),
    content: input.content.trim(),
    target_type: input.target_type,
    target_id: input.target_id?.trim() || null,
    schedule_type: input.schedule_type,
    schedule_time: input.schedule_time,
    schedule_days: input.schedule_days ?? null,
    schedule_dates: input.schedule_dates ?? null,
    schedule_once_at: input.schedule_once_at ?? null,
    is_enabled: true,
  }

  const { data, error } = await supabase
    .from('line_notifications')
    .insert(payload)
    .select()
    .single()

  if (error) return { error: error.message }

  revalidatePath('/admin/settings')
  return { data: data as LineNotification }
}

// ── 更新 ────────────────────────────────────────────────────────────────────

export async function updateLineNotification(
  id: string,
  input: Partial<CreateLineNotificationInput>
): Promise<{ data?: LineNotification; error?: string }> {
  const supabase = createServiceClient()

  const payload: Record<string, unknown> = {}
  if (input.name !== undefined)            payload.name = input.name.trim()
  if (input.content !== undefined)         payload.content = input.content.trim()
  if (input.target_type !== undefined)     payload.target_type = input.target_type
  if (input.target_id !== undefined)       payload.target_id = input.target_id?.trim() || null
  if (input.schedule_type !== undefined)   payload.schedule_type = input.schedule_type
  if (input.schedule_time !== undefined)   payload.schedule_time = input.schedule_time
  if (input.schedule_days !== undefined)   payload.schedule_days = input.schedule_days ?? null
  if (input.schedule_dates !== undefined)  payload.schedule_dates = input.schedule_dates ?? null
  if (input.schedule_once_at !== undefined) payload.schedule_once_at = input.schedule_once_at ?? null

  const { data, error } = await supabase
    .from('line_notifications')
    .update(payload)
    .eq('id', id)
    .select()
    .single()

  if (error) return { error: error.message }

  revalidatePath('/admin/settings')
  return { data: data as LineNotification }
}

// ── オン/オフ切り替え ────────────────────────────────────────────────────────

export async function toggleLineNotification(
  id: string,
  isEnabled: boolean
): Promise<{ error?: string }> {
  const supabase = createServiceClient()
  const { error } = await supabase
    .from('line_notifications')
    .update({ is_enabled: isEnabled })
    .eq('id', id)

  if (error) return { error: error.message }

  revalidatePath('/admin/settings')
  return {}
}

// ── 削除 ────────────────────────────────────────────────────────────────────

export async function deleteLineNotification(
  id: string
): Promise<{ error?: string }> {
  const supabase = createServiceClient()
  const { error } = await supabase
    .from('line_notifications')
    .delete()
    .eq('id', id)

  if (error) return { error: error.message }

  revalidatePath('/admin/settings')
  return {}
}

// ── テスト送信 ───────────────────────────────────────────────────────────────

export async function testSendLineNotification(
  id: string
): Promise<{ ok: boolean; error?: string }> {
  const supabase = createServiceClient()

  const { data: notif, error: fetchError } = await supabase
    .from('line_notifications')
    .select('*')
    .eq('id', id)
    .single()

  if (fetchError || !notif) return { ok: false, error: 'notification_not_found' }

  const message = buildMessage(notif.content)

  let result: { ok: boolean; skipped?: boolean; reason?: string }
  if (notif.target_type === 'individual' && notif.target_id) {
    result = await sendLineMessage(notif.target_id, message)
  } else {
    result = await sendLineGroupMessage(message)
  }

  // ログ記録
  await supabase.from('line_notification_logs').insert({
    notification_id: id,
    status: result.ok ? 'sent' : result.skipped ? 'skipped' : 'failed',
    message_preview: message.slice(0, 100),
    error_reason: result.ok ? null : result.reason ?? null,
  })

  return { ok: result.ok, error: result.ok ? undefined : result.reason }
}

// ── スケジューラー実行（Cronから呼ばれる） ────────────────────────────────────

export async function runScheduledNotifications(): Promise<{
  executed: number
  errors: number
}> {
  const supabase = createServiceClient()

  // 有効な通知を全件取得
  const { data: notifications, error } = await supabase
    .from('line_notifications')
    .select('*')
    .eq('is_enabled', true)

  if (error || !notifications) return { executed: 0, errors: 0 }

  // JST 現在時刻
  const nowUtc = new Date()
  const jstOffset = 9 * 60 * 60 * 1000
  const nowJst = new Date(nowUtc.getTime() + jstOffset)

  const currentHour = nowJst.getUTCHours()
  const currentMinute = nowJst.getUTCMinutes()
  const currentDayOfWeek = nowJst.getUTCDay()      // 0=日〜6=土
  const currentDate = nowJst.getUTCDate()           // 1〜31

  let executed = 0
  let errors = 0

  for (const notif of notifications) {
    if (!shouldFire(notif, currentHour, currentMinute, currentDayOfWeek, currentDate)) {
      continue
    }

    // 二重送信チェック（直近30分以内に送信済みなら skip）
    const thirtyMinAgo = new Date(nowUtc.getTime() - 30 * 60 * 1000).toISOString()
    const { data: recentLog } = await supabase
      .from('line_notification_logs')
      .select('id')
      .eq('notification_id', notif.id)
      .eq('status', 'sent')
      .gte('sent_at', thirtyMinAgo)
      .limit(1)

    if (recentLog && recentLog.length > 0) continue

    const message = buildMessage(notif.content)

    let result: { ok: boolean; skipped?: boolean; reason?: string }
    if (notif.target_type === 'individual' && notif.target_id) {
      result = await sendLineMessage(notif.target_id, message)
    } else {
      result = await sendLineGroupMessage(message)
    }

    const status = result.ok ? 'sent' : result.skipped ? 'skipped' : 'failed'

    await supabase.from('line_notification_logs').insert({
      notification_id: notif.id,
      status,
      message_preview: message.slice(0, 100),
      error_reason: result.ok ? null : (result.reason ?? null),
    })

    if (result.ok) {
      await supabase
        .from('line_notifications')
        .update({ last_sent_at: nowUtc.toISOString() })
        .eq('id', notif.id)

      // once タイプは送信後に無効化
      if (notif.schedule_type === 'once') {
        await supabase
          .from('line_notifications')
          .update({ is_enabled: false })
          .eq('id', notif.id)
      }

      executed++
    } else if (!result.skipped) {
      errors++
    }
  }

  return { executed, errors }
}

// ── ヘルパー: 発火判定 ───────────────────────────────────────────────────────

function shouldFire(
  notif: LineNotification,
  hour: number,
  minute: number,
  dayOfWeek: number,
  date: number
): boolean {
  // schedule_time を "HH:MM" でパース
  const [schedHour, schedMinute] = notif.schedule_time.split(':').map(Number)

  // 時刻が ±7分以内か（Cronは15分ごと）
  const totalCurrentMinutes = hour * 60 + minute
  const totalSchedMinutes = schedHour * 60 + schedMinute
  if (Math.abs(totalCurrentMinutes - totalSchedMinutes) > 7) return false

  switch (notif.schedule_type) {
    case 'daily':
      return true

    case 'weekly':
      return Array.isArray(notif.schedule_days) && notif.schedule_days.includes(dayOfWeek)

    case 'monthly':
      return Array.isArray(notif.schedule_dates) && notif.schedule_dates.includes(date)

    case 'once':
      if (!notif.schedule_once_at) return false
      const onceJst = new Date(new Date(notif.schedule_once_at).getTime() + 9 * 60 * 60 * 1000)
      const onceTotal = onceJst.getUTCHours() * 60 + onceJst.getUTCMinutes()
      return (
        onceJst.getUTCFullYear() === new Date(Date.now() + 9 * 60 * 60 * 1000).getUTCFullYear() &&
        onceJst.getUTCMonth() === new Date(Date.now() + 9 * 60 * 60 * 1000).getUTCMonth() &&
        onceJst.getUTCDate() === date &&
        Math.abs(onceTotal - (hour * 60 + minute)) <= 7
      )

    default:
      return false
  }
}

// ── ヘルパー: メッセージビルド ───────────────────────────────────────────────

function buildMessage(content: string): string {
  const nowJst = new Date(Date.now() + 9 * 60 * 60 * 1000)
  const dateStr = `${nowJst.getUTCFullYear()}/${String(nowJst.getUTCMonth() + 1).padStart(2, '0')}/${String(nowJst.getUTCDate()).padStart(2, '0')}`
  return content.replace(/\{today\}/g, dateStr).replace(/\{date\}/g, dateStr)
}
