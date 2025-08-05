import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const OPENAI_API_KEY = Deno.env.get('OPENAI_API_KEY');
    const ELEVENLABS_API_KEY = Deno.env.get('ELEVENLABS_API_KEY');
    
    if (!OPENAI_API_KEY) {
      throw new Error('OPENAI_API_KEY is not set');
    }
    
    if (!ELEVENLABS_API_KEY) {
      throw new Error('ELEVENLABS_API_KEY is not set');
    }

    const { person, messageType = 'motivational' } = await req.json();

    if (!person || !person.name) {
      throw new Error('Person data is required');
    }

    console.log(`Generating ${messageType} message for ${person.name}`);

    // Construir prompt baseado na personalidade da pessoa
    const personalityTraits = person.personality?.join(', ') || 'carinhosa, atenciosa';
    const commonPhrases = person.commonPhrases?.join(', ') || '';
    const howTheyCalledYou = person.howTheyCalledYou || 'querido(a)';
    const talkingStyle = person.talkingStyle || 'carinhoso';
    const emotionalTone = person.emotionalTone || 'afetuoso';
    const values = person.values?.join(', ') || '';

    // Tipos de mensagens disponíveis
    const messageTypes = {
      motivational: 'uma mensagem motivacional e encorajadora',
      caring: 'uma mensagem carinhosa e afetuosa',
      wisdom: 'um conselho sábio e reflexivo',
      encouragement: 'palavras de encorajamento e apoio',
      gratitude: 'uma mensagem de gratidão e amor',
      daily: 'uma mensagem para começar bem o dia',
      comfort: 'uma mensagem de conforto e tranquilidade'
    };

    const selectedMessageType = messageTypes[messageType] || messageTypes.motivational;

    const prompt = `Você é ${person.name}, uma pessoa com as seguintes características:
- Personalidade: ${personalityTraits}
- Estilo de fala: ${talkingStyle}
- Tom emocional: ${emotionalTone}
- Valores importantes: ${values}
- Costuma chamar a pessoa de: ${howTheyCalledYou}
${commonPhrases ? `- Frases características que você usa: ${commonPhrases}` : ''}

Crie ${selectedMessageType} de no máximo 150 palavras, falando diretamente para a pessoa como se fosse uma mensagem de voz espontânea. A mensagem deve:
- Ser natural e autêntica ao seu jeito de falar
- Durar aproximadamente 20-30 segundos quando falada
- Ser positiva e emotiva
- Usar seu jeito característico de se expressar
- Ser como se você estivesse mandando uma mensagem de voz de surpresa

Não mencione que é uma IA ou mensagem gerada. Fale naturalmente como ${person.name} falaria.`;

    // Gerar mensagem com OpenAI
    const openaiResponse = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${OPENAI_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          { role: 'system', content: 'Você é um especialista em criar mensagens autênticas e personalizadas baseadas na personalidade de pessoas específicas.' },
          { role: 'user', content: prompt }
        ],
        temperature: 0.8,
        max_tokens: 300
      }),
    });

    if (!openaiResponse.ok) {
      throw new Error(`OpenAI API error: ${await openaiResponse.text()}`);
    }

    const openaiData = await openaiResponse.json();
    const messageText = openaiData.choices[0].message.content;

    console.log(`Generated message: ${messageText.substring(0, 100)}...`);

    // Se a pessoa tem voz clonada, usar ElevenLabs
    if (person.voiceSettings?.voiceId) {
      console.log(`Using cloned voice: ${person.voiceSettings.voiceId}`);
      
      const elevenLabsResponse = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${person.voiceSettings.voiceId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'xi-api-key': ELEVENLABS_API_KEY,
        },
        body: JSON.stringify({
          text: messageText,
          model_id: 'eleven_multilingual_v2',
          voice_settings: {
            stability: 0.5,
            similarity_boost: 0.75,
            style: 0.5,
            use_speaker_boost: true
          }
        }),
      });

      if (!elevenLabsResponse.ok) {
        const errorText = await elevenLabsResponse.text();
        console.error('ElevenLabs error:', errorText);
        throw new Error(`ElevenLabs API error: ${errorText}`);
      }

      // Converter audio para base64
      const audioBuffer = await elevenLabsResponse.arrayBuffer();
      const base64Audio = btoa(String.fromCharCode(...new Uint8Array(audioBuffer)));

      return new Response(JSON.stringify({
        success: true,
        message: messageText,
        audioContent: base64Audio,
        hasCustomVoice: true,
        voiceId: person.voiceSettings.voiceId
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    } else {
      // Se não tem voz clonada, usar voz padrão
      console.log('Using default voice');
      
      const elevenLabsResponse = await fetch('https://api.elevenlabs.io/v1/text-to-speech/EXAVITQu4vr4xnSDxMaL', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'xi-api-key': ELEVENLABS_API_KEY,
        },
        body: JSON.stringify({
          text: messageText,
          model_id: 'eleven_multilingual_v2',
          voice_settings: {
            stability: 0.5,
            similarity_boost: 0.75
          }
        }),
      });

      if (!elevenLabsResponse.ok) {
        const errorText = await elevenLabsResponse.text();
        console.error('ElevenLabs error:', errorText);
        throw new Error(`ElevenLabs API error: ${errorText}`);
      }

      const audioBuffer = await elevenLabsResponse.arrayBuffer();
      const base64Audio = btoa(String.fromCharCode(...new Uint8Array(audioBuffer)));

      return new Response(JSON.stringify({
        success: true,
        message: messageText,
        audioContent: base64Audio,
        hasCustomVoice: false,
        voiceId: 'EXAVITQu4vr4xnSDxMaL'
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

  } catch (error) {
    console.error('Error in generate-voice-message function:', error);
    return new Response(JSON.stringify({ 
      error: error.message,
      success: false 
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});