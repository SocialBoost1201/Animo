'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

/**
 * スタッフの権限ロールを更新する
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
 * スタッフアカウントを削除する（Supabase AuthではなくProfileのみ削除）
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
