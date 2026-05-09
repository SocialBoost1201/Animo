'use server';

import { createClient } from '@/lib/supabase/server';
import { createServiceClient } from '@/lib/supabase/service';
import { requireAdminLogin } from '@/lib/auth/admin';
import { revalidatePath } from 'next/cache';
import { getJstDateString } from '@/lib/date-utils';
import { combineStaffFullName } from '@/lib/staff-name';
import { mapRowToStaffSlave, type StaffTableRow, type StaffSlave } from '@/lib/staff-records';

export type { StaffSlave, StaffTableRow } from '@/lib/staff-records';

const EXTENDED_STAFF_COLUMNS = ['family_name', 'given_name', 'line_id', 'mobile_phone'] as const;

function isMissingColumnError(error: { code?: string | null; message: string }, column: string): boolean {
  if (error.code !== 'PGRST204') return false;
  const normalizedMessage = error.message.toLowerCase();
  const columnToken = `'${column.toLowerCase()}'`;
  return (
    normalizedMessage.includes(columnToken) && (normalizedMessage.includes('column') || normalizedMessage.includes('schema cache'))
  );
}

function isExtendedColumnMissingError(error: { code?: string | null; message: string }): boolean {
  return EXTENDED_STAFF_COLUMNS.some((column) => isMissingColumnError(error, column));
}

/**
 * スタッフマスタ（staffsテーブル）の取得
 */
export async function getStaffs(includeInactive = false) {
  const supabase = await createClient();
  let query = supabase
    .from('staffs')
    .select('*')
    .order('created_at', { ascending: false });

  if (!includeInactive) {
    query = query.eq('is_active', true);
  }

  const { data, error } = await query;
  if (error) {
    console.error('Error fetching staffs:', error);
    return [];
  }
  return (data ?? []).map((row) => mapRowToStaffSlave(row as StaffTableRow));
}

export async function getStaffById(id: string): Promise<StaffSlave | null> {
  const supabase = await createClient();
  const { data, error } = await supabase.from('staffs').select('*').eq('id', id).single();

  if (error) return null;
  return mapRowToStaffSlave(data as StaffTableRow);
}

export type StaffTodayAttendance = {
  start_time: string | null;
  end_time: string | null;
  note: string | null;
};

export type StaffWithTodayAttendance = StaffSlave & {
  today_attendance: StaffTodayAttendance | null;
};

/**
 * スタッフ一覧 + 当日 (JST today) の出勤レコードを返す。
 * /admin/staffs ページの 出勤/休み トグル表示に使用。
 */
export async function getStaffsWithTodayAttendance(includeInactive = true): Promise<StaffWithTodayAttendance[]> {
  const supabase = await createClient();
  const today = getJstDateString();

  let query = supabase
    .from('staffs')
    .select('*')
    .order('created_at', { ascending: false });
  if (!includeInactive) query = query.eq('is_active', true);

  const [{ data: staffsRaw, error: staffsError }, attendanceRes] = await Promise.all([
    query,
    supabase
      .from('daily_staff_attendances')
      .select('staff_id, start_time, end_time, note')
      .eq('staff_date', today),
  ]);

  if (staffsError) {
    console.error('getStaffsWithTodayAttendance: staffs error', staffsError);
    return [];
  }

  const attendanceMap = new Map<string, StaffTodayAttendance>();
  if (attendanceRes && !attendanceRes.error) {
    for (const row of attendanceRes.data ?? []) {
      if (!row.staff_id) continue;
      attendanceMap.set(row.staff_id as string, {
        start_time: (row.start_time as string | null) ?? null,
        end_time: (row.end_time as string | null) ?? null,
        note: (row.note as string | null) ?? null,
      });
    }
  } else if (attendanceRes?.error) {
    console.error('getStaffsWithTodayAttendance: attendance error', attendanceRes.error);
  }

  return (staffsRaw ?? []).map((row) => {
    const slave = mapRowToStaffSlave(row as StaffTableRow);
    return {
      ...slave,
      today_attendance: attendanceMap.get(slave.id) ?? null,
    };
  });
}

