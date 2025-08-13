-- Create waitlist table
CREATE TABLE public.waitlist (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  email TEXT NOT NULL UNIQUE,
  full_name TEXT NOT NULL,
  message TEXT,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.waitlist ENABLE ROW LEVEL SECURITY;

-- Create policies for waitlist
CREATE POLICY "Anyone can join waitlist" 
ON public.waitlist 
FOR INSERT 
WITH CHECK (true);

-- Create trigger for timestamps
CREATE TRIGGER update_waitlist_updated_at
BEFORE UPDATE ON public.waitlist
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Create beta_access table to control who has access
CREATE TABLE public.beta_access (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  email TEXT NOT NULL UNIQUE,
  access_code TEXT NOT NULL UNIQUE DEFAULT substring(md5(random()::text) from 1 for 8),
  used_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.beta_access ENABLE ROW LEVEL SECURITY;

-- Create policies for beta_access
CREATE POLICY "Anyone can check access" 
ON public.beta_access 
FOR SELECT 
USING (true);

CREATE POLICY "Users can update their own access" 
ON public.beta_access 
FOR UPDATE 
USING (true);

-- Insert some initial beta testers (you can modify these emails)
INSERT INTO public.beta_access (email) VALUES 
('admin@eterna.com'),
('beta@eterna.com'),
('test@eterna.com');