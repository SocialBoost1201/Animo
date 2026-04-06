-- ================================================
-- shift_submissions テーブル作成 SQL
-- 実行先: Supabase ダッシュボード > SQL Editor
-- https://supabase.com/dashboard/project/nygsfetbfxngwfzbmryq/editor
-- ================================================

CREATE TABLE IF NOT EXISTS public.shift_submissions (
    id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
    cast_id uuid REFERENCES public.casts(id) ON DELETE CASCADE,
    target_week_monday date NOT NULL,
    status text NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
    shifts_data jsonb NOT NULL,
    submitted_at timestamptz DEFAULT now(),
    updated_at timestamptz DEFAULT now(),
    UNIQUE(cast_id, target_week_monday)
);

CREATE INDEX IF NOT EXISTS idx_shift_submissions_cast_id ON public.shift_submissions(cast_id);
CREATE INDEX IF NOT EXISTS idx_shift_submissions_target_week ON public.shift_submissions(target_week_monday);
CREATE INDEX IF NOT EXISTS idx_shift_submissions_status ON public.shift_submissions(status);

CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $func$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$func$ language 'plpgsql';

DROP TRIGGER IF EXISTS update_shift_submissions_updated_at ON public.shift_submissions;
CREATE TRIGGER update_shift_submissions_updated_at
    BEFORE UPDATE ON public.shift_submissions
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

ALTER TABLE public.shift_submissions ENABLE ROW LEVEL SECURITY;

-- キャスト: 自分の提出を閲覧
DROP POLICY IF EXISTS "cast_select_own_submissions" ON public.shift_submissions;
CREATE POLICY "cast_select_own_submissions" ON public.shift_submissions
    FOR SELECT TO authenticated
    USING (
        EXISTS (
            SELECT 1 FROM public.casts
            WHERE casts.id = shift_submissions.cast_id
            AND casts.auth_user_id = auth.uid()
        )
    );

-- キャスト: INSERT
DROP POLICY IF EXISTS "cast_insert_own_submissions" ON public.shift_submissions;
CREATE POLICY "cast_insert_own_submissions" ON public.shift_submissions
    FOR INSERT TO authenticated
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM public.casts
            WHERE casts.id = shift_submissions.cast_id
            AND casts.auth_user_id = auth.uid()
        )
    );

-- キャスト: UPDATE
DROP POLICY IF EXISTS "cast_update_own_submissions" ON public.shift_submissions;
CREATE POLICY "cast_update_own_submissions" ON public.shift_submissions
    FOR UPDATE TO authenticated
    USING (
        EXISTS (
            SELECT 1 FROM public.casts
            WHERE casts.id = shift_submissions.cast_id
            AND casts.auth_user_id = auth.uid()
        )
    );

-- 管理者: 全操作
DROP POLICY IF EXISTS "Admins can full access shift_submissions" ON public.shift_submissions;
CREATE POLICY "Admins can full access shift_submissions" ON public.shift_submissions
    FOR ALL TO authenticated
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

-- 実行確認クエリ（最後に実行して確認）
SELECT 'shift_submissions table ready' as status, count(*) as row_count FROM public.shift_submissions;
