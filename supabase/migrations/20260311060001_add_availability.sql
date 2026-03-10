-- Migration: Add availability field to site_settings for Realtime FOMO feature
-- Run: supabase db push OR apply manually in Supabase SQL editor

ALTER TABLE public.site_settings 
  ADD COLUMN IF NOT EXISTS availability text 
  DEFAULT 'available' 
  CHECK (availability IN ('open', 'available', 'limited', 'full', 'closed'));

-- Enable realtime for site_settings (so frontend can listen to changes)
ALTER PUBLICATION supabase_realtime ADD TABLE public.site_settings;
