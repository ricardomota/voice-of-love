import React, { useState } from 'react';
import { LandingHeader } from '@/components/landing/LandingHeader';
import { HeroSection } from '@/components/landing/HeroSection';
import { FeaturesSection } from '@/components/landing/FeaturesSection';

import { HowItWorksSection } from '@/components/landing/HowItWorksSection';
import { StoryCard } from '@/components/landing/StoryCard';
import { PricingSection } from '@/components/landing/PricingSection';
import { LandingFooter } from '@/components/landing/LandingFooter';
import { useSubscription } from '@/hooks/useSubscription';
import { useToast } from '@/hooks/use-toast';


interface LandingPageProps {
  onTryFree: () => void;
  onLogin: () => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({ onTryFree, onLogin }) => {
  const { createCheckout } = useSubscription();
  const { toast } = useToast();
  

  const scrollToPricing = () => {
    const element = document.getElementById('pricing');
    element?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleUpgrade = async (planId: string) => {
    const params = new URLSearchParams({ plan: planId });
    window.location.href = `/payment?${params.toString()}`;
  };

  return (
    <div className="min-h-screen bg-background overflow-hidden">
      {/* Header */}
      <LandingHeader
        onTryFree={onTryFree}
        onSignIn={onLogin}
      />

      {/* Hero Section - Enhanced spacing */}
      <HeroSection 
        onTryFree={onTryFree}
        onSeePricing={scrollToPricing}
        onLogin={onLogin}
      />

      {/* Features Section - Enhanced spacing */}
      <div className="relative">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-muted/10 to-transparent pointer-events-none" />
        <FeaturesSection />
      </div>

      {/* How It Works - Enhanced spacing */}
      <div className="relative">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-accent/5 pointer-events-none" />
        <HowItWorksSection />
      </div>

      {/* Pricing - Enhanced spacing */}
      <div className="relative">
        <div className="absolute inset-0 bg-gradient-to-t from-secondary/10 via-transparent to-transparent pointer-events-none" />
        <PricingSection 
          onTryFree={onTryFree}
          onSeePricing={scrollToPricing}
          onUpgrade={handleUpgrade}
        />
      </div>
      {/* Story Card - Personal touch */}
      <StoryCard />

      {/* Footer with enhanced top spacing */}
      <div className="mt-12 sm:mt-16 lg:mt-20">
        <LandingFooter 
          onTryFree={onTryFree}
          onSignIn={onLogin}
        />
      </div>

    </div>
  );
};