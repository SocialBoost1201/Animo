-- ==============================================================================
-- セキュリティ修正: キャスト間データ漏洩防止 RLS 修正
-- ==============================================================================
-- 問題1: cast_posts の SELECT ポリシーが cast ロールを持つ全ユーザーに
--         他キャストの投稿（下書き・承認待ちを含む）を開示していた
-- 問題2: line_notifications / line_notification_logs に RLS が未設定で
--         認証済みユーザーなら誰でもアクセス可能だった
-- 問題3: daily_dispatches / daily_trials / shift_changes /
--         daily_staff_attendances の RLS が auth.uid() IS NOT NULL のみで
--         キャストを含む全認証ユーザーが業務テーブルを閲覧できた
-- ==============================================================================

-- ------------------------------------------------------------------------------
-- Fix 1: cast_posts — SELECT ポリシーをキャスト本人のみに限定
-- ------------------------------------------------------------------------------
DROP POLICY IF EXISTS "cast_own_posts_select" ON public.cast_posts;

CREATE POLICY "cast_own_posts_select" ON public.cast_posts
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.casts
      WHERE casts.id   = cast_posts.cast_id
        AND casts.auth_user_id = auth.uid()
    )
  );

-- ------------------------------------------------------------------------------
-- Fix 2: line_notifications — RLS 有効化 + 管理者専用ポリシー
-- ------------------------------------------------------------------------------
ALTER TABLE public.line_notifications      ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.line_notification_logs  ENABLE ROW LEVEL SECURITY;

CREATE POLICY "admins_manage_line_notifications"
  ON public.line_notifications
  FOR ALL
  TO authenticated
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

CREATE POLICY "admins_read_line_notification_logs"
  ON public.line_notification_logs
  FOR ALL
  TO authenticated
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

-- ------------------------------------------------------------------------------
-- Fix 3: 業務テーブルの RLS を管理者 / スタッフに限定
--         (従来: auth.uid() IS NOT NULL = キャスト含む全認証ユーザーが閲覧可)
-- ------------------------------------------------------------------------------

-- daily_dispatches (日次派遣記録)
DROP POLICY IF EXISTS "Admins can full access daily_dispatches" ON public.daily_dispatches;
CREATE POLICY "Admins can full access daily_dispatches"
  ON public.daily_dispatches
  FOR ALL
  TO authenticated
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

-- daily_trials (体入記録)
DROP POLICY IF EXISTS "Admins can full access daily_trials" ON public.daily_trials;
CREATE POLICY "Admins can full access daily_trials"
  ON public.daily_trials
  FOR ALL
  TO authenticated
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

-- shift_changes (シフト変更記録)
DROP POLICY IF EXISTS "Admins can full access shift_changes" ON public.shift_changes;
CREATE POLICY "Admins can full access shift_changes"
  ON public.shift_changes
  FOR ALL
  TO authenticated
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

-- daily_staff_attendances (スタッフ出勤記録)
DROP POLICY IF EXISTS "Admins can full access daily_staff_attendances" ON public.daily_staff_attendances;
CREATE POLICY "Admins can full access daily_staff_attendances"
  ON public.daily_staff_attendances
  FOR ALL
  TO authenticated
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
