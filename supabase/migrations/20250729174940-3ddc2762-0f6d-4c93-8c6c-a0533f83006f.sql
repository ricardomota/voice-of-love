-- Criar bucket para armazenar arquivos de mídia
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'media',
  'media',
  true,
  52428800, -- 50MB limit
  ARRAY['image/*', 'video/*', 'audio/*']
);

-- Criar políticas para o bucket de mídia
CREATE POLICY "Users can view media files" 
ON storage.objects 
FOR SELECT 
USING (bucket_id = 'media');

CREATE POLICY "Users can upload their own media files" 
ON storage.objects 
FOR INSERT 
WITH CHECK (
  bucket_id = 'media' 
  AND auth.uid()::text = (storage.foldername(name))[1]
);

CREATE POLICY "Users can update their own media files" 
ON storage.objects 
FOR UPDATE 
USING (
  bucket_id = 'media' 
  AND auth.uid()::text = (storage.foldername(name))[1]
);

CREATE POLICY "Users can delete their own media files" 
ON storage.objects 
FOR DELETE 
USING (
  bucket_id = 'media' 
  AND auth.uid()::text = (storage.foldername(name))[1]
);