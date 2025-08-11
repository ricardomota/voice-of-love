import React from 'react';
import { LandingHeader } from './LandingHeader';
import { ModernHero } from './ModernHero';
import { FeaturesShowcase } from './FeaturesShowcase';
import { PersonalStory } from './PersonalStory';
import { PricingSection } from './PricingSection';
import { ConversionBand } from './ConversionBand';
import { LandingFooter } from './LandingFooter';

interface SimpleLandingPageProps {
  onTryFree: () => void;
  onSignIn: () => void;
  onLearnMore: () => void;
}

export const SimpleLandingPage: React.FC<SimpleLandingPageProps> = ({
  onTryFree,
  onSignIn,
  onLearnMore
}) => {
  return (
    <div className="min-h-screen">
      <LandingHeader onTryFree={onTryFree} onSignIn={onSignIn} onHowItWorks={onLearnMore} />
      <ModernHero onTryFree={onTryFree} onLearnMore={onLearnMore} />
      <FeaturesShowcase />
      <PersonalStory onGetStarted={onTryFree} />
      <PricingSection onTryFree={onTryFree} onSeePricing={() => {}} />
      <ConversionBand onTryFree={onTryFree} />
      <LandingFooter onTryFree={onTryFree} onSignIn={onSignIn} />
    </div>
  );
};