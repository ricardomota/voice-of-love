import React from 'react';
import { LandingHeader } from '@/components/landing/LandingHeader';
import { PricingSection } from '@/components/landing/PricingSection';
import { PrivacySection } from '@/components/landing/PrivacySection';
import { ConversionBand } from '@/components/landing/ConversionBand';
import { LandingFooter } from '@/components/landing/LandingFooter';

interface PricingPageProps {
  onTryFree: () => void;
  onSignIn: () => void;
}

export const PricingPage: React.FC<PricingPageProps> = ({ onTryFree, onSignIn }) => {
  return (
    <div className="min-h-screen bg-background">
      <LandingHeader onTryFree={onTryFree} onSignIn={onSignIn} />
      
      <main className="pt-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 text-center">
          <h1 className="text-4xl sm:text-5xl font-bold text-foreground mb-6">
            Choose Your Plan
          </h1>
          <p className="text-xl text-muted-foreground mb-12">
            Start free and upgrade when you're ready to preserve more family voices and memories.
          </p>
        </div>
        
        <PricingSection onTryFree={onTryFree} onSeePricing={() => {}} />
        <PrivacySection />
        <ConversionBand onTryFree={onTryFree} />
      </main>
      
      <LandingFooter onTryFree={onTryFree} onSignIn={onSignIn} />
    </div>
  );
};