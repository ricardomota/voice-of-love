import React from 'react';
import { LandingHeader } from './LandingHeader';
import { ModernHero } from './ModernHero';
import { FeaturesShowcase } from './FeaturesShowcase';
import { PersonalStory } from './PersonalStory';
import { PricingSection } from './PricingSection';
import { ConversionBand } from './ConversionBand';
import { LandingFooter } from './LandingFooter';

interface RileyLandingPageProps {
  onTryFree: () => void;
  onSignIn: () => void;
  onLearnMore: () => void;
  onSeePricing?: () => void;
}

export default function RileyLandingPage({ onTryFree, onSignIn, onLearnMore }: RileyLandingPageProps) {
  const scrollToPricing = () => {
    const element = document.getElementById('pricing');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen">
      <LandingHeader onTryFree={onTryFree} onSignIn={onSignIn} onHowItWorks={onLearnMore} />
      <ModernHero onTryFree={onTryFree} onLearnMore={onLearnMore} />
      <FeaturesShowcase />
      <PersonalStory onGetStarted={onTryFree} />
      <PricingSection onTryFree={onTryFree} onSeePricing={scrollToPricing} />
      <ConversionBand onTryFree={onTryFree} />
      <LandingFooter onTryFree={onTryFree} onSignIn={onSignIn} />
    </div>
  );
}