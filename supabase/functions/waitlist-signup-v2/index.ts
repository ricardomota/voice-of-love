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
    console.log('🔵 Waitlist V2 signup request received:', req.method);

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
    console.log('🔵 Request body received:', body);

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
    console.log('🔵 Normalized email:', normalizedEmail);

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
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

    console.log('🔵 Checking for duplicate email...');
    
    // Check for duplicate using direct query (bypass RLS with service role)
    const { data: existingEmails, error: checkError } = await supabase
      .from('waitlist')
      .select('email')
      .eq('email', normalizedEmail)
      .limit(1);

    if (checkError) {
      console.warn('⚠️ Duplicate check failed, continuing with insert:', checkError?.message);
    } else if (existingEmails && existingEmails.length > 0) {
      console.log('🔵 Email already exists, returning success');
      return new Response(
        JSON.stringify({ ok: true, message: 'ALREADY_EXISTS' }),
        { 
          status: 200, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      )
    }

    console.log('🔵 Inserting email into waitlist...');

    // Insert with all required fields to satisfy constraints
    const { error: insertError } = await supabase
      .from('waitlist')
      .insert({
        email: normalizedEmail,
        full_name: 'Anonymous User',
        user_id: null, // Explicitly set to null
        status: 'queued', // Explicitly set status
        primary_interest: 'general', // Explicitly set
        how_did_you_hear: 'website', // Explicitly set
        requested_at: new Date().toISOString() // Explicitly set timestamp
      })

    if (insertError) {
      console.error('❌ Insert error:', insertError);
      
      // Handle duplicate constraint violation
      if (insertError.code === '23505') {
        console.log('🔵 Duplicate constraint violation - email already exists');
        return new Response(
          JSON.stringify({ ok: true, message: 'ALREADY_EXISTS' }),
          { 
            status: 200, 
            headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
          }
        )
      }

      // Handle check constraint violation
      if (insertError.message.includes('check constraint')) {
        console.log('🔵 Check constraint violation - trying with different status values');
        
        // Try with different status values that might be allowed
        const statusValues = ['pending', 'active', 'waiting', 'confirmed'];
        let insertSuccess = false;
        
        for (const status of statusValues) {
          const { error: retryError } = await supabase
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
          
          if (!retryError) {
            insertSuccess = true;
            break;
          }
        }
        
        if (insertSuccess) {
          console.log('🔵 SUCCESS! Inserted with alternative status');
          return new Response(
            JSON.stringify({ ok: true, message: 'SUCCESS' }),
            { 
              status: 201, 
              headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
            }
          )
        }
      }

      // Other database errors
      return new Response(
        JSON.stringify({ 
          error: 'INTERNAL_ERROR', 
          code: insertError.code || 'DB_ERROR',
          message: insertError.message 
        }),
        { 
          status: 500, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      )
    }

    console.log('🔵 SUCCESS! Email inserted successfully:', normalizedEmail);

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
