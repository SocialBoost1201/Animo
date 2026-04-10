-- Allow 'escort' as a valid type in recruit_applications
ALTER TABLE public.recruit_applications DROP CONSTRAINT recruit_applications_type_check;
ALTER TABLE public.recruit_applications ADD CONSTRAINT recruit_applications_type_check CHECK (type IN ('cast', 'staff', 'escort'));
