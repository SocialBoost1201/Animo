-- ==========================================
-- キャスト出勤依頼通知ログテーブル
-- Phase 2: Shift Shortage Visibility and Attendance Request Logs
-- ==========================================
--
-- 目的: 管理者・スタッフが低人員日にキャストへ出勤依頼を行った記録を保存する。
-- 実装方針: LINEへの直接送信は行わず、内部ログ + コピー用メッセージ生成のみ。
-- 重要: channel='internal' のみ。status='sent' はスタッフが手動で送信した場合のみ更新。
--
-- 重複防止: business_date + cast_id + channel の組み合わせで
--           status IN ('pending', 'sent') のレコードが既に存在する場合は追加しない。
--
-- RLSパターン: 20260319000000_add_today_dashboard.sql に準拠 (user_roles.user_id)
-- ==========================================

CREATE TABLE IF NOT EXISTS public.cast_shift_request_notifications (
  id            uuid        PRIMARY KEY DEFAULT uuid_generate_v4(),
  business_date date        NOT NULL,
  cast_id       uuid        NOT NULL REFERENCES public.casts(id) ON DELETE CASCADE,
  message       text        NOT NULL,
  status        text        NOT NULL DEFAULT 'pending'
                  CHECK (status IN ('pending', 'sent', 'failed')),
  channel       text        NOT NULL DEFAULT 'internal'
                  CHECK (channel IN ('internal', 'manual')),
  sent_by       uuid        REFERENCES auth.users(id) ON DELETE SET NULL,
  sent_at       timestamptz,
  created_at    timestamptz NOT NULL DEFAULT now(),
  updated_at    timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.cast_shift_request_notifications ENABLE ROW LEVEL SECURITY;

-- 重複防止: 同一日・同一キャスト・同一チャンネルで pending/sent が既にある場合は追加しない
CREATE UNIQUE INDEX IF NOT EXISTS cast_shift_request_notif_no_dup
  ON public.cast_shift_request_notifications (business_date, cast_id, channel)
  WHERE status IN ('pending', 'sent');

-- 管理者・スタッフ: フルアクセス（user_rolesパターン準拠）
CREATE POLICY "Admins can manage cast_shift_request_notifications"
  ON public.cast_shift_request_notifications TO authenticated
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
CREATE INDEX IF NOT EXISTS idx_cast_shift_request_notif_date
  ON public.cast_shift_request_notifications(business_date);

CREATE INDEX IF NOT EXISTS idx_cast_shift_request_notif_cast
  ON public.cast_shift_request_notifications(cast_id);

CREATE INDEX IF NOT EXISTS idx_cast_shift_request_notif_status
  ON public.cast_shift_request_notifications(status);

-- updated_at 自動更新トリガー
CREATE OR REPLACE FUNCTION update_cast_shift_request_notifications_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_cast_shift_request_notifications_updated_at
  ON public.cast_shift_request_notifications;

CREATE TRIGGER trg_cast_shift_request_notifications_updated_at
  BEFORE UPDATE ON public.cast_shift_request_notifications
  FOR EACH ROW EXECUTE FUNCTION update_cast_shift_request_notifications_updated_at();
