import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const logStep = (step: string, details?: any) => {
  const detailsStr = details ? ` - ${JSON.stringify(details)}` : '';
  console.log(`[VOICE-DEMO] ${step}${detailsStr}`);
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    logStep("Starting voice demo request");

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

    const { action, seconds_played } = await req.json();

    if (action === "start") {
      // Get subscription info to validate demo eligibility
      const { data: subscriptionInfo, error: infoError } = await supabaseClient
        .rpc('get_user_subscription_info', { user_id: user.id });

      if (infoError) throw new Error(`Failed to get subscription info: ${infoError.message}`);

      // Validate demo eligibility
      if (subscriptionInfo.plan !== 'free') {
        throw new Error("Demo is only available for free plan users");
      }

      const demoSecondsTotal = subscriptionInfo.entitlements.demo_seconds_total;
      const demoSecondsUsed = subscriptionInfo.usage.free_demo_seconds_used;

      if (demoSecondsUsed >= demoSecondsTotal) {
        throw new Error("Demo limit exceeded");
      }

      // Check onboarding requirement if enabled
      if (subscriptionInfo.entitlements.demo_requires_onboarding) {
        const emailVerified = user.email_confirmed_at ? true : false;
        
        // Check if user has at least one memory created
        const { count: memoryCount } = await supabaseClient
          .from('memories')
          .select('*', { count: 'exact', head: true })
          .eq('person_id', user.id);

        if (!emailVerified && (memoryCount || 0) === 0) {
          throw new Error("Please verify your email or create a memory to unlock the demo");
        }
      }

      const remainingSeconds = demoSecondsTotal - demoSecondsUsed;
      
      logStep("Demo validated", { remainingSeconds });

      // Generate demo audio using ElevenLabs with generic voice
      const elevenLabsKey = Deno.env.get("ELEVENLABS_API_KEY");
      if (!elevenLabsKey) {
        throw new Error("ElevenLabs API key not configured");
      }

      const demoText = "Hello! This is a demonstration of Eterna's voice technology. You can hear how natural and lifelike our voices sound.";
      
      const response = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/21m00Tcm4TlvDq8ikWAM`, {
        method: 'POST',
        headers: {
          'Accept': 'audio/mpeg',
          'Content-Type': 'application/json',
          'xi-api-key': elevenLabsKey,
        },
        body: JSON.stringify({
          text: demoText,
          model_id: "eleven_multilingual_v1",
          voice_settings: {
            stability: 0.5,
            similarity_boost: 0.5
          }
        })
      });

      if (!response.ok) {
        throw new Error(`ElevenLabs API error: ${response.statusText}`);
      }

      const audioBuffer = await response.arrayBuffer();
      const base64Audio = btoa(String.fromCharCode(...new Uint8Array(audioBuffer)));

      return new Response(JSON.stringify({
        audio_content: base64Audio,
        remaining_seconds: remainingSeconds,
        demo_text: demoText
      }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200,
      });

    } else if (action === "consume") {
      // Update usage counter
      if (!seconds_played || seconds_played <= 0) {
        throw new Error("Invalid seconds_played value");
      }

      const currentPeriod = new Date().toISOString().slice(0, 7); // YYYY-MM format

      // Update usage
      const { error: updateError } = await supabaseClient
        .from('usage_counters')
        .upsert({
          user_id: user.id,
          period: currentPeriod,
          free_demo_seconds_used: seconds_played
        }, {
          onConflict: 'user_id,period',
          ignoreDuplicates: false
        });

      if (updateError) {
        throw new Error(`Failed to update usage: ${updateError.message}`);
      }

      // Get updated info
      const { data: updatedInfo } = await supabaseClient
        .rpc('get_user_subscription_info', { user_id: user.id });

      const demoSecondsTotal = updatedInfo.entitlements.demo_seconds_total;
      const demoSecondsUsed = updatedInfo.usage.free_demo_seconds_used;
      const remainingSeconds = Math.max(0, demoSecondsTotal - demoSecondsUsed);

      logStep("Usage updated", { seconds_played, remainingSeconds });

      return new Response(JSON.stringify({
        remaining_seconds: remainingSeconds,
        demo_exhausted: remainingSeconds === 0
      }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200,
      });
    }

    throw new Error("Invalid action. Use 'start' or 'consume'");

  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    logStep("ERROR in voice-demo", { message: errorMessage });
    
    return new Response(JSON.stringify({ error: errorMessage }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 500,
    });
  }
});