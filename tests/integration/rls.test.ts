import { describe, it } from 'node:test';
import assert from 'node:assert/strict';

import { shouldSkipIntegration, withRollbackTx, impersonate, resetRole, withSavepoint } from './_db';

const skipDecision = shouldSkipIntegration();

describe('RLS policies (integration)', { skip: skipDecision.skip ? skipDecision.reason : false }, () => {
  it('user_roles SELECT-self lets a user see only their own role row', async () => {
    await withRollbackTx(async (client) => {
      const { rows: [admin] } = await client.query<{ user_id: string }>(
        `SELECT user_id FROM user_roles WHERE role IN ('owner','manager','staff') LIMIT 1`,
      );
      assert.ok(admin, 'expected an admin user_roles row');

      await impersonate(client, admin.user_id);
      const { rows } = await client.query<{ count: string }>(
        `SELECT count(*)::int AS count FROM user_roles`,
      );
      // SELECT-self なので 0 か 1 行
      assert.ok(Number(rows[0]!.count) <= 1, 'admin must only see own user_roles row');
      await resetRole(client);
    });
  });

  it('admin EXISTS-on-user_roles check evaluates true for an admin', async () => {
    await withRollbackTx(async (client) => {
      const { rows: [admin] } = await client.query<{ user_id: string }>(
        `SELECT user_id FROM user_roles WHERE role IN ('owner','manager','staff') LIMIT 1`,
      );

      await impersonate(client, admin!.user_id);
      const { rows: [check] } = await client.query<{ ok: boolean }>(
        `SELECT EXISTS (
           SELECT 1 FROM public.user_roles
           WHERE user_roles.user_id = auth.uid()
           AND user_roles.role IN ('owner','manager','staff')
         ) AS ok`,
      );
      assert.equal(check!.ok, true, 'admin EXISTS check must resolve true so customers/cast_schedules RLS works');
      await resetRole(client);
    });
  });

  it('cast user cannot SELECT customers (admin-only RLS)', async () => {
    await withRollbackTx(async (client) => {
      const { rows: [cast] } = await client.query<{ auth_user_id: string }>(
        `SELECT auth_user_id FROM casts WHERE auth_user_id IS NOT NULL LIMIT 1`,
      );
      if (!cast) return; // skip when no linked cast

      await impersonate(client, cast.auth_user_id);
      const { rows } = await client.query<{ count: string }>(
        `SELECT count(*)::int AS count FROM customers`,
      );
      // 0 should be returned because RLS is admin-only.
      // (The DB might also have 0 customers in fixtures, which is still consistent.)
      assert.equal(Number(rows[0]!.count), 0, 'cast must not see customers under admin-only RLS');
      await resetRole(client);
    });
  });

  it('cast user cannot INSERT into cast_schedules', async () => {
    await withRollbackTx(async (client) => {
      const { rows: [cast] } = await client.query<{ auth_user_id: string; id: string }>(
        `SELECT auth_user_id, id FROM casts WHERE auth_user_id IS NOT NULL LIMIT 1`,
      );
      if (!cast) return;

      await impersonate(client, cast.auth_user_id);
      await assert.rejects(
        () => withSavepoint(client, () =>
          client.query(
            `INSERT INTO cast_schedules (cast_id, work_date) VALUES ($1, '2099-12-31')`,
            [cast.id],
          ),
        ),
        /violates row-level security/i,
        'cast must be blocked from inserting into cast_schedules',
      );
      await resetRole(client);
    });
  });

  it('cast user can SELECT only own rows from cast_schedules', async () => {
    await withRollbackTx(async (client) => {
      const { rows: [cast] } = await client.query<{ auth_user_id: string; id: string }>(
        `SELECT auth_user_id, id FROM casts WHERE auth_user_id IS NOT NULL LIMIT 1`,
      );
      if (!cast) return;

      await impersonate(client, cast.auth_user_id);
      const { rows } = await client.query<{ cast_id: string }>(
        `SELECT cast_id FROM cast_schedules`,
      );
      // 全行が自分の cast_id でなければならない
      for (const r of rows) {
        assert.equal(r.cast_id, cast.id, 'cast must only see own cast_schedules rows');
      }
      await resetRole(client);
    });
  });
});
