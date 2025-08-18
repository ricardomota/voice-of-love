import React from 'react';
import { LandingHeader } from '@/components/landing/LandingHeader';
import { HeroSection } from '@/components/landing/HeroSection';
import { FeaturesSection } from '@/components/landing/FeaturesSection';

import { HowItWorksSection } from '@/components/landing/HowItWorksSection';
import { PricingSection } from '@/components/landing/PricingSection';
import { LandingFooter } from '@/components/landing/LandingFooter';

interface LandingPageProps {
  onTryFree: () => void;
  onLogin: () => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({ onTryFree, onLogin }) => {
  const scrollToPricing = () => {
    const element = document.getElementById('pricing');
    element?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Fixed Header */}
      <LandingHeader
        onTryFree={onTryFree}
        onSignIn={onLogin}
      />

      {/* Main Content Grid */}
      <main className="relative">
        {/* Hero Section - Full viewport */}
        <section>
          <HeroSection 
            onTryFree={onTryFree}
            onSeePricing={scrollToPricing}
            onLogin={onLogin}
          />
        </section>

        {/* Features Section - Proper spacing */}
        <section className="relative py-20 lg:py-32">
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-muted/5 to-transparent pointer-events-none" />
          <FeaturesSection />
        </section>

        {/* How It Works Section - Proper spacing */}
        <section className="relative py-20 lg:py-32">
          <div className="absolute inset-0 bg-gradient-to-br from-primary/3 to-accent/3 pointer-events-none" />
          <HowItWorksSection />
        </section>

        {/* Pricing Section - Proper spacing */}
        <section id="pricing" className="relative py-20 lg:py-32">
          <div className="absolute inset-0 bg-gradient-to-t from-secondary/5 via-transparent to-transparent pointer-events-none" />
          <PricingSection 
            onTryFree={onTryFree}
            onSeePricing={scrollToPricing}
          />
        </section>
      </main>

      {/* Footer */}
      <footer>
        <LandingFooter 
          onTryFree={onTryFree}
          onSignIn={onLogin}
        />
      </footer>
    </div>
  );
};