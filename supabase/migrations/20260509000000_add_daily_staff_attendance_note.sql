-- ==========================================
-- daily_staff_attendances に 備考 (note) 列を追加
-- ==========================================
-- 用途:
--   /admin/staffs ページの 出勤/休み トグルで 備考 を保存できるようにする。
--   /admin/today の LINE 文章生成時にスタッフごとの注記として表示。
-- 安全策:
--   - IF NOT EXISTS で冪等
--   - NULL 許可（既存行は影響なし）
-- ==========================================

ALTER TABLE public.daily_staff_attendances
  ADD COLUMN IF NOT EXISTS note text;
