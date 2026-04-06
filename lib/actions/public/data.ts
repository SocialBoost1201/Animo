'use server'

import { createServiceClient } from '@/lib/supabase/service'

// ─── JST 今日の日付文字列を返す ───────────────────────────
function jstToday(): string {
  return new Date(Date.now() + 9 * 60 * 60 * 1000).toISOString().split('T')[0]
}
function jstDateAfterDays(days: number): string {
  return new Date(Date.now() + 9 * 60 * 60 * 1000 + days * 86400000).toISOString().split('T')[0]
}

type CastImageRecord = {
  image_url?: string | null
  is_primary?: boolean | null
  sort_order?: number | null
}

function resolveCastImageUrl(
  imageUrl: string | null | undefined,
  castImages: CastImageRecord[] | null | undefined
) {
  if (typeof imageUrl === 'string' && imageUrl.trim() !== '') {
    return imageUrl
  }

  if (!Array.isArray(castImages) || castImages.length === 0) {
    return null
  }

  const primaryImage = castImages.find((image) => image.is_primary && image.image_url)
  if (primaryImage?.image_url) {
    return primaryImage.image_url
  }

  const firstImage = [...castImages]
    .sort((a, b) => (a.sort_order ?? Number.MAX_SAFE_INTEGER) - (b.sort_order ?? Number.MAX_SAFE_INTEGER))
    .find((image) => image.image_url)

  return firstImage?.image_url ?? null
}

// ─── 公開キャスト一覧（is_active=true, display_order順）────
export async function getPublicCasts() {
  try {
    const supabase = createServiceClient()
    const { data, error } = await supabase
      .from('casts')
      .select(`
        *,
        cast_images(image_url, image_type, is_primary, sort_order),
        cast_posts(created_at)
      `)
      .eq('is_active', true)
      .order('display_order', { ascending: true })
      .order('created_at', { ascending: false })

    if (error) { console.error('getPublicCasts:', error); return [] }

    // 一覧表示に必要な項目を欠損時フォールバック込みで正規化する
    const diaryThreshold = Date.now() - 72 * 60 * 60 * 1000

    return data.map(cast => {
      const posts = (cast.cast_posts ?? []) as { created_at: string }[]
      const latest = posts
        .map(p => new Date(p.created_at).getTime())
        .filter((timestamp) => !Number.isNaN(timestamp))
        .sort((a, b) => b - a)[0]
      const displayName = cast.stage_name || cast.name || ''
      const imageUrl = resolveCastImageUrl(cast.image_url, cast.cast_images as CastImageRecord[] | null | undefined)

      return {
        ...cast,
        display_name: displayName,
        image_url: imageUrl,
        quiz_tags: Array.isArray(cast.quiz_tags) ? cast.quiz_tags : [],
        has_recent_post: typeof latest === 'number' ? latest >= diaryThreshold : false,
        latest_post_at: latest ? new Date(latest).toISOString() : null,
      }
    })
  } catch (err) {
    console.error('getPublicCasts: unexpected error', err)
    return []
  }
}

// ─── Night Style 診断マッチキャスト（スコア順 top N）─────────
export async function getMatchedCasts(tags: string[], limit = 4) {
  try {
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
  } catch (err) {
    console.error('getMatchedCasts: unexpected error', err)
    return []
  }
}

// ─── 公開キャスト詳細（slug ベース）──────────────────────
export async function getPublicCastBySlug(slug: string) {
  try {
    const supabase = createServiceClient()
    const today = jstToday()
    const end = jstDateAfterDays(6)

    const { data: cast, error } = await supabase
      .from('casts')
      .select(`
        *,
        cast_images(image_url, image_type, is_primary, sort_order),
        cast_private_info(real_name, date_of_birth),
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
  } catch (err) {
    console.error('getPublicCastBySlug: unexpected error', err)
    return null
  }
}

// ─── 公開シフト取得（7日間）──────────────────────────────
export async function getPublicShifts() {
  try {
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
  } catch (err) {
    console.error('getPublicShifts: unexpected error', err)
    return []
  }
}

// ─── 本日の出勤キャスト ────────────────────────────────────
export async function getTodayShifts() {
  try {
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
  } catch (err) {
    console.error('getTodayShifts: unexpected error', err)
    return []
  }
}

// ─── 公開ニュース取得 ─────────────────────────────────────
export async function getPublicNews(limit?: number) {
  try {
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
  } catch (err) {
    console.error('getPublicNews: unexpected error', err)
    return []
  }
}

// ─── 公開コンテンツ取得（後方互換）──────────────────────
export async function getPublicContents(type: string, limit?: number) {
  try {
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
  } catch (err) {
    console.error('getPublicContents: unexpected error', err)
    return []
  }
}

// ─── 公開ヒーローメディア ─────────────────────────────────
export async function getPublicHeroMedia() {
  try {
    const supabase = createServiceClient()
    const { data, error } = await supabase
      .from('hero_media')
      .select('*')
      .eq('is_active', true)
      .order('sort_order', { ascending: true })
      .order('created_at', { ascending: false })
    if (error) { console.error('getPublicHeroMedia:', error); return [] }
    return data
  } catch (err) {
    console.error('getPublicHeroMedia: unexpected error', err)
    return []
  }
}

// ─── ギャラリー取得 ──────────────────────────────────────
export async function getPublicGallery() {
  try {
    const supabase = createServiceClient()
    const { data, error } = await supabase
      .from('gallery_assets')
      .select('*')
      .eq('is_published', true)
      .order('sort_order', { ascending: true })
    if (error) { console.error('getPublicGallery:', error); return [] }
    return data
  } catch (err) {
    console.error('getPublicGallery: unexpected error', err)
    return []
  }
}
