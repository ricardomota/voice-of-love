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

interface ChunkEmbedRequest {
  redactionId: string;
  lovedOneId: string;
  uploadId: string;
}

// Generate embeddings using OpenAI
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
    const error = await response.text();
    throw new Error(`Embedding API error: ${error}`);
  }

  const result = await response.json();
  return result.data[0].embedding;
}

// Chunk text into smaller segments
function chunkText(text: string, maxTokens: number = 500, overlapTokens: number = 50): string[] {
  // Simple word-based chunking (approximation: 1 token ≈ 0.75 words)
  const words = text.split(' ');
  const maxWords = Math.floor(maxTokens * 0.75);
  const overlapWords = Math.floor(overlapTokens * 0.75);
  
  if (words.length <= maxWords) {
    return [text];
  }

  const chunks: string[] = [];
  let startIndex = 0;

  while (startIndex < words.length) {
    const endIndex = Math.min(startIndex + maxWords, words.length);
    const chunk = words.slice(startIndex, endIndex).join(' ');
    chunks.push(chunk);
    
    // Move forward, but include overlap
    startIndex = endIndex - overlapWords;
    
    // If remaining text is smaller than overlap, break to avoid infinite loop
    if (words.length - startIndex <= overlapWords) {
      break;
    }
  }

  return chunks;
}

// Extract topics/tags from text
function extractTags(text: string): string[] {
  const tags: string[] = [];
  
  // Simple keyword extraction
  const keywords = [
    'família', 'family', 'amor', 'love', 'saudade', 'miss',
    'viagem', 'travel', 'trabalho', 'work', 'escola', 'school',
    'saúde', 'health', 'dinheiro', 'money', 'casa', 'home',
    'festa', 'party', 'aniversário', 'birthday', 'natal', 'christmas',
    'páscoa', 'easter', 'futebol', 'football', 'soccer',
    'comida', 'food', 'restaurante', 'restaurant'
  ];

  const lowerText = text.toLowerCase();
  keywords.forEach(keyword => {
    if (lowerText.includes(keyword)) {
      tags.push(keyword);
    }
  });

  return [...new Set(tags)]; // Remove duplicates
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

    const { redactionId, lovedOneId, uploadId }: ChunkEmbedRequest = await req.json();

    if (!redactionId || !lovedOneId || !uploadId) {
      throw new Error('Missing required fields: redactionId, lovedOneId, uploadId');
    }

    if (!openAIApiKey) {
      throw new Error('OpenAI API key not configured');
    }

    console.log(`Starting chunking and embedding for redaction ${redactionId}`);

    // Get the redacted text
    const { data: redaction, error: redactionError } = await supabase
      .from('redactions')
      .select('redacted_text')
      .eq('id', redactionId)
      .single();

    if (redactionError || !redaction) {
      throw new Error('Redaction record not found');
    }

    // Chunk the text
    const chunks = chunkText(redaction.redacted_text);
    console.log(`Created ${chunks.length} chunks from text`);

    // Process each chunk
    const chunkPromises = chunks.map(async (chunkText, index) => {
      try {
        // Generate embedding
        const embedding = await generateEmbedding(chunkText);
        
        // Extract tags
        const tags = extractTags(chunkText);
        
        // Save chunk to database
        const { data: savedChunk, error: chunkError } = await supabase
          .from('chunks')
          .insert({
            loved_one_id: lovedOneId,
            source_id: uploadId,
            chunk_text: chunkText,
            embedding: embedding,
            tags: tags,
            start_ms: null, // Will be null for text-only chunks
            end_ms: null
          })
          .select()
          .single();

        if (chunkError) {
          console.error(`Error saving chunk ${index}:`, chunkError);
          throw chunkError;
        }

        return savedChunk;
      } catch (error) {
        console.error(`Error processing chunk ${index}:`, error);
        throw error;
      }
    });

    // Wait for all chunks to be processed
    const savedChunks = await Promise.all(chunkPromises);
    console.log(`Saved ${savedChunks.length} chunks with embeddings`);

    // Update upload status to indexed
    await supabase
      .from('uploads')
      .update({ status: 'indexed' })
      .eq('id', uploadId);

    // Log audit event
    await supabase
      .from('audit_logs')
      .insert({
        user_id: user.id,
        action: 'chunking_embedding_completed',
        resource_type: 'upload',
        resource_id: uploadId,
        metadata: {
          redaction_id: redactionId,
          chunks_created: savedChunks.length,
          total_text_length: redaction.redacted_text.length,
          embedding_model: 'text-embedding-ada-002'
        }
      });

    return new Response(JSON.stringify({
      success: true,
      chunks_created: savedChunks.length,
      status: 'indexed'
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error in chunk-embed function:', error);
    
    // Try to update upload status to failed
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
      error: error.message || 'Chunking and embedding failed' 
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});