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

export async function getWeeklySchedules(targetDate = new Date()) {
  const supabase = await createClient()
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

export async function saveSchedules(formData: FormData) {
  const supabase = await createClient()
  const updatesData = formData.get('updates') as string
  if (!updatesData) return { success: true }

  try {
    const updates = JSON.parse(updatesData)

    for (const update of updates) {
      if (update.action === 'insert') {
        await supabase.from('cast_schedules').insert({
          cast_id: update.cast_id,
          work_date: update.date,
          start_time: update.start_time === 'LAST' ? null : (update.start_time || null),
          end_time: update.end_time === 'LAST' ? null : (update.end_time || null),
        })
      } else if (update.action === 'delete') {
        await supabase
          .from('cast_schedules')
          .delete()
          .eq('cast_id', update.cast_id)
          .eq('work_date', update.date)
      }
    }

    revalidatePath('/')
    revalidatePath('/admin/shifts')
    revalidatePath('/shift')
    revalidatePath('/cast')

    const castIds = [...new Set(updates.map((u: { cast_id: string }) => u.cast_id).filter(Boolean))]
    if (castIds.length > 0) {
      const { data: castsData } = await supabase
        .from('casts').select('slug').in('id', castIds)
      if (castsData) {
        castsData.forEach((c: { slug?: string }) => { if (c.slug) revalidatePath(`/cast/${c.slug}`) })
      }
    }

    return { success: true }
  } catch (error: unknown) {
    const err = error as Error;
    return { error: err.message || 'スケジュール更新に失敗しました' }
  }
}
