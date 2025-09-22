import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

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
    console.log('🔵 Waitlist Simple signup request received');

    if (req.method !== 'POST') {
      return new Response(
        JSON.stringify({ error: 'METHOD_NOT_ALLOWED' }),
        { 
          status: 405, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      )
    }

    // Parse request body
    const body = await req.json()
    const { email } = body

    // Validate email
    if (!email || typeof email !== 'string') {
      return new Response(
        JSON.stringify({ error: 'INVALID_EMAIL' }),
        { 
          status: 400, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      )
    }

    // Normalize email
    const normalizedEmail = email.trim().toLowerCase()

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(normalizedEmail)) {
      return new Response(
        JSON.stringify({ error: 'INVALID_EMAIL' }),
        { 
          status: 400, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      )
    }

    // Create Supabase client with service role key
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    // Try to insert with minimal data first
    console.log('🔵 Attempting minimal insert...');
    
    const { error: insertError } = await supabase
      .from('waitlist')
      .insert({
        email: normalizedEmail,
        full_name: 'Anonymous User'
      })

    if (insertError) {
      console.log('❌ Minimal insert failed:', insertError.message);
      
      // If minimal insert fails, try with all fields
      console.log('🔵 Trying with all required fields...');
      
      const { error: fullInsertError } = await supabase
        .from('waitlist')
        .insert({
          email: normalizedEmail,
          full_name: 'Anonymous User',
          user_id: null,
          status: 'queued',
          primary_interest: 'general',
          how_did_you_hear: 'website',
          requested_at: new Date().toISOString()
        })

      if (fullInsertError) {
        console.log('❌ Full insert also failed:', fullInsertError.message);
        
        // Handle duplicate constraint
        if (fullInsertError.code === '23505') {
          return new Response(
            JSON.stringify({ ok: true, message: 'ALREADY_EXISTS' }),
            { 
              status: 200, 
              headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
            }
          )
        }
        
        // Handle check constraint by trying different status values
        if (fullInsertError.message.includes('check constraint')) {
          console.log('🔵 Check constraint issue - trying alternative status values...');
          
          const statusOptions = ['pending', 'active', 'waiting', 'confirmed', 'new'];
          let success = false;
          
          for (const status of statusOptions) {
            const { error: statusError } = await supabase
              .from('waitlist')
              .insert({
                email: normalizedEmail,
                full_name: 'Anonymous User',
                user_id: null,
                status: status,
                primary_interest: 'general',
                how_did_you_hear: 'website',
                requested_at: new Date().toISOString()
              });
            
            if (!statusError) {
              success = true;
              break;
            }
          }
          
          if (success) {
            return new Response(
              JSON.stringify({ ok: true, message: 'SUCCESS' }),
              { 
                status: 201, 
                headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
              }
            )
          }
        }
        
        return new Response(
          JSON.stringify({ 
            error: 'INTERNAL_ERROR', 
            code: fullInsertError.code || 'DB_ERROR',
            message: fullInsertError.message 
          }),
          { 
            status: 500, 
            headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
          }
        )
      }
    }

    console.log('🔵 SUCCESS! Email inserted successfully');

    return new Response(
      JSON.stringify({ ok: true, message: 'SUCCESS' }),
      { 
        status: 201, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    )

  } catch (error) {
    console.error('❌ Unhandled error:', error);
    return new Response(
      JSON.stringify({ error: 'INTERNAL_ERROR', message: error.message }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    )
  }
})
