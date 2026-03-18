-- Create shift_change_requests table
CREATE TABLE IF NOT EXISTS public.shift_change_requests (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    cast_id UUID NOT NULL REFERENCES public.casts(id) ON DELETE CASCADE,
    target_date DATE NOT NULL,
    action_type TEXT NOT NULL CHECK (action_type IN ('update', 'cancel')),
    new_start_time TEXT,
    new_end_time TEXT,
    status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Add updated_at trigger
CREATE OR REPLACE FUNCTION update_shift_change_requests_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = timezone('utc'::text, now());
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trigger_update_shift_change_requests_updated_at ON public.shift_change_requests;
CREATE TRIGGER trigger_update_shift_change_requests_updated_at
    BEFORE UPDATE ON public.shift_change_requests
    FOR EACH ROW
    EXECUTE FUNCTION update_shift_change_requests_updated_at();

-- Enable RLS
ALTER TABLE public.shift_change_requests ENABLE ROW LEVEL SECURITY;

-- Create policies

-- 1. Casts can view their own requests
CREATE POLICY "Casts can view own shift change requests"
    ON public.shift_change_requests
    FOR SELECT
    USING (
        cast_id IN (
            SELECT id FROM public.casts WHERE auth_user_id = auth.uid()
        )
    );

-- 2. Casts can insert their own requests
CREATE POLICY "Casts can insert own shift change requests"
    ON public.shift_change_requests
    FOR INSERT
    WITH CHECK (
        cast_id IN (
            SELECT id FROM public.casts WHERE auth_user_id = auth.uid()
        )
    );

-- 3. Admins can view all requests
CREATE POLICY "Admins can view all shift change requests"
    ON public.shift_change_requests
    FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM public.user_roles
            WHERE user_roles.user_id = auth.uid()
            AND user_roles.role IN ('owner', 'manager', 'staff')
        )
    );

-- 4. Admins can update requests (to approve/reject)
CREATE POLICY "Admins can update shift change requests"
    ON public.shift_change_requests
    FOR UPDATE
    USING (
        EXISTS (
            SELECT 1 FROM public.user_roles
            WHERE user_roles.user_id = auth.uid()
            AND user_roles.role IN ('owner', 'manager', 'staff')
        )
    );

-- Add indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_shift_change_requests_cast_id ON public.shift_change_requests(cast_id);
CREATE INDEX IF NOT EXISTS idx_shift_change_requests_target_date ON public.shift_change_requests(target_date);
CREATE INDEX IF NOT EXISTS idx_shift_change_requests_status ON public.shift_change_requests(status);
