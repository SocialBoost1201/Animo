-- Extend staffs and today attendance schema for staff management
ALTER TABLE public.staffs
  ADD COLUMN IF NOT EXISTS name_kana text,
  ADD COLUMN IF NOT EXISTS birth_date date,
  ADD COLUMN IF NOT EXISTS mobile_phone text,
  ADD COLUMN IF NOT EXISTS auth_user_id uuid REFERENCES auth.users(id) ON DELETE SET NULL;

CREATE TABLE IF NOT EXISTS public.staff_cast_assignments (
  staff_id uuid NOT NULL REFERENCES public.staffs(id) ON DELETE CASCADE,
  cast_id uuid NOT NULL REFERENCES public.casts(id) ON DELETE CASCADE,
  created_at timestamptz NOT NULL DEFAULT now(),
  PRIMARY KEY (staff_id, cast_id)
);

CREATE INDEX IF NOT EXISTS idx_staff_cast_assignments_cast_id
  ON public.staff_cast_assignments (cast_id);

ALTER TABLE public.staff_cast_assignments ENABLE ROW LEVEL SECURITY;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1
    FROM pg_policies
    WHERE schemaname = 'public'
      AND tablename = 'staff_cast_assignments'
      AND policyname = 'Admins can full access staff_cast_assignments'
  ) THEN
    EXECUTE $policy$
      CREATE POLICY "Admins can full access staff_cast_assignments"
        ON public.staff_cast_assignments TO authenticated
        USING (
          EXISTS (
            SELECT 1 FROM public.user_roles
            WHERE user_roles.user_id = auth.uid()
              AND user_roles.role IN ('owner', 'manager', 'staff')
          )
        )
        WITH CHECK (
          EXISTS (
            SELECT 1 FROM public.user_roles
            WHERE user_roles.user_id = auth.uid()
              AND user_roles.role IN ('owner', 'manager', 'staff')
          )
        )
    $policy$;
  END IF;
END
$$;

ALTER TABLE public.daily_staff_attendances
  ADD COLUMN IF NOT EXISTS end_time time;
