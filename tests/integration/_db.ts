/**
 * Integration test 用 DB 接続ヘルパー。
 *
 * - DATABASE_URL が必須。未設定なら `skipIntegration` で test を skip させる。
 * - 各 test は BEGIN / ROLLBACK の trx 内で実行され、本番データを汚さない。
 */

import { Client } from 'pg';

export function shouldSkipIntegration(): { skip: boolean; reason?: string } {
  if (!process.env.DATABASE_URL) {
    return { skip: true, reason: 'DATABASE_URL is not set; skipping integration tests' };
  }
  return { skip: false };
}

/**
 * tx 内で fn を実行し、終了後 ROLLBACK して接続を閉じる。
 * 例外が出ても ROLLBACK が走るので本番データは汚れない。
 */
export async function withRollbackTx<T>(fn: (client: Client) => Promise<T>): Promise<T> {
  const client = new Client({ connectionString: process.env.DATABASE_URL });
  await client.connect();
  try {
    await client.query('BEGIN');
    const result = await fn(client);
    return result;
  } finally {
    try { await client.query('ROLLBACK'); } catch { /* ignore */ }
    await client.end();
  }
}

/**
 * RLS impersonation。tx 内で authenticated ロールに切り替え、
 * JWT claim sub に user_id を設定する。
 */
export async function impersonate(client: Client, userId: string): Promise<void> {
  await client.query('SET LOCAL ROLE authenticated');
  await client.query(
    `SELECT set_config('request.jwt.claims', $1, true)`,
    [JSON.stringify({ sub: userId, role: 'authenticated' })],
  );
}

export async function resetRole(client: Client): Promise<void> {
  await client.query('RESET ROLE');
}

/**
 * SAVEPOINT 内で fn を実行する。
 * fn 内で SQL エラーが起きても、SAVEPOINT への ROLLBACK で
 * 外側の tx を生かし続けることができる（失敗クエリのテスト用）。
 */
export async function withSavepoint<T>(client: Client, fn: () => Promise<T>): Promise<T> {
  const sp = `sp_${Math.random().toString(36).slice(2, 10)}`;
  await client.query(`SAVEPOINT ${sp}`);
  try {
    const result = await fn();
    await client.query(`RELEASE SAVEPOINT ${sp}`);
    return result;
  } catch (err) {
    await client.query(`ROLLBACK TO SAVEPOINT ${sp}`);
    throw err;
  }
}
