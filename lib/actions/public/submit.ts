'use server'

import { createClient } from '@/lib/supabase/server'

export async function submitContact(formData: FormData) {
  const supabase = await createClient()

  // フォームデータから必要なフィールドを抽出
  const type = formData.get('type') as string
  const name = formData.get('name') as string
  const phone = formData.get('phone') as string
  const contact_method = formData.get('contactMethod') as string
  const message = formData.get('message') as string

  // 予約特有のフィールド
  const dateStr = formData.get('date') as string
  const timeStr = formData.get('time') as string
  const people = parseInt(formData.get('people') as string, 10)
  const castName = formData.get('castName') as string

  // DBの contacts テーブルに挿入
  const { error } = await supabase.from('contacts').insert({
    type,
    name,
    phone,
    contact_method,
    message,
    date: dateStr || null,
    time: timeStr ? `${timeStr}:00` : null, // format HH:MM:SS needed by time type
    people: isNaN(people) ? null : people,
    cast_name: castName || null,
    is_read: false
  })

  if (error) {
    console.error('Contact submit error:', error.message)
    return { error: '送信に失敗しました。時間をおいて再度お試しください。' }
  }

  return { success: true }
}

export async function submitRecruitApplication(formData: FormData) {
  const supabase = await createClient()

  const type = formData.get('type') as string // 'cast' | 'staff'
  const name = formData.get('name') as string
  const age = parseInt(formData.get('age') as string, 10)
  const phone = formData.get('phone') as string
  const experience = formData.get('experience') as string
  const schedule = formData.get('schedule') as string
  const message = formData.get('message') as string

  const { error } = await supabase.from('recruit_applications').insert({
    type,
    name,
    age: isNaN(age) ? null : age,
    phone,
    experience,
    schedule,
    message,
    is_read: false
  })

  if (error) {
    console.error('Recruit submit error:', error.message)
    return { error: '送信に失敗しました。時間をおいて再度お試しください。' }
  }

  return { success: true }
}
