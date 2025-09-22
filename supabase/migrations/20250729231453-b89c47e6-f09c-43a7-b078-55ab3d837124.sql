-- Adicionar novos campos para calibração da personalidade
ALTER TABLE public.people 
ADD COLUMN talking_style TEXT,
ADD COLUMN humor_style TEXT,
ADD COLUMN emotional_tone TEXT,
ADD COLUMN verbosity TEXT,
ADD COLUMN values TEXT[],
ADD COLUMN topics TEXT[];