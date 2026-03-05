'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

export async function getCasts() {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('casts')
    .select('*')
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

export async function createCast(formData: FormData) {
  const supabase = await createClient()
  
  const name = formData.get('name') as string
  const slug = formData.get('slug') as string
  const age = formData.get('age') ? parseInt(formData.get('age') as string) : null
  const height = formData.get('height') ? parseInt(formData.get('height') as string) : null
  const hobby = formData.get('hobby') as string
  const comment = formData.get('comment') as string
  const status = formData.get('status') as string || 'public'
  const is_today = formData.get('is_today') === 'on'
  
  // Storage upload handling for image would go here in a production environment
  // For now using placeholder
  const image_url = 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=1288&auto=format&fit=crop'
  
  const { error } = await supabase.from('casts').insert({
    name,
    slug,
    age,
    height,
    hobby,
    comment,
    status,
    is_today,
    image_url
  })

  if (error) return { error: error.message }
  
  revalidatePath('/admin/casts')
  revalidatePath('/cast')
  return { success: true }
}

export async function updateCast(id: string, formData: FormData) {
  const supabase = await createClient()
  
  const name = formData.get('name') as string
  const slug = formData.get('slug') as string
  const age = formData.get('age') ? parseInt(formData.get('age') as string) : null
  const height = formData.get('height') ? parseInt(formData.get('height') as string) : null
  const hobby = formData.get('hobby') as string
  const comment = formData.get('comment') as string
  const status = formData.get('status') as string || 'public'
  const is_today = formData.get('is_today') === 'on'
  
  const { error } = await supabase.from('casts').update({
    name,
    slug,
    age,
    height,
    hobby,
    comment,
    status,
    is_today,
  }).eq('id', id)

  if (error) return { error: error.message }
  
  revalidatePath('/admin/casts')
  revalidatePath('/cast')
  revalidatePath(`/cast/${slug}`)
  return { success: true }
}

export async function deleteCast(id: string) {
  const supabase = await createClient()
  const { error } = await supabase.from('casts').delete().eq('id', id)
  
  if (error) return { error: error.message }
  
  revalidatePath('/admin/casts')
  revalidatePath('/cast')
  return { success: true }
}
