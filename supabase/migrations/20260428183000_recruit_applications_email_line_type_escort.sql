-- Align recruit_applications with public forms: email/line_id columns and escort type (staff/escort tabs).
-- Before: type CHECK (cast, staff) rejected escort; INSERT for email/line_id failed on older DBs without columns.

ALTER TABLE public.recruit_applications
  ADD COLUMN IF NOT EXISTS email text,
  ADD COLUMN IF NOT EXISTS line_id text;

-- Drop the legacy CHECK on column `type` only (constraint name varies by instance).
DO $$
DECLARE
  r record;
  def text;
BEGIN
  FOR r IN
    SELECT c.conname, pg_get_constraintdef(c.oid) AS def
    FROM pg_constraint c
    JOIN pg_class t ON c.conrelid = t.oid
    WHERE t.relname = 'recruit_applications'
      AND t.relnamespace = (SELECT oid FROM pg_namespace WHERE nspname = 'public')
      AND c.contype = 'c'
  LOOP
    def := r.def;
    -- column `type` only: IN(...) or = ANY(ARRAY[...]) from PG dumps
    IF def ~* 'type\s*IN' OR def ~* 'type\s*=\s*ANY' THEN
      EXECUTE format('ALTER TABLE public.recruit_applications DROP CONSTRAINT %I', r.conname);
    END IF;
  END LOOP;
END;
$$;

ALTER TABLE public.recruit_applications
  ADD CONSTRAINT recruit_applications_type_check
  CHECK (type = ANY (ARRAY['cast', 'staff', 'escort']::text[]));

COMMENT ON COLUMN public.recruit_applications.email IS 'Optional; form field from recruit LP';
COMMENT ON COLUMN public.recruit_applications.line_id IS 'Optional; form field from recruit LP';
