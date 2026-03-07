'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

function revalidateAll(slug?: string) {
  revalidatePath('/')
  revalidatePath('/cast')
  revalidatePath('/shift')
  if (slug) revalidatePath(`/cast/${slug}`)
}

export async function getCasts() {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('casts')
    .select('*, cast_images(image_url, is_primary)')
    .order('display_order', { ascending: true })
    .order('created_at', { ascending: false })
  if (error) throw new Error(error.message)
  return data
}

export async function getCastById(id: string) {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('casts')
    .select('*, cast_images(id, image_url, image_type, is_primary, sort_order)')
    .eq('id', id)
    .single()
  if (error) throw new Error(error.message)
  return data
}

export async function createCast(formData: FormData) {
  const supabase = await createClient()

  const stage_name = formData.get('stage_name') as string
  const slug = formData.get('slug') as string
  const age = formData.get('age') ? parseInt(formData.get('age') as string) : null
  const hobby = formData.get('hobby') as string || null
  const comment = formData.get('comment') as string || null
  const is_active = formData.get('is_active') !== 'false'
  const display_order = parseInt(formData.get('display_order') as string || '0')
  const image_url = formData.get('image_url') as string || null

  const { data, error } = await supabase.from('casts').insert({
    stage_name, slug, age, hobby, comment, is_active, display_order
  }).select('id, slug').single()

  if (error) return { error: error.message }

  // cast_images へ画像を登録
  if (image_url && data?.id) {
    await supabase.from('cast_images').insert({
      cast_id: data.id,
      image_url,
      image_type: 'profile',
      is_primary: true,
      sort_order: 0
    })
  }

  revalidatePath('/admin/casts')
  revalidateAll(data?.slug)
  return { success: true, id: data?.id }
}

export async function updateCast(id: string, formData: FormData) {
  const supabase = await createClient()

  const stage_name = formData.get('stage_name') as string
  const slug = formData.get('slug') as string
  const age = formData.get('age') ? parseInt(formData.get('age') as string) : null
  const hobby = formData.get('hobby') as string || null
  const comment = formData.get('comment') as string || null
  const is_active = formData.get('is_active') !== 'false'
  const display_order = parseInt(formData.get('display_order') as string || '0')
  const image_url = formData.get('image_url') as string || null

  const { error } = await supabase.from('casts').update({
    stage_name, slug, age, hobby, comment, is_active, display_order,
    updated_at: new Date().toISOString()
  }).eq('id', id)

  if (error) return { error: error.message }

  // 画像更新（image_url が指定された場合は is_primary を上書き）
  if (image_url) {
    await supabase.from('cast_images').delete().eq('cast_id', id).eq('is_primary', true)
    await supabase.from('cast_images').insert({
      cast_id: id, image_url, image_type: 'profile', is_primary: true, sort_order: 0
    })
  }

  revalidatePath('/admin/casts')
  revalidateAll(slug)
  return { success: true }
}

export async function deleteCast(id: string) {
  const supabase = await createClient()
  const { data: cast } = await supabase.from('casts').select('slug').eq('id', id).single()
  const { error } = await supabase.from('casts').delete().eq('id', id)
  if (error) return { error: error.message }
  revalidatePath('/admin/casts')
  revalidateAll(cast?.slug)
  return { success: true }
}
