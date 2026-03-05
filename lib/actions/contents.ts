'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

// Site Settings
export async function getSiteSettings() {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('site_settings')
    .select('*')
    .eq('id', 1)
    .single()
  
  if (error) throw new Error(error.message)
  return data
}

export async function updateSiteSettings(formData: FormData) {
  const supabase = await createClient()
  
  const today_mood = formData.get('today_mood') as string
  const vip_availability = formData.get('vip_availability') as string
  const hero_transition_mode = formData.get('hero_transition_mode') as string
  
  const { error } = await supabase.from('site_settings').upsert({
    id: 1,
    today_mood,
    vip_availability,
    hero_transition_mode,
    updated_at: new Date().toISOString()
  })

  if (error) return { error: error.message }
  
  revalidatePath('/')
  revalidatePath('/admin/settings')
  return { success: true }
}

// Contents (News, Events, Gallery)
export async function getContents(type?: string) {
  const supabase = await createClient()
  let query = supabase.from('contents').select('*').order('created_at', { ascending: false })
  
  if (type) {
    query = query.eq('type', type)
  }
  
  const { data, error } = await query
  if (error) throw new Error(error.message)
  return data
}

export async function createContent(formData: FormData) {
  const supabase = await createClient()
  
  const type = formData.get('type') as string
  const title = formData.get('title') as string
  const description = formData.get('description') as string
  const content_date = formData.get('content_date') as string || null
  const is_published = formData.get('is_published') === 'on'
  const category = formData.get('category') as string || null
  
  // Storage logic would go here
  const image_url = 'https://images.unsplash.com/photo-1572116469629-078bc1b849e4?q=80&w=1920&auto=format&fit=crop'
  
  const { error } = await supabase.from('contents').insert({
    type,
    title,
    description,
    content_date,
    is_published,
    category,
    image_url
  })

  if (error) return { error: error.message }
  
  revalidatePath('/admin/contents')
  revalidatePath('/admin/gallery')
  revalidatePath('/')
  return { success: true }
}

export async function deleteContent(id: string) {
  const supabase = await createClient()
  const { error } = await supabase.from('contents').delete().eq('id', id)
  
  if (error) return { error: error.message }
  
  revalidatePath('/admin/contents')
  revalidatePath('/admin/gallery')
  return { success: true }
}
