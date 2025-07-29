-- Add temperature field to people table
ALTER TABLE public.people 
ADD COLUMN temperature DECIMAL(2,1) DEFAULT 0.7 CHECK (temperature >= 0.0 AND temperature <= 1.0);