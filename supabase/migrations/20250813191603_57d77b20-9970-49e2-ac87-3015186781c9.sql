-- Add new columns to waitlist table for better user insights
ALTER TABLE public.waitlist 
ADD COLUMN primary_interest text,
ADD COLUMN how_did_you_hear text;