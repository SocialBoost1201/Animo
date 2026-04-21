'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

function getWeekDates(startDate = new Date()): string[] {
  const dates: string[] = []
  const current = new Date(startDate)
  const day = current.getDay()
  const diff = current.getDate() - day + (day === 0 ? -6 : 1)
  current.setDate(diff)
  for (let i = 0; i < 7; i++) {
    const d = new Date(current)
    d.setDate(current.getDate() + i)
    dates.push(d.toISOString().split('T')[0])
  }
  return dates
}

function getMonthDates(targetMonth = new Date()): string[] {
  const dates: string[] = []
  const year = targetMonth.getFullYear()
  const month = targetMonth.getMonth()
  const lastDay = new Date(year, month + 1, 0).getDate()
  for (let i = 1; i <= lastDay; i++) {
    const d = new Date(year, month, i)
    d.setMinutes(d.getMinutes() - d.getTimezoneOffset()) // Avoid UTC shift issues
    dates.push(d.toISOString().split('T')[0])
  }
  return dates
}

export async function getWeeklySchedules(targetDate = new Date()) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Unauthorized')
  const dates = getWeekDates(targetDate)

  const { data: casts, error: castsError } = await supabase
    .from('casts')
    .select('id, stage_name, slug')
    .eq('is_active', true)
    .order('display_order', { ascending: true })
  if (castsError) throw new Error(castsError.message)

  const { data: schedules, error: schedulesError } = await supabase
    .from('cast_schedules')
    .select('*')
    .gte('work_date', dates[0])
    .lte('work_date', dates[6])
  if (schedulesError) throw new Error(schedulesError.message)

  return { casts, schedules, dates }
}

export async function getMonthlySchedules(targetDate = new Date()) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Unauthorized')
  const dates = getMonthDates(targetDate)

  const { data: casts, error: castsError } = await supabase
    .from('casts')
    .select('id, stage_name, slug')
    .eq('is_active', true)
    .order('display_order', { ascending: true })
  if (castsError) throw new Error(castsError.message)

  const { data: schedules, error: schedulesError } = await supabase
    .from('cast_schedules')
    .select('*')
    .gte('work_date', dates[0])
    .lte('work_date', dates[dates.length - 1])
  if (schedulesError) throw new Error(schedulesError.message)

  return { casts, schedules, dates }
}

export async function saveSchedules(formData: FormData) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Unauthorized')
  const updatesData = formData.get('updates') as string
  if (!updatesData) return { success: true }

  try {
    const updates = JSON.parse(updatesData) as {
      action: 'insert' | 'delete';
      cast_id: string;
      date: string;
      start_time?: string;
      end_time?: string;
    }[]

    const toInsert = updates
      .filter(u => u.action === 'insert')
      .map(u => ({
        cast_id: u.cast_id,
        work_date: u.date,
        start_time: u.start_time === 'LAST' ? null : (u.start_time || null),
        end_time: u.end_time === 'LAST' ? null : (u.end_time || null),
      }))

    const toDelete = updates.filter(u => u.action === 'delete')

    // 一括削除実行 (各ペアに対して)
    if (toDelete.length > 0) {
      // Supabase supports .or() for complex filters. 
      // For many deletes, looping is actually safer unless we use a temporary table or RPC,
      // but let's at least group them better if possible.
      // Small scale (tens) is fine with Promise.all
      await Promise.all(toDelete.map(u => 
        supabase
          .from('cast_schedules')
          .delete()
          .eq('cast_id', u.cast_id)
          .eq('work_date', u.date)
      ))
    }

    // 一括挿入実行
    if (toInsert.length > 0) {
      const { error } = await supabase
        .from('cast_schedules')
        .insert(toInsert)
      if (error) throw error
    }

    // Revalidation (minimizing calls)
    const pathsToRevalidate = [
      '/',
      '/admin/shifts',
      '/shift',
      '/cast'
    ]

    pathsToRevalidate.forEach(p => revalidatePath(p))

    // Unique cast slugs revalidation
    const castIds = [...new Set(updates.map(u => u.cast_id).filter(Boolean))]
    if (castIds.length > 0) {
      const { data: castsData } = await supabase
        .from('casts').select('slug').in('id', castIds)
      if (castsData) {
        const uniqueSlugs = [...new Set(castsData.map(c => c.slug).filter(Boolean))]
        uniqueSlugs.forEach(slug => revalidatePath(`/cast/${slug}`))
      }
    }

    return { success: true }
  } catch (error: unknown) {
    console.error('Save error:', error)
    const err = error as Error;
    return { error: err.message || 'スケジュール更新に失敗しました' }
  }
}
