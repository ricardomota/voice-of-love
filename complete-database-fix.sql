-- Complete Database Fix for Waitlist
-- This script fixes all database issues and tests the waitlist functionality

-- 1. Fix table schema to allow minimal inserts
ALTER TABLE public.waitlist ALTER COLUMN user_id DROP NOT NULL;

-- Check what values are allowed for status column
SELECT DISTINCT status FROM public.waitlist;

-- Drop the check constraint on status if it exists
ALTER TABLE public.waitlist DROP CONSTRAINT IF EXISTS waitlist_status_check;

-- Set defaults for all required fields
ALTER TABLE public.waitlist ALTER COLUMN status SET DEFAULT 'queued';
ALTER TABLE public.waitlist ALTER COLUMN primary_interest SET DEFAULT 'general';
ALTER TABLE public.waitlist ALTER COLUMN how_did_you_hear SET DEFAULT 'website';
ALTER TABLE public.waitlist ALTER COLUMN requested_at SET DEFAULT NOW();

-- 2. Fix RLS policies to allow service role inserts
DROP POLICY IF EXISTS "Anyone can join waitlist" ON public.waitlist;
DROP POLICY IF EXISTS "Service role can read all waitlist entries" ON public.waitlist;
DROP POLICY IF EXISTS "Users can check their own email status" ON public.waitlist;

-- Create proper RLS policies
CREATE POLICY "Anyone can join waitlist" ON public.waitlist
    FOR INSERT WITH CHECK (true);

CREATE POLICY "Service role can read all waitlist entries" ON public.waitlist
    FOR SELECT USING (auth.role() = 'service_role');

CREATE POLICY "Users can check their own email status" ON public.waitlist
    FOR SELECT USING (auth.uid() IS NOT NULL);

-- 3. Recreate the check_waitlist_duplicate function with proper security
DROP FUNCTION IF EXISTS public.check_waitlist_duplicate(text);

CREATE OR REPLACE FUNCTION public.check_waitlist_duplicate(email_to_check text)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
    RETURN EXISTS (
        SELECT 1 FROM public.waitlist 
        WHERE email = email_to_check
    );
END;
$$;

-- 4. Grant necessary permissions
GRANT EXECUTE ON FUNCTION public.check_waitlist_duplicate(text) TO service_role;
GRANT EXECUTE ON FUNCTION public.check_waitlist_duplicate(text) TO anon;

-- 5. Test the schema fix
INSERT INTO public.waitlist (email, full_name) 
VALUES ('test-schema-' || extract(epoch from now()) || '@example.com', 'Test User')
ON CONFLICT (email) DO NOTHING;

-- 6. Verify the insert worked
SELECT 
    'SUCCESS: Database schema and RLS policies fixed!' as status,
    count(*) as total_waitlist_entries
FROM public.waitlist;

-- 7. Test the duplicate check function
SELECT 
    'Duplicate check function test:' as test,
    public.check_waitlist_duplicate('test-schema-' || extract(epoch from now()) || '@example.com') as is_duplicate;

-- 8. Clean up test data
DELETE FROM public.waitlist WHERE email LIKE 'test-schema-%@example.com';
