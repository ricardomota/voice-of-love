-- Fix waitlist database schema to allow minimal inserts
-- Run this in Supabase SQL Editor

-- 1. Make user_id nullable (most common issue)
ALTER TABLE public.waitlist ALTER COLUMN user_id DROP NOT NULL;

-- 2. Add defaults for all required fields
ALTER TABLE public.waitlist ALTER COLUMN status SET DEFAULT 'queued';
ALTER TABLE public.waitlist ALTER COLUMN primary_interest SET DEFAULT 'general';
ALTER TABLE public.waitlist ALTER COLUMN how_did_you_hear SET DEFAULT 'website';
ALTER TABLE public.waitlist ALTER COLUMN requested_at SET DEFAULT NOW();

-- 3. Check current table structure
SELECT 
    column_name, 
    data_type, 
    is_nullable, 
    column_default
FROM information_schema.columns 
WHERE table_name = 'waitlist' 
AND table_schema = 'public'
ORDER BY ordinal_position;

-- 4. Check constraints that might block inserts
SELECT 
    conname as constraint_name,
    contype as constraint_type,
    confrelid::regclass as referenced_table
FROM pg_constraint 
WHERE conrelid = 'public.waitlist'::regclass;

-- 5. Test insert to verify it works
INSERT INTO public.waitlist (email, full_name) 
VALUES ('test-schema-fix@example.com', 'Test User')
ON CONFLICT (email) DO NOTHING;

-- 6. Verify the insert worked
SELECT * FROM public.waitlist WHERE email = 'test-schema-fix@example.com';

-- 7. Clean up test data
DELETE FROM public.waitlist WHERE email = 'test-schema-fix@example.com';
