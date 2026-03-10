'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

// 今週の日付一覧（月〜日）を取得するユーティリティ
function getWeekDates(startDate = new Date()) {
  const dates = []
  const current = new Date(startDate)
  // 曜日を月曜始まりにする調整 (0=日, 1=月... なので 1を基準にする)
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

// 特定の週のシフト全取得
export async function getWeeklyShifts(targetDate = new Date()) {
  const supabase = await createClient()
  const dates = getWeekDates(targetDate)
  const startDate = dates[0]
  const endDate = dates[6]

  // キャスト一覧の取得 (シフト枠表示のベースとなるため)
  const { data: casts, error: castsError } = await supabase
    .from('casts')
    .select('id, name')
    .eq('status', 'public')
    .order('created_at', { ascending: true })

  if (castsError) throw new Error(castsError.message)

  // 該当期間のシフトデータ取得
  const { data: shifts, error: shiftsError } = await supabase
    .from('shifts')
    .select('*')
    .gte('date', startDate)
    .lte('date', endDate)

  if (shiftsError) throw new Error(shiftsError.message)

  return { casts, shifts, dates }
}

// シフトの一括更新
export async function updateShifts(formData: FormData) {
  const supabase = await createClient()
  
  // 送信されたformDataから updates JSONを取り出す (クライアント側でJSON化して送る想定)
  const updatesData = formData.get('updates') as string
  if (!updatesData) return { success: true }
  
  try {
    const updates = JSON.parse(updatesData) 
    // updates = [ { action: 'insert'|'delete', cast_id, date, start_time, end_time } ]
    
    for (const update of updates) {
      if (update.action === 'insert') {
        await supabase.from('shifts').insert({
          cast_id: update.cast_id,
          date: update.date,
          start_time: update.start_time === 'LAST' ? null : (update.start_time || null),
          end_time: update.end_time === 'LAST' ? null : (update.end_time || null),
        })
      } else if (update.action === 'delete') {
        await supabase.from('shifts')
          .delete()
          .eq('cast_id', update.cast_id)
          .eq('date', update.date)
      }
    }

    revalidatePath('/')
    revalidatePath('/admin/shifts')
    revalidatePath('/shift')
    revalidatePath('/cast')
    // キャストslugを取得して詳細ページもrevalidate
    const castIds = [...new Set(updates.map((u: { cast_id: string }) => u.cast_id).filter(Boolean))]
    if (castIds.length > 0) {
      const supabaseForSlugs = await createClient()
      const { data: castsData } = await supabaseForSlugs
        .from('casts').select('slug').in('id', castIds)
      if (castsData) {
        castsData.forEach((c: { slug?: string }) => { if (c.slug) revalidatePath(`/cast/${c.slug}`) })
      }
    }
    return { success: true }
  } catch (error: unknown) {
    const err = error as Error;
    return { error: err.message || 'シフト更新に失敗しました' }
  }
}
