import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import Stripe from "https://esm.sh/stripe@14.21.0";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const logStep = (step: string, details?: any) => {
  const detailsStr = details ? ` - ${JSON.stringify(details)}` : '';
  console.log(`[BILLING-CHECKOUT] ${step}${detailsStr}`);
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    logStep("Function started");

    const stripeKey = Deno.env.get("STRIPE_SECRET_KEY");
    if (!stripeKey) throw new Error("STRIPE_SECRET_KEY is not set");
    logStep("Stripe key verified");

    // Use anon key for user authentication
    const supabaseClient = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_ANON_KEY") ?? ""
    );

    const authHeader = req.headers.get("Authorization");
    if (!authHeader) throw new Error("No authorization header provided");
    logStep("Authorization header found");

    const token = authHeader.replace("Bearer ", "");
    const { data: userData, error: userError } = await supabaseClient.auth.getUser(token);
    if (userError) throw new Error(`Authentication error: ${userError.message}`);
    const user = userData.user;
    if (!user?.email) throw new Error("User not authenticated or email not available");
    logStep("User authenticated", { userId: user.id, email: user.email });

    const { type, sku, success_url, cancel_url } = await req.json();
    logStep("Request parsed", { type, sku });

    const stripe = new Stripe(stripeKey, { apiVersion: "2023-10-16" });

    // Find or create Stripe customer
    const customers = await stripe.customers.list({ email: user.email, limit: 1 });
    let customerId: string;
    
    if (customers.data.length > 0) {
      customerId = customers.data[0].id;
      logStep("Found existing customer", { customerId });
    } else {
      const customer = await stripe.customers.create({
        email: user.email,
        metadata: { user_id: user.id }
      });
      customerId = customer.id;
      logStep("Created new customer", { customerId });
    }

    // Get plan/pack data from Supabase
    let lineItems: any[] = [];
    let mode: 'payment' | 'subscription' = 'payment';
    
    if (type === 'plan') {
      const { data: plan, error: planError } = await supabaseClient
        .from('eterna_plans')
        .select('*')
        .eq('code', sku)
        .single();
      
      if (planError || !plan) {
        throw new Error(`Plan not found: ${sku}`);
      }
      
      mode = 'subscription';
      lineItems = [{
        price_data: {
          currency: 'usd', // Use USD for now, can be extended for BRL
          product_data: {
            name: plan.name.en,
            description: `${plan.monthly_credits} credits per month`
          },
          unit_amount: Math.round(plan.monthly_price_usd * 100),
          recurring: { interval: 'month' }
        },
        quantity: 1
      }];
      
      logStep("Plan line items created", { plan: plan.code, price: plan.monthly_price_usd });
    } else if (type === 'pack') {
      const { data: pack, error: packError } = await supabaseClient
        .from('credit_packs')
        .select('*')
        .eq('sku', sku)
        .single();
      
      if (packError || !pack) {
        throw new Error(`Credit pack not found: ${sku}`);
      }
      
      mode = 'payment';
      lineItems = [{
        price_data: {
          currency: 'usd', // Use USD for now, can be extended for BRL
          product_data: {
            name: pack.name.en,
            description: `${pack.credits} credits`
          },
          unit_amount: Math.round(pack.price_usd * 100)
        },
        quantity: 1
      }];
      
      logStep("Pack line items created", { pack: pack.sku, price: pack.price_usd });
    } else {
      throw new Error(`Invalid type: ${type}`);
    }

    // Create checkout session
    const session = await stripe.checkout.sessions.create({
      customer: customerId,
      line_items: lineItems,
      mode,
      success_url: success_url || `${req.headers.get("origin")}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: cancel_url || `${req.headers.get("origin")}/pricing`,
      metadata: {
        user_id: user.id,
        type,
        sku
      },
      payment_method_types: ['card'],
      billing_address_collection: 'auto',
      tax_id_collection: { enabled: true },
      automatic_tax: { enabled: true },
      allow_promotion_codes: true
    });

    logStep("Checkout session created", { sessionId: session.id, url: session.url });

    return new Response(JSON.stringify({ url: session.url }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200,
    });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    logStep("ERROR in create-billing-checkout", { message: errorMessage });
    return new Response(JSON.stringify({ error: errorMessage }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 500,
    });
  }
});