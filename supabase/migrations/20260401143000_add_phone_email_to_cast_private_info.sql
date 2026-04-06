ALTER TABLE public.cast_private_info
ADD COLUMN IF NOT EXISTS phone text,
ADD COLUMN IF NOT EXISTS email text;

COMMENT ON COLUMN public.cast_private_info.phone IS 'キャスト本人の連絡先電話番号（管理者専用）';
COMMENT ON COLUMN public.cast_private_info.email IS 'キャスト本人の連絡先メールアドレス（管理者専用）';
