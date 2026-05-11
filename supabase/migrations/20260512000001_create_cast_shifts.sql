-- cast_shifts: キャスト個別の日別シフト記録（管理者オーバーライドにも使用）
CREATE TABLE IF NOT EXISTS public.cast_shifts (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  cast_id     uuid NOT NULL REFERENCES public.casts(id) ON DELETE CASCADE,
  work_date   date NOT NULL,
  status      text NOT NULL CHECK (status IN ('available', 'unavailable', 'maybe')),
  start_time  time,
  is_douhan   boolean NOT NULL DEFAULT false,
  created_at  timestamptz NOT NULL DEFAULT now(),
  updated_at  timestamptz NOT NULL DEFAULT now(),
  UNIQUE (cast_id, work_date)
);

CREATE INDEX IF NOT EXISTS idx_cast_shifts_cast_id   ON public.cast_shifts(cast_id);
CREATE INDEX IF NOT EXISTS idx_cast_shifts_work_date ON public.cast_shifts(work_date);

ALTER TABLE public.cast_shifts ENABLE ROW LEVEL SECURITY;

-- キャスト本人は自身のシフトを読み書き可能
CREATE POLICY IF NOT EXISTS "cast_shifts_cast_select"
  ON public.cast_shifts FOR SELECT TO authenticated
  USING (
    cast_id IN (
      SELECT id FROM public.casts WHERE auth_user_id = auth.uid()
    )
  );

CREATE POLICY IF NOT EXISTS "cast_shifts_cast_upsert"
  ON public.cast_shifts FOR ALL TO authenticated
  USING (
    cast_id IN (
      SELECT id FROM public.casts WHERE auth_user_id = auth.uid()
    )
  );
