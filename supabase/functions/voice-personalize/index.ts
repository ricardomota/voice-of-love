import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const logStep = (step: string, details?: any) => {
  const detailsStr = details ? ` - ${JSON.stringify(details)}` : '';
  console.log(`[VOICE-PERSONALIZE] ${step}${detailsStr}`);
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    logStep("Starting voice personalization request");

    const supabaseClient = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "",
      { auth: { persistSession: false } }
    );

    // Get user from auth header
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) {
      throw new Error("No authorization header provided");
    }

    const token = authHeader.replace("Bearer ", "");
    const { data: userData, error: userError } = await supabaseClient.auth.getUser(token);
    if (userError) throw new Error(`Authentication error: ${userError.message}`);
    
    const user = userData.user;
    if (!user?.id) throw new Error("User not authenticated");
    
    logStep("User authenticated", { userId: user.id });

    // Get subscription info to validate eligibility
    const { data: subscriptionInfo, error: infoError } = await supabaseClient
      .rpc('get_user_subscription_info', { user_id: user.id });

    if (infoError) throw new Error(`Failed to get subscription info: ${infoError.message}`);

    // Validate plan eligibility
    if (subscriptionInfo.plan !== 'complete') {
      throw new Error("Personalized voice is only available for Complete plan users");
    }

    // Check slot availability
    const slotsAvailable = subscriptionInfo.capacity.slots_available;
    
    if (slotsAvailable <= 0) {
      logStep("No slots available, adding to waitlist");
      
      // Add to waitlist instead
      const { error: waitlistError } = await supabaseClient
        .from('waitlist')
        .insert({
          user_id: user.id,
          email: user.email || '',
          full_name: user.user_metadata?.full_name || user.email?.split('@')[0] || 'User',
          status: 'queued',
          primary_interest: 'voice_personalization'
        });

      if (waitlistError && waitlistError.code !== '23505') { // Ignore duplicate entries
        throw new Error(`Failed to add to waitlist: ${waitlistError.message}`);
      }

      return new Response(JSON.stringify({
        status: 'queued',
        message: 'No slots available. You have been added to the waitlist and will be notified when a slot becomes available.'
      }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200,
      });
    }

    // Check if user already has a personalized voice
    const { data: existingVoice } = await supabaseClient
      .from('voices')
      .select('*')
      .eq('user_id', user.id)
      .eq('type', 'personalized')
      .eq('status', 'active')
      .single();

    if (existingVoice) {
      return new Response(JSON.stringify({
        status: 'exists',
        voice_id: existingVoice.id,
        eleven_voice_id: existingVoice.eleven_voice_id,
        message: 'You already have an active personalized voice.'
      }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200,
      });
    }

    // Get request data (audio files for voice cloning)
    const { audio_files, voice_name, description } = await req.json();

    if (!audio_files || !Array.isArray(audio_files) || audio_files.length === 0) {
      throw new Error("Audio files are required for voice personalization");
    }

    // Create voice using ElevenLabs Instant Voice Cloning
    const elevenLabsKey = Deno.env.get("ELEVENLABS_API_KEY");
    if (!elevenLabsKey) {
      throw new Error("ElevenLabs API key not configured");
    }

    logStep("Creating voice with ElevenLabs", { audioFilesCount: audio_files.length });

    // Prepare FormData for ElevenLabs API
    const formData = new FormData();
    formData.append('name', voice_name || `${user.email?.split('@')[0]}_voice`);
    formData.append('description', description || 'Personalized voice created with Eterna');

    // Add audio files
    audio_files.forEach((audioData: string, index: number) => {
      const audioBuffer = Uint8Array.from(atob(audioData), c => c.charCodeAt(0));
      const blob = new Blob([audioBuffer], { type: 'audio/wav' });
      formData.append('files', blob, `sample_${index + 1}.wav`);
    });

    // Create voice with ElevenLabs
    const voiceResponse = await fetch('https://api.elevenlabs.io/v1/voices/add', {
      method: 'POST',
      headers: {
        'xi-api-key': elevenLabsKey,
      },
      body: formData
    });

    if (!voiceResponse.ok) {
      const errorText = await voiceResponse.text();
      throw new Error(`ElevenLabs voice creation failed: ${errorText}`);
    }

    const voiceData = await voiceResponse.json();
    const elevenVoiceId = voiceData.voice_id;

    logStep("Voice created with ElevenLabs", { elevenVoiceId });

    // Create voice record in database
    const { data: newVoice, error: voiceError } = await supabaseClient
      .from('voices')
      .insert({
        user_id: user.id,
        type: 'personalized',
        status: 'active',
        eleven_voice_id: elevenVoiceId,
        last_used_at: new Date().toISOString()
      })
      .select()
      .single();

    if (voiceError) {
      // Try to clean up the ElevenLabs voice if database insert fails
      try {
        await fetch(`https://api.elevenlabs.io/v1/voices/${elevenVoiceId}`, {
          method: 'DELETE',
          headers: {
            'xi-api-key': elevenLabsKey,
          }
        });
      } catch (cleanupError) {
        logStep("Failed to cleanup ElevenLabs voice", cleanupError);
      }
      
      throw new Error(`Failed to create voice record: ${voiceError.message}`);
    }

    logStep("Voice record created", { voiceId: newVoice.id });

    return new Response(JSON.stringify({
      status: 'created',
      voice_id: newVoice.id,
      eleven_voice_id: elevenVoiceId,
      message: 'Your personalized voice has been successfully created!'
    }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200,
    });

  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    logStep("ERROR in voice-personalize", { message: errorMessage });
    
    return new Response(JSON.stringify({ error: errorMessage }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 500,
    });
  }
});