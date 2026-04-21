'use server';

import { createClient } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';

// --- Types ---
export type ShiftRequest = {
  id: string;
  target_date: string;
  message: string;
  is_active: boolean;
  created_at: string;
};

export type ShiftRequestResponse = {
  id: string;
  request_id: string;
  cast_id: string;
  proposed_start_time: string;
  proposed_end_time: string;
  status: 'pending' | 'approved' | 'rejected';
  created_at: string;
  cast: {
    id: string;
    stage_name: string;
    auth_user_id: string;
  };
  shift_request: {
    target_date: string;
    message: string;
  };
};

/**
 * 管理者: 出勤リクエストを作成する
 */
export async function createShiftRequest(targetDate: string, message: string) {
  const supabase = await createClient();

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('Unauthorized');

  const { data, error } = await supabase
    .from('shift_requests')
    .insert([{ target_date: targetDate, message }])
    .select()
    .single();

  if (error) {
    console.error('Error creating shift request:', error);
    throw new Error('募集の作成に失敗しました。');
  }

  revalidatePath('/admin/shift-requests');
  revalidatePath('/cast/dashboard');
  return { success: true, data };
}

/**
 * 管理者: すべての出勤リクエストを取得する
 */
export async function getShiftRequests(): Promise<ShiftRequest[]> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('Unauthorized');
  
  const { data, error } = await supabase
    .from('shift_requests')
    .select('*')
    .order('target_date', { ascending: false });

  if (error) {
    console.error('Error fetching shift requests:', error);
    return [];
  }

  return data || [];
}

/**
 * 管理者: 出勤リクエストのアクティブ状態を切り替える
 */
export async function toggleShiftRequestActive(id: string, isActive: boolean) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('Unauthorized');

  const { error } = await supabase
    .from('shift_requests')
    .update({ is_active: isActive })
    .eq('id', id);

  if (error) {
    console.error('Error toggling shift request:', error);
    throw new Error('状態の変更に失敗しました。');
  }

  revalidatePath('/admin/shift-requests');
  revalidatePath('/cast/dashboard');
  return { success: true };
}

/**
 * 管理者: 出勤リクエストを削除する
 */
export async function deleteShiftRequest(id: string) {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('Unauthorized');
  
    const { error } = await supabase
      .from('shift_requests')
      .delete()
      .eq('id', id);
  
    if (error) {
      console.error('Error deleting shift request:', error);
      throw new Error('募集の削除に失敗しました。');
    }
  
    revalidatePath('/admin/shift-requests');
    revalidatePath('/cast/dashboard');
    return { success: true };
}

/**
 * 管理者: 出勤リクエストに対するキャストからの応募一覧を取得する
 */
export async function getShiftRequestResponses(status?: string): Promise<ShiftRequestResponse[]> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('Unauthorized');
  
  let query = supabase
    .from('shift_request_responses')
    .select(`
      *,
      cast:casts (id, stage_name, auth_user_id),
      shift_request:shift_requests (target_date, message)
    `)
    .order('created_at', { ascending: false });

  if (status) {
    query = query.eq('status', status);
  }

  const { data, error } = await query;

  if (error) {
    console.error('Error fetching shift responses:', error);
    return [];
  }

  return data as unknown as ShiftRequestResponse[];
}

/**
 * 管理者: キャストからの応募を承認し、スケジュールに自動反映する
 */
export async function approveShiftRequestResponse(responseId: string) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('Unauthorized');

  // 1. 応募データを取得
  const { data: response, error: responseError } = await supabase
    .from('shift_request_responses')
    .select('*, shift_request:shift_requests(target_date)')
    .eq('id', responseId)
    .single();

  if (responseError || !response) {
    throw new Error('応募データの取得に失敗しました。');
  }

  const targetDate = response.shift_request.target_date;
  const castId = response.cast_id;

  // 2. 該当日のスケジュールが存在するか確認
  const { data: existingSchedule } = await supabase
    .from('cast_schedules')
    .select('id')
    .eq('cast_id', castId)
    .eq('work_date', targetDate)
    .single();

  // 3. スケジュールに反映（UPSERT）
  if (existingSchedule) {
    const { error: updateError } = await supabase
      .from('cast_schedules')
      .update({
        start_time: response.proposed_start_time,
        end_time: response.proposed_end_time,
        is_off: false
      })
      .eq('id', existingSchedule.id);
    if (updateError) throw new Error('スケジュールの更新に失敗しました。');
  } else {
    const { error: insertError } = await supabase
      .from('cast_schedules')
      .insert([{
        cast_id: castId,
        work_date: targetDate,
        start_time: response.proposed_start_time,
        end_time: response.proposed_end_time,
        is_off: false
      }]);
    if (insertError) throw new Error('スケジュールの追加に失敗しました。');
  }

  // 4. 応募自体のステータスを承認済みに変更
  const { error: statusError } = await supabase
    .from('shift_request_responses')
    .update({ status: 'approved' })
    .eq('id', responseId);

  if (statusError) {
    throw new Error('ステータス変更に失敗しました。');
  }

  revalidatePath('/admin/shift-requests');
  revalidatePath('/cast/dashboard');
  revalidatePath('/cast/shift');
  return { success: true };
}

/**
 * 管理者: キャストからの応募を却下する
 */
export async function rejectShiftRequestResponse(responseId: string) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('Unauthorized');
  
  const { error } = await supabase
    .from('shift_request_responses')
    .update({ status: 'rejected' })
    .eq('id', responseId);

  if (error) {
    console.error('Error rejecting shift response:', error);
    throw new Error('応募の却下に失敗しました。');
  }

  revalidatePath('/admin/shift-requests');
  return { success: true };
}
