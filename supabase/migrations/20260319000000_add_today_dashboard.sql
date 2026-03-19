-- ==========================================
-- 本日の営業状況ダッシュボード (Today's Operations)
-- ==========================================

-- 1. 派遣（daily_dispatches）
CREATE TABLE IF NOT EXISTS public.daily_dispatches (
  id            uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  dispatch_date date NOT NULL DEFAULT CURRENT_DATE,
  name          text NOT NULL,
  start_time    time NOT NULL,
  note          text,
  created_at    timestamptz DEFAULT now()
);

ALTER TABLE public.daily_dispatches ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Admins can full access daily_dispatches"
  ON public.daily_dispatches TO authenticated
  USING (auth.uid() IS NOT NULL) WITH CHECK (auth.uid() IS NOT NULL);


-- 2. 体入（daily_trials）
CREATE TABLE IF NOT EXISTS public.daily_trials (
  id          uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  trial_date  date NOT NULL DEFAULT CURRENT_DATE,
  name        text NOT NULL,
  start_time  time NOT NULL,
  note        text,
  created_at  timestamptz DEFAULT now()
);

ALTER TABLE public.daily_trials ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Admins can full access daily_trials"
  ON public.daily_trials TO authenticated
  USING (auth.uid() IS NOT NULL) WITH CHECK (auth.uid() IS NOT NULL);


-- 3. 来店予定（daily_reservations）
-- キャストが自分でお客様の来店予定を登録する
CREATE TABLE IF NOT EXISTS public.daily_reservations (
  id                uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  cast_id           uuid REFERENCES public.casts(id) ON DELETE CASCADE,
  reservation_date  date NOT NULL DEFAULT CURRENT_DATE,
  visit_time        time NOT NULL,
  guest_name        text NOT NULL,
  reservation_type  text NOT NULL CHECK (reservation_type IN ('douhan', 'reservation')),
  note              text,
  created_at        timestamptz DEFAULT now(),
  updated_at        timestamptz DEFAULT now()
);

ALTER TABLE public.daily_reservations ENABLE ROW LEVEL SECURITY;

-- キャスト本人は自分の予定のみ閲覧・追加・編集・削除
CREATE POLICY "Casts can manage their own reservations"
  ON public.daily_reservations TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.casts
      WHERE casts.id = daily_reservations.cast_id
      AND casts.auth_user_id = auth.uid()
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.casts
      WHERE casts.id = daily_reservations.cast_id
      AND casts.auth_user_id = auth.uid()
    )
  );

-- 管理者はすべて閲覧・操作可能
CREATE POLICY "Admins can full access daily_reservations"
  ON public.daily_reservations TO authenticated
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
  );


-- 4. 当日確認フォーム（daily_checkins）
-- キャストが毎日出勤前に送信する確認票
CREATE TABLE IF NOT EXISTS public.daily_checkins (
  id           uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  cast_id      uuid REFERENCES public.casts(id) ON DELETE CASCADE,
  checkin_date date NOT NULL DEFAULT CURRENT_DATE,
  has_change   boolean DEFAULT false,
  change_note  text,
  is_absent    boolean DEFAULT false,
  memo         text,
  submitted_at timestamptz DEFAULT now(),
  UNIQUE(cast_id, checkin_date)
);

ALTER TABLE public.daily_checkins ENABLE ROW LEVEL SECURITY;

-- キャスト本人は自分の確認票のみ操作
CREATE POLICY "Casts can manage their own checkins"
  ON public.daily_checkins TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.casts
      WHERE casts.id = daily_checkins.cast_id
      AND casts.auth_user_id = auth.uid()
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.casts
      WHERE casts.id = daily_checkins.cast_id
      AND casts.auth_user_id = auth.uid()
    )
  );

-- 管理者フルアクセス
CREATE POLICY "Admins can full access daily_checkins"
  ON public.daily_checkins TO authenticated
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
  );


-- 5. 当日変更・欠勤（shift_changes）
-- 管理者が当日の変更を記録する
CREATE TABLE IF NOT EXISTS public.shift_changes (
  id            uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  cast_id       uuid REFERENCES public.casts(id) ON DELETE CASCADE,
  change_date   date NOT NULL DEFAULT CURRENT_DATE,
  original_time time,
  new_time      time,   -- NULLの場合は欠勤
  note          text,   -- 「同伴あり」など
  created_at    timestamptz DEFAULT now()
);

ALTER TABLE public.shift_changes ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Admins can full access shift_changes"
  ON public.shift_changes TO authenticated
  USING (auth.uid() IS NOT NULL) WITH CHECK (auth.uid() IS NOT NULL);


-- 6. 本日のスタッフ出勤（daily_staff_attendances）
-- 管理者が当日出勤するスタッフを登録する
CREATE TABLE IF NOT EXISTS public.daily_staff_attendances (
  id             uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  staff_date     date NOT NULL DEFAULT CURRENT_DATE,
  display_name   text NOT NULL,
  start_time     time NOT NULL,
  created_at     timestamptz DEFAULT now()
);

ALTER TABLE public.daily_staff_attendances ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Admins can full access daily_staff_attendances"
  ON public.daily_staff_attendances TO authenticated
  USING (auth.uid() IS NOT NULL) WITH CHECK (auth.uid() IS NOT NULL);


-- インデックス
CREATE INDEX IF NOT EXISTS idx_daily_reservations_date ON public.daily_reservations(reservation_date);
CREATE INDEX IF NOT EXISTS idx_daily_reservations_cast ON public.daily_reservations(cast_id);
CREATE INDEX IF NOT EXISTS idx_daily_checkins_date ON public.daily_checkins(checkin_date);
CREATE INDEX IF NOT EXISTS idx_daily_checkins_cast ON public.daily_checkins(cast_id);
CREATE INDEX IF NOT EXISTS idx_shift_changes_date ON public.shift_changes(change_date);
