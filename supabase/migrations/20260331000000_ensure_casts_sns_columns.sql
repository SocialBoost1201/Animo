-- Ensure SNS columns exist on casts for environments that missed prior migration
ALTER TABLE public.casts
ADD COLUMN IF NOT EXISTS sns_x TEXT,
ADD COLUMN IF NOT EXISTS sns_instagram TEXT,
ADD COLUMN IF NOT EXISTS sns_tiktok TEXT;

COMMENT ON COLUMN public.casts.sns_x IS 'X (Twitter) のユーザーIDまたはURL';
COMMENT ON COLUMN public.casts.sns_instagram IS 'Instagram のユーザーIDまたはURL';
COMMENT ON COLUMN public.casts.sns_tiktok IS 'TikTok のユーザーIDまたはURL';
