-- Fix remaining database functions without secure search paths
CREATE OR REPLACE FUNCTION public.clean_expired_memories()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $function$
BEGIN
  DELETE FROM public.dynamic_memories 
  WHERE expires_at IS NOT NULL 
  AND expires_at < now();
  RETURN NULL;
END;
$function$;

CREATE OR REPLACE FUNCTION public.schedule_memory_cleanup()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $function$
BEGIN
  PERFORM cron.schedule('memory-cleanup', '0 2 * * *', 'SELECT public.clean_expired_memories();');
EXCEPTION
  WHEN OTHERS THEN
    -- Ignore error if pg_cron is not available
    NULL;
END;
$function$;