-- 【Phase 10: キャストスコアの月次管理化SQL】
-- 既存のcast_scoresテーブルに target_month カラムを追加して複合主キーに変更する

-- 1. まず既存の主キー制約を削除
ALTER TABLE public.cast_scores DROP CONSTRAINT IF EXISTS cast_scores_pkey;

-- 2. target_month カラムを追加 (例: '2026-03')
-- 既存レコードには現在の月をセット
ALTER TABLE public.cast_scores ADD COLUMN IF NOT EXISTS target_month text NOT NULL DEFAULT to_char(now(), 'YYYY-MM');

-- 3. cast_id と target_month の複合主キーを設定
ALTER TABLE public.cast_scores ADD CONSTRAINT cast_scores_pkey PRIMARY KEY (cast_id, target_month);

-- 4. ログテーブルにも target_month カラムを追加し、どの月のスコア増減か分かるようにする
ALTER TABLE public.cast_score_logs ADD COLUMN IF NOT EXISTS target_month text NOT NULL DEFAULT to_char(now(), 'YYYY-MM');
