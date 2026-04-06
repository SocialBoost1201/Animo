-- ============================================================
-- Club Animo DB 完全設計 マイグレーション SQL
-- Supabase SQL Editor で順番に実行してください
-- ============================================================

-- ─────────────────────────────────────────────────────────────
-- STEP 1: casts テーブルに slug カラム追加
-- ─────────────────────────────────────────────────────────────
ALTER TABLE public.casts ADD COLUMN IF NOT EXISTS slug text;
ALTER TABLE public.casts ADD COLUMN IF NOT EXISTS profile_image_id uuid;
ALTER TABLE public.casts ADD COLUMN IF NOT EXISTS sns_x text;
ALTER TABLE public.casts ADD COLUMN IF NOT EXISTS sns_instagram text;
ALTER TABLE public.casts ADD COLUMN IF NOT EXISTS sns_tiktok text;
ALTER TABLE public.casts ADD COLUMN IF NOT EXISTS updated_at timestamptz DEFAULT now();

-- 既存データに slug を自動生成（重複しない形式）
UPDATE public.casts
SET slug = LOWER(REGEXP_REPLACE(COALESCE(stage_name, name, 'cast'), '[^a-zA-Z0-9]', '', 'g'))
        || '-' || SUBSTR(id::text, 1, 6)
WHERE slug IS NULL;

-- slug に UNIQUE 制約
ALTER TABLE public.casts DROP CONSTRAINT IF EXISTS casts_slug_key;
ALTER TABLE public.casts ADD CONSTRAINT casts_slug_key UNIQUE (slug);

-- ─────────────────────────────────────────────────────────────
-- STEP 2: cast_schedules の date → work_date リネーム
-- ─────────────────────────────────────────────────────────────
ALTER TABLE public.cast_schedules RENAME COLUMN date TO work_date;
ALTER TABLE public.cast_schedules ADD COLUMN IF NOT EXISTS display_order integer NOT NULL DEFAULT 0;
ALTER TABLE public.cast_schedules ADD COLUMN IF NOT EXISTS updated_at timestamptz DEFAULT now();

-- ─────────────────────────────────────────────────────────────
-- STEP 3: cast_images テーブル作成
-- ─────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.cast_images (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  cast_id     uuid NOT NULL REFERENCES public.casts(id) ON DELETE CASCADE,
  image_url   text NOT NULL,
  image_type  text NOT NULL DEFAULT 'profile',
  sort_order  integer NOT NULL DEFAULT 0,
  is_primary  boolean NOT NULL DEFAULT false,
  created_at  timestamptz NOT NULL DEFAULT now(),
  updated_at  timestamptz NOT NULL DEFAULT now()
);

-- 既存の image_url を cast_images へ移行
INSERT INTO public.cast_images (cast_id, image_url, image_type, is_primary)
SELECT id, image_url, 'profile', true
FROM public.casts
WHERE image_url IS NOT NULL AND image_url != ''
ON CONFLICT DO NOTHING;

