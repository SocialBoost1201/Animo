import { describe, it, before } from 'node:test';
import assert from 'node:assert/strict';

import { shouldSkipIntegration, withRollbackTx, withSavepoint } from './_db';

const skipDecision = shouldSkipIntegration();

describe('admin_audit_logs schema (integration)', { skip: skipDecision.skip ? skipDecision.reason : false }, () => {
  before(() => {
    // DATABASE_URL を持っていれば実 DB に接続。tx は ROLLBACK で巻き戻すので安全。
  });

  it('accepts a fully-populated insert and reads it back inside the same tx', async () => {
    await withRollbackTx(async (client) => {
      const { rows: [actor] } = await client.query<{ user_id: string }>(
        `SELECT user_id FROM user_roles WHERE role IN ('owner','manager','staff') LIMIT 1`,
      );
      assert.ok(actor, 'expected at least one admin in user_roles');

      const { rows: [inserted] } = await client.query<{ id: string }>(
        `INSERT INTO admin_audit_logs
           (actor_user_id, actor_role, action, target_type, target_id, before_data, after_data, metadata)
         VALUES ($1, 'manager', 'approve', '_smoketest', 'tid-1',
                 $2::jsonb, $3::jsonb, $4::jsonb)
         RETURNING id`,
        [actor.user_id, '{"status":"pending"}', '{"status":"approved"}', '{"verified":true}'],
      );
      assert.ok(inserted.id, 'insert must return id');

      const { rows: [round] } = await client.query<{
        action: string; target_type: string; target_id: string; before_data: unknown; after_data: unknown;
      }>(
        `SELECT action, target_type, target_id, before_data, after_data
         FROM admin_audit_logs WHERE id = $1`,
        [inserted.id],
      );
      assert.equal(round.action, 'approve');
      assert.equal(round.target_type, '_smoketest');
      assert.equal(round.target_id, 'tid-1');
      assert.deepEqual(round.before_data, { status: 'pending' });
      assert.deepEqual(round.after_data, { status: 'approved' });
    });
  });

  it('FK to auth.users is ON DELETE SET NULL (not CASCADE)', async () => {
    await withRollbackTx(async (client) => {
      const { rows } = await client.query<{ confdeltype: string }>(
        `SELECT confdeltype FROM pg_constraint
         WHERE conname = 'admin_audit_logs_actor_user_id_fkey'`,
      );
      assert.ok(rows[0], 'FK must exist');
      // 'n' = SET NULL, 'a' = NO ACTION, 'c' = CASCADE
      assert.equal(rows[0].confdeltype, 'n', 'actor FK must be SET NULL so audit history survives user deletion');
    });
  });

  it('action and target_type are NOT NULL', async () => {
    await withRollbackTx(async (client) => {
      await assert.rejects(
        () => withSavepoint(client, () =>
          client.query(
            `INSERT INTO admin_audit_logs (actor_user_id, target_type) VALUES (NULL, 't')`,
          ),
        ),
        /null value in column "action"|violates not-null/i,
      );
      await assert.rejects(
        () => withSavepoint(client, () =>
          client.query(
            `INSERT INTO admin_audit_logs (actor_user_id, action) VALUES (NULL, 'approve')`,
          ),
        ),
        /null value in column "target_type"|violates not-null/i,
      );
    });
  });
});
