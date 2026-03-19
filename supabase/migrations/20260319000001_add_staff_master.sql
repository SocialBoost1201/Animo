-- ==========================================
-- スタッフマスタ管理 (Staff Master Management)
-- ==========================================

-- 1. スタッフテーブル
CREATE TABLE IF NOT EXISTS public.staffs (
  id           uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  name         text NOT NULL,                 -- 本名（内部管理用）
  display_name text NOT NULL,                 -- 表示名（ダッシュボード・LINE用）
  role         text,                          -- 役割（任意: 店長, 黒服, エプロン等）
  is_active    boolean DEFAULT true,          -- 在籍ステータス
  created_at   timestamptz DEFAULT now(),
  updated_at   timestamptz DEFAULT now()
);

-- RLS設定 (管理者のみフルアクセス)
ALTER TABLE public.staffs ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Admins can full access staffs"
  ON public.staffs TO authenticated
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

-- 2. daily_staff_attendances テーブルの拡張
-- staff_id を追加してマスタと紐付けられるようにする
ALTER TABLE public.daily_staff_attendances ADD COLUMN IF NOT EXISTS staff_id uuid REFERENCES public.staffs(id);

-- 既存のデータを移行する必要がある場合は手動調整が必要だが、
-- 運用開始直後のため、新規カラム追加のみ行う。
-- display_name はマスタから取得するように移行していく。

-- 3. インデックス追加
CREATE INDEX IF NOT EXISTS idx_staffs_is_active ON public.staffs(is_active);
