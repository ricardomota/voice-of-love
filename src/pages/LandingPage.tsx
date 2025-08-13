import React from 'react';
import { LandingHeader } from '@/components/landing/LandingHeader';
import { HeroSection } from '@/components/landing/HeroSection';
import { FeaturesSection } from '@/components/landing/FeaturesSection';
import { WaitlistSection } from '@/components/landing/WaitlistSection';
import { HowItWorksSection } from '@/components/landing/HowItWorksSection';
import { PricingSection } from '@/components/landing/PricingSection';
import { LandingFooter } from '@/components/landing/LandingFooter';

interface LandingPageProps {
  onTryFree: () => void;
  onLogin: () => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({ onTryFree, onLogin }) => {
  const scrollToWaitlist = () => {
    const element = document.getElementById('waitlist');
    element?.scrollIntoView({ behavior: 'smooth' });
  };

  const scrollToPricing = () => {
    const element = document.getElementById('pricing');
    element?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <LandingHeader
        onTryFree={scrollToWaitlist}
        onSignIn={onLogin}
      />

      {/* Hero Section */}
      <HeroSection 
        onTryFree={scrollToWaitlist}
        onSeePricing={scrollToPricing}
      />

      {/* Features Section */}
      <FeaturesSection />

      {/* Waitlist Section */}
      <WaitlistSection />

      {/* How It Works */}
      <HowItWorksSection />

      {/* Pricing */}
      <PricingSection 
        onTryFree={scrollToWaitlist}
        onSeePricing={scrollToPricing}
      />

      {/* Footer */}
      <LandingFooter 
        onTryFree={scrollToWaitlist}
        onSignIn={onLogin}
      />
    </div>
  );
};