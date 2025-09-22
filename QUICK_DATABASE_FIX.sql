-- QUICK DATABASE FIX - Copy and paste this into Supabase SQL Editor

-- Fix the most common issues blocking waitlist inserts
ALTER TABLE public.waitlist ALTER COLUMN user_id DROP NOT NULL;
ALTER TABLE public.waitlist ALTER COLUMN status SET DEFAULT 'queued';
ALTER TABLE public.waitlist ALTER COLUMN primary_interest SET DEFAULT 'general';
ALTER TABLE public.waitlist ALTER COLUMN how_did_you_hear SET DEFAULT 'website';
ALTER TABLE public.waitlist ALTER COLUMN requested_at SET DEFAULT NOW();

-- Test that it works
INSERT INTO public.waitlist (email, full_name) VALUES ('test@example.com', 'Test User');
SELECT 'SUCCESS: Database schema fixed!' as result;
