-- ============================================================
-- profiles テーブル追加マイグレーション
-- auth.users と casts / staff を紐付けるための橋渡しテーブル
--
-- 実行環境: Supabase SQL Editor
-- 実行順序: このファイルを1度だけ実行する
-- ============================================================

-- ─────────────────────────────────────────────────────────────
-- STEP 1: profiles テーブル作成
-- ─────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.profiles (
  -- auth.users.id と 1:1 で紐付く（ユーザー削除時に自動削除）
  id          uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,

  -- ロール: admin（管理者） / cast（キャスト） / staff（スタッフ）
  role        text NOT NULL DEFAULT 'cast'
              CHECK (role IN ('admin', 'cast', 'staff')),

  -- キャストの場合、casts テーブルのレコードと紐付ける
  -- スタッフ・管理者の場合は NULL
  cast_id     uuid REFERENCES public.casts(id) ON DELETE SET NULL,

  -- 表示名（任意。未設定の場合はメールアドレスで代替）
  display_name text,

  -- メモ（どのテスト用アカウントか等の管理用メモ）
  note        text,

  created_at  timestamptz NOT NULL DEFAULT now(),
  updated_at  timestamptz NOT NULL DEFAULT now()
);

-- インデックス
CREATE INDEX IF NOT EXISTS idx_profiles_role    ON public.profiles(role);
CREATE INDEX IF NOT EXISTS idx_profiles_cast_id ON public.profiles(cast_id);

-- ─────────────────────────────────────────────────────────────
-- STEP 2: 新規ユーザー登録時に profiles を自動生成するトリガー
-- ─────────────────────────────────────────────────────────────
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, role, display_name)
  VALUES (
    NEW.id,
    'cast',               -- デフォルトはキャストとして登録（後から管理画面で変更）
    NEW.email             -- 初期表示名はメールアドレス
  )
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END;
$$;

-- 既存トリガーがあれば削除して再作成
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- ─────────────────────────────────────────────────────────────
-- STEP 3: RLS 設定
-- ─────────────────────────────────────────────────────────────
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- 自分自身のプロフィールは参照可能
DROP POLICY IF EXISTS "profiles_select_own" ON public.profiles;
CREATE POLICY "profiles_select_own"
  ON public.profiles FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

-- 管理者は全件参照可能
DROP POLICY IF EXISTS "profiles_select_admin" ON public.profiles;
CREATE POLICY "profiles_select_admin"
  ON public.profiles FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles p
      WHERE p.id = auth.uid() AND p.role = 'admin'
    )
  );

-- 管理者は全件更新可能
DROP POLICY IF EXISTS "profiles_update_admin" ON public.profiles;
CREATE POLICY "profiles_update_admin"
  ON public.profiles FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles p
      WHERE p.id = auth.uid() AND p.role = 'admin'
    )
  );

-- ─────────────────────────────────────────────────────────────
-- STEP 4: 既存ユーザーの profiles を手動で初期登録
-- ※ auth.users に既に存在するユーザーはトリガーが遡及しないため
--   以下を手動で設定してください。
--
-- 【確認方法】
--   Supabase Dashboard > Authentication > Users で
--   各ユーザーの User UID をコピーしてください。
-- ─────────────────────────────────────────────────────────────

-- ① まず全既存ユーザーを cast として一括登録（上書きなし）
INSERT INTO public.profiles (id, role, display_name, note)
SELECT
  id,
  'cast',
  email,
  '既存ユーザー自動登録 - ロールは手動で修正が必要'
FROM auth.users
ON CONFLICT (id) DO NOTHING;

-- ─────────────────────────────────────────────────────────────
-- STEP 5: 各ユーザーのロールを正しく設定
--
-- 【手順】
--   1. Supabase Dashboard > Authentication > Users を開く
--   2. 各メールアドレスの User UID をコピー
--   3. 下記の UPDATE 文の '<UID>' を実際の UID に置き換えて実行
-- ─────────────────────────────────────────────────────────────

-- 管理者アカウント (animo4266@gmail.com)
-- UPDATE public.profiles
-- SET role = 'admin', display_name = '管理者', note = 'メインアドミン'
-- WHERE id = '<animo4266@gmail.com の UID>';

-- 管理者アカウント (takumat2010309@gmail.com)
-- UPDATE public.profiles
-- SET role = 'admin', display_name = '管理者（竹松）', note = 'メインアドミン'
-- WHERE id = '<takumat2010309@gmail.com の UID>';

-- キャスト: info@socialboost.jp → はるか or えりか (テスト)
-- UPDATE public.profiles
-- SET role = 'cast', display_name = 'はるか（テスト）', note = 'テストアカウント: はるかまたはえりか'
-- WHERE id = '<info@socialboost.jp の UID>';

-- キャスト: aika.smoke... (テスト)
-- UPDATE public.profiles
-- SET role = 'cast', display_name = 'あいか（テスト）', note = 'テストキャストアカウント'
-- WHERE id = '<aika.smoke... の UID>';

-- キャスト: gptmaster@gmail.com (テスト)
-- UPDATE public.profiles
-- SET role = 'cast', display_name = 'テストキャスト', note = 'GPT検証用テストアカウント'
-- WHERE id = '<gptmaster@gmail.com の UID>';

-- キャスト: maria.cast.test... (テスト)
-- UPDATE public.profiles
-- SET role = 'cast', display_name = 'まりあ（テスト）', note = 'テストキャストアカウント'
-- WHERE id = '<maria.cast.test... の UID>';

-- スタッフ: smoke-admin... (テスト)
-- UPDATE public.profiles
-- SET role = 'staff', display_name = 'スタッフ（テスト）', note = 'smoke-admin テストアカウント'
-- WHERE id = '<smoke-admin... の UID>';

-- ─────────────────────────────────────────────────────────────
-- STEP 6: casts テーブルと紐付け（キャストのみ）
--
-- キャストロールのプロフィールに cast_id を設定する。
-- casts テーブルから該当キャストの id を確認し、
-- cast_id カラムを更新する。
--
-- 【確認クエリ】
--   SELECT id, stage_name, slug FROM public.casts;
-- ─────────────────────────────────────────────────────────────

-- 例: あいかのキャストレコードと紐付け
-- UPDATE public.profiles
-- SET cast_id = '<casts テーブルのあいかの id>'
-- WHERE id = '<aika.smoke... の auth UID>';

-- ─────────────────────────────────────────────────────────────
-- STEP 7: 確認クエリ（実行後にこれで状態を確認する）
-- ─────────────────────────────────────────────────────────────

-- 全ユーザーの紐付け状況一覧
-- SELECT
--   u.email,
--   p.role,
--   p.display_name,
--   c.stage_name AS cast_name,
--   p.note,
--   p.id AS auth_uid
-- FROM auth.users u
-- LEFT JOIN public.profiles p ON p.id = u.id
-- LEFT JOIN public.casts c ON c.id = p.cast_id
-- ORDER BY p.role, u.email;
