-- キャスト個人情報（本名・生年月日）の分離テーブル
-- 公開APIや一般スタッフには絶対にアクセスさせない
CREATE TABLE IF NOT EXISTS public.cast_private_info (
  cast_id    uuid PRIMARY KEY REFERENCES public.casts(id) ON DELETE CASCADE,
  real_name  text NOT NULL,
  date_of_birth date NOT NULL,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now()
);

-- RLS 有効化
ALTER TABLE public.cast_private_info ENABLE ROW LEVEL SECURITY;

-- ポリシー: 匿名・一般公開では一切取得不可（デフォルト拒否）
-- ポリシー: 認証済みユーザー（管理者）のみフルアクセス
CREATE POLICY "Admins can full access cast_private_info"
  ON public.cast_private_info
  TO authenticated
  USING (auth.uid() IS NOT NULL)
  WITH CHECK (auth.uid() IS NOT NULL);

-- updated_at 自動更新トリガー
CREATE OR REPLACE FUNCTION update_cast_private_info_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_cast_private_info_updated_at
  BEFORE UPDATE ON public.cast_private_info
  FOR EACH ROW
  EXECUTE FUNCTION update_cast_private_info_updated_at();
