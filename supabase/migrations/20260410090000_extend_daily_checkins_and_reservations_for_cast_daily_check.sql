-- Extend today's check-in + reservations schema to support:
-- - Attendance status (work / douhan / off)
-- - Fixed 5-row visit-entry input linked to a single daily checkin

-- 1) daily_checkins: attendance_status
ALTER TABLE public.daily_checkins
ADD COLUMN IF NOT EXISTS attendance_status text NOT NULL DEFAULT 'work'
CHECK (attendance_status IN ('work', 'douhan', 'off'));

COMMENT ON COLUMN public.daily_checkins.attendance_status IS '出勤確認ステータス: work(出勤) / douhan(同伴) / off(休み)';

-- 2) daily_reservations: link to daily_checkins + fixed row ordering (1..5)
ALTER TABLE public.daily_reservations
ADD COLUMN IF NOT EXISTS daily_check_id uuid REFERENCES public.daily_checkins(id) ON DELETE CASCADE;

ALTER TABLE public.daily_reservations
ADD COLUMN IF NOT EXISTS sort_order integer
CHECK (sort_order IS NULL OR (sort_order >= 1 AND sort_order <= 5));

COMMENT ON COLUMN public.daily_reservations.daily_check_id IS '紐づく当日確認(daily_checkins)ID';
COMMENT ON COLUMN public.daily_reservations.sort_order IS '固定入力行の順番(1..5)';

-- 3) Uniqueness to allow safe upsert by row index
ALTER TABLE public.daily_reservations
ADD CONSTRAINT IF NOT EXISTS daily_reservations_unique_daily_check_row UNIQUE (daily_check_id, sort_order);

-- 4) Helpful index
CREATE INDEX IF NOT EXISTS idx_daily_reservations_daily_check_id ON public.daily_reservations(daily_check_id);

