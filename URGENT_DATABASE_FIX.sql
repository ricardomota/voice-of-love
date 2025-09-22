-- URGENT DATABASE FIX - Run this in Supabase SQL Editor
-- This fixes the check constraint issue blocking waitlist inserts

-- 1. Drop the problematic check constraint
ALTER TABLE public.waitlist DROP CONSTRAINT IF EXISTS waitlist_status_check;

-- 2. Make user_id nullable
ALTER TABLE public.waitlist ALTER COLUMN user_id DROP NOT NULL;

-- 3. Set defaults for all required fields
ALTER TABLE public.waitlist ALTER COLUMN status SET DEFAULT 'queued';
ALTER TABLE public.waitlist ALTER COLUMN primary_interest SET DEFAULT 'general';
ALTER TABLE public.waitlist ALTER COLUMN how_did_you_hear SET DEFAULT 'website';
ALTER TABLE public.waitlist ALTER COLUMN requested_at SET DEFAULT NOW();

-- 4. Test the fix
INSERT INTO public.waitlist (email, full_name) 
VALUES ('test-fix-' || extract(epoch from now()) || '@example.com', 'Test User');

-- 5. Verify it worked
SELECT 'SUCCESS: Database fixed!' as result, count(*) as total_entries FROM public.waitlist;

-- 6. Clean up test data
DELETE FROM public.waitlist WHERE email LIKE 'test-fix-%@example.com';
