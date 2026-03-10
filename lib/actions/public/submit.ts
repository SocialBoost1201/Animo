'use server'

import { createClient } from '@/lib/supabase/server'
import { sendAdminNotification } from '@/lib/mail'

const RECAPTCHA_SECRET_KEY = process.env.RECAPTCHA_SECRET_KEY;

async function verifyRecaptcha(token: string | null): Promise<boolean> {
  if (!RECAPTCHA_SECRET_KEY) {
    // 開発環境などでキーがない場合はパスさせる（必要に応じて調整）
    if (process.env.NODE_ENV === 'development') return true;
    console.warn('RECAPTCHA_SECRET_KEY is not set');
    return false;
  }
  
  if (!token) return false;

  try {
    const res = await fetch('https://www.google.com/recaptcha/api/siteverify', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: `secret=${RECAPTCHA_SECRET_KEY}&response=${token}`,
    });
    
    const data = await res.json();
    // v3はスコア(0.0 ~ 1.0)が返る。0.5以上を合格とする（厳しくするなら0.7など）
    return data.success && data.score >= 0.5;
  } catch (err) {
    console.error('reCAPTCHA verification error:', err);
    return false;
  }
}

export async function submitContact(formData: FormData) {
  const supabase = await createClient()

  // フォームデータから必要なフィールドを抽出
  const type = formData.get('type') as string // 'reserve' | 'contact'
  const name = formData.get('name') as string
  const phone = formData.get('phone') as string
  const contact_method = formData.get('contactMethod') as string
  const line_id = formData.get('lineId') as string
  const message = formData.get('message') as string

  // 予約特有のフィールド
  const dateStr = formData.get('date') as string
  const timeStr = formData.get('time') as string
  const people = parseInt(formData.get('people') as string, 10)
  const castName = formData.get('castName') as string
  const recaptchaToken = formData.get('recaptchaToken') as string | null

  // reCAPTCHA検証
  const isValid = await verifyRecaptcha(recaptchaToken);
  if (!isValid) {
    return { error: '不正なリクエストとしてブロックされました。' };
  }

  // DBの contacts テーブルに挿入
  const { error } = await supabase.from('contacts').insert({
    type,
    name,
    phone,
    contact_method,
    line_id: line_id || null,
    message,
    date: dateStr || null,
    time: timeStr ? `${timeStr}:00` : null,
    people: isNaN(people) ? null : people,
    cast_name: castName || null,
    is_read: false
  })

  if (error) {
    console.error('Contact submit DB error:', error.message, error.details, error.hint)
    return { error: '送信に失敗しました。システムエラーが発生した可能性があります。' }
  }

  // 非同期でメール通知を送信（ユーザーの待ち時間を減らすため awaited ではないのが理想だが、安定性のために一度待つか検討）
  // サーバーアクション内なので await するのが安全
  await sendAdminNotification({
    type: type as 'reserve' | 'contact',
    data: { name, phone, contact_method, date: dateStr, time: timeStr, people, castName, message }
  });

  return { success: true }
}

export async function submitRecruitApplication(formData: FormData) {
  const supabase = await createClient()

  const type = formData.get('type') as string // 'cast' | 'staff'
  const name = formData.get('name') as string
  const age = parseInt(formData.get('age') as string, 10)
  const phone = formData.get('phone') as string
  const email = formData.get('email') as string
  const line_id = formData.get('lineId') as string
  const experience = formData.get('experience') as string
  const schedule = formData.get('schedule') as string
  const message = formData.get('message') as string
  const recaptchaToken = formData.get('recaptchaToken') as string | null

  // reCAPTCHA検証
  const isValid = await verifyRecaptcha(recaptchaToken);
  if (!isValid) {
    return { error: '不正なリクエストとしてブロックされました。' };
  }

  const { error } = await supabase.from('recruit_applications').insert({
    type,
    name,
    age: isNaN(age) ? null : age,
    phone,
    email: email || null,
    line_id: line_id || null,
    experience,
    schedule,
    message,
    is_read: false
  })

  if (error) {
    console.error('Recruit submit DB error:', error.message, error.details, error.hint)
    return { error: '送信に失敗しました。システムエラーが発生した可能性があります。' }
  }

  await sendAdminNotification({
    type: type as 'cast' | 'staff',
    data: { name, age, phone, experience, schedule, message }
  });

  return { success: true }
}
