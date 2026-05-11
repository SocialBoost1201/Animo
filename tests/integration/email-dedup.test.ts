import { describe, it } from 'node:test';
import assert from 'node:assert/strict';

import { shouldSkipIntegration, withRollbackTx, withSavepoint } from './_db';

const skipDecision = shouldSkipIntegration();

describe('email dedup UNIQUE constraints (integration)', { skip: skipDecision.skip ? skipDecision.reason : false }, () => {
  it('customer_birthday_email_logs blocks duplicate (customer_id, target_year_month)', async () => {
    await withRollbackTx(async (client) => {
      const { rows: [c] } = await client.query<{ id: string }>(
        `INSERT INTO customers (id, name) VALUES (gen_random_uuid(), '_smoketest_birthday')
         RETURNING id`,
      );

      await client.query(
        `INSERT INTO customer_birthday_email_logs (customer_id, target_year_month, email)
         VALUES ($1, '2099-99', 'a@example.com')`,
        [c.id],
      );

      await assert.rejects(
        () => withSavepoint(client, () =>
          client.query(
            `INSERT INTO customer_birthday_email_logs (customer_id, target_year_month, email)
             VALUES ($1, '2099-99', 'b@example.com')`,
            [c.id],
          ),
        ),
        /duplicate key value violates unique constraint/i,
        'second insert with same (customer_id, target_year_month) must be rejected',
      );
    });
  });

  it('shift_reminder_email_logs blocks duplicate (cast_id, target_week_monday)', async () => {
    await withRollbackTx(async (client) => {
      const { rows: [cast] } = await client.query<{ id: string }>(
        `SELECT id FROM casts LIMIT 1`,
      );
      assert.ok(cast, 'expected at least one cast in fixtures');

      await client.query(
        `INSERT INTO shift_reminder_email_logs (cast_id, target_week_monday, email)
         VALUES ($1, '2099-12-30', 'a@example.com')`,
        [cast.id],
      );

      await assert.rejects(
        () => withSavepoint(client, () =>
          client.query(
            `INSERT INTO shift_reminder_email_logs (cast_id, target_week_monday, email)
             VALUES ($1, '2099-12-30', 'b@example.com')`,
            [cast.id],
          ),
        ),
        /duplicate key value violates unique constraint/i,
      );
    });
  });

  it('status check constraint accepts only sent|failed', async () => {
    await withRollbackTx(async (client) => {
      const { rows: [c] } = await client.query<{ id: string }>(
        `INSERT INTO customers (id, name) VALUES (gen_random_uuid(), '_smoketest_status')
         RETURNING id`,
      );

      await assert.rejects(
        () => withSavepoint(client, () =>
          client.query(
            `INSERT INTO customer_birthday_email_logs (customer_id, target_year_month, email, status)
             VALUES ($1, '2099-98', 'x@example.com', 'pending')`,
            [c.id],
          ),
        ),
        /violates check constraint/i,
        'status outside the allowed enum should be rejected',
      );
    });
  });
});
