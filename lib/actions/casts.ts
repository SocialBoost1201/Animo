'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

// ─── 全関連ページをリバリデート ───────────────────────────
function revalidateAll(castId?: string) {
  revalidatePath('/')
  revalidatePath('/cast')
  revalidatePath('/shift')
  if (castId) revalidatePath(`/cast/${castId}`)
}

// ─── 管理画面用: キャスト全取得 ──────────────────────────
export async function getCasts() {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('casts')
    .select('*')
    .order('display_order', { ascending: true })
    .order('created_at', { ascending: false })

  if (error) throw new Error(error.message)
  return data
}

export async function getCastById(id: string) {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('casts')
    .select('*')
    .eq('id', id)
    .single()

  if (error) throw new Error(error.message)
  return data
}

// ─── キャスト登録 ─────────────────────────────────────────
export async function createCast(formData: FormData) {
  const supabase = await createClient()

  const stage_name = formData.get('stage_name') as string
  const age = formData.get('age') ? parseInt(formData.get('age') as string) : null
  const hobby = formData.get('hobby') as string
  const comment = formData.get('comment') as string
  const is_active = formData.get('is_active') !== 'false'
  const display_order = formData.get('display_order')
    ? parseInt(formData.get('display_order') as string) : 0
  const image_url = formData.get('image_url') as string || null

  const { data, error } = await supabase.from('casts').insert({
    stage_name, age, hobby, comment, is_active, display_order, image_url
  }).select('id').single()

  if (error) return { error: error.message }

  revalidatePath('/admin/casts')
  revalidateAll(data?.id)
  return { success: true, id: data?.id }
}

// ─── キャスト更新 ─────────────────────────────────────────
export async function updateCast(id: string, formData: FormData) {
  const supabase = await createClient()

  const stage_name = formData.get('stage_name') as string
  const age = formData.get('age') ? parseInt(formData.get('age') as string) : null
  const hobby = formData.get('hobby') as string
  const comment = formData.get('comment') as string
  const is_active = formData.get('is_active') !== 'false'
  const display_order = formData.get('display_order')
    ? parseInt(formData.get('display_order') as string) : 0
  const image_url = formData.get('image_url') as string || null

  const { error } = await supabase.from('casts').update({
    stage_name, age, hobby, comment, is_active, display_order, image_url,
    updated_at: new Date().toISOString()
  }).eq('id', id)

  if (error) return { error: error.message }

  revalidatePath('/admin/casts')
  revalidateAll(id)
  return { success: true }
}

// ─── キャスト削除 ─────────────────────────────────────────
export async function deleteCast(id: string) {
  const supabase = await createClient()

  const { error } = await supabase.from('casts').delete().eq('id', id)

  if (error) return { error: error.message }

  revalidatePath('/admin/casts')
  revalidateAll()
  return { success: true }
}
