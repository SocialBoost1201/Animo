ALTER TABLE public.daily_reservations
ADD COLUMN IF NOT EXISTS guest_count integer
CHECK (guest_count IS NULL OR guest_count > 0);

COMMENT ON COLUMN public.daily_reservations.guest_count IS '来店予定の人数';