-- ─────────────────────────────────────────────────────────────
-- STEP 4: cast_tags + cast_tag_relations テーブル作成
-- ─────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.cast_tags (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name        text NOT NULL,
  slug        text NOT NULL UNIQUE,
  sort_order  integer NOT NULL DEFAULT 0,
  created_at  timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.cast_tag_relations (
  id        uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  cast_id   uuid NOT NULL REFERENCES public.casts(id) ON DELETE CASCADE,
  tag_id    uuid NOT NULL REFERENCES public.cast_tags(id) ON DELETE CASCADE,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (cast_id, tag_id)
);

-- デフォルトタグを挿入
INSERT INTO public.cast_tags (name, slug, sort_order) VALUES
  ('清楚', 'seiso', 1),
  ('大人', 'adult', 2),
  ('可愛い', 'kawaii', 3),
  ('落ち着き', 'calm', 4),
  ('華やか', 'gorgeous', 5),
  ('会話好き', 'talkative', 6)
ON CONFLICT (slug) DO NOTHING;

-- ─────────────────────────────────────────────────────────────
-- STEP 5: news テーブル作成
-- ─────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.news (
  id            uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title         text NOT NULL,
  slug          text NOT NULL UNIQUE,
  summary       text,
  body          text NOT NULL DEFAULT '',
  thumbnail_url text,
  is_published  boolean NOT NULL DEFAULT false,
  published_at  timestamptz,
  display_order integer NOT NULL DEFAULT 0,
  created_at    timestamptz NOT NULL DEFAULT now(),
  updated_at    timestamptz NOT NULL DEFAULT now()
);

-- ─────────────────────────────────────────────────────────────
-- STEP 6: recruit_pages テーブル作成
-- ─────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.recruit_pages (
  id             uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  page_type      text NOT NULL UNIQUE,
  title          text,
  body           text,
  hero_image_url text,
  is_published   boolean NOT NULL DEFAULT false,
  updated_at     timestamptz NOT NULL DEFAULT now()
);

INSERT INTO public.recruit_pages (page_type, title, is_published)
  VALUES ('cast', 'キャスト募集', true), ('staff', 'スタッフ募集', true)
ON CONFLICT (page_type) DO NOTHING;

-- ─────────────────────────────────────────────────────────────
-- STEP 7: recruit_applications テーブル作成（または再作成）
-- ─────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.recruit_applications (
  id                  uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  application_type    text NOT NULL DEFAULT 'cast',
  name                text NOT NULL,
  age                 integer,
  phone               text NOT NULL,
  line_id             text,
  preferred_date      text,
  preferred_position  text,
  message             text,
  status              text NOT NULL DEFAULT 'new',
  created_at          timestamptz NOT NULL DEFAULT now(),
  updated_at          timestamptz NOT NULL DEFAULT now()
);

-- ─────────────────────────────────────────────────────────────
-- STEP 8: contact_inquiries テーブル確認・拡張
-- ─────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.contact_inquiries (
  id         uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name       text NOT NULL,
  phone      text,
  email      text,
  message    text NOT NULL,
  status     text NOT NULL DEFAULT 'new',
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

-- ─────────────────────────────────────────────────────────────
-- STEP 9: audit_logs テーブル作成
-- ─────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.audit_logs (
  id           uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  admin_id     uuid,
  target_table text,
  target_id    uuid,
  action_type  text,
  before_data  jsonb,
  after_data   jsonb,
  created_at   timestamptz NOT NULL DEFAULT now()
);

-- ─────────────────────────────────────────────────────────────
-- STEP 10: インデックス
-- ─────────────────────────────────────────────────────────────
CREATE UNIQUE INDEX IF NOT EXISTS idx_casts_slug         ON public.casts(slug);
CREATE INDEX IF NOT EXISTS idx_casts_is_active           ON public.casts(is_active);
CREATE INDEX IF NOT EXISTS idx_casts_display_order       ON public.casts(display_order);
CREATE INDEX IF NOT EXISTS idx_cast_images_cast_id       ON public.cast_images(cast_id);
CREATE INDEX IF NOT EXISTS idx_cast_schedules_work_date  ON public.cast_schedules(work_date);
CREATE INDEX IF NOT EXISTS idx_cast_schedules_cast_id    ON public.cast_schedules(cast_id);
CREATE UNIQUE INDEX IF NOT EXISTS idx_news_slug          ON public.news(slug);
CREATE INDEX IF NOT EXISTS idx_news_is_published         ON public.news(is_published);
CREATE INDEX IF NOT EXISTS idx_recruit_app_type          ON public.recruit_applications(application_type);
CREATE INDEX IF NOT EXISTS idx_recruit_app_status        ON public.recruit_applications(status);

-- ─────────────────────────────────────────────────────────────
-- STEP 11: RLS 設定
-- ─────────────────────────────────────────────────────────────

-- 公開テーブル：匿名 SELECT 可
DO $$
DECLARE tbl text;
BEGIN
  FOR tbl IN SELECT unnest(ARRAY[
    'casts','cast_images','cast_tags','cast_tag_relations',
    'cast_schedules','news','gallery_assets','hero_media',
    'site_settings','recruit_pages'
  ]) LOOP
    EXECUTE format('ALTER TABLE public.%I ENABLE ROW LEVEL SECURITY', tbl);
    EXECUTE format('DROP POLICY IF EXISTS anon_select ON public.%I', tbl);
    EXECUTE format('CREATE POLICY anon_select ON public.%I FOR SELECT USING (true)', tbl);
    EXECUTE format('DROP POLICY IF EXISTS auth_all ON public.%I', tbl);
    EXECUTE format('CREATE POLICY auth_all ON public.%I TO authenticated USING (true) WITH CHECK (true)', tbl);
  END LOOP;
END $$;

-- 非公開テーブル（応募・問い合わせ）: 匿名INSERT可、SELECT不可
DO $$
DECLARE tbl text;
BEGIN
  FOR tbl IN SELECT unnest(ARRAY['recruit_applications','contact_inquiries']) LOOP
    EXECUTE format('ALTER TABLE public.%I ENABLE ROW LEVEL SECURITY', tbl);
    EXECUTE format('DROP POLICY IF EXISTS anon_insert ON public.%I', tbl);
    EXECUTE format('CREATE POLICY anon_insert ON public.%I FOR INSERT WITH CHECK (true)', tbl);
    EXECUTE format('DROP POLICY IF EXISTS auth_all ON public.%I', tbl);
    EXECUTE format('CREATE POLICY auth_all ON public.%I TO authenticated USING (true) WITH CHECK (true)', tbl);
  END LOOP;
END $$;

-- audit_logs: 管理者のみ
ALTER TABLE public.audit_logs ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS auth_all ON public.audit_logs;
CREATE POLICY auth_all ON public.audit_logs TO authenticated USING (true) WITH CHECK (true);
-- Storage RLS Migration for 'images' bucket

-- 1. Create the bucket if it doesn't exist
INSERT INTO storage.buckets (id, name, public)
VALUES ('images', 'images', true)
ON CONFLICT (id) DO NOTHING;

-- 2. Setup RLS policies on storage.objects

-- Allow public read access to specific folders (casts, gallery, events, hero)
-- Note: 'public' in the bucket means anyone can access the URL if they know it,
-- but we also want to explicitly allow SELECT via API for these folders just in case.
CREATE POLICY "Public Access to specific image folders"
ON storage.objects FOR SELECT
USING (
  bucket_id = 'images' 
  AND (
    (storage.foldername(name))[1] IN ('casts', 'gallery', 'events', 'hero', 'recruit')
  )
);

-- Allow authenticated users (Admins) to upload files
CREATE POLICY "Admins can upload images"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'images'
);

-- Allow authenticated users (Admins) to update files
CREATE POLICY "Admins can update images"
ON storage.objects FOR UPDATE
TO authenticated
USING (
  bucket_id = 'images'
)
WITH CHECK (
  bucket_id = 'images'
);

-- Allow authenticated users (Admins) to delete files
CREATE POLICY "Admins can delete images"
ON storage.objects FOR DELETE
TO authenticated
USING (
  bucket_id = 'images'
);
