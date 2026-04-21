-- daily_reservations に来店確度カラムを追加
-- confirmed: 確定 / maybe: 来るかも / contacting: 連絡中

ALTER TABLE public.daily_reservations
  ADD COLUMN IF NOT EXISTS visit_certainty TEXT NOT NULL DEFAULT 'maybe'
  CHECK (visit_certainty IN ('confirmed', 'maybe', 'contacting'));

COMMENT ON COLUMN public.daily_reservations.visit_certainty IS 'キャストが入力する来店確度: confirmed(確定) | maybe(来るかも) | contacting(連絡中)';
