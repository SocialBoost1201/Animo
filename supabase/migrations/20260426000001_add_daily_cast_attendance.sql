-- ==========================================
-- 本日のキャスト出勤手動オーバーライドテーブル
-- Phase 1: Manual Daily Cast Attendance Override
-- ==========================================
--
-- 目的: 管理者・スタッフが本日のキャスト出勤状況を手動で記録・上書きするための独立テーブル。
-- 重要: daily_checkins / shift_submissions / cast_schedules は一切変更しない。
-- 最終出勤状態の優先順位:
--   1. daily_cast_attendance (このテーブル, status=working|absent)
--   2. daily_checkins (キャスト自己申告)
--   3. shift_submissions (シフト申請)
--   4. 未確定
--
-- RLSパターン: 20260319000000_add_today_dashboard.sql に準拠 (user_roles.user_id)
-- ==========================================

CREATE TABLE IF NOT EXISTS public.daily_cast_attendance (
  id            uuid        PRIMARY KEY DEFAULT uuid_generate_v4(),
  cast_id       uuid        NOT NULL REFERENCES public.casts(id) ON DELETE CASCADE,
  business_date date        NOT NULL DEFAULT CURRENT_DATE,
  status        text        NOT NULL DEFAULT 'undecided'
                  CHECK (status IN ('working', 'absent', 'undecided')),
  source        text        NOT NULL DEFAULT 'manual'
                  CHECK (source IN ('manual')),
  note          text,
  created_by    uuid        REFERENCES auth.users(id) ON DELETE SET NULL,
  updated_by    uuid        REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at    timestamptz NOT NULL DEFAULT now(),
  updated_at    timestamptz NOT NULL DEFAULT now(),

  CONSTRAINT daily_cast_attendance_unique UNIQUE (cast_id, business_date)
);

ALTER TABLE public.daily_cast_attendance ENABLE ROW LEVEL SECURITY;

-- 管理者・スタッフ: フルアクセス（user_rolesパターン準拠）
CREATE POLICY "Admins can manage daily_cast_attendance"
  ON public.daily_cast_attendance TO authenticated
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

-- キャスト: 自分のレコードのみ参照可（書き込み不可）
CREATE POLICY "Casts can view own attendance override"
  ON public.daily_cast_attendance FOR SELECT TO authenticated
  USING (
    cast_id IN (
      SELECT id FROM public.casts WHERE casts.auth_user_id = auth.uid()
    )
  );

-- インデックス
CREATE INDEX IF NOT EXISTS idx_daily_cast_attendance_cast_id
  ON public.daily_cast_attendance(cast_id);

CREATE INDEX IF NOT EXISTS idx_daily_cast_attendance_date
  ON public.daily_cast_attendance(business_date);

-- updated_at 自動更新トリガー
CREATE OR REPLACE FUNCTION update_daily_cast_attendance_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_daily_cast_attendance_updated_at
  ON public.daily_cast_attendance;

CREATE TRIGGER trg_daily_cast_attendance_updated_at
  BEFORE UPDATE ON public.daily_cast_attendance
  FOR EACH ROW EXECUTE FUNCTION update_daily_cast_attendance_updated_at();
