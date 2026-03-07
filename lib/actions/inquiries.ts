'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import { sendUserReply } from '@/lib/mail'

// Hero Media
export async function getAdminHeroMedia() {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('hero_media')
    .select('*')
    .order('sort_order', { ascending: true })
    .order('created_at', { ascending: false })
  
  if (error) throw new Error(error.message)
  return data
}

export async function createHeroMedia(formData: FormData) {
  const supabase = await createClient()
  
  const type = formData.get('type') as string
  const title = formData.get('title') as string
  const url = formData.get('url') as string
  const is_active = formData.get('is_active') === 'on'
  
  // Dummy poster for now, ideally derived or uploaded separately
  const poster_url = formData.get('poster_url') as string || 'https://images.unsplash.com/photo-1572116469629-078bc1b849e4?q=80&w=1920&auto=format&fit=crop'
  
  const { error } = await supabase.from('hero_media').insert({
    type,
    title,
    url,
    poster_url,
    is_active
  })

  if (error) return { error: error.message }
  
  revalidatePath('/admin/hero')
  revalidatePath('/')
  return { success: true }
}

export async function deleteHeroMedia(id: string) {
  const supabase = await createClient()
  const { error } = await supabase.from('hero_media').delete().eq('id', id)
  
  if (error) return { error: error.message }
  
  revalidatePath('/admin/hero')
  revalidatePath('/')
  return { success: true }
}

// Inquiries / Applications
export async function getInquiries() {
  const supabase = await createClient()
  
  const { data: contacts, error: contactsError } = await supabase
    .from('contacts')
    .select('*')
    .order('created_at', { ascending: false })

  if (contactsError) throw new Error(contactsError.message)
  
  const { data: applications, error: appError } = await supabase
    .from('recruit_applications')
    .select('*')
    .order('created_at', { ascending: false })

  if (appError) throw new Error(appError.message)

  return { contacts, applications }
}

export async function markAsRead(table: 'contacts' | 'recruit_applications', id: string) {
  const supabase = await createClient()
  const { error } = await supabase.from(table).update({ is_read: true }).eq('id', id)
  
  if (error) return { error: error.message }
  
  revalidatePath('/admin/inquiries')
  revalidatePath('/admin/dashboard')
  return { success: true }
}

export async function getUnreadCounts() {
  const supabase = await createClient()
  
  const [contactsRes, appsRes] = await Promise.all([
    supabase
      .from('contacts')
      .select('id', { count: 'exact', head: true })
      .eq('is_read', false),
    supabase
      .from('recruit_applications')
      .select('id', { count: 'exact', head: true })
      .eq('is_read', false)
  ])

  return (contactsRes.count || 0) + (appsRes.count || 0)
}

export async function sendInquiryReply(formData: FormData) {
  const id = formData.get('id') as string
  const table = formData.get('table') as 'contacts' | 'recruit_applications'
  const replyText = formData.get('replyText') as string
  const toEmail = formData.get('toEmail') as string
  const customerName = formData.get('customerName') as string

  if (!replyText?.trim()) {
    return { error: '返信内容を入力してください' }
  }

  const supabase = await createClient()

  // DB に返信内容・日時を保存
  const { error: dbError } = await supabase
    .from(table)
    .update({
      reply_text: replyText,
      replied_at: new Date().toISOString(),
      is_read: true,
    })
    .eq('id', id)

  if (dbError) {
    console.error('Reply DB update error:', dbError)
    return { error: 'データ保存に失敗しました: ' + dbError.message }
  }

  // メールアドレスが入力されている場合のみメール送信
  if (toEmail && toEmail.includes('@')) {
    const mailResult = await sendUserReply({
      to: toEmail,
      customerName: customerName || 'お客様',
      replyText,
    })

    if (!mailResult.success) {
      return { error: 'DB保存は完了しましたが、メール送信に失敗しました: ' + mailResult.error }
    }
  }

  revalidatePath('/admin/inquiries')
  revalidatePath('/admin/dashboard')
  return { success: true, emailSent: !!(toEmail && toEmail.includes('@')) }
}
