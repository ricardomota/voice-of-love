import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const openAIApiKey = Deno.env.get('OPENAI_API_KEY');

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { 
      conversation, 
      personProfile, 
      previousAnalytics 
    } = await req.json();

    if (!openAIApiKey) {
      throw new Error('OpenAI API key not configured');
    }

    // Análise de sentimentos e dinâmicas de relacionamento
    const analysisPrompt = `
Você é um especialista em análise psicológica e de relacionamentos. Analise esta conversa e retorne um JSON estruturado com:

CONVERSA ANALISADA:
${conversation.map((msg: any) => `${msg.isUser ? 'Usuário' : personProfile.name}: ${msg.content}`).join('\n')}

PERFIL DA PESSOA:
- Nome: ${personProfile.name}
- Relacionamento: ${personProfile.relationship}
- Personalidade: ${personProfile.personality?.join(', ') || 'Não definida'}
- Valores: ${personProfile.values?.join(', ') || 'Não definidos'}

HISTÓRICO ANTERIOR: ${previousAnalytics ? JSON.stringify(previousAnalytics) : 'Primeira conversa'}

Retorne APENAS um JSON válido com esta estrutura exata:
{
  "sentimentAnalysis": {
    "userSentiment": {"positive": 0.0-1.0, "negative": 0.0-1.0, "neutral": 0.0-1.0},
    "characterSentiment": {"positive": 0.0-1.0, "negative": 0.0-1.0, "neutral": 0.0-1.0},
    "overallMood": "string",
    "emotionalIntensity": 0.0-1.0,
    "dominantEmotions": ["emotion1", "emotion2"]
  },
  "topicsDiscussed": ["topic1", "topic2", "topic3"],
  "relationshipDynamics": {
    "intimacyLevel": 0.0-1.0,
    "conflictDetected": boolean,
    "emotionalDistance": 0.0-1.0,
    "communicationQuality": 0.0-1.0,
    "trustLevel": 0.0-1.0,
    "engagementLevel": 0.0-1.0
  },
  "keyMoments": ["momento1", "momento2"],
  "suggestedMemories": [
    {
      "text": "Descrição da memória",
      "type": "conversation|emotional|factual|preference|relationship",
      "importance": 0.0-1.0,
      "tags": ["tag1", "tag2"]
    }
  ],
  "personalityInsights": {
    "observedTraits": ["trait1", "trait2"],
    "behaviorPatterns": ["pattern1", "pattern2"],
    "suggestedAdjustments": {
      "temperature": 0.0-1.0,
      "verbosity": "increase|decrease|maintain",
      "emotionalTone": "warmer|cooler|maintain"
    }
  },
  "conversationQuality": {
    "coherence": 0.0-1.0,
    "authenticity": 0.0-1.0,
    "emotional_resonance": 0.0-1.0,
    "engagement": 0.0-1.0
  }
}`;

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openAIApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4.1-2025-04-14',
        messages: [
          { 
            role: 'system', 
            content: 'Você é um especialista em análise psicológica. Retorne SEMPRE um JSON válido e bem estruturado. Seja preciso e objetivo na análise.' 
          },
          { role: 'user', content: analysisPrompt }
        ],
        temperature: 0.3,
        max_tokens: 2000,
        response_format: { type: "json_object" }
      }),
    });

    if (!response.ok) {
      const error = await response.text();
      throw new Error(`OpenAI API error: ${error}`);
    }

    const data = await response.json();
    let analysis;
    
    try {
      analysis = JSON.parse(data.choices[0].message.content);
    } catch (parseError) {
      // Fallback se o JSON não for válido
      analysis = {
        sentimentAnalysis: {
          userSentiment: { positive: 0.6, negative: 0.2, neutral: 0.2 },
          characterSentiment: { positive: 0.7, negative: 0.1, neutral: 0.2 },
          overallMood: "neutral",
          emotionalIntensity: 0.5,
          dominantEmotions: ["curiosity"]
        },
        topicsDiscussed: ["conversa geral"],
        relationshipDynamics: {
          intimacyLevel: 0.5,
          conflictDetected: false,
          emotionalDistance: 0.3,
          communicationQuality: 0.7,
          trustLevel: 0.6,
          engagementLevel: 0.7
        },
        keyMoments: [],
        suggestedMemories: [],
        personalityInsights: {
          observedTraits: [],
          behaviorPatterns: [],
          suggestedAdjustments: {
            temperature: personProfile.temperature || 0.7,
            verbosity: "maintain",
            emotionalTone: "maintain"
          }
        },
        conversationQuality: {
          coherence: 0.7,
          authenticity: 0.6,
          emotional_resonance: 0.5,
          engagement: 0.6
        }
      };
    }

    return new Response(JSON.stringify(analysis), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error in conversation-analyzer function:', error);
    return new Response(JSON.stringify({ error: error instanceof Error ? error.message : 'Unknown error' }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});