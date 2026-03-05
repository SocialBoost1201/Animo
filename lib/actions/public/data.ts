'use server'

import { createClient } from '@/lib/supabase/server'

// 公開用: ヒーローメディア取得
export async function getPublicHeroMedia() {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('hero_media')
    .select('*')
    .eq('is_active', true)
    .order('sort_order', { ascending: true })
    .order('created_at', { ascending: false })
  
  if (error) {
    console.error('Failed to fetch hero media:', error)
    return []
  }
  return data
}

// 公開用: キャスト取得 (出勤フラグや順序など、必要に応じて)
export async function getPublicCasts() {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('casts')
    .select('*')
    .eq('status', 'public')
    .order('is_today', { ascending: false }) // Today's cast first
    .order('created_at', { ascending: false })
  
  if (error) {
    console.error('Failed to fetch casts:', error)
    return []
  }
  return data
}

// 公開用: コンテンツ取得
export async function getPublicContents(type: string, limit?: number) {
  const supabase = await createClient()
  let query = supabase
    .from('contents')
    .select('*')
    .eq('type', type)
    .eq('is_published', true)
    .order('content_date', { ascending: false, nullsFirst: false })
    .order('created_at', { ascending: false })
    
  if (limit) {
    query = query.limit(limit)
  }
  
  const { data, error } = await query
  if (error) {
    console.error(`Failed to fetch ${type}:`, error)
    return []
  }
  return data
}
