'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import { getAppRole, isAdminLoginRole } from '@/lib/auth/admin-roles'

export type SendShiftRequestResult = {
  success: boolean
  requestedCount: number
  skippedCount: number
  copyMessage: string
  error?: string
}

function buildDefaultMessage(businessDate: string): string {
  const [, month, day] = businessDate.split('-')
  return `${parseInt(month)}月${parseInt(day)}日の出勤キャストが不足しているため、出勤可能な方を探しています。\n出勤可能な場合は、アニモ公式LINEへ返信をお願いします。`
}

// 管理者: 出勤依頼ログを記録し、コピー用メッセージを返す。
// LINE APIへの直接送信は行わない。channel='internal', status='pending' で作成する。
// 同一 (business_date, cast_id, channel) で pending/sent が既にある場合は重複を無視する。
export async function sendShiftRequestNotification(input: {
  businessDate: string
  castIds: string[]
  message?: string
}): Promise<SendShiftRequestResult> {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { success: false, requestedCount: 0, skippedCount: 0, copyMessage: '', error: 'Unauthorized' }

  const role = await getAppRole(supabase, user.id)
  if (!isAdminLoginRole(role)) return { success: false, requestedCount: 0, skippedCount: 0, copyMessage: '', error: 'Forbidden' }

  if (!input.castIds || input.castIds.length === 0) {
    return { success: false, requestedCount: 0, skippedCount: 0, copyMessage: '', error: '対象キャストを選択してください' }
  }

  const msg = (input.message?.trim()) || buildDefaultMessage(input.businessDate)

  const records = input.castIds.map(castId => ({
    business_date: input.businessDate,
    cast_id: castId,
    message: msg,
    status: 'pending',
    channel: 'internal',
    sent_by: user.id,
  }))

  // ignoreDuplicates=true → ON CONFLICT DO NOTHING
  // 部分ユニークインデックス (business_date, cast_id, channel) WHERE status IN ('pending','sent') により
  // 既存の pending/sent レコードがある場合はスキップされる。
  const { data: inserted, error } = await supabase
    .from('cast_shift_request_notifications')
    .upsert(records, { ignoreDuplicates: true })
    .select('id')

  if (error) {
    console.error('[sendShiftRequestNotification]', error)
    return { success: false, requestedCount: 0, skippedCount: input.castIds.length, copyMessage: '', error: error.message }
  }

  const requestedCount = inserted?.length ?? 0
  const skippedCount = input.castIds.length - requestedCount

  revalidatePath('/admin/shifts')

  return {
    success: true,
    requestedCount,
    skippedCount,
    copyMessage: msg,
  }
}
