-- Adjust buffer slots to match expected availability
UPDATE public.capacity 
SET buffer_slots = 1, updated_at = now() 
WHERE id = 1;