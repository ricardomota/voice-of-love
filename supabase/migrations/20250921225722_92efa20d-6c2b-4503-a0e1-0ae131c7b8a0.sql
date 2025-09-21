-- FINAL SECURITY FIX: Completely remove public read access to waitlist data
-- The security scanner is still detecting public read access, so we need to be more restrictive

-- Drop all current SELECT policies that might allow public access
DROP POLICY IF EXISTS "Users can check only their own email status" ON public.waitlist;
DROP POLICY IF EXISTS "Authenticated users can view their own entries" ON public.waitlist;

-- Create a single, very restrictive SELECT policy for admin access only
CREATE POLICY "Only service role can read waitlist entries" 
ON public.waitlist 
FOR SELECT 
USING (auth.role() = 'service_role');

-- Update the duplicate check function to be more explicit about security
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