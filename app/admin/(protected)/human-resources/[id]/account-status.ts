'use server'

import { createServiceClient } from '@/lib/supabase/service'

export type CastAccountStatus = 'unregistered' | 'registered' | 'linked' | 'needs_review'

export type CastAccountSnapshot = {
  status: CastAccountStatus
  statusLabel: string
  statusMessage: string
  email: string | null
  authUserId: string | null
  registeredAt: string | null
  lastLoginAt: string | null
}

function normalizeEmail(value: string | null | undefined) {
  return value?.trim().toLowerCase() ?? null
}

export async function getCastAccountSnapshot(params: {
  authUserId: string | null
  privateEmail?: string | null
}): Promise<CastAccountSnapshot> {
  const { authUserId, privateEmail } = params

  if (!authUserId) {
    return {
      status: 'unregistered',
      statusLabel: '未登録',
      statusMessage: 'このキャストはまだアカウント登録されていません',
      email: null,
      authUserId: null,
      registeredAt: null,
      lastLoginAt: null,
    }
  }

  try {
    const serviceClient = createServiceClient()
    const { data, error } = await serviceClient.auth.admin.getUserById(authUserId)
    const authUser = data.user

    if (error || !authUser) {
      return {
        status: 'needs_review',
        statusLabel: '要確認',
        statusMessage: 'アカウント情報に不整合の可能性があります。登録状態を確認してください',
        email: null,
        authUserId,
        registeredAt: null,
        lastLoginAt: null,
      }
    }

    const email = authUser.email ?? null
    const hasEmailMismatch =
      !!normalizeEmail(privateEmail) &&
      !!normalizeEmail(email) &&
      normalizeEmail(privateEmail) !== normalizeEmail(email)

    if (hasEmailMismatch) {
      return {
        status: 'needs_review',
        statusLabel: '要確認',
        statusMessage: 'アカウント情報に不整合の可能性があります。登録状態を確認してください',
        email,
        authUserId,
        registeredAt: authUser.created_at ?? null,
        lastLoginAt: authUser.last_sign_in_at ?? null,
      }
    }

    if (!email) {
      return {
        status: 'registered',
        statusLabel: '登録済み',
        statusMessage: 'このキャストにはアカウントが紐づいています',
        email: null,
        authUserId,
        registeredAt: authUser.created_at ?? null,
        lastLoginAt: authUser.last_sign_in_at ?? null,
      }
    }

    return {
      status: 'linked',
      statusLabel: '紐づき済み',
      statusMessage: 'このキャストにはアカウントが紐づいています',
      email,
      authUserId,
      registeredAt: authUser.created_at ?? null,
      lastLoginAt: authUser.last_sign_in_at ?? null,
    }
  } catch {
    return {
      status: 'needs_review',
      statusLabel: '要確認',
      statusMessage: 'アカウント情報に不整合の可能性があります。登録状態を確認してください',
      email: null,
      authUserId,
      registeredAt: null,
      lastLoginAt: null,
    }
  }
}
