-- ==========================================
-- キャスト プロフィール画像変更申請テーブル
-- ==========================================
-- キャストが自分のプロフィール画像の変更を申請するためのテーブル。
-- 管理者は承認・却下でき、承認時に casts.image_url を更新する運用を想定。
-- ==========================================

CREATE TABLE IF NOT EXISTS public.cast_profile_image_requests (
  id            uuid        PRIMARY KEY DEFAULT uuid_generate_v4(),
  cast_id       uuid        NOT NULL REFERENCES public.casts(id) ON DELETE CASCADE,
  image_url     text        NOT NULL,
  status        text        NOT NULL DEFAULT 'pending'
                  CHECK (status IN ('pending', 'approved', 'rejected')),
  admin_note    text,
  reviewed_by   uuid        REFERENCES auth.users(id) ON DELETE SET NULL,
  reviewed_at   timestamptz,
  created_at    timestamptz NOT NULL DEFAULT now(),
  updated_at    timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.cast_profile_image_requests ENABLE ROW LEVEL SECURITY;

-- キャスト本人: 自分の申請のみ参照・作成
CREATE POLICY "Cast can view own profile image requests"
  ON public.cast_profile_image_requests FOR SELECT TO authenticated
  USING (
    cast_id IN (
      SELECT id FROM public.casts WHERE auth_user_id = auth.uid()
    )
  );

CREATE POLICY "Cast can insert own profile image requests"
  ON public.cast_profile_image_requests FOR INSERT TO authenticated
  WITH CHECK (
    cast_id IN (
      SELECT id FROM public.casts WHERE auth_user_id = auth.uid()
    )
  );

-- 管理者・スタッフ: フルアクセス
CREATE POLICY "Admins can manage cast_profile_image_requests"
  ON public.cast_profile_image_requests FOR ALL TO authenticated
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
CREATE INDEX IF NOT EXISTS idx_cast_profile_image_requests_cast_id
  ON public.cast_profile_image_requests(cast_id);

CREATE INDEX IF NOT EXISTS idx_cast_profile_image_requests_status
  ON public.cast_profile_image_requests(status);

-- updated_at 自動更新トリガー
CREATE OR REPLACE FUNCTION update_cast_profile_image_requests_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_cast_profile_image_requests_updated_at
  ON public.cast_profile_image_requests;

CREATE TRIGGER trg_cast_profile_image_requests_updated_at
  BEFORE UPDATE ON public.cast_profile_image_requests
  FOR EACH ROW EXECUTE FUNCTION update_cast_profile_image_requests_updated_at();
