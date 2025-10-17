-- Add temporal access support to beta_access table
ALTER TABLE public.beta_access 
  ADD COLUMN IF NOT EXISTS expires_at timestamptz,
  ADD COLUMN IF NOT EXISTS is_temporary boolean DEFAULT false,
  ADD COLUMN IF NOT EXISTS granted_from_waitlist boolean DEFAULT false,
  ADD COLUMN IF NOT EXISTS notes text;

-- Create index for expiration queries
CREATE INDEX IF NOT EXISTS idx_beta_access_expires_at ON public.beta_access(expires_at) WHERE expires_at IS NOT NULL;

-- Function to grant beta access from waitlist
CREATE OR REPLACE FUNCTION public.grant_waitlist_beta_access(
  email_list text[],
  days_duration integer DEFAULT 30,
  notes_text text DEFAULT 'Waitlist early access'
)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  granted_count integer := 0;
  already_exists_count integer := 0;
  result_data jsonb := '[]'::jsonb;
  email_item text;
  new_access_code text;
  expiration_date timestamptz;
BEGIN
  -- Only admins can grant access
  IF NOT public.has_role(auth.uid(), 'admin') THEN
    RAISE EXCEPTION 'Only admins can grant beta access';
  END IF;

  -- Calculate expiration date (NULL means permanent)
  IF days_duration > 0 THEN
    expiration_date := now() + (days_duration || ' days')::interval;
  ELSE
    expiration_date := NULL;
  END IF;

  -- Process each email
  FOREACH email_item IN ARRAY email_list
  LOOP
    -- Check if email already has access
    IF EXISTS (SELECT 1 FROM public.beta_access WHERE email = lower(trim(email_item))) THEN
      already_exists_count := already_exists_count + 1;
      CONTINUE;
    END IF;

    -- Generate unique access code
    new_access_code := SUBSTRING(md5(random()::text || email_item) FROM 1 FOR 8);

    -- Insert new beta access
    INSERT INTO public.beta_access (
      email,
      access_code,
      expires_at,
      is_temporary,
      granted_from_waitlist,
      notes
    ) VALUES (
      lower(trim(email_item)),
      new_access_code,
      expiration_date,
      days_duration > 0,
      true,
      notes_text
    );

    -- Update waitlist status if exists
    UPDATE public.waitlist 
    SET status = 'granted_access'
    WHERE email = lower(trim(email_item)) AND status = 'pending';

    granted_count := granted_count + 1;

    -- Add to result
    result_data := result_data || jsonb_build_object(
      'email', email_item,
      'access_code', new_access_code,
      'expires_at', expiration_date
    );
  END LOOP;

  RETURN jsonb_build_object(
    'granted', granted_count,
    'already_exists', already_exists_count,
    'access_data', result_data
  );
END;
$$;

-- Update check_beta_access to validate expiration
CREATE OR REPLACE FUNCTION public.check_beta_access(p_email text, p_access_code text DEFAULT NULL::text)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  access_record beta_access%ROWTYPE;
  result jsonb;
  days_remaining integer;
BEGIN
  -- If access_code is provided, validate both email and code
  IF p_access_code IS NOT NULL THEN
    SELECT * INTO access_record 
    FROM beta_access 
    WHERE email = p_email AND access_code = p_access_code;
    
    IF FOUND THEN
      -- Check if expired
      IF access_record.expires_at IS NOT NULL AND access_record.expires_at < now() THEN
        RETURN jsonb_build_object(
          'hasAccess', false,
          'is_expired', true,
          'expired_at', access_record.expires_at,
          'message', 'Access code has expired'
        );
      END IF;

      -- Calculate days remaining
      IF access_record.expires_at IS NOT NULL THEN
        days_remaining := EXTRACT(DAY FROM (access_record.expires_at - now()));
      ELSE
        days_remaining := -1; -- Permanent access
      END IF;

      -- Update used_at timestamp
      UPDATE beta_access 
      SET used_at = now() 
      WHERE email = p_email AND access_code = p_access_code;
      
      RETURN jsonb_build_object(
        'hasAccess', true,
        'is_temporary', access_record.is_temporary,
        'is_expired', false,
        'expires_at', access_record.expires_at,
        'days_remaining', days_remaining,
        'used_at', access_record.used_at,
        'message', 'Access granted'
      );
    ELSE
      RETURN jsonb_build_object(
        'hasAccess', false,
        'is_expired', false,
        'message', 'Invalid email or access code'
      );
    END IF;
  ELSE
    -- Only check if email exists (for checking eligibility)
    SELECT * INTO access_record 
    FROM beta_access 
    WHERE email = p_email;
    
    IF FOUND THEN
      -- Check if expired
      IF access_record.expires_at IS NOT NULL AND access_record.expires_at < now() THEN
        RETURN jsonb_build_object(
          'hasAccess', false,
          'is_expired', true,
          'expired_at', access_record.expires_at,
          'message', 'Access has expired'
        );
      END IF;

      RETURN jsonb_build_object(
        'hasAccess', true,
        'is_temporary', access_record.is_temporary,
        'expires_at', access_record.expires_at,
        'used_at', access_record.used_at,
        'message', 'Email found in beta access'
      );
    ELSE
      RETURN jsonb_build_object(
        'hasAccess', false,
        'is_expired', false,
        'message', 'Email not found in beta access'
      );
    END IF;
  END IF;
END;
$$;

-- Create admin view for monitoring
CREATE OR REPLACE VIEW public.admin_beta_access_overview AS
SELECT 
  ba.id,
  ba.email,
  ba.access_code,
  ba.is_temporary,
  ba.expires_at,
  ba.used_at,
  ba.granted_from_waitlist,
  ba.notes,
  ba.created_at,
  CASE 
    WHEN ba.expires_at IS NULL THEN 'Permanent'
    WHEN ba.expires_at < now() THEN 'Expired'
    ELSE 'Active'
  END as access_status,
  CASE
    WHEN ba.expires_at IS NOT NULL AND ba.expires_at > now() THEN
      EXTRACT(DAY FROM (ba.expires_at - now()))
    ELSE NULL
  END as days_remaining,
  w.id as waitlist_id,
  w.status as waitlist_status
FROM public.beta_access ba
LEFT JOIN public.waitlist w ON w.email = ba.email
ORDER BY ba.created_at DESC;

-- Grant access to admins only for the view
GRANT SELECT ON public.admin_beta_access_overview TO authenticated;

-- Create RLS policy for the view (admins only)
CREATE POLICY "Admins can view beta access overview"
ON public.beta_access
FOR SELECT
USING (public.has_role(auth.uid(), 'admin'));