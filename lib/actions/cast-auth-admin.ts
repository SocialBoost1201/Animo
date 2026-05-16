'use server'

import { revalidatePath } from 'next/cache'
import { createServiceClient } from '@/lib/supabase/service'
import { createClient } from '@/lib/supabase/server'
import { toE164JpPhone, normalizeCastPhone } from '@/lib/cast-auth-utils'
import { getAppRole, isAdminLoginRole } from '@/lib/auth/admin-roles'

type ProvisionResult =
  | { success: true; authUserId: string; message: string }
  | { success: false; error: string }

/**
 * 管理者がキャストの Auth アカウントを代理作成し casts に紐付ける。
 * - phone_confirm: false で作成（本人の SMS 検証は初回ログイン時に実施）
 * - 同一電話番号の Auth ユーザーが既に存在する場合はそちらを流用
 * - auth_user_id が既にセットされている場合は何もしない（冪等）
 */
export async function adminProvisionCastAccount(castId: string): Promise<ProvisionResult> {
  // 呼び出し元が管理者であることを確認
  const supabase = await createClient()
  const { data: { user: actor } } = await supabase.auth.getUser()
  if (!actor) return { success: false, error: '認証情報がありません。再ログインしてください。' }

  const role = await getAppRole(supabase, actor.id)
  if (!isAdminLoginRole(role)) {
    return { success: false, error: '管理者権限が必要です。' }
  }

  const serviceClient = createServiceClient()

  // 対象キャストの情報を取得
  const { data: cast, error: castError } = await serviceClient
    .from('casts')
    .select('id, stage_name, auth_user_id, cast_private_info(phone)')
    .eq('id', castId)
    .maybeSingle()

  if (castError || !cast) {
    return { success: false, error: 'キャスト情報の取得に失敗しました。' }
  }

  // 冪等性チェック
  if (cast.auth_user_id) {
    return { success: false, error: 'このキャストは既にアカウントが紐づいています。' }
  }

  // 電話番号の取得
  const privateInfo = Array.isArray(cast.cast_private_info)
    ? cast.cast_private_info[0]
    : cast.cast_private_info
  const rawPhone: string = (privateInfo as { phone?: string | null } | null)?.phone ?? ''

  const normalizedPhone = normalizeCastPhone(rawPhone)
  if (!normalizedPhone) {
    return { success: false, error: '電話番号が登録されていないため、アカウント作成できません。' }
  }

  const e164Phone = toE164JpPhone(normalizedPhone)
  if (!e164Phone) {
    return { success: false, error: `電話番号の形式が不正です: ${rawPhone}` }
  }

  // Auth ユーザーを作成（既存なら流用）
  let authUserId: string

  const { data: createData, error: createError } = await serviceClient.auth.admin.createUser({
    phone: e164Phone,
    phone_confirm: false,
  })

  if (createError) {
    const msg = (createError.message ?? '').toLowerCase()
    const isAlreadyExists = msg.includes('already') || msg.includes('registered') || msg.includes('exists')

    if (!isAlreadyExists) {
      console.error('[adminProvisionCastAccount] auth user creation failed', { castId, e164Phone, error: createError })
      return { success: false, error: `Auth ユーザーの作成に失敗しました: ${createError.message}` }
    }

    // 既存ユーザーを電話番号で検索
    const searchParams = new URLSearchParams({ page: '1', per_page: '10', filter: `phone=${e164Phone}` })
    const resp = await fetch(
      `${process.env.NEXT_PUBLIC_SUPABASE_URL}/auth/v1/admin/users?${searchParams}`,
      {
        headers: {
          Authorization: `Bearer ${process.env.SUPABASE_SERVICE_ROLE_KEY}`,
          apikey: process.env.SUPABASE_SERVICE_ROLE_KEY!,
        },
      }
    )

    if (!resp.ok) {
      return { success: false, error: '既存 Auth ユーザーの検索に失敗しました。' }
    }

    type AuthUserLite = { id: string; phone?: string }
    const json = (await resp.json()) as { users?: AuthUserLite[] }
    const matched = (json.users ?? []).filter((u) => u.phone === e164Phone)

    if (matched.length === 0) {
      return { success: false, error: '電話番号に一致する Auth ユーザーが見つかりませんでした。' }
    }
    if (matched.length > 1) {
      return { success: false, error: '同一電話番号の Auth ユーザーが複数存在します。手動で確認してください。' }
    }

    // 既存の Auth ユーザーが他のキャストに既に紐づいていないか確認
    const { data: existingLink } = await serviceClient
      .from('casts')
      .select('id, stage_name')
      .eq('auth_user_id', matched[0].id)
      .maybeSingle()

    if (existingLink) {
      return {
        success: false,
        error: `この電話番号は既に「${existingLink.stage_name}」に紐づいています。`,
      }
    }

    authUserId = matched[0].id
  } else {
    if (!createData.user) {
      return { success: false, error: 'Auth ユーザーの作成後にIDが取得できませんでした。' }
    }
    authUserId = createData.user.id
  }

  // casts.auth_user_id を更新
  const now = new Date().toISOString()
  const { error: castUpdateError } = await serviceClient
    .from('casts')
    .update({ auth_user_id: authUserId, updated_at: now })
    .eq('id', castId)
    .is('auth_user_id', null)

  if (castUpdateError) {
    console.error('[adminProvisionCastAccount] casts update failed', { castId, authUserId, error: castUpdateError })
    return { success: false, error: 'キャスト情報の更新に失敗しました。' }
  }

  // user_roles に cast ロールを upsert
  const { error: roleError } = await serviceClient
    .from('user_roles')
    .upsert({ user_id: authUserId, role: 'cast' }, { onConflict: 'user_id' })

  if (roleError) {
    console.error('[adminProvisionCastAccount] user_roles upsert failed', { authUserId, error: roleError })
    return { success: false, error: 'ロールの設定に失敗しました。' }
  }

  revalidatePath(`/admin/human-resources/${castId}`)

  return {
    success: true,
    authUserId,
    message: `${cast.stage_name} のアカウントを作成しました。初回ログイン時に SMS 認証が必要です。`,
  }
}
