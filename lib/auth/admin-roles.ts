export const adminLoginRoles = new Set(['owner', 'manager', 'staff'])
export const adminManageRoles = new Set(['owner', 'manager'])
export const ownerOnlyRoles = new Set(['owner'])

export type AdminLoginRole = 'owner' | 'manager' | 'staff'
export type AdminManageRole = 'owner' | 'manager'
export type OwnerRole = 'owner'

type RoleRow = {
  role: string | null
}

type RoleLookupClient = {
  from(table: string): unknown
}

type RoleLookupQuery = {
  select(columns: string): {
    eq(column: string, value: string): {
      maybeSingle(): PromiseLike<{ data: RoleRow | null }>
    }
  }
}

export async function getAppRole(client: RoleLookupClient, userId: string) {
  const userRolesQuery = client.from('user_roles') as RoleLookupQuery
  const { data: userRole } = await userRolesQuery
    .select('role')
    .eq('user_id', userId)
    .maybeSingle()

  if (userRole?.role) {
    return userRole.role
  }

  const profilesQuery = client.from('profiles') as RoleLookupQuery
  const { data: profile } = await profilesQuery
    .select('role')
    .eq('id', userId)
    .maybeSingle()

  return profile?.role ?? null
}

export function isAdminLoginRole(role: string | null): role is AdminLoginRole {
  return Boolean(role && adminLoginRoles.has(role))
}

export function isAdminManageRole(role: string | null): role is AdminManageRole {
  return Boolean(role && adminManageRoles.has(role))
}

export function isOwnerRole(role: string | null): role is OwnerRole {
  return Boolean(role && ownerOnlyRoles.has(role))
}
