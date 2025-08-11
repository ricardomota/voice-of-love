import React from 'react';
import { LandingHeader } from './LandingHeader';
import { SimpleHero } from './SimpleHero';
import { HomeStats } from './HomeStats';
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
    <div className="min-h-screen bg-background">
      <LandingHeader onTryFree={onTryFree} onSignIn={onSignIn} onHowItWorks={onLearnMore} />
      
      <main>
        <SimpleHero onTryFree={onTryFree} onLearnMore={onLearnMore} />
        <HomeStats onGetStarted={onTryFree} />
      </main>
      
      <LandingFooter onTryFree={onTryFree} onSignIn={onSignIn} />
    </div>
  );
};