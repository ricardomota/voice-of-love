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

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Initialize Supabase client for authentication
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

    const { messages, systemPrompt, temperature = 0.7 } = await req.json();

    // Input validation
    if (!messages || !Array.isArray(messages)) {
      throw new Error('Messages must be a non-empty array');
    }

    if (messages.length === 0) {
      throw new Error('Messages array cannot be empty');
    }

    // Enhanced input validation and rate limiting
    const totalLength = messages.reduce((acc, msg) => acc + (msg.content?.length || 0), 0);
    if (totalLength > 5000) { // Reduced from 10000 for better security
      throw new Error('Message content too long');
    }

    // Validate individual message length
    for (const message of messages) {
      if (message.content && message.content.length > 2000) {
        throw new Error('Individual message too long');
      }
    }

    // Basic rate limiting check (implement redis-based rate limiting in production)
    const userAgent = req.headers.get('User-Agent') || '';
    if (userAgent.length === 0) {
      throw new Error('Missing user agent');
    }

    if (!openAIApiKey) {
      throw new Error('OpenAI API key not configured');
    }

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openAIApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4.1-2025-04-14',
        messages: [
          { role: 'system', content: systemPrompt },
          ...messages
        ],
        temperature: temperature,
        max_tokens: 200,
        frequency_penalty: 0.6,
        presence_penalty: 0.4,
        top_p: 0.9,
      }),
    });

    if (!response.ok) {
      const error = await response.text();
      throw new Error(`OpenAI API error: ${error}`);
    }

    const data = await response.json();
    const aiResponse = data.choices[0].message.content;

    return new Response(JSON.stringify({ response: aiResponse }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error in openai-chat function:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});