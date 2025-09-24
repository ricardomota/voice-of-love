-- Fix waitlist table security vulnerability
-- Remove policies that allow public/authenticated users to read waitlist data

-- Drop the problematic public SELECT policies
DROP POLICY IF EXISTS "Authenticated select" ON public.waitlist;
DROP POLICY IF EXISTS "Authenticated insert" ON public.waitlist; -- This is redundant with "Anyone can join waitlist"

-- Ensure we have the correct restrictive policies
-- Keep anonymous INSERT ability (for joining waitlist)
-- Restrict SELECT to service role only

-- The following policies should already exist but let's ensure they're correct:

-- Allow anonymous users to join the waitlist
DROP POLICY IF EXISTS "Anyone can join waitlist" ON public.waitlist;
CREATE POLICY "Anyone can join waitlist" 
ON public.waitlist 
FOR INSERT 
TO anon, authenticated
WITH CHECK (true);

-- Only service role can read waitlist entries
DROP POLICY IF EXISTS "Only service role can read waitlist entries" ON public.waitlist;
CREATE POLICY "Only service role can read waitlist entries" 
ON public.waitlist 
FOR SELECT 
TO service_role
USING (true);

-- Ensure service role has full management access
DROP POLICY IF EXISTS "Service role can manage waitlist" ON public.waitlist;
CREATE POLICY "Service role can manage waitlist" 
ON public.waitlist 
FOR ALL 
TO service_role
USING (true);