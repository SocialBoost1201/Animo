ALTER TABLE public.casts
  ADD COLUMN IF NOT EXISTS last_sms_verified_at timestamptz,
  ADD COLUMN IF NOT EXISTS last_login_at timestamptz;
