'use server';

import { createClient } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';

export type ShiftChangeStatus = 'pending' | 'approved' | 'rejected';
export type ShiftChangeActionType = 'update' | 'cancel';

export type ShiftChangeRequest = {
  id: string;
  cast_id: string;
  target_date: string;
  action_type: ShiftChangeActionType;
  new_start_time: string | null;
  new_end_time: string | null;
  status: ShiftChangeStatus;
  created_at: string;
};

/**
 * キャストが自身の確定済みスケジュール一覧（直近指定日数分）を取得する
 */
export async function getMyConfirmedSchedules(castId: string, daysForward: number = 14) {
  const supabase = await createClient();

  // 今日の日付文字列
  const todayStr = new Date(Date.now() - new Date().getTimezoneOffset() * 60000).toISOString().split('T')[0];
  
  // 指定日数後の日付文字列
  const endDate = new Date(Date.now() + daysForward * 24 * 60 * 60 * 1000);
  const endStr = new Date(endDate.getTime() - endDate.getTimezoneOffset() * 60000).toISOString().split('T')[0];

  const { data: schedules, error } = await supabase
    .from('cast_schedules')
    .select('*')
    .eq('cast_id', castId)
    .gte('work_date', todayStr)
    .lte('work_date', endStr)
    .order('work_date', { ascending: true });

  if (error) return { data: [], error: error.message };

  return { data: schedules, error: null };
}

/**
 * キャストが自身の最新の未承認（pending）変更申請一覧を取得する
 */
export async function getMyPendingChangeRequests(castId: string) {
  const supabase = await createClient();

  const { data: requests, error } = await supabase
    .from('shift_change_requests')
    .select('*')
    .eq('cast_id', castId)
    .eq('status', 'pending')
    .order('target_date', { ascending: true });

  if (error) return { data: [], error: error.message };

  return { data: requests as ShiftChangeRequest[], error: null };
}

/**
 * キャストがシフトの変更依頼または取消依頼を送信する
 */
export async function submitShiftChangeRequest(
  castId: string,
  targetDate: string,
  actionType: ShiftChangeActionType,
  newStartTime: string | null,
  newEndTime: string | null
) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return { success: false, error: 'Unauthorized' };
  }

  if (typeof castId !== 'string' || !castId.trim()) {
    return { success: false, error: 'Invalid cast' };
  }

  const normalizedCastId = castId.trim();

  const { data: ownedCast, error: castError } = await supabase
    .from('casts')
    .select('id')
    .eq('id', normalizedCastId)
    .eq('auth_user_id', user.id)
    .maybeSingle();

  if (castError) {
    return { success: false, error: 'Failed to save request' };
  }

  if (!ownedCast) {
    return { success: false, error: 'Invalid cast' };
  }

  // すでに pending の申請がないかチェック（1日1アクティブ申請）
  const { data: existing } = await supabase
    .from('shift_change_requests')
    .select('id')
    .eq('cast_id', normalizedCastId)
    .eq('target_date', targetDate)
    .eq('status', 'pending')
    .single();

  if (existing) {
    return { success: false, error: 'この日の変更申請はすでに送信済み（承認待ち）です' };
  }

  const { error } = await supabase
    .from('shift_change_requests')
    .insert({
      cast_id: normalizedCastId,
      target_date: targetDate,
      action_type: actionType,
      new_start_time: actionType === 'cancel' ? null : newStartTime,
      new_end_time: actionType === 'cancel' ? null : newEndTime,
      status: 'pending',
    });

  if (error) {
    return { success: false, error: error.message };
  }

  revalidatePath('/cast/dashboard');
  return { success: true };
}
