'use server'

import { normalizeCastPhone } from '@/lib/cast-auth-utils'
import { createServiceClient } from '@/lib/supabase/service'

export type CastAccountStatus = 'unregistered' | 'registered' | 'linked' | 'needs_review'

export type CastAccountSnapshot = {
  status: CastAccountStatus
  statusLabel: string
  statusMessage: string
  phone: string | null
  authUserId: string | null
  registeredAt: string | null
  lastLoginAt: string | null
}

export async function getCastAccountSnapshot(params: {
  authUserId: string | null
  privatePhone?: string | null
}): Promise<CastAccountSnapshot> {
  const { authUserId, privatePhone } = params

  if (!authUserId) {
    return {
      status: 'unregistered',
      statusLabel: '未登録',
      statusMessage: 'このキャストはまだアカウント登録されていません',
      phone: null,
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
        phone: null,
        authUserId,
        registeredAt: null,
        lastLoginAt: null,
      }
    }

    const phone = authUser.phone ?? null
    const normalizedPrivatePhone = normalizeCastPhone(privatePhone ?? '')
    const normalizedAuthPhone = normalizeCastPhone(phone ?? '')
    const hasPhoneMismatch =
      !!normalizedPrivatePhone &&
      !!normalizedAuthPhone &&
      normalizedPrivatePhone !== normalizedAuthPhone

    if (hasPhoneMismatch) {
      return {
        status: 'needs_review',
        statusLabel: '要確認',
        statusMessage: 'アカウント情報に不整合の可能性があります。登録状態を確認してください',
        phone,
        authUserId,
        registeredAt: authUser.created_at ?? null,
        lastLoginAt: authUser.last_sign_in_at ?? null,
      }
    }

    if (!phone) {
      return {
        status: 'registered',
        statusLabel: '登録済み',
        statusMessage: 'このキャストにはアカウントが紐づいています',
        phone: null,
        authUserId,
        registeredAt: authUser.created_at ?? null,
        lastLoginAt: authUser.last_sign_in_at ?? null,
      }
    }

    return {
      status: 'linked',
      statusLabel: '紐づき済み',
      statusMessage: 'このキャストにはアカウントが紐づいています',
      phone,
      authUserId,
      registeredAt: authUser.created_at ?? null,
      lastLoginAt: authUser.last_sign_in_at ?? null,
    }
  } catch {
    return {
      status: 'needs_review',
      statusLabel: '要確認',
      statusMessage: 'アカウント情報に不整合の可能性があります。登録状態を確認してください',
      phone: null,
      authUserId,
      registeredAt: null,
      lastLoginAt: null,
    }
  }
}
