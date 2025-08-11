import React from 'react';
import { LandingHeader } from './LandingHeader';
import { ModernHero } from './ModernHero';
import { FeaturesShowcase } from './FeaturesShowcase';
import { PersonalStory } from './PersonalStory';
import { LandingFooter } from './LandingFooter';
import { ConversionBand } from './ConversionBand';

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
      <ConversionBand onTryFree={onTryFree} />
      <LandingFooter onTryFree={onTryFree} onSignIn={onSignIn} />
    </div>
  );
};