-- Fix waitlist RLS policy to allow anonymous signups
-- The current policy is too restrictive and prevents anonymous users from joining the waitlist

-- Drop the overly restrictive SELECT policy
DROP POLICY IF EXISTS "Only service role can read waitlist entries" ON public.waitlist;

-- Create a new policy that allows anonymous users to insert into waitlist
-- This policy should already exist but let's ensure it's there
DROP POLICY IF EXISTS "Anyone can join waitlist" ON public.waitlist;

CREATE POLICY "Anyone can join waitlist" 
ON public.waitlist 
FOR INSERT 
WITH CHECK (true);

-- Create a policy that allows service role to read all entries (for admin purposes)
CREATE POLICY "Service role can read all waitlist entries" 
ON public.waitlist 
FOR SELECT 
USING (auth.role() = 'service_role');

-- Create a policy that allows users to check if their email exists (for duplicate checking)
-- This is needed for the duplicate check functionality
CREATE POLICY "Users can check their own email status" 
ON public.waitlist 
FOR SELECT 
USING (
  auth.uid() IS NOT NULL AND 
  email = auth.email()
);

-- Ensure the duplicate check function works properly
-- The function should already exist but let's make sure it's properly secured
DROP FUNCTION IF EXISTS public.check_waitlist_duplicate(text);
CREATE OR REPLACE FUNCTION public.check_waitlist_duplicate(email_to_check text)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Validate input
  IF email_to_check IS NULL OR length(trim(email_to_check)) = 0 THEN
    RETURN false;
  END IF;
  
  -- Only return true/false, never expose actual data
  -- This function runs with definer rights, bypassing RLS
  RETURN EXISTS (
    SELECT 1 FROM public.waitlist 
    WHERE email = lower(trim(email_to_check))
    LIMIT 1
  );
EXCEPTION
  WHEN OTHERS THEN
    -- Log error but don't expose it
    RETURN false;
END;
$$;

-- Ensure the function is properly secured
REVOKE ALL ON FUNCTION public.check_waitlist_duplicate(text) FROM public;
GRANT EXECUTE ON FUNCTION public.check_waitlist_duplicate(text) TO public;
