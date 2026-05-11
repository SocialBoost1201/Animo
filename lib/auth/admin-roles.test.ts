import { describe, it } from 'node:test'
import assert from 'node:assert/strict'
import { getAppRole } from './admin-roles'

function makeClient(userRolesRole: string | null) {
  return {
    from: (table: string) => {
      if (table === 'profiles') {
        throw new Error('getAppRole must not consult profiles table')
      }
      return {
        select: (_col: string) => ({
          eq: (_col: string, _val: string) => ({
            maybeSingle: async () => ({
              data: userRolesRole ? { role: userRolesRole } : null,
            }),
          }),
        }),
      }
    },
  }
}

describe('getAppRole', () => {
  it('returns the role from user_roles', async () => {
    const client = makeClient('owner')
    const role = await getAppRole(client, 'user-123')
    assert.equal(role, 'owner')
  })

  it('returns null when user_roles has no entry for the user', async () => {
    const client = makeClient(null)
    const role = await getAppRole(client, 'user-abc')
    assert.equal(role, null)
  })

  it('does not fall back to profiles when user_roles returns null', async () => {
    // makeClient throws when profiles is called.
    // The current code (with fallback) will FAIL this test.
    const client = makeClient(null)
    const role = await getAppRole(client, 'user-abc')
    assert.equal(role, null)
  })
})
