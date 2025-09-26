-- Fix critical security vulnerability in waitlist table
-- Remove overly permissive read policies that expose customer personal data

-- Drop the problematic policies that allow public access
DROP POLICY IF EXISTS "Only service role can read waitlist entries" ON public.waitlist;
DROP POLICY IF EXISTS "Service role can manage waitlist" ON public.waitlist;

-- Create proper restrictive policies for service role access only
CREATE POLICY "Service role can read waitlist entries" 
ON public.waitlist 
FOR SELECT 
USING (auth.role() = 'service_role'::text);

CREATE POLICY "Service role can manage all waitlist operations" 
ON public.waitlist 
FOR ALL 
USING (auth.role() = 'service_role'::text);

-- Ensure the insert policy remains permissive for public waitlist signups
-- but verify it exists with proper constraints
DROP POLICY IF EXISTS "Anyone can join waitlist" ON public.waitlist;
CREATE POLICY "Public can insert waitlist entries" 
ON public.waitlist 
FOR INSERT 
WITH CHECK (true);

-- Remove any other overly permissive policies and ensure proper access control
DROP POLICY IF EXISTS "Users cannot delete waitlist entries" ON public.waitlist;
DROP POLICY IF EXISTS "Users cannot update waitlist entries" ON public.waitlist;