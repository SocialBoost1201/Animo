-- Staff: split legal-style name, LINE contact; keep legacy `name` in sync in app
ALTER TABLE public.staffs
  ADD COLUMN IF NOT EXISTS family_name text,
  ADD COLUMN IF NOT EXISTS given_name text,
  ADD COLUMN IF NOT EXISTS line_id text;

-- Backfill 苗字/名前 from existing 氏名（先頭の空白で分割）
UPDATE public.staffs
SET
  family_name = NULLIF(
    btrim(split_part(btrim(COALESCE(name, '')), ' ', 1)),
    ''
  ),
  given_name = NULLIF(
    CASE
      WHEN strpos(btrim(COALESCE(name, '')), ' ') > 0
        THEN btrim(substr(btrim(name) from strpos(btrim(name), ' ') + 1))
      ELSE NULL
    END,
    ''
  )
WHERE family_name IS NULL
  AND given_name IS NULL
  AND name IS NOT NULL
  AND btrim(name) <> '';
