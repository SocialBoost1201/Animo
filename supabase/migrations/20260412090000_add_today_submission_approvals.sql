ALTER TABLE public.daily_checkins
  ADD COLUMN IF NOT EXISTS approval_status text NOT NULL DEFAULT 'pending'
    CHECK (approval_status IN ('pending', 'approved', 'rejected')),
  ADD COLUMN IF NOT EXISTS approved_at timestamptz,
  ADD COLUMN IF NOT EXISTS approved_by uuid REFERENCES auth.users(id) ON DELETE SET NULL;

ALTER TABLE public.daily_reservations
  ADD COLUMN IF NOT EXISTS approval_status text NOT NULL DEFAULT 'pending'
    CHECK (approval_status IN ('pending', 'approved', 'rejected')),
  ADD COLUMN IF NOT EXISTS approved_at timestamptz,
  ADD COLUMN IF NOT EXISTS approved_by uuid REFERENCES auth.users(id) ON DELETE SET NULL;

UPDATE public.daily_checkins
SET approval_status = 'approved'
WHERE approval_status IS DISTINCT FROM 'approved';

UPDATE public.daily_reservations
SET approval_status = 'approved'
WHERE approval_status IS DISTINCT FROM 'approved';

COMMENT ON COLUMN public.daily_checkins.approval_status IS 'pending | approved | rejected';
COMMENT ON COLUMN public.daily_reservations.approval_status IS 'pending | approved | rejected';

CREATE INDEX IF NOT EXISTS idx_daily_checkins_approval_status
  ON public.daily_checkins(checkin_date, approval_status);

CREATE INDEX IF NOT EXISTS idx_daily_reservations_approval_status
  ON public.daily_reservations(reservation_date, approval_status);