/**
 * 当日 (JST today) の出勤を 出勤(working) または 休み(absent) に切替。
 *
 * - working: daily_staff_attendances へ upsert（start_time / end_time / note を保存）
 * - absent : 当該スタッフの当日レコードを削除
 *
 * /admin/today の addStaffAttendance / deleteStaffAttendance と並列に動作する設計。
 */
export async function setStaffTodayAttendance(input: {
  staffId: string;
  status: 'working' | 'absent';
  startTime?: string | null;
  endTime?: string | null;
  note?: string | null;
}): Promise<{ success: boolean; error?: string }> {
  const auth = await requireAdminLogin();
  if (!auth.ok) return { success: false, error: auth.error };

  const serviceSupabase = createServiceClient();
  const today = getJstDateString();

  // 1) 対象スタッフの存在確認 (display_name 取得のため)
  const { data: staffRow, error: staffError } = await serviceSupabase
    .from('staffs')
    .select('id, display_name')
    .eq('id', input.staffId)
    .maybeSingle();
  if (staffError) return { success: false, error: staffError.message };
  if (!staffRow) return { success: false, error: 'スタッフが見つかりません' };

  if (input.status === 'absent') {
    const { error } = await serviceSupabase
      .from('daily_staff_attendances')
      .delete()
      .eq('staff_id', input.staffId)
      .eq('staff_date', today);
    if (error) return { success: false, error: error.message };
    revalidatePath('/admin/staffs');
    revalidatePath('/admin/today');
    revalidatePath('/admin/dashboard');
    return { success: true };
  }

  // status === 'working'
  const startTime = (input.startTime ?? '20:00').slice(0, 5);
  const endTime = input.endTime ? input.endTime.slice(0, 5) : null;
  const note = input.note && input.note.trim() !== '' ? input.note.trim() : null;

  // 既存レコードの有無で insert / update を分岐 (UNIQUE 制約は無いため手動)
  const { data: existing, error: existingError } = await serviceSupabase
    .from('daily_staff_attendances')
    .select('id')
    .eq('staff_id', input.staffId)
    .eq('staff_date', today)
    .maybeSingle();
  if (existingError) return { success: false, error: existingError.message };

  if (existing?.id) {
    const { error } = await serviceSupabase
      .from('daily_staff_attendances')
      .update({
        display_name: staffRow.display_name,
        start_time: startTime,
        end_time: endTime,
        note,
      })
      .eq('id', existing.id);
    if (error) return { success: false, error: error.message };
  } else {
    const { error } = await serviceSupabase
      .from('daily_staff_attendances')
      .insert({
        staff_id: input.staffId,
        staff_date: today,
        display_name: staffRow.display_name,
        start_time: startTime,
        end_time: endTime,
        note,
      });
    if (error) return { success: false, error: error.message };
  }

  revalidatePath('/admin/staffs');
  revalidatePath('/admin/today');
  revalidatePath('/admin/dashboard');
  return { success: true };
}

/**
 * スタッフマスタ登録
 */
export async function createStaff(formData: FormData) {
  const auth = await requireAdminLogin();
  if (!auth.ok) return { error: auth.error };

  const serviceSupabase = createServiceClient();
  const family_name = String(formData.get('family_name') ?? '').trim();
  const given_name = String(formData.get('given_name') ?? '').trim();
  const display_name = String(formData.get('display_name') ?? '').trim();
  const mobile_phone = String(formData.get('mobile_phone') ?? '').trim();
  const line_id = String(formData.get('line_id') ?? '').trim();
  const is_active = formData.get('is_active') === 'true';

  if (!family_name || !given_name) {
    return { error: '苗字と名前を入力してください' };
  }
  if (!display_name) {
    return { error: '芸名を入力してください' };
  }

  const name = combineStaffFullName(family_name, given_name);
  if (!name) {
    return { error: '苗字と名前を入力してください' };
  }

  const insertPayload: {
    name: string;
    family_name: string;
    given_name: string;
    display_name: string;
    role: null;
    is_active: boolean;
    mobile_phone?: string;
    line_id?: string;
  } = {
    name,
    family_name,
    given_name,
    display_name,
    role: null,
    is_active,
  };

  if (mobile_phone.length > 0) insertPayload.mobile_phone = mobile_phone;
  if (line_id.length > 0) insertPayload.line_id = line_id;

  let { data, error } = await serviceSupabase.from('staffs').insert(insertPayload).select().single();

  if (error && isExtendedColumnMissingError(error as { code?: string | null; message: string })) {
    const fallbackPayload = {
      name,
      display_name,
      role: null as string | null,
      is_active,
    };
    const retry = await serviceSupabase.from('staffs').insert(fallbackPayload).select().single();
    data = retry.data;
    error = retry.error;
  }

  if (error) {
    return { error: error.message };
  }

  revalidatePath('/admin/human-resources');
  revalidatePath('/admin/staffs');
  return { success: true, data };
}

