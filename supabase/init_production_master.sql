-- ============================================================
-- Club Animo DB 本番環境用 完全マスター構築 SQL
-- (新規プロジェクトに対して、このファイル1つを実行するだけで全テーブル・RLS・ストレージ設定が完了します)
-- ============================================================

-- Extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ─────────────────────────────────────────────────────────────
-- 1. BASE TABLES CREATION
-- ─────────────────────────────────────────────────────────────

-- casts
CREATE TABLE IF NOT EXISTS public.casts (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  name text, -- For backward compatibility
  stage_name text NOT NULL,
  name_kana text,
  slug text UNIQUE NOT NULL,
  age integer,
  height integer,
  hobby text,
  comment text,
  image_url text,
  profile_image_id uuid,
  sns_x text,
  sns_instagram text,
  sns_tiktok text,
  tags text[],
  quiz_tags text[],
  status text DEFAULT 'public' CHECK (status IN ('public', 'private')),
  is_active boolean DEFAULT true,
  is_today boolean DEFAULT false,
  display_order integer NOT NULL DEFAULT 0,
  joined_at timestamp with time zone,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now()
);

-- cast_schedules (旧 shifts)
CREATE TABLE IF NOT EXISTS public.cast_schedules (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  cast_id uuid REFERENCES public.casts(id) ON DELETE CASCADE,
  work_date date NOT NULL,
  start_time time,
  end_time time,
  display_order integer NOT NULL DEFAULT 0,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now()
);

-- cast_images
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

-- cast_tags
CREATE TABLE IF NOT EXISTS public.cast_tags (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name        text NOT NULL,
  slug        text NOT NULL UNIQUE,
  sort_order  integer NOT NULL DEFAULT 0,
  created_at  timestamptz NOT NULL DEFAULT now()
);

-- cast_tag_relations
CREATE TABLE IF NOT EXISTS public.cast_tag_relations (
  id        uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  cast_id   uuid NOT NULL REFERENCES public.casts(id) ON DELETE CASCADE,
  tag_id    uuid NOT NULL REFERENCES public.cast_tags(id) ON DELETE CASCADE,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (cast_id, tag_id)
);

-- news
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

-- recruit_pages
CREATE TABLE IF NOT EXISTS public.recruit_pages (
  id             uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  page_type      text NOT NULL UNIQUE,
  title          text,
  body           text,
  hero_image_url text,
  is_published   boolean NOT NULL DEFAULT false,
  updated_at     timestamptz NOT NULL DEFAULT now()
);

-- recruit_applications
CREATE TABLE IF NOT EXISTS public.recruit_applications (
  id                  uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  type                text NOT NULL DEFAULT 'cast',
  name                text NOT NULL,
  age                 integer,
  phone               text NOT NULL,
  email               text,
  line_id             text,
  experience          text,
  schedule            text,
  message             text,
  status              text DEFAULT '未対応',
  is_read             boolean DEFAULT false,
  reply_text          text,
  replied_at          timestamptz,
  created_at          timestamptz NOT NULL DEFAULT now(),
  updated_at          timestamptz NOT NULL DEFAULT now()
);

