'use server'

import { createServiceClient } from '@/lib/supabase/service'

// ─── JST 今日の日付文字列を返す ───────────────────────────
function jstToday(): string {
  return new Date(Date.now() + 9 * 60 * 60 * 1000).toISOString().split('T')[0]
}
function jstDateAfterDays(days: number): string {
  return new Date(Date.now() + 9 * 60 * 60 * 1000 + days * 86400000).toISOString().split('T')[0]
}

// ─── 公開キャスト一覧（is_active=true, display_order順）────
export async function getPublicCasts() {
  const supabase = createServiceClient()
  const { data, error } = await supabase
    .from('casts')
    .select('*, cast_images(image_url, image_type, is_primary, sort_order)')
    .eq('is_active', true)
    .order('display_order', { ascending: true })
    .order('created_at', { ascending: false })

  if (error) { console.error('getPublicCasts:', error); return [] }
  return data
}

// ─── Night Style 診断マッチキャスト（スコア順 top N）─────────
export async function getMatchedCasts(tags: string[], limit = 4) {
  const supabase = createServiceClient()
  const { data, error } = await supabase
    .from('casts')
    .select('id, stage_name, slug, age, quiz_tags, cast_images(image_url, is_primary)')
    .eq('is_active', true)

  if (error || !data) return []

  // スコア計算: タグ一致ごとに +1
  const scored = data.map((cast) => {
    const castTags: string[] = cast.quiz_tags ?? []
    const score = tags.filter((t) => castTags.includes(t)).length
    return { ...cast, matchScore: score }
  })

  return scored
    .filter((c) => c.matchScore > 0)
    .sort((a, b) => b.matchScore - a.matchScore)
    .slice(0, limit)
}

// ─── 公開キャスト詳細（slug ベース）──────────────────────
export async function getPublicCastBySlug(slug: string) {
  const supabase = createServiceClient()
  const today = jstToday()
  const end = jstDateAfterDays(6)

  const { data: cast, error } = await supabase
    .from('casts')
    .select(`
      *,
      cast_images(image_url, image_type, is_primary, sort_order),
      cast_tag_relations(cast_tags(id, name, slug))
    `)
    .eq('slug', slug)
    .eq('is_active', true)
    .single()

  if (error || !cast) return null

  const { data: schedules } = await supabase
    .from('cast_schedules')
    .select('*')
    .eq('cast_id', cast.id)
    .gte('work_date', today)
    .lte('work_date', end)
    .order('work_date', { ascending: true })

  return { ...cast, upcomingSchedules: schedules || [] }
}

// ─── 公開シフト取得（7日間）──────────────────────────────
export async function getPublicShifts() {
  const supabase = createServiceClient()
  const today = jstToday()
  const end = jstDateAfterDays(6)

  const { data, error } = await supabase
    .from('cast_schedules')
    .select(`
      *,
      casts(id, slug, stage_name, age, hobby,
        cast_images(image_url, is_primary))
    `)
    .gte('work_date', today)
    .lte('work_date', end)
    .order('work_date', { ascending: true })

  if (error) { console.error('getPublicShifts:', error); return [] }
  return data
}

// ─── 本日の出勤キャスト ────────────────────────────────────
export async function getTodayShifts() {
  const supabase = createServiceClient()
  const today = jstToday()

  const { data, error } = await supabase
    .from('cast_schedules')
    .select(`
      *,
      casts(id, slug, stage_name, age,
        cast_images(image_url, is_primary))
    `)
    .eq('work_date', today)

  if (error) { console.error('getTodayShifts:', error); return [] }
  return data
}

// ─── 公開ニュース取得 ─────────────────────────────────────
export async function getPublicNews(limit?: number) {
  const supabase = createServiceClient()
  let query = supabase
    .from('news')
    .select('*')
    .eq('is_published', true)
    .order('published_at', { ascending: false, nullsFirst: false })
    .order('created_at', { ascending: false })

  if (limit) query = query.limit(limit)
  const { data, error } = await query
  if (error) { console.error('getPublicNews:', error); return [] }
  return data
}

// ─── 公開コンテンツ取得（後方互換）──────────────────────
export async function getPublicContents(type: string, limit?: number) {
  const supabase = createServiceClient()
  let query = supabase
    .from('contents')
    .select('*')
    .eq('type', type)
    .eq('is_published', true)
    .order('content_date', { ascending: false, nullsFirst: false })
    .order('created_at', { ascending: false })
  if (limit) query = query.limit(limit)
  const { data, error } = await query
  if (error) { console.error('getPublicContents:', error); return [] }
  return data
}

// ─── 公開ヒーローメディア ─────────────────────────────────
export async function getPublicHeroMedia() {
  const supabase = createServiceClient()
  const { data, error } = await supabase
    .from('hero_media')
    .select('*')
    .eq('is_active', true)
    .order('sort_order', { ascending: true })
    .order('created_at', { ascending: false })
  if (error) { console.error('getPublicHeroMedia:', error); return [] }
  return data
}

// ─── ギャラリー取得 ──────────────────────────────────────
export async function getPublicGallery() {
  const supabase = createServiceClient()
  const { data, error } = await supabase
    .from('gallery_assets')
    .select('*')
    .eq('is_published', true)
    .order('sort_order', { ascending: true })
  if (error) { console.error('getPublicGallery:', error); return [] }
  return data
}
