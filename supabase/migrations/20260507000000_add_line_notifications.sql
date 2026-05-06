-- line_notifications: LINE自動通知スケジュール管理テーブル
CREATE TABLE IF NOT EXISTS line_notifications (
  id                uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  name              text        NOT NULL,
  content           text        NOT NULL,
  target_type       text        NOT NULL CHECK (target_type IN ('group', 'individual')),
  target_id         text        NULL,        -- 個別送信時のLINE user_id
  schedule_type     text        NOT NULL CHECK (schedule_type IN ('daily', 'weekly', 'monthly', 'once')),
  schedule_time     text        NOT NULL,    -- "HH:MM" 形式
  schedule_days     integer[]   NULL,        -- weekly: 0=日〜6=土
  schedule_dates    integer[]   NULL,        -- monthly: 1〜31
  schedule_once_at  timestamptz NULL,        -- once: 送信日時
  is_enabled        boolean     NOT NULL DEFAULT true,
  last_sent_at      timestamptz NULL,
  created_at        timestamptz NOT NULL DEFAULT now(),
  updated_at        timestamptz NOT NULL DEFAULT now()
);

-- line_notification_logs: 送信ログ
CREATE TABLE IF NOT EXISTS line_notification_logs (
  id                  uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  notification_id     uuid        NOT NULL REFERENCES line_notifications(id) ON DELETE CASCADE,
  sent_at             timestamptz NOT NULL DEFAULT now(),
  status              text        NOT NULL CHECK (status IN ('sent', 'failed', 'skipped')),
  message_preview     text        NULL,
  error_reason        text        NULL
);

-- updated_at 自動更新トリガー
CREATE OR REPLACE FUNCTION update_line_notifications_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_line_notifications_updated_at ON line_notifications;
CREATE TRIGGER trg_line_notifications_updated_at
  BEFORE UPDATE ON line_notifications
  FOR EACH ROW EXECUTE FUNCTION update_line_notifications_updated_at();

-- インデックス
CREATE INDEX IF NOT EXISTS idx_line_notifications_enabled ON line_notifications(is_enabled);
CREATE INDEX IF NOT EXISTS idx_line_notification_logs_notif ON line_notification_logs(notification_id, sent_at DESC);
