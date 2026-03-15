-- ==============================================================================
-- 1. Table: cast_posts (キャスト日記/SNS投稿)
-- ==============================================================================
CREATE TABLE IF NOT EXISTS public.cast_posts (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  cast_id uuid NOT NULL REFERENCES public.casts(id) ON DELETE CASCADE,
  content text NOT NULL,
  image_url text NOT NULL,
  status text NOT NULL DEFAULT 'pending' CHECK (status IN ('draft', 'pending', 'published')),
  likes integer NOT NULL DEFAULT 0,
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Index for fast retrieval
CREATE INDEX IF NOT EXISTS idx_cast_posts_cast_id ON public.cast_posts(cast_id);
CREATE INDEX IF NOT EXISTS idx_cast_posts_status ON public.cast_posts(status);
CREATE INDEX IF NOT EXISTS idx_cast_posts_created_at ON public.cast_posts(created_at DESC);

-- Enable RLS
ALTER TABLE public.cast_posts ENABLE ROW LEVEL SECURITY;

-- ==============================================================================
-- 2. RLS Policies for cast_posts
-- ==============================================================================

-- Admin (Owner/Manager): 全てのレコードの SELECT, INSERT, UPDATE, DELETE を許可
CREATE POLICY "admin_all_cast_posts" ON public.cast_posts
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.user_roles
      WHERE user_roles.user_id = auth.uid()
      AND user_roles.role IN ('owner', 'manager')
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.user_roles
      WHERE user_roles.user_id = auth.uid()
      AND user_roles.role IN ('owner', 'manager')
    )
  );

-- Cast (Auth): 自身の投稿のみ INSERT, UPDATE, SELECT を許可
-- ※ ここでは `casts` テーブルに `user_id` がある前提ですが、もし `casts` テーブルが直接Authと紐づいていない場合は
-- 別途管理側の設定が必要です。ここでは「特定のcast」として投稿する仕組みのため、
-- フロントエンド（server action）側で Service Role (Admin) を使って insert させるか、
-- RLSでcast_idを許容する必要があります。
-- 現在の Animo の Auth仕様（portal等）に合わせて、portal login しているユーザーが cast かどうか判定する logic とします。
CREATE POLICY "cast_own_posts_select" ON public.cast_posts
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.user_roles
      WHERE user_roles.user_id = auth.uid()
      AND user_roles.role = 'cast'
      -- ※ 追加要件: ログインユーザーとキャストIDの紐付けがあればANDでつなぐ。
    )
  );

-- Public: Publishedの投稿のみ閲覧許可
CREATE POLICY "public_read_published_cast_posts" ON public.cast_posts
  FOR SELECT
  TO public
  USING (status = 'published');


-- ==============================================================================
-- 3. Storage Bucket: cast-posts
-- ==============================================================================

INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'cast-posts',
  'cast-posts',
  true,
  5242880, -- 5MB
  ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/heic']::text[]
) ON CONFLICT (id) DO UPDATE SET 
  public = true,
  file_size_limit = 5242880,
  allowed_mime_types = ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/heic']::text[];

-- ==============================================================================
-- 4. Storage RLS for cast-posts
-- ==============================================================================

-- Public Select
CREATE POLICY "public_read_cast_posts_images" ON storage.objects
  FOR SELECT
  TO public
  USING (bucket_id = 'cast-posts');

-- Admin/Cast Upload (Server Action等からService Keyで叩く場合はRLSスルーされますが、念の為定義)
CREATE POLICY "auth_insert_cast_posts_images" ON storage.objects
  FOR INSERT
  TO authenticated
  WITH CHECK (bucket_id = 'cast-posts');

CREATE POLICY "auth_update_cast_posts_images" ON storage.objects
  FOR UPDATE
  TO authenticated
  USING (bucket_id = 'cast-posts');

CREATE POLICY "auth_delete_cast_posts_images" ON storage.objects
  FOR DELETE
  TO authenticated
  USING (bucket_id = 'cast-posts');
