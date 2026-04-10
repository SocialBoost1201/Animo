'use server'

import { createClient } from '@/lib/supabase/server'
import { createServiceClient } from '@/lib/supabase/service'

const PRODUCTION_AUTH_BASE_URL = 'https://club-animo.jp'

function resolveAuthBaseUrl() {
  const candidates = [
    process.env.NEXT_PUBLIC_APP_URL,
    process.env.NEXT_PUBLIC_SITE_URL,
    process.env.APP_URL,
  ]

  for (const candidate of candidates) {
    if (!candidate) continue

    try {
      const url = new URL(candidate)
      const isLocal =
        url.hostname === 'localhost' ||
        url.hostname === '127.0.0.1' ||
        url.hostname.endsWith('.local')

      if (isLocal) continue
      return url.origin
    } catch {
      // ignore invalid env value and continue
    }
  }

  return PRODUCTION_AUTH_BASE_URL
}

export async function adminRegister(formData: FormData) {
  const lastName = (formData.get('lastName') as string | null)?.trim() ?? ''
  const firstName = (formData.get('firstName') as string | null)?.trim() ?? ''
  const stageName = (formData.get('stageName') as string | null)?.trim() ?? ''
  const phone = (formData.get('phone') as string | null)?.trim() ?? ''
  const email = (formData.get('email') as string | null)?.trim().toLowerCase() ?? ''
  const password = (formData.get('password') as string | null) ?? ''
  const confirmPassword = (formData.get('confirmPassword') as string | null) ?? ''

  if (!lastName || !firstName || !stageName || !phone || !email || !password) {
    return { success: false as const, error: 'すべての項目を入力してください。' }
  }
  if (password !== confirmPassword) {
    return { success: false as const, error: 'パスワードが一致しません。' }
  }
  if (password.length < 8) {
    return { success: false as const, error: 'パスワードは8文字以上にしてください。' }
  }

  const supabase = await createClient()
  const serviceRoleClient = createServiceClient()
  const authBaseUrl = resolveAuthBaseUrl()

  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      emailRedirectTo: `${authBaseUrl}/admin/login`,
    },
  })

  if (error) {
    return {
      success: false as const,
      error: `アカウント作成に失敗しました: ${error.message}`,
    }
  }

  if (!data.user) {
    return {
      success: false as const,
      error: 'アカウント作成の応答が不正でした。時間をおいて再度お試しください。',
    }
  }

  const displayName = stageName || `${lastName} ${firstName}`.trim()
  const { error: profileError } = await serviceRoleClient
    .from('profiles')
    .upsert({
      id: data.user.id,
      display_name: displayName,
      last_name: lastName,
      first_name: firstName,
      stage_name: stageName,
      phone,
      updated_at: new Date().toISOString(),
    })

  if (profileError) {
    return {
      success: false as const,
      error: `プロフィール保存に失敗しました: ${profileError.message}`,
    }
  }

  return {
    success: true as const,
    message:
      'アカウントを登録しました。確認メールが届く場合は認証後にログインしてください。',
  }
}

export async function adminRegisterAction(state: unknown, formData: FormData) {
  return adminRegister(formData)
}

export async function adminForgotPassword(formData: FormData) {
  const email = (formData.get('email') as string | null)?.trim().toLowerCase() ?? ''

  if (!email) {
    return { success: false as const, error: 'メールアドレスを入力してください。' }
  }

  const supabase = await createClient()
  const authBaseUrl = resolveAuthBaseUrl()

  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${authBaseUrl}/admin/reset-password`,
  })

  if (error) {
    const normalized = error.message.toLowerCase()

    if (normalized.includes('redirect url') && normalized.includes('not allowed')) {
      return {
        success: false as const,
        error: '再設定リンクURLが許可されていません。認証設定（URL Configuration）をご確認ください。',
      }
    }

    if (
      normalized.includes('error sending recovery email') ||
      normalized.includes('failed to send message') ||
      normalized.includes('smtp')
    ) {
      return {
        success: false as const,
        error: '再設定メールの送信に失敗しました。SMTP設定をご確認ください。',
      }
    }

    if (normalized.includes('rate limit')) {
      return {
        success: false as const,
        error: '短時間での送信回数が上限に達しました。しばらく待ってから再度お試しください。',
      }
    }

    return { success: false as const, error: error.message }
  }

  return { success: true as const, message: 'パスワード再設定のメールを送信しました。' }
}

export async function adminForgotPasswordAction(state: unknown, formData: FormData) {
  return adminForgotPassword(formData)
}
