-- 【Phase 10: キャスト・スコア（モチベーション評価）機能の構築】

-- 1. cast_scores テーブルの作成（現在の合計スコアとレベル）
CREATE TABLE public.cast_scores (
  cast_id uuid NOT NULL,
  total_score integer NOT NULL DEFAULT 0,
  current_level integer NOT NULL DEFAULT 1,
  updated_at timestamp with time zone NOT NULL DEFAULT timezone('utc'::text, now()),
  
  CONSTRAINT cast_scores_pkey PRIMARY KEY (cast_id),
  CONSTRAINT cast_scores_cast_id_fkey FOREIGN KEY (cast_id) REFERENCES casts(id) ON DELETE CASCADE
);

-- RLSポリシー（cast_scores）
ALTER TABLE public.cast_scores ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Casts can view their own score"
  ON public.cast_scores
  FOR SELECT
  TO authenticated
  USING (cast_id = (SELECT id FROM casts WHERE auth_user_id = auth.uid()));

CREATE POLICY "Admins have full access to cast scores"
  ON public.cast_scores
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.user_roles
      WHERE user_roles.user_id = auth.uid()
      AND user_roles.role IN ('owner', 'manager', 'staff')
    )
  );

-- 2. cast_score_logs テーブルの作成（スコアの増減履歴）
CREATE TABLE public.cast_score_logs (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  cast_id uuid NOT NULL,
  action_type text NOT NULL, -- 'shift_submitted_on_time', 'blog_posted', 'blog_pv_milestone' etc.
  points_delta integer NOT NULL, -- 増減したスコア（+10, -5 など）
  description text, -- 「ブログを投稿しました」「期限前にシフトを提出しました」など
  created_at timestamp with time zone NOT NULL DEFAULT timezone('utc'::text, now()),
  
  CONSTRAINT cast_score_logs_pkey PRIMARY KEY (id),
  CONSTRAINT cast_score_logs_cast_id_fkey FOREIGN KEY (cast_id) REFERENCES casts(id) ON DELETE CASCADE
);

-- RLSポリシー（cast_score_logs）
ALTER TABLE public.cast_score_logs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Casts can view their own score logs"
  ON public.cast_score_logs
  FOR SELECT
  TO authenticated
  USING (cast_id = (SELECT id FROM casts WHERE auth_user_id = auth.uid()));

CREATE POLICY "Admins have full access to cast score logs"
  ON public.cast_score_logs
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.user_roles
      WHERE user_roles.user_id = auth.uid()
      AND user_roles.role IN ('owner', 'manager', 'staff')
    )
  );

-- cast_scoresの更新日時用トリガー関数（存在しなければ作成）
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- cast_scoresの更新日時用トリガー
CREATE TRIGGER update_cast_scores_updated_at
  BEFORE UPDATE ON public.cast_scores
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();
