'use server'

import { createClient } from '@/lib/supabase/server'
import { validateCastProfileInput } from '@/lib/validators/cast-profile'
import { revalidatePath } from 'next/cache'

function revalidateAll(slug?: string) {
  revalidatePath('/')
  revalidatePath('/cast')
  revalidatePath('/shift')
  if (slug) revalidatePath(`/cast/${slug}`)
}

const SNS_SCHEMA_ERROR_PATTERNS = [
  "Could not find the 'sns_",
  "column casts.sns_",
  'schema cache',
]
const PRIVATE_INFO_SCHEMA_ERROR_PATTERNS = [
  'column cast_private_info_1.phone does not exist',
  'column cast_private_info.phone does not exist',
  "Could not find the 'phone' column",
  "Could not find the 'email' column",
]

function hasMissingSnsColumnError(message: string) {
  return SNS_SCHEMA_ERROR_PATTERNS.some((pattern) => message.includes(pattern))
}

function hasMissingPrivateInfoColumnError(message: string) {
  return PRIVATE_INFO_SCHEMA_ERROR_PATTERNS.some((pattern) => message.includes(pattern))
}

async function insertCastWithSnsFallback(
  supabase: Awaited<ReturnType<typeof createClient>>,
  basePayload: Record<string, unknown>,
  snsPayload: Record<string, unknown>,
) {
  const firstAttempt = await supabase
    .from('casts')
    .insert({ ...basePayload, ...snsPayload })
    .select('id, slug')
    .single()

  if (!firstAttempt.error || !hasMissingSnsColumnError(firstAttempt.error.message)) {
    return firstAttempt
  }

  console.warn('casts SNS columns are unavailable; retrying insert without SNS fields.', {
    message: firstAttempt.error.message,
  })

  return supabase
    .from('casts')
    .insert(basePayload)
    .select('id, slug')
    .single()
}

async function updateCastWithSnsFallback(
  supabase: Awaited<ReturnType<typeof createClient>>,
  id: string,
  basePayload: Record<string, unknown>,
  snsPayload: Record<string, unknown>,
) {
  const firstAttempt = await supabase.from('casts').update({ ...basePayload, ...snsPayload }).eq('id', id)

  if (!firstAttempt.error || !hasMissingSnsColumnError(firstAttempt.error.message)) {
    return firstAttempt
  }

  console.warn('casts SNS columns are unavailable; retrying update without SNS fields.', {
    castId: id,
    message: firstAttempt.error.message,
  })

  return supabase.from('casts').update(basePayload).eq('id', id)
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
  const firstAttempt = await supabase
    .from('casts')
    .select('*, cast_images(id, image_url, image_type, is_primary, sort_order), cast_private_info(real_name, date_of_birth, phone, email)')
    .eq('id', id)
    .single()

  if (!firstAttempt.error || !hasMissingPrivateInfoColumnError(firstAttempt.error.message)) {
    if (firstAttempt.error) throw new Error(firstAttempt.error.message)
    return firstAttempt.data
  }

  console.warn('cast_private_info optional columns are unavailable; retrying cast detail fetch without phone/email.', {
    castId: id,
    message: firstAttempt.error.message,
  })

  const fallbackAttempt = await supabase
    .from('casts')
    .select('*, cast_images(id, image_url, image_type, is_primary, sort_order), cast_private_info(real_name, date_of_birth)')
    .eq('id', id)
    .single()

  if (fallbackAttempt.error) throw new Error(fallbackAttempt.error.message)
  return fallbackAttempt.data
}

