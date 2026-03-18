-- ==========================================
-- ブログ機能のSEO分析（PVトラッキング等）
-- ==========================================

-- 1. cast_posts テーブルに閲覧数カラムを追加
ALTER TABLE public.cast_posts 
ADD COLUMN IF NOT EXISTS view_count integer DEFAULT 0 NOT NULL;

-- 2. 個別の閲覧履歴を管理するテーブル (重複カウント防止用)
CREATE TABLE IF NOT EXISTS public.post_views (
    id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
    post_id uuid NOT NULL REFERENCES public.cast_posts(id) ON DELETE CASCADE,
    viewer_ip text, -- セッションIDやIPハッシュなどを想定
    viewer_user_agent text,
    created_at timestamptz DEFAULT now() NOT NULL
);

-- インデックス
CREATE INDEX IF NOT EXISTS idx_post_views_post_id ON public.post_views(post_id);
CREATE INDEX IF NOT EXISTS idx_post_views_created_at ON public.post_views(created_at);
-- 1時間以内の同一IP/セッションからの重複PVを防ぐための複合インデックス
CREATE INDEX IF NOT EXISTS idx_post_views_viewer_lookup 
ON public.post_views(post_id, viewer_ip, created_at);

-- 3. RLS設定
ALTER TABLE public.post_views ENABLE ROW LEVEL SECURITY;

-- 3.1 誰でも閲覧履歴を記録(INSERT)できる（APIからの呼び出しを想定）
CREATE POLICY "Anyone can insert post views" ON public.post_views
    FOR INSERT 
    WITH CHECK (true);

-- 3.2 管理者はすべての閲覧履歴を参照できる
CREATE POLICY "Admins can view all post views" ON public.post_views
    FOR SELECT
    TO authenticated
    USING (
        EXISTS (
            SELECT 1 FROM public.user_roles
            WHERE user_roles.user_id = auth.uid()
            AND user_roles.role IN ('owner', 'manager', 'staff')
        )
    );

-- 4. RPC (Remote Procedure Call) - PVを安全にインクリメントする関数
-- クライアント/APIから直接 view_count を +1 するためのセキュアなストアドプロシージャ
CREATE OR REPLACE FUNCTION increment_post_view_count(target_post_id uuid, viewer_ip_hash text, user_agent_text text)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER -- RLSをバイパスして安全に実行
AS $$
DECLARE
    recent_view_count integer;
BEGIN
    -- 同一IP/セッションからの過去1時間以内の閲覧があるかチェック（簡易的な連打スパム防止）
    SELECT COUNT(*) INTO recent_view_count
    FROM public.post_views
    WHERE post_id = target_post_id
    AND viewer_ip = viewer_ip_hash
    AND created_at > now() - interval '1 hour';

    IF recent_view_count = 0 THEN
        -- 履歴テーブルに記録
        INSERT INTO public.post_views (post_id, viewer_ip, viewer_user_agent)
        VALUES (target_post_id, viewer_ip_hash, user_agent_text);

        -- cast_postsの合計閲覧数を更新
        UPDATE public.cast_posts
        SET view_count = view_count + 1
        WHERE id = target_post_id;
        
        RETURN true;
    END IF;

    RETURN false;
END;
$$;
