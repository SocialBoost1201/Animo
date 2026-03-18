-- 【Phase 9: 出勤リクエスト（ヘルプ募集）機能の初期構築】

-- 1. shift_requests テーブル（店舗が発行する募集要項）の作成
CREATE TABLE public.shift_requests (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  target_date date NOT NULL,
  message text NOT NULL,
  is_active boolean NOT NULL DEFAULT true,
  created_at timestamp with time zone NOT NULL DEFAULT timezone('utc'::text, now()),
  
  CONSTRAINT shift_requests_pkey PRIMARY KEY (id)
);

-- RLSポリシー（shift_requests）
-- 全ての認証済ユーザー（キャストおよび管理者）が募集内容を閲覧可能
ALTER TABLE public.shift_requests ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view active shift requests"
  ON public.shift_requests
  FOR SELECT
  TO authenticated
  USING (is_active = true);
  
CREATE POLICY "Admins have full access to shift requests"
  ON public.shift_requests
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.user_roles
      WHERE user_roles.user_id = auth.uid()
      AND user_roles.role IN ('owner', 'manager', 'staff')
    )
  );


-- 2. shift_request_responses テーブル（キャストからの応募）の作成
CREATE TABLE public.shift_request_responses (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  request_id uuid NOT NULL,
  cast_id uuid NOT NULL,
  proposed_start_time text NOT NULL, -- 出勤可能時間（HH:mm形式等）
  proposed_end_time text NOT NULL,   -- 退勤可能時間（HH:mm形式等）
  status text NOT NULL DEFAULT 'pending', -- 'pending', 'approved', 'rejected'
  created_at timestamp with time zone NOT NULL DEFAULT timezone('utc'::text, now()),
  
  CONSTRAINT shift_request_responses_pkey PRIMARY KEY (id),
  CONSTRAINT shift_request_responses_request_id_fkey FOREIGN KEY (request_id) REFERENCES shift_requests(id) ON DELETE CASCADE,
  CONSTRAINT shift_request_responses_cast_id_fkey FOREIGN KEY (cast_id) REFERENCES casts(id) ON DELETE CASCADE
);

-- 同一募集に対して同一キャストが重複して応募できないようにする制約
CREATE UNIQUE INDEX idx_unique_shift_response ON public.shift_request_responses (request_id, cast_id);

-- RLSポリシー（shift_request_responses）
ALTER TABLE public.shift_request_responses ENABLE ROW LEVEL SECURITY;

-- キャスト本人は自身の応募を作成・閲覧可能
CREATE POLICY "Casts can insert their own responses"
  ON public.shift_request_responses
  FOR INSERT
  TO authenticated
  WITH CHECK (cast_id = (SELECT id FROM casts WHERE auth_user_id = auth.uid()));

CREATE POLICY "Casts can view their own responses"
  ON public.shift_request_responses
  FOR SELECT
  TO authenticated
  USING (cast_id = (SELECT id FROM casts WHERE auth_user_id = auth.uid()));

-- 管理者は全ての応募を閲覧・更新可能
CREATE POLICY "Admins have full access to shift request responses"
  ON public.shift_request_responses
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.user_roles
      WHERE user_roles.user_id = auth.uid()
      AND user_roles.role IN ('owner', 'manager', 'staff')
    )
  );

-- Function: admin_usersテーブルの存在チェックは省略し、既存ポリシーの構造に合わせます。
