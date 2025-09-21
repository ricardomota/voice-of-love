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
    console.log('🔵 1. Waitlist signup request received:', req.method);

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
    console.log('🔵 2. Request body received:', body);

    const { email } = body

    // Validate email
    if (!email || typeof email !== 'string') {
      console.log('❌ Invalid email provided:', email);
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
    console.log('🔵 3. Normalized email:', normalizedEmail);

    // Basic email validation
    const emailRegex = /^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$/
    if (!emailRegex.test(normalizedEmail)) {
      console.log('❌ Email format invalid:', normalizedEmail);
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

    console.log('🔵 4. Checking for duplicate email...');
    
    // Check for duplicate using the secure function
    const { data: isDuplicate, error: duplicateError } = await supabase
      .rpc('check_waitlist_duplicate', { email_to_check: normalizedEmail });

    if (duplicateError) {
      console.error('❌ Duplicate check error:', duplicateError);
      // Continue with insertion - let database handle constraint violation
    } else if (isDuplicate) {
      console.log('🔵 5. Email is duplicate, returning success');
      return new Response(
        JSON.stringify({ ok: true, message: 'ALREADY_EXISTS' }),
        { 
          status: 200, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      )
    }

    console.log('🔵 6. Inserting email into waitlist...');

    // Insert into waitlist table using service role
    const { error: insertError } = await supabase
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

    if (insertError) {
      console.error('❌ Insert error:', insertError);
      
      // Handle duplicate constraint violation
      if (insertError.code === '23505') {
        console.log('🔵 7. Duplicate constraint violation - email already exists');
        return new Response(
          JSON.stringify({ ok: true, message: 'ALREADY_EXISTS' }),
          { 
            status: 200, 
            headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
          }
        )
      }

      // Other database errors
      return new Response(
        JSON.stringify({ error: 'INTERNAL_ERROR' }),
        { 
          status: 500, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      )
    }

    console.log('🔵 8. SUCCESS! Email inserted successfully:', normalizedEmail);

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
      JSON.stringify({ error: 'INTERNAL_ERROR' }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    )
  }
})
