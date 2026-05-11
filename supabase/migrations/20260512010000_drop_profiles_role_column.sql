-- Drop profiles.role column
-- profiles.role カラムに依存するRLSポリシーを先に削除してからカラムを削除する

DROP POLICY IF EXISTS "Profiles can be updated by owner or self." ON public.profiles;
DROP POLICY IF EXISTS "Profiles can be inserted by owner." ON public.profiles;
DROP POLICY IF EXISTS "Profiles can be deleted by owner." ON public.profiles;

ALTER TABLE profiles DROP COLUMN IF EXISTS role;
