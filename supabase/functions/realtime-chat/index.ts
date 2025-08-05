import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    console.log("Realtime-chat function called");
    
    const OPENAI_API_KEY = Deno.env.get('OPENAI_API_KEY');
    if (!OPENAI_API_KEY) {
      console.error('OPENAI_API_KEY is not set');
      throw new Error('OPENAI_API_KEY is not set');
    }

    const url = new URL(req.url);
    const upgrade = req.headers.get("upgrade") || "";
    
    // Check for authentication token
    const token = url.searchParams.get('token');
    if (!token) {
      console.error('No authentication token provided');
      return new Response("Authentication required", { 
        status: 401,
        headers: corsHeaders 
      });
    }
    
    if (upgrade.toLowerCase() !== "websocket") {
      console.error('Expected websocket connection, got:', upgrade);
      return new Response("Expected websocket connection", { 
        status: 400,
        headers: corsHeaders 
      });
    }

    console.log("Upgrading to WebSocket connection");

    const { socket, response } = Deno.upgradeWebSocket(req);
    
    let openaiWs: WebSocket | null = null;
    let sessionCreated = false;

    socket.onopen = () => {
      console.log("Client WebSocket connected successfully");
      
      try {
        // Connect to OpenAI Realtime API
        const openaiUrl = `wss://api.openai.com/v1/realtime?model=gpt-4o-realtime-preview-2024-10-01`;
        console.log("Connecting to OpenAI:", openaiUrl);
        
        openaiWs = new WebSocket(openaiUrl, {
          headers: {
            'Authorization': `Bearer ${OPENAI_API_KEY}`,
            'OpenAI-Beta': 'realtime=v1'
          }
        });
      } catch (error) {
        console.error("Error creating OpenAI WebSocket:", error);
        socket.send(JSON.stringify({
          type: 'error',
          message: 'Failed to connect to OpenAI'
        }));
      }

      if (openaiWs) {
        openaiWs.onopen = () => {
          console.log("Connected to OpenAI Realtime API successfully");
        };

      openaiWs.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          console.log("OpenAI message type:", data.type);
          
          // Handle session.created event
          if (data.type === 'session.created') {
            console.log("Session created, sending session.update");
            sessionCreated = true;
            
            // Send session configuration AFTER session.created
            openaiWs?.send(JSON.stringify({
              type: "session.update",
              session: {
                modalities: ["text", "audio"],
                instructions: `Você é Gilberto, o pai carinhoso e rígido. Você:
                - É rígido mas muito amoroso
                - Às vezes responde só com polegar para cima
                - Nunca fala que ama espontaneamente, mas quando o filho fala que te ama, você responde "a recíproca é verdadeira"
                - Chama o filho de "Filhão", "Rick", "Ricardo", ou "Filho"
                - Gosta de falar sobre São Paulo (time), trabalho na Eletropaulo, política
                - É protetor e gosta de saber todos os detalhes da vida do filho
                - Usa frases como "Oi Filhão", "Tchau", "abraço", "viu"
                - Tem humor sério mas carinhoso
                - É católico e valoriza família, honestidade, religião
                - Responda como se fosse realmente o pai dele, de forma natural e carinhosa`,
                voice: "onyx",
                input_audio_format: "pcm16",
                output_audio_format: "pcm16",
                input_audio_transcription: {
                  model: "whisper-1"
                },
                turn_detection: {
                  type: "server_vad",
                  threshold: 0.5,
                  prefix_padding_ms: 300,
                  silence_duration_ms: 1000
                },
                temperature: 0.3,
                max_response_output_tokens: "inf"
              }
            }));
          }
          
          // Forward all messages to client
          socket.send(event.data);
          
        } catch (error) {
          console.error("Error processing OpenAI message:", error);
        }
      };

        openaiWs.onerror = (error) => {
          console.error("OpenAI WebSocket error:", error);
          socket.send(JSON.stringify({
            type: 'error',
            message: 'OpenAI connection error'
          }));
        };

        openaiWs.onclose = (event) => {
          console.log("OpenAI WebSocket closed. Code:", event.code, "Reason:", event.reason);
          socket.close();
        };
      }
    };

    socket.onmessage = (event) => {
      try {
        console.log("Client message received");
        
        // Forward client messages to OpenAI
        if (openaiWs && openaiWs.readyState === WebSocket.OPEN) {
          openaiWs.send(event.data);
        } else {
          console.error("OpenAI WebSocket not ready");
        }
      } catch (error) {
        console.error("Error processing client message:", error);
      }
    };

    socket.onclose = () => {
      console.log("Client WebSocket disconnected");
      if (openaiWs) {
        openaiWs.close();
      }
    };

    socket.onerror = (error) => {
      console.error("Client WebSocket error:", error);
    };

    return response;

  } catch (error) {
    console.error("Error in realtime-chat function:", error);
    return new Response(
      JSON.stringify({ error: error.message }), 
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});