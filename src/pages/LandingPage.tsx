import React, { useState } from 'react';
import { ModernHeader } from '@/components/layout/ModernHeader';
import { HeroSection } from '@/components/landing/HeroSection';
import { FeaturesSection } from '@/components/landing/FeaturesSection';
import { InteractiveHowItWorks } from '@/components/landing/InteractiveHowItWorks';
import { ModernStats } from '@/components/landing/ModernStats';
import { StoryCard } from '@/components/landing/StoryCard';
import { LandingFooter } from '@/components/landing/LandingFooter';
import { SimplePricingSection } from '@/components/landing/SimplePricingSection';
import { SimpleWaitlistForm } from '@/components/landing/SimpleWaitlistForm';

interface LandingPageProps {
  onTryFree: () => void;
  onLogin: () => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({ onTryFree, onLogin }) => {
  const [showWaitlistModal, setShowWaitlistModal] = useState(false);

  const openWaitlistModal = () => {
    setShowWaitlistModal(true);
  };

  const scrollToPricing = () => {
    const element = document.getElementById('pricing');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-background via-muted/30 to-background">
      {/* Header */}
      <ModernHeader />

      {/* Hero Section */}
      <div className="transition-all duration-700 ease-in-out">
        <HeroSection 
          onTryFree={openWaitlistModal}
          onSeePricing={scrollToPricing}
          onLogin={onLogin}
        />
      </div>

      {/* Features Section */}
      <div className="bg-gradient-to-b from-background/50 to-muted/50 backdrop-blur-sm transition-all duration-700 ease-in-out">
        <FeaturesSection />
      </div>

      {/* How It Works Section */}
      <div className="bg-gradient-to-r from-muted/40 via-accent/30 to-muted/40 dark:from-muted/20 dark:via-accent/10 dark:to-muted/20 transition-all duration-700 ease-in-out">
        <InteractiveHowItWorks />
      </div>

      {/* Pricing Section */}
      <div className="bg-gradient-to-b from-background/70 to-muted/30 backdrop-blur-sm transition-all duration-700 ease-in-out">
        <SimplePricingSection onJoinWaitlist={openWaitlistModal} />
      </div>

      {/* Stats */}
      <div className="bg-gradient-to-r from-accent/30 via-muted/40 to-accent/30 dark:from-accent/10 dark:via-muted/20 dark:to-accent/10 transition-all duration-700 ease-in-out">
        <ModernStats />
      </div>

      {/* Story Card */}
      <div className="bg-gradient-to-b from-muted/40 to-background/60 backdrop-blur-sm transition-all duration-700 ease-in-out">
        <StoryCard />
      </div>

      {/* Footer */}
      <div className="bg-gradient-to-t from-muted/50 to-background/40 transition-all duration-700 ease-in-out">
        <LandingFooter 
          onTryFree={openWaitlistModal}
          onSignIn={openWaitlistModal}
        />
      </div>

      {/* Waitlist Modal */}
      <SimpleWaitlistForm 
        isOpen={showWaitlistModal}
        onClose={() => setShowWaitlistModal(false)}
      />
    </div>
  );
};