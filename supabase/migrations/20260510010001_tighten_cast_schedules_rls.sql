-- ==========================================
-- cast_schedules テーブル RLS の引き締め
-- ==========================================
-- 背景:
--   既存ポリシー:
--     anon_select : anon ロールに SELECT 全許可
--     auth_all    : authenticated に ALL 操作（任意キャストが他キャストの
--                   スケジュールを参照・追加・更新・削除可能）
--
--   実態:
--     - 公開サイト経路 (lib/actions/public/data.ts) は createServiceClient で
--       service_role を使うため、anon SELECT は不要
--     - 管理画面の書き込み（admin-shifts.ts, today.ts）も service_role 経由
--     - admin の session 経由書き込み（schedules.ts saveSchedules,
--       admin-change-requests.ts, admin-shift-requests.ts）は RLS 通過が必要
--     - cast 側は自己 cast_id の SELECT のみ必要
--       (cast-change-requests.ts, cast/today, cast/dashboard)
--
-- 設計:
--   admin: user_roles に owner/manager/staff があれば ALL 操作許可
--   cast : casts.auth_user_id = auth.uid() の場合のみ自己レコード SELECT
--   anon : 全 deny

DROP POLICY IF EXISTS "anon_select" ON public.cast_schedules;
DROP POLICY IF EXISTS "auth_all"    ON public.cast_schedules;

CREATE POLICY "Admins can full access cast_schedules"
  ON public.cast_schedules TO authenticated
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

CREATE POLICY "Casts can view own cast_schedules"
  ON public.cast_schedules FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.casts
      WHERE casts.id = cast_schedules.cast_id
      AND casts.auth_user_id = auth.uid()
    )
  );
