-- 【Phase 11: 既読管理付き「お知らせ掲示板」機能】

-- 1. internal_notices (お知らせ本文)
CREATE TABLE public.internal_notices (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  title text NOT NULL,
  content text NOT NULL, -- リッチテキストやマークダウン等を格納
  importance text NOT NULL DEFAULT 'normal', -- 'high' (重要), 'normal' (通常)
  created_by uuid NOT NULL, -- 作成した管理者/スタッフのユーザーID (auth.users.id)
  created_at timestamp with time zone NOT NULL DEFAULT timezone('utc'::text, now()),
  updated_at timestamp with time zone NOT NULL DEFAULT timezone('utc'::text, now()),
  
  CONSTRAINT internal_notices_pkey PRIMARY KEY (id),
  CONSTRAINT internal_notices_created_by_fkey FOREIGN KEY (created_by) REFERENCES auth.users(id) ON DELETE SET NULL
);

-- RLSポリシー（internal_notices）
ALTER TABLE public.internal_notices ENABLE ROW LEVEL SECURITY;

-- 誰もが見れる（閲覧）：キャストも管理者も
CREATE POLICY "Anyone authenticated can view notices"
  ON public.internal_notices
  FOR SELECT
  TO authenticated
  USING (true);

-- 管理者のみフルアクセス
CREATE POLICY "Admins have full access to notices"
  ON public.internal_notices
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.user_roles
      WHERE user_roles.user_id = auth.uid()
      AND user_roles.role IN ('owner', 'manager', 'staff')
    )
  );

-- updated_at 自動更新トリガー
CREATE TRIGGER update_internal_notices_updated_at
  BEFORE UPDATE ON public.internal_notices
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();


-- 2. notice_reads (既読管理)
CREATE TABLE public.notice_reads (
  notice_id uuid NOT NULL,
  cast_id uuid NOT NULL,
  read_at timestamp with time zone NOT NULL DEFAULT timezone('utc'::text, now()),
  
  CONSTRAINT notice_reads_pkey PRIMARY KEY (notice_id, cast_id),
  CONSTRAINT notice_reads_notice_id_fkey FOREIGN KEY (notice_id) REFERENCES internal_notices(id) ON DELETE CASCADE,
  CONSTRAINT notice_reads_cast_id_fkey FOREIGN KEY (cast_id) REFERENCES casts(id) ON DELETE CASCADE
);

-- RLSポリシー（notice_reads）
ALTER TABLE public.notice_reads ENABLE ROW LEVEL SECURITY;

-- キャストは自身の既読情報のみ閲覧可能
CREATE POLICY "Casts can view their own notice reads"
  ON public.notice_reads
  FOR SELECT
  TO authenticated
  USING (cast_id = (SELECT id FROM casts WHERE auth_user_id = auth.uid()));

-- キャストは自身の既読情報を登録可能
CREATE POLICY "Casts can insert their own notice reads"
  ON public.notice_reads
  FOR INSERT
  TO authenticated
  WITH CHECK (cast_id = (SELECT id FROM casts WHERE auth_user_id = auth.uid()));

-- 管理者は全キャストの既読情報を閲覧可能
CREATE POLICY "Admins can view all notice reads"
  ON public.notice_reads
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.user_roles
      WHERE user_roles.user_id = auth.uid()
      AND user_roles.role IN ('owner', 'manager', 'staff')
    )
  );
