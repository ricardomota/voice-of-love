import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.38.0';

const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
const supabaseServiceRoleKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface PIIScrubRequest {
  transcriptId: string;
  text: string;
  language?: string;
}

// Simple PII detection patterns for basic scrubbing
const PII_PATTERNS = {
  // Email addresses
  email: /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/gi,
  
  // Phone numbers (various formats)
  phone: /(\+?1[-.\s]?)?\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}/g,
  
  // Credit card numbers (basic pattern)
  creditCard: /\b(?:\d{4}[-\s]?){3}\d{4}\b/g,
  
  // Social Security Numbers (US format)
  ssn: /\b\d{3}-\d{2}-\d{4}\b/g,
  
  // Brazilian CPF
  cpf: /\b\d{3}\.\d{3}\.\d{3}-\d{2}\b/g,
  
  // Brazilian RG
  rg: /\b\d{1,2}\.\d{3}\.\d{3}-\d{1,2}\b/g,
  
  // URLs
  url: /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)/gi,
  
  // Bank account patterns (simple)
  bankAccount: /\b(?:account|conta|acc|no\.?)\s*:?\s*\d{4,}\b/gi,
  
  // Addresses (basic pattern)
  address: /\b\d+\s+[A-Za-z\s]+(street|st|avenue|ave|road|rd|lane|ln|drive|dr|boulevard|blvd)\b/gi,
  
  // Passwords/keys (common indicators)
  password: /\b(?:password|senha|pass|pwd|key|chave|token)\s*[:=]\s*\S+/gi,
  
  // Common sensitive number patterns
  sensitiveNumbers: /\b(?:pin|código|code|numero|number)\s*[:=]?\s*\d{4,}\b/gi
};

function scrubPII(text: string, language: string = 'en'): { redactedText: string; piiMap: Record<string, string[]>; redactionCount: number } {
  let redactedText = text;
  const piiMap: Record<string, string[]> = {};
  let redactionCount = 0;

  // Apply each pattern
  Object.entries(PII_PATTERNS).forEach(([type, pattern]) => {
    const matches = text.match(pattern);
    if (matches) {
      piiMap[type] = matches;
      redactionCount += matches.length;
      
      // Replace with appropriate tokens
      const token = `[REDACTED_${type.toUpperCase()}]`;
      redactedText = redactedText.replace(pattern, token);
    }
  });

  // Additional context-aware scrubbing for Portuguese
  if (language === 'pt' || language === 'pt-BR') {
    // Brazilian specific patterns
    const brazilianPatterns = {
      cep: /\b\d{5}-?\d{3}\b/g, // Brazilian postal code
      cnpj: /\b\d{2}\.\d{3}\.\d{3}\/\d{4}-\d{2}\b/g, // Brazilian company ID
    };

    Object.entries(brazilianPatterns).forEach(([type, pattern]) => {
      const matches = redactedText.match(pattern);
      if (matches) {
        if (!piiMap[type]) piiMap[type] = [];
        piiMap[type].push(...matches);
        redactionCount += matches.length;
        
        const token = `[REDACTED_${type.toUpperCase()}]`;
        redactedText = redactedText.replace(pattern, token);
      }
    });
  }

  return { redactedText, piiMap, redactionCount };
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

    const { transcriptId, text, language = 'en' }: PIIScrubRequest = await req.json();

    if (!transcriptId || !text) {
      throw new Error('Missing required fields: transcriptId, text');
    }

    console.log(`Starting PII scrubbing for transcript ${transcriptId}`);

    // Scrub PII from the text
    const { redactedText, piiMap, redactionCount } = scrubPII(text, language);

    // Save redaction record
    const { data: redaction, error: redactionError } = await supabase
      .from('redactions')
      .insert({
        transcript_id: transcriptId,
        pii_map_json: piiMap,
        redacted_text: redactedText,
        redaction_count: redactionCount
      })
      .select()
      .single();

    if (redactionError) {
      console.error('Error saving redaction:', redactionError);
      throw new Error('Failed to save redaction record');
    }

    // Get the upload ID from the transcript
    const { data: transcript, error: transcriptError } = await supabase
      .from('transcripts')
      .select('upload_id')
      .eq('id', transcriptId)
      .single();

    if (transcriptError) {
      throw new Error('Failed to find transcript');
    }

    // Update upload status to chunking
    await supabase
      .from('uploads')
      .update({ status: 'chunking' })
      .eq('id', transcript.upload_id);

    // Log audit event
    await supabase
      .from('audit_logs')
      .insert({
        user_id: user.id,
        action: 'pii_scrubbing_completed',
        resource_type: 'transcript',
        resource_id: transcriptId,
        metadata: {
          redaction_id: redaction.id,
          redaction_count: redactionCount,
          pii_types_found: Object.keys(piiMap),
          original_length: text.length,
          redacted_length: redactedText.length
        }
      });

    console.log(`PII scrubbing completed for transcript ${transcriptId}. Found ${redactionCount} PII items.`);

    return new Response(JSON.stringify({
      success: true,
      redaction_id: redaction.id,
      redaction_count: redactionCount,
      pii_types_found: Object.keys(piiMap),
      text_preview: redactedText.substring(0, 200) + '...'
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error in PII scrubbing function:', error);
    
    return new Response(JSON.stringify({ 
      error: error instanceof Error ? error.message : 'PII scrubbing failed' 
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});