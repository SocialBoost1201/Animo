-- ==========================================
-- admin_audit_logs: 管理アクション監査ログ（最小基盤）
-- ==========================================
-- 目的:
--   承認・却下・削除・公開/非公開切替・出勤切替・シフト変更・
--   キャスト情報変更・権限変更・LINE通知送信・管理画面設定変更
--   など、現場で事故が起きた時に「誰が何を変更したか」を追跡可能にする。
--
--   Phase 1 では汎用テーブル 1 つで全て記録。
--   diff 生成は Phase 2、初期実装では before_data / after_data の JSONB で十分。

CREATE TABLE IF NOT EXISTS public.admin_audit_logs (
  id              uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  actor_user_id   uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  actor_role      text,
  action          text NOT NULL,
  target_type     text NOT NULL,
  target_id       text,
  before_data     jsonb,
  after_data      jsonb,
  metadata        jsonb,
  created_at      timestamptz NOT NULL DEFAULT now()
);

COMMENT ON TABLE  public.admin_audit_logs IS '管理アクション監査ログ（最小基盤）';
COMMENT ON COLUMN public.admin_audit_logs.actor_user_id IS '操作した auth ユーザーID（削除されたユーザーは NULL）';
COMMENT ON COLUMN public.admin_audit_logs.actor_role    IS '操作時点のロール（owner|manager|staff|cast 等）';
COMMENT ON COLUMN public.admin_audit_logs.action        IS 'approve|reject|delete|publish|unpublish|attendance_toggle|shift_change|cast_info_change|role_change|line_notification_send|admin_settings_change';
COMMENT ON COLUMN public.admin_audit_logs.target_type   IS '対象テーブル/エンティティ種別 (例: shift_submission, cast_post, daily_checkin)';
COMMENT ON COLUMN public.admin_audit_logs.target_id     IS '対象レコードのID（uuid とは限らないため text）';
COMMENT ON COLUMN public.admin_audit_logs.before_data   IS '変更前データのスナップショット（任意項目のみ、JSONB）';
COMMENT ON COLUMN public.admin_audit_logs.after_data    IS '変更後データのスナップショット（任意項目のみ、JSONB）';
COMMENT ON COLUMN public.admin_audit_logs.metadata      IS '補助情報（影響範囲・件数・備考など）';

-- ── インデックス ───────────────────────────────
CREATE INDEX IF NOT EXISTS idx_admin_audit_logs_created_at ON public.admin_audit_logs(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_admin_audit_logs_actor      ON public.admin_audit_logs(actor_user_id);
CREATE INDEX IF NOT EXISTS idx_admin_audit_logs_target     ON public.admin_audit_logs(target_type, target_id);
CREATE INDEX IF NOT EXISTS idx_admin_audit_logs_action     ON public.admin_audit_logs(action);

-- ── RLS ───────────────────────────────────────
ALTER TABLE public.admin_audit_logs ENABLE ROW LEVEL SECURITY;

-- INSERT は service_role 経由のみ許可（ヘルパー lib/audit/admin-audit.ts から）
-- → ポリシー無し（authenticated は INSERT 不可）

-- 管理者は全件 SELECT 可能（事故調査用）
CREATE POLICY "Admins can read admin_audit_logs"
  ON public.admin_audit_logs FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.user_roles
      WHERE user_roles.user_id = auth.uid()
      AND user_roles.role IN ('owner', 'manager', 'staff')
    )
  );
