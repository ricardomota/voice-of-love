import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import Stripe from "https://esm.sh/stripe@14.21.0";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

// Helper logging function for debugging
const logStep = (step: string, details?: any) => {
  const detailsStr = details ? ` - ${JSON.stringify(details)}` : '';
  console.log(`[CREATE-CHECKOUT] ${step}${detailsStr}`);
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  // Create a Supabase client using the anon key
  const supabaseClient = createClient(
    Deno.env.get("SUPABASE_URL") ?? "",
    Deno.env.get("SUPABASE_ANON_KEY") ?? ""
  );

  try {
    logStep("Function started");

    const body = await req.json();
    const { plan, planId, mode = 'checkout' } = body;
    const selectedPlan = plan || planId;
    if (!selectedPlan) throw new Error("Plan ID is required");
    logStep("Plan ID received", { selectedPlan, mode });

    const stripeKey = Deno.env.get("STRIPE_SECRET_KEY");
    if (!stripeKey) throw new Error("STRIPE_SECRET_KEY is not set");
    logStep("Stripe key verified");

    const authHeader = req.headers.get("Authorization");
    if (!authHeader) throw new Error("No authorization header provided");
    logStep("Authorization header found");

    const token = authHeader.replace("Bearer ", "");
    const { data } = await supabaseClient.auth.getUser(token);
    const user = data.user;
    if (!user?.email) throw new Error("User not authenticated or email not available");
    logStep("User authenticated", { userId: user.id, email: user.email });

    const stripe = new Stripe(stripeKey, { apiVersion: "2023-10-16" });
    const customers = await stripe.customers.list({ email: user.email, limit: 1 });
    let customerId;
    if (customers.data.length > 0) {
      customerId = customers.data[0].id;
      logStep("Found existing customer", { customerId });
    } else {
      logStep("No existing customer found");
    }

    // Define prices based on plan
    let priceData;
    if (selectedPlan === 'essential') {
      priceData = {
        currency: "usd",
        product_data: { name: "Essential Plan" },
        unit_amount: 2900, // $29.00
        recurring: { interval: "month" },
      };
    } else if (selectedPlan === 'complete') {
      priceData = {
        currency: "usd",
        product_data: { name: "Complete Plan" },
        unit_amount: 7900, // $79.00
        recurring: { interval: "month" },
      };
    } else {
      throw new Error("Invalid plan ID");
    }

    logStep("Creating checkout session", { selectedPlan, priceData, mode });

    if (mode === 'setup') {
      // Create a subscription for Stripe Elements (Payment page) with incomplete payment behavior
      // This allows us to get a client_secret for the payment intent
      
      // First create or get customer
      if (!customerId) {
        const customer = await stripe.customers.create({
          email: user.email,
        });
        customerId = customer.id;
        logStep("Created new Stripe customer", { customerId });
      }

      const subscription = await stripe.subscriptions.create({
        customer: customerId,
        items: [{ price_data: priceData }],
        payment_behavior: 'default_incomplete',
        payment_settings: { save_default_payment_method: 'on_subscription' },
        expand: ['latest_invoice.payment_intent'],
      });

      const invoice = subscription.latest_invoice as Stripe.Invoice;
      const paymentIntent = invoice.payment_intent as Stripe.PaymentIntent;

      return new Response(JSON.stringify({ 
        client_secret: paymentIntent.client_secret,
        subscription_id: subscription.id
      }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200,
      });
    } else {
      // Create traditional checkout session (existing flow)
      const session = await stripe.checkout.sessions.create({
        customer: customerId,
        customer_email: customerId ? undefined : user.email,
        line_items: [
          {
            price_data: priceData,
            quantity: 1,
          },
        ],
        mode: "subscription",
        success_url: `${req.headers.get("origin")}/app/dashboard?subscription=success`,
        cancel_url: `${req.headers.get("origin")}/app/dashboard?subscription=cancelled`,
      });

      logStep("Checkout session created", { sessionId: session.id, url: session.url });

      return new Response(JSON.stringify({ url: session.url }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200,
      });
    }
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    logStep("ERROR in create-checkout", { message: errorMessage });
    return new Response(JSON.stringify({ error: errorMessage }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 500,
    });
  }
});