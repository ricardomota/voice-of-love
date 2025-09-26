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

interface ChatRequest {
  sessionId: string;
  message: string;
  ragEnabled?: boolean;
  language?: string;
}

interface ChatMessage {
  role: 'user' | 'assistant' | 'system';
  content: string;
}

// Generate embeddings for semantic search
async function generateEmbedding(text: string): Promise<number[]> {
  const response = await fetch('https://api.openai.com/v1/embeddings', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${openAIApiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: 'text-embedding-ada-002',
      input: text
    }),
  });

  if (!response.ok) {
    throw new Error('Failed to generate embedding');
  }

  const result = await response.json();
  return result.data[0].embedding;
}

// Retrieve relevant memories using RAG
async function retrieveMemories(supabase: any, lovedOneId: string, query: string, limit: number = 5): Promise<string[]> {
  try {
    // Generate embedding for the query
    const queryEmbedding = await generateEmbedding(query);
    
    // Search for similar chunks using pgvector
    const { data: chunks, error } = await supabase.rpc('match_chunks', {
      loved_one_id: lovedOneId,
      query_embedding: queryEmbedding,
      match_threshold: 0.7,
      match_count: limit
    });

    if (error) {
      console.error('Error retrieving memories:', error);
      return [];
    }

    return chunks ? chunks.map((chunk: any) => chunk.chunk_text) : [];
  } catch (error) {
    console.error('Error in memory retrieval:', error);
    return [];
  }
}

// Build the system prompt for the clone
function buildSystemPrompt(lovedOneName: string, userFirstName: string, language: string, memories?: string[]): string {
  const basePrompt = language === 'pt' || language === 'pt-BR' ? 
    `Você é ${lovedOneName}, um membro da família carinhoso e solidário falando com ${userFirstName}. 
    Responda com afeto, usando seu estilo familiar de sempre. Seja breve, reconfortante e autêntico.
    Use expressões carinhosas apenas se estiverem presentes nos dados fornecidos.
    Nunca revele informações sensíveis, senhas, dados financeiros ou informações privadas de terceiros.
    Quando não souber algo, seja humilde e gentil. Evite conselhos médicos/financeiros; sugira ajuda profissional quando perguntado.
    Mantenha o tom carinhoso e fiel ao jeito da pessoa de falar.` :
    `You are ${lovedOneName}, a warm, supportive family member speaking to ${userFirstName}.
    Mirror their chosen language. Style: affectionate, brief, familiar, reassuring.
    Use authentic nicknames/emoji ONLY if present in data.
    Never reveal secrets, PII, passwords, codes, financial data, or private third-party info.
    When unsure, be humble and kind. Avoid medical/financial advice; suggest professional help when asked.
    Keep the tone caring and faithful to the loved one's way of speaking.`;

  if (memories && memories.length > 0) {
    const memorySection = language === 'pt' || language === 'pt-BR' ?
      `\n\nMemórias (informações pessoais):\n${memories.join('\n\n')}\n\nUse APENAS se relevante para a última mensagem. Não invente fatos.` :
      `\n\nMemories (personal information):\n${memories.join('\n\n')}\n\nUse ONLY if relevant to the user's last message. Do not invent facts.`;
    
    return basePrompt + memorySection;
  }

  return basePrompt;
}

