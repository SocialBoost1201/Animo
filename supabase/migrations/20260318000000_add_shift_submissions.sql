-- ==========================================
-- キャストシフト提出・管理システム (Shift Submissions)
-- ==========================================

-- 1. テーブル作成
CREATE TABLE IF NOT EXISTS public.shift_submissions (
    id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
    cast_id uuid REFERENCES public.casts(id) ON DELETE CASCADE,
    target_week_monday date NOT NULL, -- 対象週の月曜日
    status text NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
    shifts_data jsonb NOT NULL, -- { "YYYY-MM-DD": { "type": "work"|"off", "start": "21:00", "end": "LAST" }, ... }
    submitted_at timestamptz DEFAULT now(),
    updated_at timestamptz DEFAULT now(),
    
    -- 同一キャストが同じ週に複数回提出（新規レコード作成）するのを防ぐ
    -- ※再提出時はこのレコードの shifts_data 等を UPDATE する
    UNIQUE(cast_id, target_week_monday)
);

-- インデックス
CREATE INDEX IF NOT EXISTS idx_shift_submissions_cast_id ON public.shift_submissions(cast_id);
CREATE INDEX IF NOT EXISTS idx_shift_submissions_target_weekON ON public.shift_submissions(target_week_monday);
CREATE INDEX IF NOT EXISTS idx_shift_submissions_status ON public.shift_submissions(status);

-- 更新日時トリガーのための関数（既存の update_updated_at_column がなければ作成）
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_shift_submissions_updated_at
    BEFORE UPDATE ON public.shift_submissions
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();


-- ==========================================
-- 2. RLS (Row Level Security) レベル設定
-- ==========================================

ALTER TABLE public.shift_submissions ENABLE ROW LEVEL SECURITY;

-- 2.1 キャスト本人用ポリシー
-- a. 自分の提出したシフトだけを見ることができる
CREATE POLICY "cast_select_own_submissions" ON public.shift_submissions
    FOR SELECT
    TO authenticated
    USING (
        EXISTS (
            SELECT 1 FROM public.casts
            WHERE casts.id = shift_submissions.cast_id
            AND casts.auth_user_id = auth.uid()
        )
    );

-- b. 自分のシフトを提出（INSERT）できる
CREATE POLICY "cast_insert_own_submissions" ON public.shift_submissions
    FOR INSERT
    TO authenticated
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM public.casts
            WHERE casts.id = shift_submissions.cast_id
            AND casts.auth_user_id = auth.uid()
        )
    );

-- c. 自分のシフトを修正（UPDATE）できる
CREATE POLICY "cast_update_own_submissions" ON public.shift_submissions
    FOR UPDATE
    TO authenticated
    USING (
        EXISTS (
            SELECT 1 FROM public.casts
            WHERE casts.id = shift_submissions.cast_id
            AND casts.auth_user_id = auth.uid()
        )
    );

-- 2.2 管理者用ポリシー (Admin)
-- Auth(staff以上)であれば全ての操作が可能
CREATE POLICY "Admins can full access shift_submissions" ON public.shift_submissions
    TO authenticated
    USING (
        EXISTS (
            SELECT 1 FROM public.user_roles
            WHERE user_roles.user_id = auth.uid()
            AND user_roles.role IN ('owner', 'manager', 'staff')
        )
    )
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM public.user_roles
            WHERE user_roles.user_id = auth.uid()
            AND user_roles.role IN ('owner', 'manager', 'staff')
        )
    );
