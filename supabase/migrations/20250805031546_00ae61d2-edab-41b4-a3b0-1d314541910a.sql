-- Migrar áudios existentes do voice_settings para a tabela audio_files
INSERT INTO audio_files (person_id, file_name, file_url, duration, transcription)
SELECT 
  p.id as person_id,
  COALESCE(audio_file->>'name', 'audio_' || ROW_NUMBER() OVER() || '.webm') as file_name,
  audio_file->>'url' as file_url,
  NULLIF(audio_file->>'duration', '')::integer as duration,
  audio_file->>'transcription' as transcription
FROM people p
CROSS JOIN LATERAL jsonb_array_elements(p.voice_settings->'audioFiles') AS audio_file
WHERE p.voice_settings ? 'audioFiles' 
  AND jsonb_array_length(p.voice_settings->'audioFiles') > 0;