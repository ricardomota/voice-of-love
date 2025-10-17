import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.3";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface GrantAccessRequest {
  emails: string[];
  durationDays?: number;
  notes?: string;
  sendNotifications?: boolean;
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      {
        auth: {
          persistSession: false,
          autoRefreshToken: false,
        },
        global: {
          headers: { Authorization: req.headers.get('Authorization')! },
        },
      }
    );

    // Verify user is authenticated and is admin
    const { data: { user }, error: authError } = await supabaseClient.auth.getUser();
    
    if (authError || !user) {
      console.error('Authentication error:', authError);
      return new Response(
        JSON.stringify({ error: 'Unauthorized' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Check if user is admin
    const { data: roleData, error: roleError } = await supabaseClient
      .rpc('has_role', { _user_id: user.id, _role: 'admin' });

    if (roleError || !roleData) {
      console.error('Role check error:', roleError);
      return new Response(
        JSON.stringify({ error: 'Forbidden: Admin access required' }),
        { status: 403, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Parse request body
    const body: GrantAccessRequest = await req.json();
    const { emails, durationDays = 30, notes = 'Waitlist early access', sendNotifications = false } = body;

    if (!emails || !Array.isArray(emails) || emails.length === 0) {
      return new Response(
        JSON.stringify({ error: 'Invalid request: emails array is required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log(`Processing ${emails.length} email(s) for beta access grant by admin ${user.email}`);
    console.log(`Duration: ${durationDays} days, Notes: ${notes}`);

    // Call the database function to grant access
    const { data: grantResult, error: grantError } = await supabaseClient
      .rpc('grant_waitlist_beta_access', {
        email_list: emails,
        days_duration: durationDays,
        notes_text: notes
      });

    if (grantError) {
      console.error('Error granting access:', grantError);
      return new Response(
        JSON.stringify({ error: grantError.message }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log('Grant result:', grantResult);

    // TODO: Send email notifications if requested
    // This would integrate with Resend or another email service
    if (sendNotifications && grantResult.access_data && grantResult.access_data.length > 0) {
      console.log('Email notifications requested but not yet implemented');
      // Future: Call send-email function or Resend API here
    }

    return new Response(
      JSON.stringify({
        success: true,
        granted: grantResult.granted,
        already_exists: grantResult.already_exists,
        access_data: grantResult.access_data,
        message: `Successfully granted access to ${grantResult.granted} user(s)`
      }),
      { 
        status: 200, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );

  } catch (error: any) {
    console.error('Unexpected error:', error);
    return new Response(
      JSON.stringify({ error: error.message || 'Internal server error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});