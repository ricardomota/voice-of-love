-- Fix critical security vulnerability: Remove public access to beta_access table
-- and replace with secure access control

-- Drop the dangerous public access policies
DROP POLICY IF EXISTS "Anyone can check access" ON public.beta_access;  
DROP POLICY IF EXISTS "Users can update their own access" ON public.beta_access;

-- Create a secure function to check beta access without exposing email data
CREATE OR REPLACE FUNCTION public.check_beta_access(p_email text, p_access_code text DEFAULT NULL)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
DECLARE
  access_record beta_access%ROWTYPE;
  result jsonb;
BEGIN
  -- If access_code is provided, validate both email and code
  IF p_access_code IS NOT NULL THEN
    SELECT * INTO access_record 
    FROM beta_access 
    WHERE email = p_email AND access_code = p_access_code;
    
    IF FOUND THEN
      -- Update used_at timestamp
      UPDATE beta_access 
      SET used_at = now() 
      WHERE email = p_email AND access_code = p_access_code;
      
      RETURN jsonb_build_object(
        'hasAccess', true,
        'used_at', access_record.used_at,
        'message', 'Access granted'
      );
    ELSE
      RETURN jsonb_build_object(
        'hasAccess', false,
        'message', 'Invalid email or access code'
      );
    END IF;
  ELSE
    -- Only check if email exists (for checking eligibility)
    SELECT * INTO access_record 
    FROM beta_access 
    WHERE email = p_email;
    
    IF FOUND THEN
      RETURN jsonb_build_object(
        'hasAccess', true,
        'used_at', access_record.used_at,
        'message', 'Email found in beta access'
      );
    ELSE
      RETURN jsonb_build_object(
        'hasAccess', false,
        'message', 'Email not found in beta access'
      );
    END IF;
  END IF;
END;
$$;

-- Create restrictive RLS policies
CREATE POLICY "Authenticated users can check their own beta access"
ON public.beta_access
FOR SELECT
USING (auth.uid() IS NOT NULL AND email = auth.email());

CREATE POLICY "Service role can manage beta access"
ON public.beta_access
FOR ALL
USING (auth.role() = 'service_role');

-- Grant execute permission on the function to authenticated users
GRANT EXECUTE ON FUNCTION public.check_beta_access TO authenticated;