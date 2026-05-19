-- push_subscriptions テーブルに user_id カラムを追加して
-- Web Push 通知の送信先をユーザー単位で特定できるようにする
ALTER TABLE public.push_subscriptions
  ADD COLUMN IF NOT EXISTS user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE;

CREATE INDEX IF NOT EXISTS idx_push_subscriptions_user_id
  ON public.push_subscriptions(user_id);

-- RLS が未設定の場合は有効化
ALTER TABLE public.push_subscriptions ENABLE ROW LEVEL SECURITY;

-- 自分の購読のみ管理可能
DROP POLICY IF EXISTS "users_manage_own_push_subscription" ON public.push_subscriptions;
CREATE POLICY "users_manage_own_push_subscription"
  ON public.push_subscriptions
  FOR ALL
  TO authenticated
  USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());

-- サービスロールは全件参照可（通知送信用）
DROP POLICY IF EXISTS "service_read_push_subscriptions" ON public.push_subscriptions;
