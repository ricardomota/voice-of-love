-- Fix function search path mutable warnings
ALTER FUNCTION public.update_credit_balance() SET search_path = 'public';
ALTER FUNCTION public.charge_credits(UUID, TEXT, INTEGER, TEXT) SET search_path = 'public';
ALTER FUNCTION public.update_updated_at_column() SET search_path = 'public';