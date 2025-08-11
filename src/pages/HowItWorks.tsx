import React from 'react';
import { useNavigate } from 'react-router-dom';
import { LandingHeader } from '@/components/landing/LandingHeader';
import { HowItWorksSection } from '@/components/landing/HowItWorksSection';
import { WhyEternaSection } from '@/components/landing/WhyEternaSection';
import { FeaturesSection } from '@/components/landing/FeaturesSection';
import { ConversionBand } from '@/components/landing/ConversionBand';
import { LandingFooter } from '@/components/landing/LandingFooter';

interface HowItWorksPageProps {
  onTryFree: () => void;
  onSignIn: () => void;
}

export const HowItWorksPage: React.FC<HowItWorksPageProps> = ({ onTryFree, onSignIn }) => {
  const navigate = useNavigate();
  
  return (
    <div className="min-h-screen bg-background">
      <LandingHeader 
        onTryFree={onTryFree} 
        onSignIn={onSignIn}
        onHowItWorks={() => navigate('/how-it-works')}
      />
      
      <main className="pt-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 text-center">
          <h1 className="text-4xl sm:text-5xl font-bold text-foreground mb-6">
            How Eterna Works
          </h1>
          <p className="text-xl text-muted-foreground mb-12">
            Discover how we help families preserve voices and create lasting connections through AI technology.
          </p>
        </div>
        
        <HowItWorksSection />
        <WhyEternaSection />
        <FeaturesSection />
        <ConversionBand onTryFree={onTryFree} />
      </main>
      
      <LandingFooter onTryFree={onTryFree} onSignIn={onSignIn} />
    </div>
  );
};