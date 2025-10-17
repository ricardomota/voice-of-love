-- Assign admin role to the current users (you can adjust this as needed)
-- This inserts admin role for the most recent user

INSERT INTO public.user_roles (user_id, role)
SELECT user_id, 'admin'::app_role
FROM public.profiles
WHERE display_name = 'alvaro.oliveira' -- Change this to your username if different
ON CONFLICT (user_id, role) DO NOTHING;

-- Or if you want to make a specific user admin by email, you can use this instead:
-- First, let's create a helper to assign admin by email
CREATE OR REPLACE FUNCTION public.make_user_admin(user_email text)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.user_roles (user_id, role)
  SELECT id, 'admin'::app_role
  FROM auth.users
  WHERE email = user_email
  ON CONFLICT (user_id, role) DO NOTHING;
END;
$$;

-- Example usage (uncomment and modify email as needed):
-- SELECT public.make_user_admin('your-email@example.com');