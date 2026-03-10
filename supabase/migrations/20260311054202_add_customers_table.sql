-- Migration for Customer CRM Support

-- 1. Create customers table
CREATE TABLE IF NOT EXISTS public.customers (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  phone text,
  email text,
  line_id text,
  rank text default 'normal' check (rank in ('normal', 'bronze', 'silver', 'gold', 'vip', 'black')),
  total_visits integer default 0,
  notes text,
  birthday date,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 2. Add customer_id reference to contacts table
ALTER TABLE public.contacts 
  ADD COLUMN IF NOT EXISTS customer_id uuid references public.customers(id) on delete set null;

-- 3. Setup RLS for customers
ALTER TABLE public.customers ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Customers are viewable by authenticated users."
  ON public.customers FOR SELECT
  TO authenticated
  USING ( true );

CREATE POLICY "Customers are insertable by authenticated users."
  ON public.customers FOR INSERT
  TO authenticated
  WITH CHECK ( true );

CREATE POLICY "Customers are updatable by authenticated users."
  ON public.customers FOR UPDATE
  TO authenticated
  USING ( true );

CREATE POLICY "Customers are deletable by authenticated users."
  ON public.customers FOR DELETE
  TO authenticated
  USING ( true );

-- Enable realtime
ALTER PUBLICATION supabase_realtime ADD TABLE public.customers;
