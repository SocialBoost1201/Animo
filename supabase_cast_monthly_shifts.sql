-- =================================================================================
-- 【Phase 12: 月間シフト（○×△）提出機能】
-- cast_shifts テーブル作成 / RLS / トリガー
-- =================================================================================

-- 1. テーブル作成
CREATE TABLE IF NOT EXISTS public.cast_shifts (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  cast_id uuid NOT NULL,
  work_date date NOT NULL,
  status text NOT NULL CHECK (status IN ('available', 'unavailable', 'maybe')),
  created_at timestamp with time zone NOT NULL DEFAULT timezone('utc'::text, now()),
  updated_at timestamp with time zone NOT NULL DEFAULT timezone('utc'::text, now()),
  
  CONSTRAINT cast_shifts_pkey PRIMARY KEY (id),
  CONSTRAINT cast_shifts_cast_id_work_date_key UNIQUE (cast_id, work_date), -- 同一キャストの同日重複防止
  CONSTRAINT cast_shifts_cast_id_fkey FOREIGN KEY (cast_id) REFERENCES casts(id) ON DELETE CASCADE
);

-- 2. index作成 (検索速度向上のため、年月などで検索することも想定)
CREATE INDEX idx_cast_shifts_cast_id ON public.cast_shifts(cast_id);
CREATE INDEX idx_cast_shifts_work_date ON public.cast_shifts(work_date);

-- 3. RLSポリシーの設定
ALTER TABLE public.cast_shifts ENABLE ROW LEVEL SECURITY;

-- キャストは自身のシフトのみ閲覧可能
CREATE POLICY "Casts can view their own shifts"
  ON public.cast_shifts
  FOR SELECT
  TO authenticated
  USING (cast_id = (SELECT id FROM casts WHERE auth_user_id = auth.uid()));

-- キャストは自身のシフトのみ登録・更新・削除可能
CREATE POLICY "Casts can manage their own shifts"
  ON public.cast_shifts
  FOR ALL
  TO authenticated
  USING (cast_id = (SELECT id FROM casts WHERE auth_user_id = auth.uid()));

-- 管理者は全キャストのシフトを閲覧・管理可能
CREATE POLICY "Admins can view and manage all shifts"
  ON public.cast_shifts
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.user_roles
      WHERE user_roles.user_id = auth.uid()
      AND user_roles.role IN ('owner', 'manager', 'staff')
    )
  );

-- 4. updated_at 自動更新トリガー
-- ※ update_updated_at_column() はこれまでの作業ですでに作成済みと想定
CREATE TRIGGER update_cast_shifts_updated_at
  BEFORE UPDATE ON public.cast_shifts
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();
