-- Corrigir warnings de segurança das funções
DROP FUNCTION IF EXISTS public.clean_expired_memories();
DROP FUNCTION IF EXISTS public.schedule_memory_cleanup();

-- Recriar as funções com search_path seguro
CREATE OR REPLACE FUNCTION public.clean_expired_memories()
RETURNS TRIGGER 
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
BEGIN
  DELETE FROM public.dynamic_memories 
  WHERE expires_at IS NOT NULL 
  AND expires_at < now();
  RETURN NULL;
END;
$$;

CREATE OR REPLACE FUNCTION public.schedule_memory_cleanup()
RETURNS void 
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
BEGIN
  PERFORM cron.schedule('memory-cleanup', '0 2 * * *', 'SELECT public.clean_expired_memories();');
EXCEPTION
  WHEN OTHERS THEN
    -- Ignora erro se pg_cron não estiver disponível
    NULL;
END;
$$;