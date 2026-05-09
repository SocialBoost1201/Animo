-- ==========================================
-- メール重複送信防止ログ
-- ==========================================
-- 目的:
--   1. customer_birthday_email_logs:
--      誕生月の顧客への自動メール送信を月単位で記録し、同月内の二重送信を防ぐ
--   2. shift_reminder_email_logs:
--      シフト未提出キャストへのリマインドメールを週単位で記録し、同週内の二重送信を防ぐ

-- ─────────────────────────────────────────────
-- 1. customer_birthday_email_logs
-- ─────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.customer_birthday_email_logs (
  id                 uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  customer_id        uuid REFERENCES public.customers(id) ON DELETE CASCADE,
  target_year_month  text NOT NULL,  -- 'YYYY-MM' 形式
  sent_at            timestamptz NOT NULL DEFAULT now(),
  email              text NOT NULL,
  status             text NOT NULL DEFAULT 'sent'
                     CHECK (status IN ('sent', 'failed')),
  UNIQUE(customer_id, target_year_month)
);

COMMENT ON TABLE  public.customer_birthday_email_logs IS '誕生月メール送信ログ（毎月対象顧客に1回だけ送信）';
COMMENT ON COLUMN public.customer_birthday_email_logs.target_year_month IS '送信対象の年月（YYYY-MM形式、UNIQUE制約のキー）';

ALTER TABLE public.customer_birthday_email_logs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can full access customer_birthday_email_logs"
  ON public.customer_birthday_email_logs TO authenticated
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

CREATE INDEX IF NOT EXISTS idx_customer_birthday_email_logs_year_month
  ON public.customer_birthday_email_logs(target_year_month);
CREATE INDEX IF NOT EXISTS idx_customer_birthday_email_logs_customer_id
  ON public.customer_birthday_email_logs(customer_id);

-- ─────────────────────────────────────────────
-- 2. shift_reminder_email_logs
-- ─────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.shift_reminder_email_logs (
  id                  uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  cast_id             uuid REFERENCES public.casts(id) ON DELETE CASCADE,
  target_week_monday  date NOT NULL,
  sent_at             timestamptz NOT NULL DEFAULT now(),
  email               text NOT NULL,
  status              text NOT NULL DEFAULT 'sent'
                      CHECK (status IN ('sent', 'failed')),
  UNIQUE(cast_id, target_week_monday)
);

COMMENT ON TABLE  public.shift_reminder_email_logs IS 'シフト未提出キャストへのリマインドメール送信ログ（週単位で1回だけ送信）';
COMMENT ON COLUMN public.shift_reminder_email_logs.target_week_monday IS '対象週の月曜日（UNIQUE制約のキー）';

ALTER TABLE public.shift_reminder_email_logs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can full access shift_reminder_email_logs"
  ON public.shift_reminder_email_logs TO authenticated
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

CREATE INDEX IF NOT EXISTS idx_shift_reminder_email_logs_week
  ON public.shift_reminder_email_logs(target_week_monday);
CREATE INDEX IF NOT EXISTS idx_shift_reminder_email_logs_cast_id
  ON public.shift_reminder_email_logs(cast_id);
