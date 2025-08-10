import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.53.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface ChatMessage {
  role: "system" | "user" | "assistant";
  content: string;
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { messages, systemPrompt, temperature = 0.7 } = await req.json();

    if (!Array.isArray(messages)) {
      throw new Error("Invalid payload: messages must be an array");
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
    const supabaseAnonKey = Deno.env.get("SUPABASE_ANON_KEY") ?? "";
    const supabase = createClient(supabaseUrl, supabaseAnonKey, {
      global: { headers: { Authorization: `Bearer ${token}` } },
      auth: { persistSession: false },
    });

    // Identify user
    const { data: userData, error: userError } = await supabase.auth.getUser(token);
    if (userError || !userData?.user?.id) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const userId = userData.user.id;

    // Get user settings (plan and language)
    const { data: settings, error: settingsError } = await supabase
      .from("user_settings")
      .select("plan_id, ui_language")
      .eq("user_id", userId)
      .maybeSingle();

    if (settingsError) {
      console.error("Settings fetch error", settingsError);
    }

    const planId = settings?.plan_id ?? "free";
    const uiLanguage = settings?.ui_language ?? "en";

    // Load plan limits
    const { data: planRow } = await supabase
      .from("plans")
      .select("limits")
      .eq("plan_id", planId)
      .maybeSingle();

    const messageLimit = planRow?.limits?.messages_per_month ?? (planId === "free" ? 5 : 300);

    // Determine current period (YYYY-MM)
    const now = new Date();
    const period = `${now.getUTCFullYear()}-${String(now.getUTCMonth() + 1).padStart(2, "0")}`;

    // Fetch current usage
    const { data: usage, error: usageError } = await supabase
      .from("usage_counters")
      .select("messages_used, tts_seconds_used")
      .eq("user_id", userId)
      .eq("period", period)
      .maybeSingle();

    if (usageError) {
      console.error("Usage fetch error", usageError);
    }

    const messagesUsed = usage?.messages_used ?? 0;
    if (messagesUsed >= messageLimit) {
      return new Response(
        JSON.stringify({
          error: "limit_reached",
          title: "You’ve reached your limit.",
          body:
            "You’ve used all your messages or voice minutes for the month. Upgrade now to continue preserving and enjoying memories.",
          ctaPrimary: "Upgrade Now",
          ctaSecondary: "Maybe Later",
        }),
        { status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" } },
      );
    }

    // Compose messages with system prompt and language hint
    const composed: ChatMessage[] = [
      { role: "system", content: `${systemPrompt || "You are a helpful, warm companion."}\nLanguage: ${uiLanguage}` },
      ...messages,
    ];

    let aiResponse = "";
    let provider: "together" | "openai" = "together";

    if (planId === "free") {
      // Together.ai routing
      const togetherKey = Deno.env.get("TOGETHER_API_KEY");
      if (!togetherKey) {
        throw new Error("TOGETHER_API_KEY not configured");
      }

      // Allow override from config table
      const { data: cfg } = await supabase
        .from("config")
        .select("value")
        .eq("key", "llm_free_model")
        .maybeSingle();
      const model = cfg?.value || "meta-llama/Meta-Llama-3.1-8B-Instruct";

      const res = await fetch("https://api.together.ai/v1/chat/completions", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${togetherKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model,
          messages: composed,
          temperature,
          top_p: 0.9,
          max_tokens: 600,
        }),
      });

      if (!res.ok) {
        const tErr = await res.text();
        throw new Error(`Together API error: ${tErr}`);
      }
      const data = await res.json();
      aiResponse = data.choices?.[0]?.message?.content ?? "";
      provider = "together";
    } else {
      // OpenAI routing for paid plans
      const openAIApiKey = Deno.env.get("OPENAI_API_KEY");
      if (!openAIApiKey) {
        throw new Error("OPENAI_API_KEY not configured");
      }

      const res = await fetch("https://api.openai.com/v1/chat/completions", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${openAIApiKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "gpt-4o",
          messages: composed,
          temperature,
        }),
      });

      if (!res.ok) {
        const oErr = await res.text();
        throw new Error(`OpenAI API error: ${oErr}`);
      }
      const data = await res.json();
      aiResponse = data.choices?.[0]?.message?.content ?? "";
      provider = "openai";
    }

    // Update usage (upsert row if missing)
    if (usage) {
      await supabase
        .from("usage_counters")
        .update({ messages_used: (usage.messages_used ?? 0) + 1 })
        .eq("user_id", userId)
        .eq("period", period);
    } else {
      await supabase.from("usage_counters").insert({
        user_id: userId,
        period,
        messages_used: 1,
        tts_seconds_used: 0,
      });
    }

    return new Response(
      JSON.stringify({ response: aiResponse, provider, plan: planId }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } },
    );
  } catch (error) {
    console.error("Error in llm-router:", error);
    const message = error instanceof Error ? error.message : String(error);
    return new Response(JSON.stringify({ error: message }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
