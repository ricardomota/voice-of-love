-- Update waitlist table to allow anonymous signups (user_id can be null)
-- and add policy for public waitlist signup

-- First, allow NULL user_id values in waitlist table
ALTER TABLE public.waitlist ALTER COLUMN user_id DROP NOT NULL;

-- Update the existing policy to allow anonymous signups
DROP POLICY IF EXISTS "Users can insert their own waitlist entries" ON public.waitlist;

-- Create a new policy that allows anyone to sign up for the waitlist
CREATE POLICY "Anyone can join waitlist" 
ON public.waitlist 
FOR INSERT 
WITH CHECK (true);

-- Keep the existing policy for viewing your own entries, but make it work with email matching for anonymous users
DROP POLICY IF EXISTS "Users can view their own waitlist entries" ON public.waitlist;

CREATE POLICY "Users can view their waitlist entries" 
ON public.waitlist 
FOR SELECT 
USING (
  (auth.uid() IS NOT NULL AND user_id = auth.uid()) OR
  (auth.uid() IS NOT NULL AND email = auth.email())
);