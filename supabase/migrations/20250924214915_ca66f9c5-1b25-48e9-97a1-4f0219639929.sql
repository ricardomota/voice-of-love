-- Fix beta_access table security vulnerability  
-- Remove public access and create secure RPC function for duplicate checking

-- First, drop existing policies that allow public access
DROP POLICY IF EXISTS "Authenticated users can check their own beta access" ON public.beta_access;

-- Only keep service role policies (don't recreate if exists)
-- Create secure function to check beta access without exposing data
CREATE OR REPLACE FUNCTION public.check_beta_access_secure(email_to_check text)
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
    SELECT 1 FROM public.beta_access 
    WHERE email = lower(trim(email_to_check))
    LIMIT 1
  );
EXCEPTION
  WHEN OTHERS THEN
    -- Log error but don't expose it
    RETURN false;
END;
$$;