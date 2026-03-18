'use server';

import { createClient } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';
import { addCastScore } from './scores';

export type ShiftType = 'off' | 'work';

export type DailyShiftData = {
  type: ShiftType;
  start?: string; // "21:00"
  end?: string;   // "LAST" or "01:00"
};

export type WeeklyShiftSubmission = Record<string, DailyShiftData>;

/**
 * 対象週月曜日を取得するユーティリティ
 */
export function getTargetWeekMonday(baseDate: Date = new Date()): Date {
  const date = new Date(baseDate);
  const day = date.getDay();
  // day: 0=Sun, 1=Mon, ..., 6=Sat
  const diff = date.getDate() - day + (day === 0 ? -6 : 1);
  const monday = new Date(date.setDate(diff));
  monday.setHours(0, 0, 0, 0);
  return monday;
}

/**
 * キャスト本人の特定の週のシフト提出状況を取得する
 */
export async function getMyShiftSubmission(targetWeekMonday: string) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return { data: null, error: 'Unauthorized' };
  }

  // auth_user_id から cast_id を取得
  const { data: cast } = await supabase
    .from('casts')
    .select('id')
    .eq('auth_user_id', user.id)
    .single();

  if (!cast) {
    return { data: null, error: 'Cast not found' };
  }

  const { data, error } = await supabase
    .from('shift_submissions')
    .select('*')
    .eq('cast_id', cast.id)
    .eq('target_week_monday', targetWeekMonday)
    .maybeSingle();

  if (error) {
    return { data: null, error: error.message };
  }

  return { data, castId: cast.id, error: null };
}

/**
 * シフトを提出（保存）する
 */
export async function submitMyShift(
  castId: string,
  targetWeekMonday: string,
  shiftsData: WeeklyShiftSubmission
) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return { success: false, error: 'Unauthorized' };
  }

  // 提出データのUpsert（ON CONFLICT を利用するか、既存チェック後にUPDATE/INSERT）
  // 既存レコードがあるか確認
  const { data: existing } = await supabase
    .from('shift_submissions')
    .select('id')
    .eq('cast_id', castId)
    .eq('target_week_monday', targetWeekMonday)
    .maybeSingle();

  if (existing) {
    // 更新
    const { error } = await supabase
      .from('shift_submissions')
      .update({
        shifts_data: shiftsData as any,
        status: 'pending', // 再提出時は再度pendingにする
        submitted_at: new Date().toISOString(),
      })
      .eq('id', existing.id);

    if (error) return { success: false, error: error.message };
  } else {
    // 新規作成
    const { error } = await supabase
      .from('shift_submissions')
      .insert({
        cast_id: castId,
        target_week_monday: targetWeekMonday,
        shifts_data: shiftsData as any,
        status: 'pending',
      });

    if (error) return { success: false, error: error.message };
    
    // 新規提出の場合、期限チェックなどを行ってポイント付与（簡易的に初回提出で+10ptとする）
    try {
      await addCastScore(castId, 10, 'shift_submitted_on_time', 'シフトを提出しました');
    } catch (e) {
      console.warn('Failed to add score for shift submission:', e);
    }
  }

  revalidatePath('/cast/shift');
  revalidatePath('/cast/dashboard');
  
  return { success: true };
}
