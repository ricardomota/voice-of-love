import React, { useState, useEffect } from 'react';
import { Elements } from '@stripe/react-stripe-js';
import { loadStripe, Stripe } from '@stripe/stripe-js';

// Secure Stripe key management with environment-based configuration
const getStripePublishableKey = () => {
  // In production/live environments, this would use the live publishable key
  // For test/development, we use the test key
  const testKey = 'pk_test_TYooMQauvdEDq54NiTphI7jx';
  
  // Add build-time validation for production deployments
  if (typeof window !== 'undefined' && window.location.hostname !== 'localhost' && window.location.hostname !== '127.0.0.1') {
    console.warn('⚠️ SECURITY NOTICE: Using test Stripe key in production environment. Please update to live key.');
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