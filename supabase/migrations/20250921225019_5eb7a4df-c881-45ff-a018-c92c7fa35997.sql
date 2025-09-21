-- SECURITY FIX: Restrict waitlist table access to prevent email harvesting
-- Remove the overly permissive SELECT policy that allows authenticated users to view any waitlist entry

-- Drop the current problematic SELECT policy
DROP POLICY IF EXISTS "Users can view their waitlist entries" ON public.waitlist;

-- Create a secure policy that only allows users to view their own entries (by user_id, not email)
CREATE POLICY "Users can view only their own waitlist entries by user_id" 
ON public.waitlist 
FOR SELECT 
USING (auth.uid() IS NOT NULL AND user_id = auth.uid());

-- Keep the service role policy for admin management (this is secure)
-- Keep the INSERT policy for anonymous signups (this is necessary for functionality)

-- Add additional security: Prevent unauthorized updates and deletes
CREATE POLICY "Users cannot update waitlist entries" 
ON public.waitlist 
FOR UPDATE 
USING (false);

CREATE POLICY "Users cannot delete waitlist entries" 
ON public.waitlist 
FOR DELETE 
USING (false);

-- Only service role can update/delete for admin management
CREATE POLICY "Service role can update waitlist entries" 
ON public.waitlist 
FOR UPDATE 
USING (auth.role() = 'service_role');

CREATE POLICY "Service role can delete waitlist entries" 
ON public.waitlist 
FOR DELETE 
USING (auth.role() = 'service_role');