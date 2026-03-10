-- Add status column to recruit_applications
ALTER TABLE public.recruit_applications 
ADD COLUMN IF NOT EXISTS status text DEFAULT '未対応' CHECK (status IN ('未対応', '連絡済', '面接予定', '採用', '不採用'));
