-- Harden update_updated_at_column with SECURITY DEFINER and safe search_path
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO ''
AS $function$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$function$;

-- Restrict cost_inputs with RLS (admin/service-role only)
ALTER TABLE public.cost_inputs ENABLE ROW LEVEL SECURITY;

-- Create explicit service_role-only policies if they don't exist
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE schemaname = 'public' AND tablename = 'cost_inputs' AND policyname = 'Service role can view cost inputs') THEN
    CREATE POLICY "Service role can view cost inputs"
    ON public.cost_inputs
    FOR SELECT
    USING (auth.role() = 'service_role');
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE schemaname = 'public' AND tablename = 'cost_inputs' AND policyname = 'Service role can insert cost inputs') THEN
    CREATE POLICY "Service role can insert cost inputs"
    ON public.cost_inputs
    FOR INSERT
    WITH CHECK (auth.role() = 'service_role');
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE schemaname = 'public' AND tablename = 'cost_inputs' AND policyname = 'Service role can update cost inputs') THEN
    CREATE POLICY "Service role can update cost inputs"
    ON public.cost_inputs
    FOR UPDATE
    USING (auth.role() = 'service_role');
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE schemaname = 'public' AND tablename = 'cost_inputs' AND policyname = 'Service role can delete cost inputs') THEN
    CREATE POLICY "Service role can delete cost inputs"
    ON public.cost_inputs
    FOR DELETE
    USING (auth.role() = 'service_role');
  END IF;
END$$;