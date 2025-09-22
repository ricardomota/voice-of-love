-- Secure the waitlist table by updating RLS policies
-- Remove the existing policies first
DROP POLICY IF EXISTS "Authenticated users can join waitlist" ON public.waitlist;
DROP POLICY IF EXISTS "Users can view their own waitlist entries" ON public.waitlist;
DROP POLICY IF EXISTS "Service role can manage waitlist" ON public.waitlist;

-- Create more secure policies
-- Only allow service role to manage waitlist (for edge functions)
CREATE POLICY "Service role can manage waitlist" ON public.waitlist
FOR ALL USING (auth.role() = 'service_role');

-- Allow authenticated users to insert their own entries
CREATE POLICY "Users can insert their own waitlist entries" ON public.waitlist
FOR INSERT WITH CHECK (
  auth.uid() IS NOT NULL AND 
  (user_id = auth.uid() OR user_id IS NULL) AND
  email = auth.email()
);

-- Allow users to view only their own entries
CREATE POLICY "Users can view their own waitlist entries" ON public.waitlist
FOR SELECT USING (
  auth.uid() IS NOT NULL AND 
  email = auth.email()
);

-- Update waitlist table to ensure user_id is properly set
-- Make user_id NOT NULL to prevent RLS bypass
ALTER TABLE public.waitlist 
ALTER COLUMN user_id SET NOT NULL;

-- Update any existing NULL user_id values (this will fail if there are orphaned records)
-- Note: If this fails, it means there are waitlist entries without proper user association
-- Those should be reviewed and either assigned to users or removed