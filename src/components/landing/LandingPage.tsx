import React from 'react';
import { LandingHeader } from './LandingHeader';
import { HeroSection } from './HeroSection';
import { HowItWorksSection } from './HowItWorksSection';
import { WhyEternaSection } from './WhyEternaSection';
import { FeaturesSection } from './FeaturesSection';
import { ConversionBand } from './ConversionBand';
import { PricingSection } from './PricingSection';
import { PrivacySection } from './PrivacySection';
import { LandingFooter } from './LandingFooter';

interface LandingPageProps {
  onTryFree: () => void;
  onSignIn: () => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({ onTryFree, onSignIn }) => {
  
  const scrollToPricing = () => {
    const element = document.getElementById('pricing');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <LandingHeader onTryFree={onTryFree} onSignIn={onSignIn} />
      
      <main>
        <HeroSection onTryFree={onTryFree} onSeePricing={scrollToPricing} />
        <HowItWorksSection />
        <WhyEternaSection />
        <FeaturesSection />
        <ConversionBand onTryFree={onTryFree} />
        <PricingSection onTryFree={onTryFree} onSeePricing={scrollToPricing} />
        <PrivacySection />
      </main>
      
      <LandingFooter onTryFree={onTryFree} onSignIn={onSignIn} />
    </div>
  );
};