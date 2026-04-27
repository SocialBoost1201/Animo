'use server';

import { createClient } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';
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

/**
 * スタッフマスタ単件取得
 */
export async function getStaffById(id: string): Promise<StaffSlave | null> {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('staffs')
    .select('*')
    .eq('id', id)
    .single()
  if (error) return null
  return data as StaffSlave
}

/**
 * スタッフマスタ登録
 */
export async function createStaff(formData: FormData) {
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

  let { data, error } = await supabase.from('staffs').insert(insertPayload).select().single();

  if (error && isExtendedColumnMissingError(error as { code?: string | null; message: string })) {
    const fallbackPayload = {
      name,
      display_name,
      role: null as string | null,
      is_active,
    };
    const retry = await supabase.from('staffs').insert(fallbackPayload).select().single();
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
