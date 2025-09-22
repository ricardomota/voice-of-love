import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.38.0';

const openAIApiKey = Deno.env.get('OPENAI_API_KEY');
const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
const supabaseServiceRoleKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface TranscriptionRequest {
  uploadId: string;
  audioUrl: string;
  language?: string;
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabase = createClient(supabaseUrl, supabaseServiceRoleKey);
    
    // Get the authorization header
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      throw new Error('Missing authorization header');
    }

    // Verify the JWT token
    const token = authHeader.replace('Bearer ', '');
    const { data: { user }, error: authError } = await supabase.auth.getUser(token);
    
    if (authError || !user) {
      throw new Error('Invalid or expired token');
    }

    const { uploadId, audioUrl, language = 'en' }: TranscriptionRequest = await req.json();

    if (!uploadId || !audioUrl) {
      throw new Error('Missing required fields: uploadId, audioUrl');
    }

    if (!openAIApiKey) {
      throw new Error('OpenAI API key not configured');
    }

    console.log(`Starting transcription for upload ${uploadId}`);

    // Update upload status to transcribing
    await supabase
      .from('uploads')
      .update({ status: 'transcribing' })
      .eq('id', uploadId)
      .eq('user_id', user.id);

    // Fetch the audio file
    const audioResponse = await fetch(audioUrl);
    if (!audioResponse.ok) {
      throw new Error(`Failed to fetch audio file: ${audioResponse.statusText}`);
    }

    const audioBlob = await audioResponse.blob();
    
    // Prepare form data for Whisper API
    const formData = new FormData();
    formData.append('file', audioBlob, 'audio.wav');
    formData.append('model', 'whisper-1');
    formData.append('language', language);
    formData.append('response_format', 'verbose_json');
    formData.append('timestamp_granularities[]', 'word');

    // Call Whisper API
    const whisperResponse = await fetch('https://api.openai.com/v1/audio/transcriptions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openAIApiKey}`,
      },
      body: formData,
    });

    if (!whisperResponse.ok) {
      const error = await whisperResponse.text();
      throw new Error(`Whisper API error: ${error}`);
    }

    const transcriptionResult = await whisperResponse.json();
    console.log(`Transcription completed for upload ${uploadId}`);

    // Save transcript to database
    const { data: transcript, error: transcriptError } = await supabase
      .from('transcripts')
      .insert({
        upload_id: uploadId,
        language: transcriptionResult.language || language,
        raw_text: transcriptionResult.text,
        confidence_score: 0.95, // Whisper doesn't provide confidence, using default
        diarization_json: {
          words: transcriptionResult.words || [],
          segments: transcriptionResult.segments || []
        }
      })
      .select()
      .single();

    if (transcriptError) {
      console.error('Error saving transcript:', transcriptError);
      throw new Error('Failed to save transcript');
    }

    // Update upload status
    await supabase
      .from('uploads')
      .update({ status: 'scrubbing' })
      .eq('id', uploadId);

    // Log audit event
    await supabase
      .from('audit_logs')
      .insert({
        user_id: user.id,
        action: 'transcription_completed',
        resource_type: 'upload',
        resource_id: uploadId,
        metadata: {
          transcript_id: transcript.id,
          language: transcriptionResult.language,
          duration: transcriptionResult.duration || 0,
          word_count: transcriptionResult.text.split(' ').length
        }
      });

    return new Response(JSON.stringify({
      success: true,
      transcript_id: transcript.id,
      text_preview: transcriptionResult.text.substring(0, 200) + '...',
      language: transcriptionResult.language,
      duration: transcriptionResult.duration || 0
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error in transcribe function:', error);
    
    // Try to update upload status to failed if we have the upload ID
    try {
      const body = await req.clone().json();
      if (body.uploadId) {
        const supabase = createClient(supabaseUrl, supabaseServiceRoleKey);
        await supabase
          .from('uploads')
          .update({ status: 'failed' })
          .eq('id', body.uploadId);
      }
    } catch (e) {
      console.error('Failed to update upload status:', e);
    }

    return new Response(JSON.stringify({ 
      error: error.message || 'Transcription failed' 
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});