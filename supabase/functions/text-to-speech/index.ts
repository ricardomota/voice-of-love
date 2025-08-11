import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.53.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface TTSRequest {
  text: string;
  language?: string;
  voiceSettings?: {
    stability?: number;
    similarity_boost?: number;
    style?: number;
    use_speaker_boost?: boolean;
  };
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { text, language = 'en', voiceSettings }: TTSRequest = await req.json();

    if (!text) {
      throw new Error("Text is required");
    }

    const authHeader = req.headers.get("Authorization");
    if (!authHeader) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const token = authHeader.replace("Bearer ", "");
    const supabaseUrl = Deno.env.get("SUPABASE_URL") ?? "";
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "";
    
    const supabase = createClient(supabaseUrl, supabaseServiceKey, {
      global: { headers: { Authorization: `Bearer ${token}` } },
      auth: { persistSession: false },
    });

    // Authenticate user
    const { data: userData, error: userError } = await supabase.auth.getUser(token);
    if (userError || !userData?.user?.id) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const userId = userData.user.id;

    // Get user settings and plan
    const { data: settings } = await supabase
      .from("user_settings")
      .select("plan_id, ui_language, preferred_base_voice_id")
      .eq("user_id", userId)
      .maybeSingle();

    const planId = settings?.plan_id ?? "free";
    const userLanguage = language || settings?.ui_language || 'en';

    // Load plan limits
    const { data: planRow } = await supabase
      .from("plans")
      .select("limits")
      .eq("plan_id", planId)
      .maybeSingle();

    const ttsLimit = planRow?.limits?.tts_seconds_per_month ?? (planId === "free" ? 60 : 900);

    // Check current usage
    const now = new Date();
    const period = `${now.getUTCFullYear()}-${String(now.getUTCMonth() + 1).padStart(2, "0")}`;

    const { data: usage } = await supabase
      .from("usage_counters")
      .select("tts_seconds_used")
      .eq("user_id", userId)
      .eq("period", period)
      .maybeSingle();

    const ttsUsed = usage?.tts_seconds_used ?? 0;
    
    // Estimate duration (roughly 150 words per minute, avg 5 chars per word)
    const estimatedDuration = Math.ceil(text.length / 750 * 60); // rough estimate in seconds
    
    if (ttsUsed + estimatedDuration > ttsLimit) {
      return new Response(
        JSON.stringify({
          error: "tts_limit_reached",
          title: "You've reached your limit.",
          body: "You've used all your voice minutes for the month. Upgrade now to continue preserving and enjoying memories.",
          ctaPrimary: "Upgrade Now",
          ctaSecondary: "Maybe Later",
        }),
        { status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    let voiceId = "";
    let useClonedVoice = false;

    // Check if user has a custom voice clone for this language (paid plan only)
    if (planId !== "free") {
      const { data: userVoice } = await supabase
        .from("user_voice_assets")
        .select("provider_id")
        .eq("user_id", userId)
        .eq("lang", userLanguage)
        .eq("type", "clone")
        .maybeSingle();

      if (userVoice?.provider_id) {
        voiceId = userVoice.provider_id;
        useClonedVoice = true;
      }
    }

    // If no cloned voice, use base voice
    if (!voiceId) {
      // Get user's preferred base voice or default for language
      if (settings?.preferred_base_voice_id) {
        const { data: preferredVoice } = await supabase
          .from("voices_base")
          .select("voice_key")
          .eq("id", settings.preferred_base_voice_id)
          .contains("lang_supported", [userLanguage])
          .maybeSingle();
        
        voiceId = preferredVoice?.voice_key;
      }

      // Fallback to first available base voice for language
      if (!voiceId) {
        const { data: baseVoice } = await supabase
          .from("voices_base")
          .select("voice_key")
          .eq("provider", "elevenlabs")
          .contains("lang_supported", [userLanguage])
          .limit(1)
          .maybeSingle();

        voiceId = baseVoice?.voice_key || "9BWtsMINqrJLrRacOk9x"; // Default to Aria
      }
    }

    const elevenLabsApiKey = Deno.env.get("ELEVENLABS_API_KEY");
    if (!elevenLabsApiKey) {
      throw new Error("ELEVENLABS_API_KEY not configured");
    }

    // Prepare voice settings
    const defaultSettings = {
      stability: 0.5,
      similarity_boost: 0.8,
      style: 0.0,
      use_speaker_boost: true,
    };

    const finalVoiceSettings = { ...defaultSettings, ...voiceSettings };

    // Call ElevenLabs API
    const response = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${voiceId}`, {
      method: "POST",
      headers: {
        "Accept": "audio/mpeg",
        "Content-Type": "application/json",
        "xi-api-key": elevenLabsApiKey,
      },
      body: JSON.stringify({
        text,
        model_id: "eleven_multilingual_v2",
        voice_settings: finalVoiceSettings,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`ElevenLabs API error: ${errorText}`);
    }

    // Get audio buffer and convert to base64
    const audioBuffer = await response.arrayBuffer();
    const base64Audio = btoa(String.fromCharCode(...new Uint8Array(audioBuffer)));

    // Update usage counter
    const actualDuration = Math.ceil(audioBuffer.byteLength / 4000); // rough estimate based on file size
    
    if (usage) {
      await supabase
        .from("usage_counters")
        .update({ tts_seconds_used: (usage.tts_seconds_used ?? 0) + actualDuration })
        .eq("user_id", userId)
        .eq("period", period);
    } else {
      await supabase.from("usage_counters").insert({
        user_id: userId,
        period,
        messages_used: 0,
        tts_seconds_used: actualDuration,
      });
    }

    return new Response(
      JSON.stringify({ 
        audioContent: base64Audio,
        voiceId,
        useClonedVoice,
        duration: actualDuration,
        remainingSeconds: ttsLimit - ttsUsed - actualDuration
      }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );

  } catch (error) {
    console.error("Error in text-to-speech:", error);
    const message = error instanceof Error ? error.message : String(error);
    return new Response(JSON.stringify({ error: message }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});