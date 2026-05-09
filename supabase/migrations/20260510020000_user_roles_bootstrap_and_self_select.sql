-- ==========================================
-- user_roles: ブートストラップ + SELECT-self ポリシー
-- ==========================================
-- 背景:
--   user_roles テーブルは本番に存在するが、テーブル作成のマイグレーション
--   ファイルが追跡されていない（手動で作成されたまま）。
--   さらに RLS が有効化されているが、ポリシーが 1 つも存在せず、
--   authenticated ロールからの SELECT は常に 0 行を返す。
--
--   これが原因で、本マイグレーションシリーズ内の
--     20260510010000_tighten_customers_rls.sql
--     20260510010001_tighten_cast_schedules_rls.sql
--   で書いた `EXISTS (SELECT ... FROM user_roles ...)` の
--   admin チェックが session 経由で常に false 評価され、
--   admin の customers / cast_schedules への session アクセスが破綻していた。
--
--   このマイグレーションは:
--     1. テーブル定義をコード化（IF NOT EXISTS で既存運用を尊重）
--     2. ユーザーが自分の役割のみ SELECT できる SELECT-self ポリシーを追加
--   これにより admin チェックの subquery が正しく評価される。
--   他ユーザーの役割は引き続き参照不可。

-- ─── テーブル定義（既存と整合する形で IF NOT EXISTS）──────
CREATE TABLE IF NOT EXISTS public.user_roles (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id     uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role        text NOT NULL CHECK (role IN ('owner', 'manager', 'staff', 'cast')),
  created_at  timestamp with time zone NOT NULL DEFAULT timezone('utc'::text, now())
);

ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- 複数行登録を防ぐための一意制約（既に存在すれば skip）
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_indexes
    WHERE schemaname = 'public'
      AND indexname = 'user_roles_user_id_unique'
  ) THEN
    CREATE UNIQUE INDEX user_roles_user_id_unique ON public.user_roles(user_id);
  END IF;
END$$;

-- ─── ポリシー: 自分の役割のみ SELECT 可能 ──────────────────
DROP POLICY IF EXISTS "Users can read own role" ON public.user_roles;
CREATE POLICY "Users can read own role"
  ON public.user_roles FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

-- INSERT/UPDATE/DELETE はポリシー無し → service_role 経由のみ許可
-- （管理用途は service_role + Server Action 内で getUser() 確認するパターン）
