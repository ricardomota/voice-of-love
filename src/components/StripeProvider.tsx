import React, { useState, useEffect } from 'react';
import { Elements } from '@stripe/react-stripe-js';
import { loadStripe, Stripe } from '@stripe/stripe-js';

// Secure Stripe key management with environment-based configuration
const getStripePublishableKey = () => {
  // SECURITY: Publishable keys are safe to expose client-side
  // However, ensure you're using the correct key for your environment
  
  // Production domains should use live keys (pk_live_...)
  const isProduction = typeof window !== 'undefined' && 
    !window.location.hostname.includes('localhost') && 
    !window.location.hostname.includes('127.0.0.1') &&
    !window.location.hostname.includes('.lovable.app'); // Lovable preview domains
  
  // TEST KEY - Replace with live key for production
  const testKey = 'pk_test_TYooMQauvdEDq54NiTphI7jx';
  
  // TODO: When deploying to production, update this to use your live Stripe key
  // const liveKey = 'pk_live_YOUR_LIVE_KEY_HERE';
  // return isProduction ? liveKey : testKey;
  
  if (isProduction) {
    console.error('🚨 CRITICAL SECURITY WARNING: Using Stripe TEST key in production!');
    console.error('Update getStripePublishableKey() to use your live Stripe publishable key');
  }
  
  return testKey;
};

// Lazy load Stripe - only when needed
let stripePromise: Promise<Stripe | null> | null = null;
const getStripePromise = () => {
  if (!stripePromise) {
    stripePromise = loadStripe(getStripePublishableKey());
  }
  return stripePromise;
};

interface StripeProviderProps {
  children: React.ReactNode;
  clientSecret: string;
}

export const StripeProvider: React.FC<StripeProviderProps> = ({ children, clientSecret }) => {
  const [stripe, setStripe] = useState<Promise<Stripe | null> | null>(null);

  useEffect(() => {
    // Load Stripe only when this component mounts
    setStripe(getStripePromise());
  }, []);

  const options = {
    clientSecret,
    appearance: {
      theme: 'stripe' as const,
      variables: {
        colorPrimary: 'hsl(var(--primary))',
        colorBackground: 'hsl(var(--background))',
        colorText: 'hsl(var(--foreground))',
        colorDanger: 'hsl(var(--destructive))',
        fontFamily: 'system-ui, sans-serif',
        spacingUnit: '4px',
        borderRadius: '6px',
      },
    },
  };

  if (!stripe) {
    return <div className="flex items-center justify-center p-8">Loading payment form...</div>;
  }

  return (
    <Elements stripe={stripe} options={options}>
      {children}
    </Elements>
  );
};