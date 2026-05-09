-- Fix: daily_cast_attendance.source CHECK constraint too restrictive
-- The approval flow writes 'checkin_approved' and 'checkin_rejected' as source values,
-- but the original constraint only allowed 'manual'. This migration extends the constraint.

ALTER TABLE public.daily_cast_attendance
  DROP CONSTRAINT IF EXISTS daily_cast_attendance_source_check;

ALTER TABLE public.daily_cast_attendance
  ADD CONSTRAINT daily_cast_attendance_source_check
    CHECK (source IN ('manual', 'checkin_approved', 'checkin_rejected'));
