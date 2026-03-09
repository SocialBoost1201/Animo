-- castsテーブルにフリガナ(name_kana)カラムを追加
ALTER TABLE public.casts ADD COLUMN IF NOT EXISTS name_kana text;

-- 既存のデータに対する簡易的な初期値設定 (任意ですがアプリケーションエラー防止のため)
UPDATE public.casts SET name_kana = name WHERE name_kana IS NULL;
