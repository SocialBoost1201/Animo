import 'server-only'

import type { User } from '@supabase/supabase-js'
import {
  getAppRole,
  isAdminLoginRole,
  isAdminManageRole,
  isOwnerRole,
  type AdminLoginRole,
  type AdminManageRole,
  type OwnerRole,
} from '@/lib/auth/admin-roles'
import { createClient } from '@/lib/supabase/server'

type SupabaseServerClient = Awaited<ReturnType<typeof createClient>>

type AdminAuthSuccess<Role extends string> = {
  ok: true
  supabase: SupabaseServerClient
  user: User
  role: Role
}

type AdminAuthFailure = {
  ok: false
  status: 401 | 403
  error: string
  role: string | null
}

export type AdminAuthResult<Role extends string = AdminLoginRole> =
  | AdminAuthSuccess<Role>
  | AdminAuthFailure

async function requireRole<Role extends string>(
  allowsRole: (role: string | null) => role is Role
): Promise<AdminAuthResult<Role>> {
  const supabase = await createClient()
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser()

  if (error || !user) {
    return { ok: false, status: 401, error: 'Unauthorized', role: null }
  }

  const role = await getAppRole(supabase, user.id)
  if (!allowsRole(role)) {
    return { ok: false, status: 403, error: 'Forbidden', role }
  }

  return { ok: true, supabase, user, role }
}

export function requireAdminLogin() {
  return requireRole<AdminLoginRole>(isAdminLoginRole)
}

export function requireAdminManage() {
  return requireRole<AdminManageRole>(isAdminManageRole)
}

export function requireOwner() {
  return requireRole<OwnerRole>(isOwnerRole)
}
