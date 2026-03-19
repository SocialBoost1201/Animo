-- ==========================================
-- 本日確認メール 送信ログ (checkin_mail_logs)
-- ==========================================
-- 目的: 月〜土 16:00 のメール自動送信を記録し、同日二重送信を防止する

CREATE TABLE IF NOT EXISTS public.checkin_mail_logs (
  id         uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  cast_id    uuid REFERENCES public.casts(id) ON DELETE CASCADE,
  sent_date  date NOT NULL DEFAULT CURRENT_DATE,
  sent_at    timestamptz NOT NULL DEFAULT now(),
  email      text NOT NULL,
  status     text NOT NULL DEFAULT 'sent'
             CHECK (status IN ('sent', 'failed')),
  UNIQUE(cast_id, sent_date)   -- 同日二重送信を DB レベルで防止
);

COMMENT ON TABLE  public.checkin_mail_logs IS '本日確認フォームURLのメール送信ログ（月〜土 16:00 自動送信）';
COMMENT ON COLUMN public.checkin_mail_logs.cast_id   IS '送信対象キャストのID';
COMMENT ON COLUMN public.checkin_mail_logs.sent_date IS '送信日（UNIQUE制約のキー）';
COMMENT ON COLUMN public.checkin_mail_logs.email     IS '送信先メールアドレス（スナップショット）';
COMMENT ON COLUMN public.checkin_mail_logs.status    IS 'sent | failed';

ALTER TABLE public.checkin_mail_logs ENABLE ROW LEVEL SECURITY;

-- 管理者のみ閲覧・操作可能
CREATE POLICY "Admins can full access checkin_mail_logs"
  ON public.checkin_mail_logs TO authenticated
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

-- インデックス
CREATE INDEX IF NOT EXISTS idx_checkin_mail_logs_date    ON public.checkin_mail_logs(sent_date);
CREATE INDEX IF NOT EXISTS idx_checkin_mail_logs_cast_id ON public.checkin_mail_logs(cast_id);
