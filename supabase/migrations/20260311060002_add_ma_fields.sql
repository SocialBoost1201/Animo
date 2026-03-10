-- Migration: Add MA fields to customers table for CRM automation
-- last_visit_date: 最終来店日（Cron Jobs or Webhook で自動更新）
-- email_opt_in: メール配信許可フラグ

ALTER TABLE public.customers
  ADD COLUMN IF NOT EXISTS last_visit_date date,
  ADD COLUMN IF NOT EXISTS email_opt_in boolean DEFAULT true,
  ADD COLUMN IF NOT EXISTS follow_up_status text DEFAULT 'none' 
    CHECK (follow_up_status IN ('none', 'needed', 'done'));

-- Enable realtime for customers
ALTER PUBLICATION supabase_realtime ADD TABLE public.customers;
