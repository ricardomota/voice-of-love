import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const ELEVENLABS_API_KEY = Deno.env.get('ELEVENLABS_API_KEY')
    if (!ELEVENLABS_API_KEY) {
      throw new Error('ELEVENLABS_API_KEY is not set')
    }

    const { audioBlob, name, description } = await req.json()

    if (!audioBlob || !name) {
      return new Response(
        JSON.stringify({ 
          error: "Missing required fields: audioBlob and name are required" 
        }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 400,
        }
      )
    }

    console.log("Creating voice clone for:", name)

    // Convert base64 audio to binary for ElevenLabs
    const audioData = Uint8Array.from(atob(audioBlob), c => c.charCodeAt(0))

    // Create FormData for ElevenLabs API
    const formData = new FormData()
    formData.append('name', name)
    formData.append('description', description || `Voice of ${name}`)
    formData.append('files', new Blob([audioData], { type: 'audio/webm' }), 'voice_sample.webm')

    // Call ElevenLabs Voice Add API
    const response = await fetch('https://api.elevenlabs.io/v1/voices/add', {
      method: 'POST',
      headers: {
        'xi-api-key': ELEVENLABS_API_KEY,
      },
      body: formData
    })

    const responseData = await response.json()

    if (!response.ok) {
      console.error('ElevenLabs API error:', responseData)
      throw new Error(responseData.detail?.message || 'Failed to create voice clone')
    }

    console.log("Voice clone created successfully:", responseData)

    return new Response(
      JSON.stringify({ 
        success: true, 
        voiceId: responseData.voice_id,
        name: responseData.name
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      }
    )

  } catch (error) {
    console.error("Error in voice-clone function:", error)
    return new Response(
      JSON.stringify({ error: error.message }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500,
      }
    )
  }
})