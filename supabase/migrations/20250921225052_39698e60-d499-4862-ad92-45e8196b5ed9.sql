-- SECURITY FIX PART 2: Enable secure anonymous waitlist signups
-- The previous fix secured SELECT access but broke anonymous waitlist functionality
-- We need to allow anonymous users to join the waitlist without being able to read other entries

-- Drop the overly restrictive SELECT policy
DROP POLICY IF EXISTS "Users can view only their own waitlist entries by user_id" ON public.waitlist;

-- Create a minimal SELECT policy that only allows users to check their own email status
-- This prevents email enumeration while allowing duplicate detection
CREATE POLICY "Users can check only their own email status" 
ON public.waitlist 
FOR SELECT 
USING (
  auth.uid() IS NOT NULL 
  AND email = auth.email()
  AND user_id IS NULL  -- Only for anonymous entries
);

-- Allow authenticated users to see their own entries by user_id
CREATE POLICY "Authenticated users can view their own entries" 
ON public.waitlist 
FOR SELECT 
USING (
  auth.uid() IS NOT NULL 
  AND user_id = auth.uid()
);

-- Create a function to safely check for duplicates without exposing data
CREATE OR REPLACE FUNCTION public.check_waitlist_duplicate(email_to_check text)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Only return true/false, never expose actual data
  RETURN EXISTS (
    SELECT 1 FROM public.waitlist 
    WHERE email = lower(trim(email_to_check))
  );
END;
$$;

-- Grant execute permission to public (anonymous users)
GRANT EXECUTE ON FUNCTION public.check_waitlist_duplicate(text) TO public;