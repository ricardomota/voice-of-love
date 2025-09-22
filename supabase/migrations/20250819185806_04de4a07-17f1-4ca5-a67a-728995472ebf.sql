-- Fix remaining functions with mutable search_path

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

CREATE OR REPLACE FUNCTION public.check_event_rate_limit(p_user_id uuid)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
DECLARE
  event_count integer;
BEGIN
  -- Check events in last minute for this user
  SELECT COUNT(*) INTO event_count
  FROM public.event_logs
  WHERE user_id = p_user_id 
  AND created_at > now() - interval '1 minute';
  
  -- Allow max 60 events per minute per user
  RETURN event_count < 60;
END;
$$;