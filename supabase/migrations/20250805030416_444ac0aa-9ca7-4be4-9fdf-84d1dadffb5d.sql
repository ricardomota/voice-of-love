-- Criar tabela para armazenar arquivos de áudio das pessoas
CREATE TABLE IF NOT EXISTS public.audio_files (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  person_id UUID NOT NULL,
  file_name TEXT NOT NULL,
  file_url TEXT NOT NULL,
  duration INTEGER,
  transcription TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  FOREIGN KEY (person_id) REFERENCES public.people(id) ON DELETE CASCADE
);

-- Enable RLS
ALTER TABLE public.audio_files ENABLE ROW LEVEL SECURITY;

-- Create policies for audio files
CREATE POLICY "Users can view audio files of their people" 
ON public.audio_files 
FOR SELECT 
USING (EXISTS (
  SELECT 1 FROM people 
  WHERE people.id = audio_files.person_id 
  AND people.user_id = auth.uid()
));

CREATE POLICY "Users can create audio files for their people" 
ON public.audio_files 
FOR INSERT 
WITH CHECK (EXISTS (
  SELECT 1 FROM people 
  WHERE people.id = audio_files.person_id 
  AND people.user_id = auth.uid()
));

CREATE POLICY "Users can update audio files of their people" 
ON public.audio_files 
FOR UPDATE 
USING (EXISTS (
  SELECT 1 FROM people 
  WHERE people.id = audio_files.person_id 
  AND people.user_id = auth.uid()
));

CREATE POLICY "Users can delete audio files of their people" 
ON public.audio_files 
FOR DELETE 
USING (EXISTS (
  SELECT 1 FROM people 
  WHERE people.id = audio_files.person_id 
  AND people.user_id = auth.uid()
));