// Safety check using OpenAI Moderation API
async function moderateContent(content: string): Promise<boolean> {
  try {
    const response = await fetch('https://api.openai.com/v1/moderations', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openAIApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ input: content }),
    });

    if (!response.ok) {
      console.error('Moderation API error');
      return false; // Err on the side of caution
    }

    const result = await response.json();
    return !result.results[0].flagged;
  } catch (error) {
    console.error('Error in content moderation:', error);
    return false; // Err on the side of caution
  }
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

    const { sessionId, message, ragEnabled = true, language = 'en' }: ChatRequest = await req.json();

    // Enhanced input validation
    if (!sessionId || !message) {
      throw new Error('Missing required fields: sessionId, message');
    }

    if (message.length > 2000) {
      throw new Error('Message too long');
    }

    if (sessionId.length > 36) {
      throw new Error('Invalid session ID format');
    }

    // Validate language parameter
    const validLanguages = ['en', 'pt', 'pt-BR', 'es', 'fr', 'de', 'it', 'ja', 'ko', 'zh-CN', 'zh-TW'];
    if (language && !validLanguages.includes(language)) {
      throw new Error('Invalid language parameter');
    }

    if (!openAIApiKey) {
      throw new Error('OpenAI API key not configured');
    }

    // Moderate the user's message
    const isSafe = await moderateContent(message);
    if (!isSafe) {
      throw new Error('Message content violates safety guidelines');
    }

    // Get session details
    const { data: session, error: sessionError } = await supabase
      .from('chat_sessions')
      .select(`
        *,
        loved_ones!inner(display_name, metadata)
      `)
      .eq('id', sessionId)
      .eq('user_id', user.id)
      .single();

    if (sessionError || !session) {
      throw new Error('Chat session not found');
    }

    // Get conversation history
    const { data: messageHistory, error: historyError } = await supabase
      .from('chat_messages')
      .select('role, content')
      .eq('session_id', sessionId)
      .order('created_at', { ascending: true })
      .limit(20); // Keep last 20 messages for context

    if (historyError) {
      console.error('Error fetching message history:', historyError);
    }

    // Save user message
    await supabase
      .from('chat_messages')
      .insert({
        session_id: sessionId,
        role: 'user',
        content: message
      });

    // Retrieve memories if RAG is enabled
    let memories: string[] = [];
    if (ragEnabled) {
      memories = await retrieveMemories(supabase, session.loved_one_id, message);
    }

    // Build system prompt
    const systemPrompt = buildSystemPrompt(
      session.loved_ones.display_name,
      user.email?.split('@')[0] || 'dear',
      language,
      memories.length > 0 ? memories : undefined
    );

    // Prepare conversation for GPT-4
    const conversation: ChatMessage[] = [
      { role: 'system', content: systemPrompt }
    ];

    // Add recent message history
    if (messageHistory) {
      conversation.push(...messageHistory.slice(-10) as ChatMessage[]);
    }

    // Add current message
    conversation.push({ role: 'user', content: message });

    // Call GPT-4
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openAIApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4',
        messages: conversation,
        max_tokens: 300,
        temperature: 0.7,
        frequency_penalty: 0.3,
        presence_penalty: 0.2,
      }),
    });

    if (!response.ok) {
      const error = await response.text();
      throw new Error(`OpenAI API error: ${error}`);
    }

    const aiResponse = await response.json();
    const assistantMessage = aiResponse.choices[0].message.content;

    // Additional safety check on the assistant's response
    const responseIsSafe = await moderateContent(assistantMessage);
    if (!responseIsSafe) {
      throw new Error('Generated response violates safety guidelines');
    }

    // Check for PII leakage in response (simple regex check)
    const piiPatterns = [
      /\[REDACTED_\w+\]/g,
      /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/gi,
      /\b\d{3}-\d{2}-\d{4}\b/g,
      /\b\d{3}\.\d{3}\.\d{3}-\d{2}\b/g
    ];

    const hasPII = piiPatterns.some(pattern => pattern.test(assistantMessage));
    if (hasPII) {
      throw new Error('Generated response contains sensitive information');
    }

    // Save assistant message
    const { data: savedMessage, error: saveError } = await supabase
      .from('chat_messages')
      .insert({
        session_id: sessionId,
        role: 'assistant',
        content: assistantMessage,
        metadata: {
          rag_enabled: ragEnabled,
          memories_used: memories.length,
          model_used: 'gpt-4'
        }
      })
      .select()
      .single();

    if (saveError) {
      console.error('Error saving message:', saveError);
    }

    // Log audit event
    await supabase
      .from('audit_logs')
      .insert({
        user_id: user.id,
        action: 'chat_message_sent',
        resource_type: 'chat_session',
        resource_id: sessionId,
        metadata: {
          message_id: savedMessage?.id,
          rag_enabled: ragEnabled,
          memories_retrieved: memories.length,
          language: language
        }
      });

    return new Response(JSON.stringify({
      success: true,
      message: assistantMessage,
      message_id: savedMessage?.id,
      memories_used: memories.length,
      rag_enabled: ragEnabled
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error in chat function:', error);
    
    // Return a safe fallback message
    const fallbackMessage = "I'm sorry, I'm having trouble responding right now. Please try again in a moment.";
    
    return new Response(JSON.stringify({ 
      error: error instanceof Error ? error.message : 'Chat request failed',
      fallback_message: fallbackMessage
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});