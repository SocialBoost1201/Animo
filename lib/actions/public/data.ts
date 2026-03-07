'use server'

import { createServiceClient } from '@/lib/supabase/service'

// ─── 公開キャスト一覧 ──────────────────────────────────────
export async function getPublicCasts() {
  const supabase = createServiceClient()
  const { data, error } = await supabase
    .from('casts')
    .select('*')
    .eq('is_active', true)
    .order('display_order', { ascending: true })
    .order('created_at', { ascending: false })

  if (error) {
    console.error('Failed to fetch casts:', error)
    return []
  }
  return data
}

// ─── 公開キャスト詳細（スケジュール JOIN）──────────────────
export async function getPublicCastById(id: string) {
  const supabase = createServiceClient()
  const today = new Date()
  const jstToday = new Date(today.getTime() + 9 * 60 * 60 * 1000)
  const todayStr = jstToday.toISOString().split('T')[0]
  const endDate = new Date(jstToday)
  endDate.setDate(endDate.getDate() + 6)
  const endStr = endDate.toISOString().split('T')[0]

  const { data: cast, error } = await supabase
    .from('casts')
    .select('*')
    .eq('id', id)
    .eq('is_active', true)
    .single()

  if (error || !cast) return null

  const { data: schedules } = await supabase
    .from('cast_schedules')
    .select('*')
    .eq('cast_id', id)
    .gte('date', todayStr)
    .lte('date', endStr)
    .order('date', { ascending: true })

  return { ...cast, upcomingSchedules: schedules || [] }
}

// ─── 公開シフト取得（7日間）──────────────────────────────
export async function getPublicShifts() {
  const supabase = createServiceClient()
  const today = new Date()
  const jstToday = new Date(today.getTime() + 9 * 60 * 60 * 1000)
  const startStr = jstToday.toISOString().split('T')[0]
  const endDate = new Date(jstToday)
  endDate.setDate(endDate.getDate() + 6)
  const endStr = endDate.toISOString().split('T')[0]

  const { data, error } = await supabase
    .from('cast_schedules')
    .select('*, casts(id, stage_name, image_url, age, hobby)')
    .gte('date', startStr)
    .lte('date', endStr)
    .order('date', { ascending: true })

  if (error) {
    console.error('Failed to fetch shifts:', error)
    return []
  }
  return data
}

// ─── 本日の出勤キャスト ────────────────────────────────────
export async function getTodayShifts() {
  const supabase = createServiceClient()
  const today = new Date()
  const jstToday = new Date(today.getTime() + 9 * 60 * 60 * 1000)
  const todayStr = jstToday.toISOString().split('T')[0]

  const { data, error } = await supabase
    .from('cast_schedules')
    .select('*, casts(id, stage_name, image_url, age)')
    .eq('date', todayStr)

  if (error) {
    console.error('Failed to fetch today shifts:', error)
    return []
  }
  return data
}

// ─── 公開コンテンツ取得 ────────────────────────────────────
export async function getPublicContents(type: string, limit?: number) {
  const supabase = createServiceClient()
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

// ─── 公開ヒーローメディア ─────────────────────────────────
export async function getPublicHeroMedia() {
  const supabase = createServiceClient()
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
