'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

export type StaffSlave = {
  id: string
  name: string
  display_name: string
  role?: string
  is_active: boolean
  created_at: string
}

/**
 * スタッフマスタ（staffsテーブル）の取得
 */
export async function getStaffs(includeInactive = false) {
  const supabase = await createClient()
  let query = supabase.from('staffs').select('*').order('created_at', { ascending: false })
  
  if (!includeInactive) {
    query = query.eq('is_active', true)
  }
  
  const { data, error } = await query
  if (error) {
    console.error('Error fetching staffs:', error)
    return []
  }
  return data as StaffSlave[]
}

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
  const supabase = await createClient()
  const name = formData.get('name') as string
  const display_name = formData.get('display_name') as string
  const role = formData.get('role') as string || null
  const is_active = formData.get('is_active') === 'true'

  const { data, error } = await supabase.from('staffs').insert({
    name,
    display_name,
    role,
    is_active,
  }).select().single()

  if (error) return { error: error.message }
  
  revalidatePath('/admin/human-resources')
  revalidatePath('/admin/staffs')
  return { success: true, data }
}

/**
 * スタッフマスタ更新
 */
export async function updateStaff(id: string, formData: FormData) {
  const supabase = await createClient()
  const name = formData.get('name') as string
  const display_name = formData.get('display_name') as string
  const role = formData.get('role') as string || null
  const is_active = formData.get('is_active') === 'true'

  const { error } = await supabase.from('staffs').update({
    name,
    display_name,
    role,
    is_active,
  }).eq('id', id)

  if (error) return { error: error.message }
  
  revalidatePath('/admin/human-resources')
  return { success: true }
}

/**
 * スタッフマスタ削除
 */
export async function deleteStaff(id: string) {
  const supabase = await createClient()
  const { error } = await supabase.from('staffs').delete().eq('id', id)
  if (error) return { error: error.message }
  
  revalidatePath('/admin/human-resources')
  return { success: true }
}

/**
 * スタッフの権限ロールを更新する (profilesテーブル)
 */
export async function updateStaffRole(id: string, role: string) {
  const supabase = await createClient()

  // 操作者が owner であることを確認
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: '認証が必要です' }

  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single()

  if (profile?.role !== 'owner') {
    return { error: 'オーナー権限が必要です' }
  }

  // owner 自身の権限は変更不可
  if (id === user.id) {
    return { error: 'オーナー自身の権限は変更できません' }
  }

  const validRoles = ['owner', 'manager', 'staff']
  if (!validRoles.includes(role)) {
    return { error: '無効なロールです' }
  }

  const { error } = await supabase
    .from('profiles')
    .update({ role, updated_at: new Date().toISOString() })
    .eq('id', id)

  if (error) return { error: error.message }

  revalidatePath('/admin/staffs')
  return { success: true }
}

/**
 * スタッフアカウントを削除する（profilesテーブル）
 */
export async function removeStaff(id: string) {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: '認証が必要です' }

  if (id === user.id) {
    return { error: '自分自身を削除することはできません' }
  }

  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single()

  if (profile?.role !== 'owner') {
    return { error: 'オーナー権限が必要です' }
  }

  const { error } = await supabase
    .from('profiles')
    .delete()
    .eq('id', id)

  if (error) return { error: error.message }

  revalidatePath('/admin/staffs')
  return { success: true }
}

