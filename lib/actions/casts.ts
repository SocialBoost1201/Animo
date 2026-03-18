'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

function revalidateAll(slug?: string) {
  revalidatePath('/')
  revalidatePath('/cast')
  revalidatePath('/shift')
  if (slug) revalidatePath(`/cast/${slug}`)
}

export async function getCasts(query?: string) {
  const supabase = await createClient()
  let sql = supabase
    .from('casts')
    .select('*, cast_images(image_url, is_primary), cast_scores(total_score, current_level, target_month)')
    .order('display_order', { ascending: true })
    .order('name_kana', { ascending: true })
    .order('created_at', { ascending: false })

  if (query) {
    // stage_name または name にクエリが含まれるか検索
    sql = sql.or(`stage_name.ilike.%${query}%,name.ilike.%${query}%`)
  }

  const { data, error } = await sql

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
  const name_kana = formData.get('name_kana') as string
  let slug = formData.get('slug') as string
  if (!slug) {
    slug = crypto.randomUUID().split('-')[0]
  }
  const age = formData.get('age') ? parseInt(formData.get('age') as string) : null
  const height = formData.get('height') ? parseInt(formData.get('height') as string) : null
  const hobby = formData.get('hobby') as string || null
  const comment = formData.get('comment') as string || null
  const is_active = formData.get('is_active') !== 'false'
  const display_order = parseInt(formData.get('display_order') as string || '0')
  const quiz_tags = formData.getAll('quiz_tags') as string[]
  const image_file = formData.get('image_file') as File | null

  const { data, error } = await supabase.from('casts').insert({
    name: stage_name, stage_name, name_kana, slug, age, height, hobby, comment, is_active, display_order, quiz_tags
  }).select('id, slug').single()

  if (error) return { error: error.message }

  // cast_images へ画像をアップロードして登録
  if (image_file && image_file.size > 0 && data?.id) {
    const ext = image_file.name.split('.').pop()
    const fileName = `${data.id}-${Date.now()}.${ext}`
    
    // Storageにアップロード
    const { error: uploadError } = await supabase.storage
      .from('images')
      .upload(`casts/${fileName}`, image_file, { cacheControl: '3600', upsert: false })

    if (uploadError) {
      console.error('Image Upload Error:', uploadError)
    } else {
      // 成功したら公開URLを取得してDB登録
      const { data: { publicUrl } } = supabase.storage
        .from('images')
        .getPublicUrl(`casts/${fileName}`)

      await supabase.from('cast_images').insert({
        cast_id: data.id,
        image_url: publicUrl,
        image_type: 'profile',
        is_primary: true,
        sort_order: 0
      })
    }
  }

  revalidatePath('/admin/casts')
  revalidateAll(data?.slug)

  // cast_private_info に本名・生年月日を保存（別テーブル・RLS: 管理者のみ）
  if (data?.id) {
    const real_name = formData.get('real_name') as string
    const date_of_birth = formData.get('date_of_birth') as string
    if (real_name && date_of_birth) {
      await supabase.from('cast_private_info').upsert({
        cast_id: data.id,
        real_name,
        date_of_birth,
      }, { onConflict: 'cast_id' })
    }
  }

  return { success: true, id: data?.id }
}

export async function updateCast(id: string, formData: FormData) {
  const supabase = await createClient()

  const stage_name = formData.get('stage_name') as string
  const name_kana = formData.get('name_kana') as string
  const slug = formData.get('slug') as string
  
  const age = formData.get('age') ? parseInt(formData.get('age') as string) : null
  const height = formData.get('height') ? parseInt(formData.get('height') as string) : null
  const hobby = formData.get('hobby') as string || null
  const comment = formData.get('comment') as string || null
  const is_active = formData.get('is_active') !== 'false'
  const display_order = parseInt(formData.get('display_order') as string || '0')
  const quiz_tags = formData.getAll('quiz_tags') as string[]
  const image_file = formData.get('image_file') as File | null

  const updateData: Record<string, unknown> = {
    stage_name, name_kana, age, height, hobby, comment, is_active, display_order, quiz_tags,
    updated_at: new Date().toISOString()
  }
  if (slug) {
    updateData.slug = slug
  }

  const { error } = await supabase.from('casts').update(updateData).eq('id', id)

  if (error) return { error: error.message }

  // 画像アップロード・更新処理
  if (image_file && image_file.size > 0) {
    const ext = image_file.name.split('.').pop()
    const fileName = `${id}-${Date.now()}.${ext}`
    
    // 古い画像URL（Supabase Storageのもの）があれば削除するロジックなどは、
    // ここでは複雑になるため省略（または保持）し、新しい画像をis_primaryとして登録・上書きします。
    
    const { error: uploadError } = await supabase.storage
      .from('images')
      .upload(`casts/${fileName}`, image_file, { cacheControl: '3600', upsert: false })

    if (uploadError) {
      console.error('Image Upload Error:', uploadError)
    } else {
      const { data: { publicUrl } } = supabase.storage
        .from('images')
        .getPublicUrl(`casts/${fileName}`)

      // 古い is_primary を削除（またはダウングレード）してから新しいものを登録
      await supabase.from('cast_images').delete().eq('cast_id', id).eq('is_primary', true)
      await supabase.from('cast_images').insert({
        cast_id: id, image_url: publicUrl, image_type: 'profile', is_primary: true, sort_order: 0
      })
    }
  }

  revalidatePath('/admin/casts')
  revalidateAll(slug)

  // cast_private_info を更新（upsertで存在しなければ作成）
  const real_name = formData.get('real_name') as string
  const date_of_birth = formData.get('date_of_birth') as string
  if (real_name && date_of_birth) {
    await supabase.from('cast_private_info').upsert({
      cast_id: id,
      real_name,
      date_of_birth,
    }, { onConflict: 'cast_id' })
  }

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
