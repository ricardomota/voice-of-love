import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const logStep = (step: string, details?: any) => {
  const detailsStr = details ? ` - ${JSON.stringify(details)}` : '';
  console.log(`[CHAT-SEND] ${step}${detailsStr}`);
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    logStep("Starting chat request");

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

    const { messages, persona_id } = await req.json();

    if (!messages || !Array.isArray(messages)) {
      throw new Error("Messages array is required");
    }

    // Get subscription info to validate chat limits
    const { data: subscriptionInfo, error: infoError } = await supabaseClient
      .rpc('get_user_subscription_info', { user_id: user.id });

    if (infoError) throw new Error(`Failed to get subscription info: ${infoError.message}`);

    // Check chat limits
    const chatLimit = subscriptionInfo.entitlements.chat_limit_monthly;
    const chatUsed = subscriptionInfo.usage.chat_interactions_used;

    if (chatLimit !== -1 && chatUsed >= chatLimit) {
      throw new Error(`Chat limit exceeded. You have used ${chatUsed}/${chatLimit} interactions this month.`);
    }

    logStep("Chat limits validated", { chatLimit, chatUsed });

    // Get persona information if provided
    let personaContext = "";
    if (persona_id) {
      const { data: person } = await supabaseClient
        .from('people')
        .select('*')
        .eq('id', persona_id)
        .eq('user_id', user.id)
        .single();

      if (person) {
        personaContext = `
You are ${person.name}, a ${person.relationship}. 
Personality traits: ${person.personality?.join(', ') || 'Not specified'}
Talking style: ${person.talking_style || 'Natural'}
Emotional tone: ${person.emotional_tone || 'Warm'}
Common phrases you might use: ${person.common_phrases?.join(', ') || 'None specified'}
How you call the user: ${person.how_they_called_you || 'by their name'}

Respond as this person would, staying true to their personality and relationship with the user.
        `;
      }
    }

    // Prepare messages for OpenAI
    const systemMessage = {
      role: "system",
      content: personaContext || "You are a helpful AI assistant for Eterna, designed to have meaningful conversations and provide support."
    };

    const conversationMessages = [systemMessage, ...messages];

    logStep("Calling OpenAI", { messageCount: conversationMessages.length });

    // Call OpenAI API
    const openAIKey = Deno.env.get("OPENAI_API_KEY");
    if (!openAIKey) {
      throw new Error("OpenAI API key not configured");
    }

    const openAIResponse = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${openAIKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        messages: conversationMessages,
        max_tokens: 1000,
        temperature: 0.7,
      }),
    });

    if (!openAIResponse.ok) {
      const errorText = await openAIResponse.text();
      throw new Error(`OpenAI API error: ${errorText}`);
    }

    const openAIData = await openAIResponse.json();
    const reply = openAIData.choices[0].message.content;
    const usage = openAIData.usage;

    logStep("OpenAI response received", { 
      promptTokens: usage.prompt_tokens, 
      completionTokens: usage.completion_tokens 
    });

    // Update usage counter
    const currentPeriod = new Date().toISOString().slice(0, 7); // YYYY-MM format
    
    const { error: updateError } = await supabaseClient
      .from('usage_counters')
      .upsert({
        user_id: user.id,
        period: currentPeriod,
        chat_interactions_used: chatUsed + 1
      }, {
        onConflict: 'user_id,period'
      });

    if (updateError) {
      logStep("Failed to update usage counter", updateError);
      // Don't throw error here, just log it as the chat was successful
    }

    logStep("Usage updated", { newChatCount: chatUsed + 1 });

    return new Response(JSON.stringify({
      reply,
      usage: {
        prompt_tokens: usage.prompt_tokens,
        completion_tokens: usage.completion_tokens,
        total_tokens: usage.total_tokens
      },
      interactions_remaining: chatLimit === -1 ? -1 : Math.max(0, chatLimit - (chatUsed + 1))
    }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200,
    });

  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    logStep("ERROR in chat-send", { message: errorMessage });
    
    return new Response(JSON.stringify({ error: errorMessage }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 500,
    });
  }
});