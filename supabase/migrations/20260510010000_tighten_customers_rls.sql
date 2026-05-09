-- ==========================================
-- customers テーブル RLS の引き締め
-- ==========================================
-- 背景:
--   従来は "TO authenticated USING (true)" のため、
--   キャスト等の非管理者ユーザーも顧客情報（電話・メール・誕生日・notes）を
--   全件参照・更新・削除できる状態だった。
--
--   admin 権限を持たない authenticated ユーザーからのアクセスを遮断する。
--
-- 互換性:
--   - 公開フォーム (lib/actions/public/submit.ts) は anon role で動作するため
--     現在も RLS で読み取りがブロックされており、本変更で挙動は変わらない
--   - cron (birthday) は service role で動作するため RLS bypass、影響なし
--   - admin Server Actions (lib/actions/customers.ts) と admin ページは
--     user_roles で 'owner'/'manager'/'staff' を持つユーザーのみ通る

-- ─── 旧ポリシー削除 ────────────────────────────
DROP POLICY IF EXISTS "Customers are viewable by authenticated users."  ON public.customers;
DROP POLICY IF EXISTS "Customers are insertable by authenticated users." ON public.customers;
DROP POLICY IF EXISTS "Customers are updatable by authenticated users."  ON public.customers;
DROP POLICY IF EXISTS "Customers are deletable by authenticated users."  ON public.customers;

-- ─── 新ポリシー（管理者のみ）──────────────────
CREATE POLICY "Admins can full access customers"
  ON public.customers TO authenticated
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
