import React, { useState } from 'react';
import { ModernHeader } from '@/components/layout/ModernHeader';
import { HeroSection } from '@/components/landing/HeroSection';
import { FeaturesSection } from '@/components/landing/FeaturesSection';
import { InteractiveHowItWorks } from '@/components/landing/InteractiveHowItWorks';
import { ModernStats } from '@/components/landing/ModernStats';
import { StoryCard } from '@/components/landing/StoryCard';
import { LandingFooter } from '@/components/landing/LandingFooter';
import { SimplePricingSection } from '@/components/landing/SimplePricingSection';
import { SimpleWaitlistModal } from '@/components/landing/SimpleWaitlistModal';

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
    <div className="min-h-screen bg-white dark:bg-gray-950">
      {/* Header */}
      <ModernHeader />

      {/* Hero Section */}
      <HeroSection 
        onTryFree={openWaitlistModal}
        onSeePricing={scrollToPricing}
        onLogin={onLogin}
      />

      {/* Features Section */}
      <FeaturesSection />

      {/* How It Works Section */}
      <InteractiveHowItWorks />

      {/* Pricing Section */}
      <SimplePricingSection onJoinWaitlist={openWaitlistModal} />

      {/* Stats */}
      <ModernStats />

      {/* Story Card */}
      <StoryCard />

      {/* Footer */}
      <LandingFooter 
        onTryFree={openWaitlistModal}
        onSignIn={openWaitlistModal}
      />

      {/* Waitlist Modal */}
      <SimpleWaitlistModal 
        isOpen={showWaitlistModal}
        onClose={() => setShowWaitlistModal(false)}
      />
    </div>
  );
};