/**
 * スタッフマスタ更新
 */
export async function updateStaff(id: string, formData: FormData) {
  const supabase = await createClient();
  const family_name = String(formData.get('family_name') ?? '').trim();
  const given_name = String(formData.get('given_name') ?? '').trim();
  const display_name = String(formData.get('display_name') ?? '').trim();
  const mobile_phone = String(formData.get('mobile_phone') ?? '').trim();
  const line_id = String(formData.get('line_id') ?? '').trim();
  const is_active = formData.get('is_active') === 'true';

  if (!family_name || !given_name) {
    return { error: '苗字と名前を入力してください' };
  }
  if (!display_name) {
    return { error: '芸名を入力してください' };
  }

  const name = combineStaffFullName(family_name, given_name);
  if (!name) {
    return { error: '苗字と名前を入力してください' };
  }

  const updatePayload: {
    name: string;
    family_name: string;
    given_name: string;
    display_name: string;
    is_active: boolean;
    mobile_phone: string | null;
    line_id: string | null;
  } = {
    name,
    family_name,
    given_name,
    display_name,
    is_active,
    mobile_phone: mobile_phone.length > 0 ? mobile_phone : null,
    line_id: line_id.length > 0 ? line_id : null,
  };

  let { error } = await supabase.from('staffs').update(updatePayload).eq('id', id);

  if (error && isExtendedColumnMissingError(error as { code?: string | null; message: string })) {
    const fallbackPayload = {
      name,
      display_name,
      is_active,
    };
    const retry = await supabase.from('staffs').update(fallbackPayload).eq('id', id);
    error = retry.error;
  }

  if (error) return { error: error.message };

  revalidatePath('/admin/human-resources');
  revalidatePath('/admin/staffs');
  return { success: true };
}

/**
 * スタッフマスタ削除
 */
export async function deleteStaff(id: string) {
  const supabase = await createClient();
  const { error } = await supabase.from('staffs').delete().eq('id', id);
  if (error) return { error: error.message };

  revalidatePath('/admin/human-resources');
  revalidatePath('/admin/staffs');
  return { success: true };
}

/**
 * スタッフの権限ロールを更新する (profilesテーブル)
 */
export async function updateStaffRole(id: string, role: string) {
  const supabase = await createClient();

  // 操作者が owner であることを確認
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { error: '認証が必要です' };

  const { data: profile } = await supabase.from('profiles').select('role').eq('id', user.id).single();

  if (profile?.role !== 'owner') {
    return { error: 'オーナー権限が必要です' };
  }

  // owner 自身の権限は変更不可
  if (id === user.id) {
    return { error: 'オーナー自身の権限は変更できません' };
  }

  const validRoles = ['owner', 'manager', 'staff'];
  if (!validRoles.includes(role)) {
    return { error: '無効なロールです' };
  }

  const { error } = await supabase
    .from('profiles')
    .update({ role, updated_at: new Date().toISOString() })
    .eq('id', id);

  if (error) return { error: error.message };

  revalidatePath('/admin/staffs');
  return { success: true };
}

/**
 * スタッフアカウントを削除する（profilesテーブル）
 */
export async function removeStaff(id: string) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { error: '認証が必要です' };

  if (id === user.id) {
    return { error: '自分自身を削除することはできません' };
  }

  const { data: profile } = await supabase.from('profiles').select('role').eq('id', user.id).single();

  if (profile?.role !== 'owner') {
    return { error: 'オーナー権限が必要です' };
  }

  const { error } = await supabase.from('profiles').delete().eq('id', id);

  if (error) return { error: error.message };

  revalidatePath('/admin/staffs');
  return { success: true };
}
