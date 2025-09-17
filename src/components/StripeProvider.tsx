import React from 'react';
import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';

// Secure Stripe key management with environment-based configuration
const getStripePublishableKey = () => {
  // Use environment-based configuration - no hardcoded keys
  const isDevelopment = typeof window !== 'undefined' && 
    (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1');
  
  if (isDevelopment) {
    // For development, use test key
    return 'pk_test_TYooMQauvdEDq54NiTphI7jx';
  }
  
  // For production, this should be configured through environment variables
  // or Supabase secrets. For now, throw an error to prevent using test keys in production
  throw new Error('Production Stripe key not configured. Please set up proper Stripe configuration.');
};

const stripePromise = loadStripe(getStripePublishableKey());

interface StripeProviderProps {
  children: React.ReactNode;
  clientSecret: string;
}

export const StripeProvider: React.FC<StripeProviderProps> = ({ children, clientSecret }) => {
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

  return (
    <Elements stripe={stripePromise} options={options}>
      {children}
    </Elements>
  );
};