-- contacts
CREATE TABLE IF NOT EXISTS public.contacts (
  id         uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  type       text NOT NULL DEFAULT 'contact',
  name       text NOT NULL,
  phone      text,
  contact_method text,
  line_id    text,
  date       date,
  time       time,
  people     integer,
  cast_name  text,
  message    text NOT NULL,
  is_read    boolean DEFAULT false,
  reply_text text,
  replied_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

-- contents
CREATE TABLE IF NOT EXISTS public.contents (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  type text NOT NULL CHECK (type IN ('event', 'news', 'gallery')),
  title text,
  description text,
  image_url text,
  content_date date,
  category text,
  sort_order integer DEFAULT 0,
  is_published boolean DEFAULT true,
  created_at timestamp with time zone DEFAULT now()
);

-- hero_media
CREATE TABLE IF NOT EXISTS public.hero_media (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  type text CHECK (type IN ('video', 'image')),
  title text,
  url text NOT NULL,
  poster_url text,
  sort_order integer DEFAULT 0,
  is_active boolean DEFAULT true,
  created_at timestamp with time zone DEFAULT now()
);

-- site_settings
CREATE TABLE IF NOT EXISTS public.site_settings (
  id integer PRIMARY KEY DEFAULT 1,
  today_mood text,
  vip_availability text,
  hero_transition_mode text DEFAULT 'fade',
  hero_duration_ms integer DEFAULT 3000,
  hero_transition_ms integer DEFAULT 700,
  updated_at timestamp with time zone DEFAULT now()
);

-- audit_logs
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

-- gallery_assets (To satisfy RLS queries below, if used)
CREATE TABLE IF NOT EXISTS public.gallery_assets (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  image_url   text NOT NULL,
  title       text,
  sort_order  integer NOT NULL DEFAULT 0,
  is_published boolean NOT NULL DEFAULT true,
  created_at  timestamptz NOT NULL DEFAULT now()
);

-- ─────────────────────────────────────────────────────────────
-- 2. INITIAL DATA
-- ─────────────────────────────────────────────────────────────
INSERT INTO public.site_settings (id, today_mood, vip_availability, hero_transition_mode) 
VALUES (1, '本日も皆様のご来店をお待ちしております', '空きあり', 'fade')
ON CONFLICT (id) DO NOTHING;

INSERT INTO public.cast_tags (name, slug, sort_order) VALUES
  ('清楚', 'seiso', 1),
  ('大人', 'adult', 2),
  ('可愛い', 'kawaii', 3),
  ('落ち着き', 'calm', 4),
  ('華やか', 'gorgeous', 5),
  ('会話好き', 'talkative', 6)
ON CONFLICT (slug) DO NOTHING;

INSERT INTO public.recruit_pages (page_type, title, is_published)
  VALUES ('cast', 'キャスト募集', true), ('staff', 'スタッフ募集', true)
ON CONFLICT (page_type) DO NOTHING;

-- ─────────────────────────────────────────────────────────────
-- 3. INDEXES
-- ─────────────────────────────────────────────────────────────
CREATE UNIQUE INDEX IF NOT EXISTS idx_casts_slug         ON public.casts(slug);
CREATE INDEX IF NOT EXISTS idx_casts_is_active           ON public.casts(is_active);
CREATE INDEX IF NOT EXISTS idx_casts_display_order       ON public.casts(display_order);
CREATE INDEX IF NOT EXISTS idx_cast_images_cast_id       ON public.cast_images(cast_id);
CREATE INDEX IF NOT EXISTS idx_cast_schedules_work_date  ON public.cast_schedules(work_date);
CREATE INDEX IF NOT EXISTS idx_cast_schedules_cast_id    ON public.cast_schedules(cast_id);
CREATE UNIQUE INDEX IF NOT EXISTS idx_news_slug          ON public.news(slug);
CREATE INDEX IF NOT EXISTS idx_news_is_published         ON public.news(is_published);
CREATE INDEX IF NOT EXISTS idx_recruit_app_type          ON public.recruit_applications(type);
CREATE INDEX IF NOT EXISTS idx_recruit_app_status        ON public.recruit_applications(status);

-- ─────────────────────────────────────────────────────────────
-- 4. ROW LEVEL SECURITY (RLS)
-- ─────────────────────────────────────────────────────────────

-- 4.1. Public Readable Tables
DO $$
DECLARE tbl text;
BEGIN
  FOR tbl IN SELECT unnest(ARRAY[
    'casts','cast_images','cast_tags','cast_tag_relations',
    'cast_schedules','news','contents','gallery_assets','hero_media',
    'site_settings','recruit_pages'
  ]) LOOP
    EXECUTE format('ALTER TABLE public.%I ENABLE ROW LEVEL SECURITY', tbl);
    
    EXECUTE format('DROP POLICY IF EXISTS anon_select ON public.%I', tbl);
    EXECUTE format('CREATE POLICY anon_select ON public.%I FOR SELECT USING (true)', tbl);
    
    EXECUTE format('DROP POLICY IF EXISTS auth_all ON public.%I', tbl);
    EXECUTE format('CREATE POLICY auth_all ON public.%I TO authenticated USING (true) WITH CHECK (true)', tbl);
  END LOOP;
END $$;

-- 4.2. Append-Only / Private Tables (Applications, Inquiries)
DO $$
DECLARE tbl text;
BEGIN
  FOR tbl IN SELECT unnest(ARRAY['recruit_applications','contacts']) LOOP
    EXECUTE format('ALTER TABLE public.%I ENABLE ROW LEVEL SECURITY', tbl);
    
    EXECUTE format('DROP POLICY IF EXISTS anon_insert ON public.%I', tbl);
    EXECUTE format('CREATE POLICY anon_insert ON public.%I FOR INSERT WITH CHECK (true)', tbl);
    
    EXECUTE format('DROP POLICY IF EXISTS auth_all ON public.%I', tbl);
    EXECUTE format('CREATE POLICY auth_all ON public.%I TO authenticated USING (true) WITH CHECK (true)', tbl);
  END LOOP;
END $$;

-- 4.3. Admin Only Tables (Audit Logs)
ALTER TABLE public.audit_logs ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS auth_all ON public.audit_logs;
CREATE POLICY auth_all ON public.audit_logs TO authenticated USING (true) WITH CHECK (true);

-- ─────────────────────────────────────────────────────────────
-- 5. STORAGE BUCKET & RLS
-- ─────────────────────────────────────────────────────────────

-- 5.1 Create 'images' bucket
INSERT INTO storage.buckets (id, name, public)
VALUES ('images', 'images', true)
ON CONFLICT (id) DO NOTHING;

-- 5.2 Storage Security Policies
CREATE POLICY "Public Access to specific image folders" ON storage.objects FOR SELECT
USING (bucket_id = 'images' AND ((storage.foldername(name))[1] IN ('casts', 'gallery', 'events', 'hero', 'recruit')));

CREATE POLICY "Admins can upload images" ON storage.objects FOR INSERT TO authenticated WITH CHECK (bucket_id = 'images');
CREATE POLICY "Admins can update images" ON storage.objects FOR UPDATE TO authenticated USING (bucket_id = 'images') WITH CHECK (bucket_id = 'images');
CREATE POLICY "Admins can delete images" ON storage.objects FOR DELETE TO authenticated USING (bucket_id = 'images');
