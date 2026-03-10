-- Migration for RBAC (Role Based Access Control) and Profiles

-- 1. Create profiles table linked to auth.users
CREATE TABLE IF NOT EXISTS public.profiles (
  id uuid references auth.users on delete cascade primary key,
  role text not null check (role in ('owner', 'manager', 'staff')) default 'staff',
  display_name text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 2. Setup RLS
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- 誰でも(ログインユーザーは)プロファイル一覧を見れるようにする。
-- 実運用では、auth.uid(), auth.role() などを判定しますが、今回は全スタッフが互いの存在を見れる仕様とします。
CREATE POLICY "Profiles are viewable by authenticated users."
  ON public.profiles FOR SELECT
  TO authenticated
  USING ( true );

-- 更新は本人、もしくは上位の role (ownerなど) が行えるようにすべきですが、
-- マイグレーションとしては一旦本人および全管理者が操作できるようシンプルにします (後ほどの拡張用)。
CREATE POLICY "Profiles can be updated by owner or self."
  ON public.profiles FOR UPDATE
  TO authenticated
  USING ( auth.uid() = id OR (SELECT role FROM public.profiles WHERE id = auth.uid()) = 'owner' );

-- 新規プロファイルの作成（通常はトリガーで auth.users 登録時に自動作成するか、オーナーが作成）
CREATE POLICY "Profiles can be inserted by owner."
  ON public.profiles FOR INSERT
  TO authenticated
  WITH CHECK ( (SELECT role FROM public.profiles WHERE id = auth.uid()) = 'owner' OR auth.uid() = id );

CREATE POLICY "Profiles can be deleted by owner."
  ON public.profiles FOR DELETE
  TO authenticated
  USING ( (SELECT role FROM public.profiles WHERE id = auth.uid()) = 'owner' );

-- 3. (Optional) Trigger to create profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.profiles (id, role, display_name)
  VALUES (new.id, 'staff', new.email);
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Drop trigger if exists
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();

-- Enable realtime
ALTER PUBLICATION supabase_realtime ADD TABLE public.profiles;
