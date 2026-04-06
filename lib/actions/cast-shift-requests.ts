'use server';

import { createClient } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';
import { ShiftRequest } from './admin-shift-requests';

export type MyShiftRequestResponse = {
  id: string;
  request_id: string;
  cast_id: string;
  proposed_start_time: string;
  proposed_end_time: string;
  status: 'pending' | 'approved' | 'rejected';
  created_at: string;
  shift_request: Array<{
    target_date: string;
    message: string;
  }> | null;
};

/**
 * キャスト: 現在アクティブな出勤リクエスト（募集）一覧を取得する
 */
export async function getActiveShiftRequests(): Promise<ShiftRequest[]> {
  const supabase = await createClient();
  
  // 今日の日付を取得
  const today = new Date();
  // タイムゾーンの調整なしにJSTの「今日」の文字列(YYYY-MM-DD)にするなど調整が必要な場合もありますが
  // 一旦はシンプルな現在時刻で判定します
  const todayStr = today.toISOString().split('T')[0];

  const { data, error } = await supabase
    .from('shift_requests')
    .select('*')
    .eq('is_active', true)
    .gte('target_date', todayStr) // 過去の募集は表示しない
    .order('target_date', { ascending: true });

  if (error) {
    console.error('Error fetching active shift requests:', error);
    return [];
  }

  return data || [];
}

/**
 * キャスト: 出勤リクエストに応募（時間を指定して送信）する
 */
export async function submitShiftRequestResponse(
  requestId: string,
  proposedStartTime: string,
  proposedEndTime: string
) {
  const supabase = await createClient();

  const { data: { session } } = await supabase.auth.getSession();
  if (!session) throw new Error('認証されていません。再度ログインしてください。');

  // キャストIDを取得
  const { data: castInfo } = await supabase
    .from('casts')
    .select('id')
    .eq('auth_user_id', session.user.id)
    .single();

  if (!castInfo) {
    throw new Error('キャスト情報が見つかりません。');
  }

  const { error } = await supabase
    .from('shift_request_responses')
    .insert([{
      request_id: requestId,
      cast_id: castInfo.id,
      proposed_start_time: proposedStartTime,
      proposed_end_time: proposedEndTime,
      status: 'pending'
    }]);

  if (error) {
    if (error.code === '23505') { // UNIQUE制約違反
        throw new Error('この募集には既に応募済みです。');
    }
    console.error('Error submitting shift request response:', error);
    throw new Error('応募の送信に失敗しました。');
  }

  revalidatePath('/cast/dashboard');
  revalidatePath('/admin/shift-requests');
  return { success: true };
}

/**
 * キャスト: 過去の自身の応募ステータスを取得する
 */
export async function getMyShiftRequestResponses(): Promise<MyShiftRequestResponse[]> {
    const supabase = await createClient();

    const { data: { session } } = await supabase.auth.getSession();
    if (!session) return [];
  
    // キャストIDを取得
    const { data: castInfo } = await supabase
      .from('casts')
      .select('id')
      .eq('auth_user_id', session.user.id)
      .single();
  
    if (!castInfo) return [];

    const { data, error } = await supabase
        .from('shift_request_responses')
        .select(`
            id,
            request_id,
            cast_id,
            proposed_start_time,
            proposed_end_time,
            status,
            created_at,
            shift_request:shift_requests (target_date, message)
        `)
        .eq('cast_id', castInfo.id)
        .order('created_at', { ascending: false })
        .limit(10); // 直近10件のみ

    if (error) {
        console.error('Error fetching my shift responses:', error);
        return [];
    }

    return (data ?? []) as MyShiftRequestResponse[];
}
