-- =================================================================================
-- 【Phase 12: 月間シフト（○×△）提出機能 - 追加実装分】
-- 出勤時間（start_time）および、同伴フラグ（is_douhan）の追加
-- =================================================================================

-- 既存の cast_shifts テーブルにカラムを追加します
-- 既にデータが入っている場合も安全に実行できます

ALTER TABLE public.cast_shifts 
ADD COLUMN IF NOT EXISTS start_time time,
ADD COLUMN IF NOT EXISTS is_douhan boolean DEFAULT false;

-- （参考）万が一テーブルごと作り直す場合用の定義:
/*
CREATE TABLE IF NOT EXISTS public.cast_shifts (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  cast_id uuid NOT NULL,
  work_date date NOT NULL,
  status text NOT NULL CHECK (status IN ('available', 'unavailable', 'maybe')),
  start_time time, -- 例: '21:00', '21:30'
  is_douhan boolean DEFAULT false, -- true: 同伴出勤
  created_at timestamp with time zone NOT NULL DEFAULT timezone('utc'::text, now()),
  updated_at timestamp with time zone NOT NULL DEFAULT timezone('utc'::text, now()),
  
  CONSTRAINT cast_shifts_pkey PRIMARY KEY (id),
  CONSTRAINT cast_shifts_cast_id_work_date_key UNIQUE (cast_id, work_date),
  CONSTRAINT cast_shifts_cast_id_fkey FOREIGN KEY (cast_id) REFERENCES casts(id) ON DELETE CASCADE
);
*/