export async function createCast(formData: FormData) {
  const supabase = await createClient()

  const profileValidation = validateCastProfileInput({
    real_name: String(formData.get('real_name') ?? ''),
    name_kana: String(formData.get('name_kana') ?? ''),
    stage_name: String(formData.get('stage_name') ?? ''),
    date_of_birth: String(formData.get('date_of_birth') ?? ''),
    phone: String(formData.get('phone') ?? ''),
    email: String(formData.get('email') ?? ''),
  })

  if (Object.keys(profileValidation.fieldErrors).length > 0) {
    return {
      error: '入力内容を確認してください。',
      fieldErrors: profileValidation.fieldErrors,
    }
  }

  const stage_name = profileValidation.values.stageName
  const name_kana = profileValidation.values.nameKana
  const real_name = profileValidation.values.realName
  const date_of_birth = profileValidation.values.dateOfBirth
  const phone = profileValidation.values.phone
  const email = profileValidation.values.email

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
  const sns_x = formData.get('sns_x') as string || null
  const sns_instagram = formData.get('sns_instagram') as string || null
  const sns_tiktok = formData.get('sns_tiktok') as string || null

  const basePayload = {
    name: stage_name, stage_name, name_kana, slug, age, height, hobby, comment, is_active, display_order, quiz_tags,
    status: is_active ? 'public' : 'private',
  }
  const snsPayload = { sns_x, sns_instagram, sns_tiktok }

  const { data, error } = await insertCastWithSnsFallback(supabase, basePayload, snsPayload)

  if (error) return { error: error.message }
  if (!data?.id) return { error: 'Cast insert succeeded but no ID was returned.' }

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

  revalidatePath('/admin/human-resources')
  revalidatePath(`/admin/human-resources/${data.id}`)
  revalidateAll(data?.slug)

  // cast_private_info に必須個人情報を保存（別テーブル・RLS: 管理者のみ）
  if (data?.id) {
    await supabase.from('cast_private_info').upsert({
      cast_id: data.id,
      real_name,
      date_of_birth,
      phone,
      email,
    }, { onConflict: 'cast_id' })
  }

  return { success: true, id: data?.id }
}

export async function updateCast(id: string, formData: FormData) {
  const supabase = await createClient()

  const profileValidation = validateCastProfileInput({
    real_name: String(formData.get('real_name') ?? ''),
    name_kana: String(formData.get('name_kana') ?? ''),
    stage_name: String(formData.get('stage_name') ?? ''),
    date_of_birth: String(formData.get('date_of_birth') ?? ''),
    phone: String(formData.get('phone') ?? ''),
    email: String(formData.get('email') ?? ''),
  })

  if (Object.keys(profileValidation.fieldErrors).length > 0) {
    return {
      error: '入力内容を確認してください。',
      fieldErrors: profileValidation.fieldErrors,
    }
  }

  const stage_name = profileValidation.values.stageName
  const name_kana = profileValidation.values.nameKana
  const real_name = profileValidation.values.realName
  const date_of_birth = profileValidation.values.dateOfBirth
  const phone = profileValidation.values.phone
  const email = profileValidation.values.email

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
    name: stage_name, stage_name, name_kana, age, height, hobby, comment, is_active, display_order, quiz_tags,
    status: is_active ? 'public' : 'private',
    updated_at: new Date().toISOString()
  }
  const snsUpdateData: Record<string, unknown> = {
    sns_x: formData.get('sns_x') as string || null,
    sns_instagram: formData.get('sns_instagram') as string || null,
    sns_tiktok: formData.get('sns_tiktok') as string || null,
  }
  if (slug) {
    updateData.slug = slug
  }

  const { error } = await updateCastWithSnsFallback(supabase, id, updateData, snsUpdateData)

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

  revalidatePath('/admin/human-resources')
  revalidatePath(`/admin/human-resources/${id}`)
  revalidateAll(slug)

  // cast_private_info を更新（upsertで存在しなければ作成）
  await supabase.from('cast_private_info').upsert({
    cast_id: id,
    real_name,
    date_of_birth,
    phone,
    email,
  }, { onConflict: 'cast_id' })

  return { success: true }
}

export async function deleteCast(id: string) {
  const supabase = await createClient()
  const { data: cast } = await supabase.from('casts').select('slug').eq('id', id).single()
  const { error } = await supabase.from('casts').delete().eq('id', id)
  if (error) return { error: error.message }
  revalidatePath('/admin/human-resources')
  revalidateAll(cast?.slug)
  return { success: true }
}
