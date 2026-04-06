#!/usr/bin/env node
/**
 * shift_submissions テーブルを Supabase に直接作成するスクリプト
 * 使用: node scripts/create-shift-submissions-table.mjs
 */

const SUPABASE_URL = 'https://nygsfetbfxngwfzbmryq.supabase.co';
const SERVICE_ROLE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im55Z3NmZXRiZnhuZ3dmemJtcnlxIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3MjcxNzg3NiwiZXhwIjoyMDg4MjkzODc2fQ.ozqzLjj8slY4uUPIWCquQHRaP_fnBz_83zoxRjLaxS4';

const sql = `
-- ==========================================
-- shift_submissions テーブル作成
-- ==========================================
CREATE TABLE IF NOT EXISTS public.shift_submissions (
    id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
    cast_id uuid REFERENCES public.casts(id) ON DELETE CASCADE,
    target_week_monday date NOT NULL,
    status text NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
    shifts_data jsonb NOT NULL,
    submitted_at timestamptz DEFAULT now(),
    updated_at timestamptz DEFAULT now(),
    UNIQUE(cast_id, target_week_monday)
);

CREATE INDEX IF NOT EXISTS idx_shift_submissions_cast_id ON public.shift_submissions(cast_id);
CREATE INDEX IF NOT EXISTS idx_shift_submissions_target_week ON public.shift_submissions(target_week_monday);
CREATE INDEX IF NOT EXISTS idx_shift_submissions_status ON public.shift_submissions(status);

CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $func$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$func$ language 'plpgsql';

DROP TRIGGER IF EXISTS update_shift_submissions_updated_at ON public.shift_submissions;
CREATE TRIGGER update_shift_submissions_updated_at
    BEFORE UPDATE ON public.shift_submissions
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

ALTER TABLE public.shift_submissions ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "cast_select_own_submissions" ON public.shift_submissions;
CREATE POLICY "cast_select_own_submissions" ON public.shift_submissions
    FOR SELECT TO authenticated
    USING (
        EXISTS (
            SELECT 1 FROM public.casts
            WHERE casts.id = shift_submissions.cast_id
            AND casts.auth_user_id = auth.uid()
        )
    );

DROP POLICY IF EXISTS "cast_insert_own_submissions" ON public.shift_submissions;
CREATE POLICY "cast_insert_own_submissions" ON public.shift_submissions
    FOR INSERT TO authenticated
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM public.casts
            WHERE casts.id = shift_submissions.cast_id
            AND casts.auth_user_id = auth.uid()
        )
    );

DROP POLICY IF EXISTS "cast_update_own_submissions" ON public.shift_submissions;
CREATE POLICY "cast_update_own_submissions" ON public.shift_submissions
    FOR UPDATE TO authenticated
    USING (
        EXISTS (
            SELECT 1 FROM public.casts
            WHERE casts.id = shift_submissions.cast_id
            AND casts.auth_user_id = auth.uid()
        )
    );

DROP POLICY IF EXISTS "Admins can full access shift_submissions" ON public.shift_submissions;
CREATE POLICY "Admins can full access shift_submissions" ON public.shift_submissions
    FOR ALL TO authenticated
    USING (
        EXISTS (
            SELECT 1 FROM public.user_roles
            WHERE user_roles.user_id = auth.uid()
            AND user_roles.role IN ('owner', 'manager', 'staff')
        )
    )
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM public.user_roles
            WHERE user_roles.user_id = auth.uid()
            AND user_roles.role IN ('owner', 'manager', 'staff')
        )
    );
`;

async function runSQL() {
  console.log('🔧 shift_submissions テーブルを作成中...');

  // Supabase Management API (SQL実行)
  const projectRef = 'nygsfetbfxngwfzbmryq';
  
  try {
    // Supabase REST API 経由で execute_sql RPC を呼ぶ（pg_query 使用）
    const response = await fetch(
      `${SUPABASE_URL}/rest/v1/rpc/execute_sql`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'apikey': SERVICE_ROLE_KEY,
          'Authorization': `Bearer ${SERVICE_ROLE_KEY}`,
        },
        body: JSON.stringify({ sql }),
      }
    );

    if (response.ok) {
      console.log('✅ 成功: テーブルが作成されました');
      return;
    }

    // フォールバック: pgSQL API
    console.log('RPC失敗、Management API を試みます...');
    
    const mgmtResponse = await fetch(
      `https://api.supabase.com/v1/projects/${projectRef}/database/query`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${SERVICE_ROLE_KEY}`,
        },
        body: JSON.stringify({ query: sql }),
      }
    );

    const data = await mgmtResponse.json();
    console.log('Response:', JSON.stringify(data, null, 2));
    
    if (!mgmtResponse.ok) {
      console.error('❌ Management API も失敗しました。Supabaseダッシュボードから手動でSQLを実行してください。');
      console.log('\n=== 実行すべきSQL ===');
      console.log(sql);
    } else {
      console.log('✅ Management API 経由で成功');
    }
  } catch (err) {
    console.error('エラー:', err.message);
    console.log('\n=== 手動で実行してください (Supabase SQL Editor) ===');
    console.log(sql);
  }
}

runSQL();
