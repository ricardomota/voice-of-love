import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import Stripe from "https://esm.sh/stripe@14.21.0";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const stripe = new Stripe(Deno.env.get("STRIPE_SECRET_KEY") || "", {
  apiVersion: "2023-10-16",
});

const supabase = createClient(
  Deno.env.get("SUPABASE_URL") ?? "",
  Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "",
  { auth: { persistSession: false } }
);

const logStep = (step: string, details?: any) => {
  const detailsStr = details ? ` - ${JSON.stringify(details)}` : '';
  console.log(`[STRIPE-WEBHOOK] ${step}${detailsStr}`);
};

serve(async (req) => {
  try {
    logStep("Webhook received");

    const signature = req.headers.get("stripe-signature");
    if (!signature) {
      throw new Error("No Stripe signature found");
    }

    const body = await req.text();
    const webhookSecret = Deno.env.get("STRIPE_WEBHOOK_SECRET");
    if (!webhookSecret) {
      throw new Error("STRIPE_WEBHOOK_SECRET is not set");
    }

    let event: Stripe.Event;
    try {
      event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
    } catch (err) {
      console.error("Webhook signature verification failed:", err);
      return new Response("Webhook signature verification failed", { status: 400 });
    }

    logStep("Event verified", { type: event.type, id: event.id });

    switch (event.type) {
      case 'checkout.session.completed':
        await handleCheckoutCompleted(event.data.object as Stripe.Checkout.Session);
        break;
      
      case 'invoice.paid':
        await handleInvoicePaid(event.data.object as Stripe.Invoice);
        break;
      
      case 'invoice.payment_failed':
        await handleInvoicePaymentFailed(event.data.object as Stripe.Invoice);
        break;
      
      case 'customer.subscription.created':
      case 'customer.subscription.updated':
        await handleSubscriptionChanged(event.data.object as Stripe.Subscription);
        break;
      
      case 'customer.subscription.deleted':
        await handleSubscriptionDeleted(event.data.object as Stripe.Subscription);
        break;
      
      default:
        logStep("Unhandled event type", { type: event.type });
    }

    return new Response(JSON.stringify({ received: true }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    logStep("ERROR in webhook", { message: errorMessage });
    return new Response(`Error: ${errorMessage}`, { status: 500 });
  }
});

async function handleCheckoutCompleted(session: Stripe.Checkout.Session) {
  logStep("Handling checkout completed", { sessionId: session.id });

  const userId = session.metadata?.user_id;
  const type = session.metadata?.type;
  const sku = session.metadata?.sku;

  if (!userId || !type || !sku) {
    throw new Error("Missing required metadata in checkout session");
  }

  if (type === 'pack') {
    // Handle credit pack purchase
    const { data: pack, error: packError } = await supabase
      .from('credit_packs')
      .select('*')
      .eq('sku', sku)
      .single();

    if (packError || !pack) {
      throw new Error(`Credit pack not found: ${sku}`);
    }

    // Create credit transaction
    const { error: transactionError } = await supabase
      .from('credit_transactions')
      .insert({
        user_id: userId,
        delta: pack.credits,
        reason: 'pack_purchase',
        sku: sku,
        metadata: {
          stripe_session_id: session.id,
          amount_paid: session.amount_total,
          currency: session.currency
        }
      });

    if (transactionError) {
      throw new Error(`Failed to create credit transaction: ${transactionError.message}`);
    }

    logStep("Credit pack processed", { userId, credits: pack.credits, sku });
  } else if (type === 'plan' && session.mode === 'subscription') {
    // Subscription will be handled by subscription.created event
    logStep("Subscription checkout completed, waiting for subscription.created event");
  }
}

async function handleInvoicePaid(invoice: Stripe.Invoice) {
  if (!invoice.subscription) return;

  logStep("Handling invoice paid", { invoiceId: invoice.id, subscriptionId: invoice.subscription });

  const subscription = await stripe.subscriptions.retrieve(invoice.subscription as string);
  
  // Grant monthly credits for subscription
  await handleSubscriptionChanged(subscription);
}

async function handleInvoicePaymentFailed(invoice: Stripe.Invoice) {
  logStep("Handling invoice payment failed", { invoiceId: invoice.id });
  
  // TODO: Implement dunning management
  // - Send notification emails
  // - Pause auto top-up
  // - Update user status
}

async function handleSubscriptionChanged(subscription: Stripe.Subscription) {
  logStep("Handling subscription changed", { subscriptionId: subscription.id });

  const customer = await stripe.customers.retrieve(subscription.customer as string);
  if (!customer || customer.deleted) {
    throw new Error("Customer not found");
  }

  const userId = (customer as Stripe.Customer).metadata?.user_id;
  if (!userId) {
    throw new Error("User ID not found in customer metadata");
  }

  // Get the price ID and determine the plan
  const priceId = subscription.items.data[0]?.price.id;
  if (!priceId) {
    throw new Error("Price ID not found in subscription");
  }

  const price = await stripe.prices.retrieve(priceId);
  const amount = price.unit_amount || 0;

  // Map amount to plan code (simplified mapping)
  let planCode = 'free';
  if (amount >= 8900) planCode = 'scale';  // $89
  else if (amount >= 1900) planCode = 'family'; // $19

  const { data: plan, error: planError } = await supabase
    .from('eterna_plans')
    .select('*')
    .eq('code', planCode)
    .single();

  if (planError || !plan) {
    throw new Error(`Plan not found: ${planCode}`);
  }

  // Grant monthly credits
  const { error: transactionError } = await supabase
    .from('credit_transactions')
    .insert({
      user_id: userId,
      delta: plan.monthly_credits,
      reason: 'subscription_monthly_grant',
      sku: planCode,
      metadata: {
        stripe_subscription_id: subscription.id,
        period_start: new Date(subscription.current_period_start * 1000).toISOString(),
        period_end: new Date(subscription.current_period_end * 1000).toISOString()
      }
    });

  if (transactionError) {
    throw new Error(`Failed to grant monthly credits: ${transactionError.message}`);
  }

  logStep("Monthly credits granted", { userId, credits: plan.monthly_credits, planCode });
}

async function handleSubscriptionDeleted(subscription: Stripe.Subscription) {
  logStep("Handling subscription deleted", { subscriptionId: subscription.id });
  
  // TODO: Update user plan to free tier
  // Note: Credits remain, but no new monthly grants
}