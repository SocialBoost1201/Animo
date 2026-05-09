-- daily_operation_memos: 日次営業メモ（VIP来店・イベント・要対応事項）
-- ダッシュボードと出勤調整ページの MANAGEMENT MEMO セクションで使用する。
-- 1日3種（vip / event / urgent）のメモを管理者が登録する。

CREATE TABLE IF NOT EXISTS public.daily_operation_memos (
  id             uuid        PRIMARY KEY DEFAULT uuid_generate_v4(),
  operation_date date        NOT NULL DEFAULT CURRENT_DATE,
  memo_type      text        NOT NULL CHECK (memo_type IN ('vip', 'event', 'urgent')),
  content        text        NOT NULL DEFAULT '',
  created_at     timestamptz NOT NULL DEFAULT now(),
  updated_at     timestamptz NOT NULL DEFAULT now(),

  CONSTRAINT daily_operation_memos_unique UNIQUE (operation_date, memo_type)
);

ALTER TABLE public.daily_operation_memos ENABLE ROW LEVEL SECURITY;

-- 管理者・スタッフ: フルアクセス
CREATE POLICY "Admins can manage daily_operation_memos"
  ON public.daily_operation_memos TO authenticated
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

CREATE INDEX IF NOT EXISTS idx_daily_operation_memos_date
  ON public.daily_operation_memos(operation_date);

-- updated_at 自動更新
CREATE OR REPLACE FUNCTION update_daily_operation_memos_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_daily_operation_memos_updated_at ON public.daily_operation_memos;

CREATE TRIGGER trg_daily_operation_memos_updated_at
  BEFORE UPDATE ON public.daily_operation_memos
  FOR EACH ROW EXECUTE FUNCTION update_daily_operation_memos_updated_at();
