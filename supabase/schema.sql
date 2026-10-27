-- =========================================================================
-- Supabase Schema for Dr. Mithra Hegde's Dental Speciality Clinic
-- Project ID: slwyuakcgtekywozudyg
-- Run this in your Supabase SQL Editor (https://supabase.com/dashboard/project/slwyuakcgtekywozudyg/sql)
-- =========================================================================

-- 1. Create Appointments Table
CREATE TABLE IF NOT EXISTS public.appointments (
  id TEXT PRIMARY KEY,
  reference_code TEXT UNIQUE NOT NULL,
  service_id TEXT,
  service_name TEXT NOT NULL,
  service_category TEXT,
  staff_id TEXT,
  staff_name TEXT NOT NULL,
  appointment_date DATE NOT NULL,
  appointment_time TEXT NOT NULL,
  display_time TEXT,
  duration_minutes INTEGER DEFAULT 30,
  total_price NUMERIC DEFAULT 0,
  patient_name TEXT NOT NULL,
  patient_phone TEXT NOT NULL,
  patient_email TEXT,
  patient_age TEXT,
  patient_gender TEXT,
  notes TEXT,
  status TEXT DEFAULT 'confirmed',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Create Index on Reference Code and Date for Fast Queries
CREATE INDEX IF NOT EXISTS idx_appointments_ref ON public.appointments (reference_code);
CREATE INDEX IF NOT EXISTS idx_appointments_date ON public.appointments (appointment_date);

-- 3. Enable Row Level Security (RLS)
ALTER TABLE public.appointments ENABLE ROW LEVEL SECURITY;

-- 4. Set RLS Policies so the website can save and read bookings
-- Drop existing policies if re-running
DROP POLICY IF EXISTS "Allow public booking inserts" ON public.appointments;
DROP POLICY IF EXISTS "Allow public reading of appointments" ON public.appointments;
DROP POLICY IF EXISTS "Allow update of appointments" ON public.appointments;

-- Allow anyone with the anon key to insert new appointments from the website
CREATE POLICY "Allow public booking inserts" 
ON public.appointments 
FOR INSERT 
TO anon, authenticated 
WITH CHECK (true);

-- Allow reading appointments (e.g. for lookup and admin views)
CREATE POLICY "Allow public reading of appointments" 
ON public.appointments 
FOR SELECT 
TO anon, authenticated 
USING (true);

-- Allow updates (for rescheduling and cancellations)
CREATE POLICY "Allow update of appointments" 
ON public.appointments 
FOR UPDATE 
TO anon, authenticated 
USING (true);

-- 5. Optional Contact Inquiries Table
CREATE TABLE IF NOT EXISTS public.contact_inquiries (
  id BIGSERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  phone TEXT NOT NULL,
  email TEXT,
  message TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.contact_inquiries ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Allow public inquiry inserts" ON public.contact_inquiries;
CREATE POLICY "Allow public inquiry inserts" 
ON public.contact_inquiries 
FOR INSERT 
TO anon, authenticated 
WITH CHECK (true);

DROP POLICY IF EXISTS "Allow read inquiries" ON public.contact_inquiries;
CREATE POLICY "Allow read inquiries" 
ON public.contact_inquiries 
FOR SELECT 
TO anon, authenticated 
USING (true);
