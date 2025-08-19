import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const logStep = (step: string, details?: any) => {
  const detailsStr = details ? ` - ${JSON.stringify(details)}` : '';
  console.log(`[VOICE-WAITLIST] ${step}${detailsStr}`);
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    logStep("Starting voice waitlist request");

    const supabaseClient = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "",
      { auth: { persistSession: false } }
    );

    const { action, name, email } = await req.json();

    if (action === "join") {
      // Join waitlist - can be done without authentication for flexibility
      if (!name || !email) {
        throw new Error("Name and email are required");
      }

      logStep("Adding to waitlist", { name, email });

      const { data: waitlistEntry, error: waitlistError } = await supabaseClient
        .from('waitlist')
        .insert({
          full_name: name,
          email: email,
          status: 'queued',
          primary_interest: 'voice_personalization',
          message: 'Joined waitlist for personalized voice slots'
        })
        .select()
        .single();

      if (waitlistError) {
        if (waitlistError.code === '23505') {
          // Duplicate entry
          return new Response(JSON.stringify({
            status: 'already_queued',
            message: 'You are already in the waitlist.'
          }), {
            headers: { ...corsHeaders, "Content-Type": "application/json" },
            status: 200,
          });
        }
        throw new Error(`Failed to add to waitlist: ${waitlistError.message}`);
      }

      // Get current waitlist position
      const { count: position } = await supabaseClient
        .from('waitlist')
        .select('*', { count: 'exact', head: true })
        .eq('status', 'queued')
        .lte('created_at', waitlistEntry.created_at);

      logStep("Added to waitlist", { waitlistId: waitlistEntry.id, position });

      return new Response(JSON.stringify({
        status: 'queued',
        waitlist_id: waitlistEntry.id,
        position: position || 1,
        message: `You have been added to the waitlist. Current position: ${position || 1}`
      }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200,
      });

    } else if (action === "status") {
      // Check waitlist status
      if (!email) {
        throw new Error("Email is required to check status");
      }

      const { data: waitlistEntry } = await supabaseClient
        .from('waitlist')
        .select('*')
        .eq('email', email)
        .eq('primary_interest', 'voice_personalization')
        .order('created_at', { ascending: false })
        .limit(1)
        .single();

      if (!waitlistEntry) {
        return new Response(JSON.stringify({
          status: 'not_found',
          message: 'Email not found in waitlist.'
        }), {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
          status: 200,
        });
      }

      let position = 0;
      if (waitlistEntry.status === 'queued') {
        const { count } = await supabaseClient
          .from('waitlist')
          .select('*', { count: 'exact', head: true })
          .eq('status', 'queued')
          .lte('created_at', waitlistEntry.created_at);
        
        position = count || 1;
      }

      return new Response(JSON.stringify({
        status: waitlistEntry.status,
        position: position > 0 ? position : null,
        created_at: waitlistEntry.created_at,
        processed_at: waitlistEntry.processed_at,
        message: waitlistEntry.status === 'queued' 
          ? `You are currently at position ${position} in the waitlist.`
          : `Your status: ${waitlistEntry.status}`
      }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200,
      });

    } else if (action === "process") {
      // Process waitlist - internal function for cron jobs
      logStep("Processing waitlist");

      // Get current capacity
      const { data: capacity } = await supabaseClient
        .from('capacity')
        .select('*')
        .eq('id', 1)
        .single();

      if (!capacity) {
        throw new Error("Capacity information not found");
      }

      const slotsAvailable = Math.max(0, capacity.max_slots - capacity.buffer_slots - capacity.active_slots);
      
      if (slotsAvailable <= 0) {
        return new Response(JSON.stringify({
          processed: 0,
          message: 'No slots available for processing waitlist.'
        }), {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
          status: 200,
        });
      }

      // Get next entries to process
      const { data: waitlistEntries } = await supabaseClient
        .from('waitlist')
        .select('*')
        .eq('status', 'queued')
        .eq('primary_interest', 'voice_personalization')
        .order('created_at', { ascending: true })
        .limit(slotsAvailable);

      if (!waitlistEntries || waitlistEntries.length === 0) {
        return new Response(JSON.stringify({
          processed: 0,
          message: 'No entries in waitlist to process.'
        }), {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
          status: 200,
        });
      }

      let processed = 0;
      
      for (const entry of waitlistEntries) {
        try {
          // Update status to processing
          await supabaseClient
            .from('waitlist')
            .update({ 
              status: 'processing',
              processed_at: new Date().toISOString()
            })
            .eq('id', entry.id);

          // Here you could send email notification to the user
          // For now, just mark as notified
          await supabaseClient
            .from('waitlist')
            .update({ status: 'notified' })
            .eq('id', entry.id);

          processed++;
          logStep("Processed waitlist entry", { entryId: entry.id, email: entry.email });

        } catch (error) {
          logStep("Failed to process waitlist entry", { entryId: entry.id, error });
        }
      }

      return new Response(JSON.stringify({
        processed,
        message: `Processed ${processed} waitlist entries.`
      }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200,
      });
    }

    throw new Error("Invalid action. Use 'join', 'status', or 'process'");

  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    logStep("ERROR in voice-waitlist", { message: errorMessage });
    
    return new Response(JSON.stringify({ error: errorMessage }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 500,
    });
  }
});