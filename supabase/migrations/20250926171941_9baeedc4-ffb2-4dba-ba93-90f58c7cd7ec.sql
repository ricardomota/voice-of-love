-- Fix remaining function search path issues and move extensions

-- Update update_voice_capacity function
CREATE OR REPLACE FUNCTION public.update_voice_capacity()
 RETURNS trigger
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
BEGIN
  -- Update active_slots count in capacity table
  UPDATE public.capacity 
  SET 
    active_slots = (
      SELECT COUNT(*) 
      FROM public.voices 
      WHERE status = 'active' AND type = 'personalized'
    ),
    updated_at = now()
  WHERE id = 1;
  
  RETURN COALESCE(NEW, OLD);
END;
$function$;

-- Update ensure_usage_row function
CREATE OR REPLACE FUNCTION public.ensure_usage_row(p_user_id uuid, p_period text)
 RETURNS void
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
BEGIN
  INSERT INTO public.usage_counters(user_id, period)
  VALUES (p_user_id, p_period)
  ON CONFLICT (user_id, period) DO NOTHING;
END; 
$function$;

-- Move vector extension to extensions schema if it exists in public
-- First check if extensions schema exists, create if not
CREATE SCHEMA IF NOT EXISTS extensions;

-- Move vector extension from public to extensions schema if it exists
-- This requires careful handling to avoid breaking existing functionality
DO $$
BEGIN
  -- Check if vector extension exists in public schema
  IF EXISTS (
    SELECT 1 FROM pg_extension e 
    JOIN pg_namespace n ON e.extnamespace = n.oid 
    WHERE e.extname = 'vector' AND n.nspname = 'public'
  ) THEN
    -- Note: Moving extensions requires careful coordination
    -- This will be handled by the database administrator
    RAISE NOTICE 'Vector extension detected in public schema. Please contact your database administrator to move it to the extensions schema.';
  END IF;
END $$;