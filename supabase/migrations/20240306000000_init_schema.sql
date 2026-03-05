-- Extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. Table Creations

-- casts
CREATE TABLE IF NOT EXISTS public.casts (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  name text NOT NULL,
  slug text UNIQUE NOT NULL,
  age integer,
  height integer,
  hobby text,
  comment text,
  image_url text,
  tags text[],
  status text DEFAULT 'public' CHECK (status IN ('public', 'private')),
  is_today boolean DEFAULT false,
  joined_at timestamp with time zone,
  created_at timestamp with time zone DEFAULT now()
);

-- shifts
CREATE TABLE IF NOT EXISTS public.shifts (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  cast_id uuid REFERENCES public.casts(id) ON DELETE CASCADE,
  date date NOT NULL,
  start_time time,
  end_time time,
  created_at timestamp with time zone DEFAULT now()
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

-- recruit_applications
CREATE TABLE IF NOT EXISTS public.recruit_applications (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  type text NOT NULL CHECK (type IN ('cast', 'staff')),
  name text NOT NULL,
  age integer,
  phone text NOT NULL,
  experience text,
  schedule text,
  message text,
  is_read boolean DEFAULT false,
  created_at timestamp with time zone DEFAULT now()
);

-- contacts
CREATE TABLE IF NOT EXISTS public.contacts (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  type text NOT NULL CHECK (type IN ('reserve', 'contact')),
  name text NOT NULL,
  date date,
  time time,
  people integer,
  first_visit boolean,
  purpose text,
  cast_name text,
  contact_method text,
  message text,
  is_read boolean DEFAULT false,
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

-- Insert default site settings
INSERT INTO public.site_settings (id, today_mood, vip_availability, hero_transition_mode) 
VALUES (1, '本日も皆様のご来店をお待ちしております', '空きあり', 'fade')
ON CONFLICT (id) DO NOTHING;

-- 2. Row Level Security Setup

-- Enable RLS
ALTER TABLE public.casts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.shifts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.contents ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.recruit_applications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.contacts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.hero_media ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.site_settings ENABLE ROW LEVEL SECURITY;

-- 2.1 Public Data Policies (casts, shifts, contents, hero_media, site_settings)
-- Everyone can read
CREATE POLICY "Public profiles are viewable by everyone" ON public.casts FOR SELECT USING (status = 'public');
CREATE POLICY "Shifts are viewable by everyone" ON public.shifts FOR SELECT USING (true);
CREATE POLICY "Published contents are viewable by everyone" ON public.contents FOR SELECT USING (is_published = true);
CREATE POLICY "Active hero media viewable by everyone" ON public.hero_media FOR SELECT USING (is_active = true);
CREATE POLICY "Site settings are viewable by everyone" ON public.site_settings FOR SELECT USING (true);

-- Authenticated (Admin) can insert/update/delete public data
CREATE POLICY "Admins can full access casts" ON public.casts TO authenticated USING (auth.uid() IS NOT NULL) WITH CHECK (auth.uid() IS NOT NULL);
CREATE POLICY "Admins can full access shifts" ON public.shifts TO authenticated USING (auth.uid() IS NOT NULL) WITH CHECK (auth.uid() IS NOT NULL);
CREATE POLICY "Admins can full access contents" ON public.contents TO authenticated USING (auth.uid() IS NOT NULL) WITH CHECK (auth.uid() IS NOT NULL);
CREATE POLICY "Admins can full access hero media" ON public.hero_media TO authenticated USING (auth.uid() IS NOT NULL) WITH CHECK (auth.uid() IS NOT NULL);
CREATE POLICY "Admins can full access site settings" ON public.site_settings TO authenticated USING (auth.uid() IS NOT NULL) WITH CHECK (auth.uid() IS NOT NULL);

-- 2.2 Private Data Policies (recruit_applications, contacts)
-- Anyone can insert
CREATE POLICY "Anyone can submit applications" ON public.recruit_applications FOR INSERT WITH CHECK (true);
CREATE POLICY "Anyone can submit contacts" ON public.contacts FOR INSERT WITH CHECK (true);

-- Only authenticated users (Admins) can view/update/delete
CREATE POLICY "Admins can full access applications" ON public.recruit_applications TO authenticated USING (auth.uid() IS NOT NULL) WITH CHECK (auth.uid() IS NOT NULL);
CREATE POLICY "Admins can full access contacts" ON public.contacts TO authenticated USING (auth.uid() IS NOT NULL) WITH CHECK (auth.uid() IS NOT NULL);
