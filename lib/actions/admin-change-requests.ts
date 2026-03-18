'use server';

import { createClient } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';
import { ShiftChangeRequest } from './cast-change-requests';

export type ShiftChangeRequestWithCast = ShiftChangeRequest & {
  casts: { stage_name: string; slug: string };
};

/**
 * 管理者が変更申請の一覧を取得する
 */
export async function getAdminShiftChangeRequests(statusFilter: string = 'pending') {
  const supabase = await createClient();

  let query = supabase
    .from('shift_change_requests')
    .select(`
      *,
      casts (stage_name, slug)
    `)
    .order('created_at', { ascending: false });

  if (statusFilter !== 'all') {
    query = query.eq('status', statusFilter);
  }

  const { data, error } = await query;

  if (error) return { data: [], error: error.message };
  return { data: data as ShiftChangeRequestWithCast[], error: null };
}

/**
 * 変更申請を承認し、cast_schedulesの該当レコードを更新または削除する
 */
export async function approveShiftChangeRequest(requestId: string) {
  const supabase = await createClient();

  // 1. まず該当の申請内容を取得
  const { data: request, error: fetchErr } = await supabase
    .from('shift_change_requests')
    .select('*')
    .eq('id', requestId)
    .single();

  if (fetchErr || !request) {
    return { success: false, error: fetchErr?.message || 'Request not found' };
  }

  if (request.status !== 'pending') {
    return { success: false, error: 'This request is not pending' };
  }

  // 2. 本番テーブル（cast_schedules）へ反映
  if (request.action_type === 'cancel') {
    // 該当日のシフトを削除
    const { error: delErr } = await supabase
      .from('cast_schedules')
      .delete()
      .eq('cast_id', request.cast_id)
      .eq('work_date', request.target_date);
    if (delErr) return { success: false, error: delErr.message };
  } else if (request.action_type === 'update') {
    // 該当日のシフトを更新（まだその日にシフトがない場合の考慮としてupsertを利用）
    const { error: upsertErr } = await supabase
      .from('cast_schedules')
      .upsert({
        cast_id: request.cast_id,
        work_date: request.target_date,
        start_time: request.new_start_time === 'LAST' ? null : request.new_start_time,
        end_time: request.new_end_time === 'LAST' ? null : request.new_end_time,
      });
    if (upsertErr) return { success: false, error: upsertErr.message };
  }

  // 3. 申請のステータスを approved に変更
  const { error: updateErr } = await supabase
    .from('shift_change_requests')
    .update({ status: 'approved' })
    .eq('id', requestId);

  if (updateErr) return { success: false, error: updateErr.message };

  // 全画面でリロードしやすくする
  revalidatePath('/admin/shift-requests');
  revalidatePath('/cast/dashboard');
  revalidatePath('/');
  return { success: true };
}

/**
 * 変更申請を却下する
 */
export async function rejectShiftChangeRequest(requestId: string) {
  const supabase = await createClient();

  const { error } = await supabase
    .from('shift_change_requests')
    .update({ status: 'rejected' })
    .eq('id', requestId);

  if (error) {
    return { success: false, error: error.message };
  }

  revalidatePath('/admin/shift-requests');
  revalidatePath('/cast/dashboard');
  return { success: true };
}
