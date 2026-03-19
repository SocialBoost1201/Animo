-- ==========================================
-- サイト全体の簡易アクセス解析
-- ==========================================

-- 1. アクセスログテーブル
CREATE TABLE IF NOT EXISTS public.site_analytics (
    id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
    path text NOT NULL,                    -- 閲覧ページパス (例: /cast/dashboard)
    referrer text,                         -- どこから来たか
    user_agent text,                       -- ブラウザ情報
    viewer_hash text NOT NULL,             -- 重複防止用の匿名ハッシュ (IP+UAのハッシュなど)
    created_at timestamptz DEFAULT now() NOT NULL
);

-- インデックス
CREATE INDEX IF NOT EXISTS idx_site_analytics_path ON public.site_analytics(path);
CREATE INDEX IF NOT EXISTS idx_site_analytics_created_at ON public.site_analytics(created_at);
CREATE INDEX IF NOT EXISTS idx_site_analytics_viewer_lookup 
ON public.site_analytics(path, viewer_hash, created_at);

-- 2. RLS設定
ALTER TABLE public.site_analytics ENABLE ROW LEVEL SECURITY;

-- 2.1 誰でも記録(INSERT)できる（サーバーアクション経由）
CREATE POLICY "Anyone can insert site analytics" ON public.site_analytics
    FOR INSERT 
    WITH CHECK (true);

-- 2.2 管理者はすべてのログを参照できる
CREATE POLICY "Admins can view site analytics" ON public.site_analytics
    FOR SELECT
    TO authenticated
    USING (
        EXISTS (
            SELECT 1 FROM public.user_roles
            WHERE user_roles.user_id = auth.uid()
            AND user_roles.role IN ('owner', 'manager', 'staff')
        )
    );

-- 3. 安全にPVを記録するためのRPC
-- 同一URL、同一ハッシュでの24時間以内の重複を避ける（またはインターバルを置く）
CREATE OR REPLACE FUNCTION log_site_access(
    p_path text, 
    p_referrer text, 
    p_user_agent text, 
    p_viewer_hash text
)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    recent_count integer;
BEGIN
    -- 同一ユーザー(hash)による同一ページの閲覧が直近12時間以内にあるかチェック
    -- (PVの精度とデータ量のバランスを見て12時間に設定)
    SELECT COUNT(*) INTO recent_count
    FROM public.site_analytics
    WHERE path = p_path
    AND viewer_hash = p_viewer_hash
    AND created_at > now() - interval '12 hours';

    IF recent_count = 0 THEN
        INSERT INTO public.site_analytics (path, referrer, user_agent, viewer_hash)
        VALUES (p_path, p_referrer, p_user_agent, p_viewer_hash);
        RETURN true;
    END IF;

    RETURN false;
END;
$$;
