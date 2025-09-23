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
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 dark:from-gray-950 dark:via-purple-950/20 dark:to-blue-950/20">
      {/* Header */}
      <ModernHeader />

      {/* Hero Section */}
      <HeroSection 
        onTryFree={openWaitlistModal}
        onSeePricing={scrollToPricing}
        onLogin={onLogin}
      />

      {/* Features Section */}
      <div className="bg-white/50 dark:bg-gray-900/50 backdrop-blur-sm">
        <FeaturesSection />
      </div>

      {/* How It Works Section */}
      <div className="bg-gradient-to-r from-purple-100/80 to-blue-100/80 dark:from-purple-900/20 dark:to-blue-900/20">
        <InteractiveHowItWorks />
      </div>

      {/* Pricing Section */}
      <div className="bg-white/70 dark:bg-gray-800/30 backdrop-blur-sm">
        <SimplePricingSection onJoinWaitlist={openWaitlistModal} />
      </div>

      {/* Stats */}
      <div className="bg-gradient-to-r from-pink-100/80 to-purple-100/80 dark:from-pink-900/20 dark:to-purple-900/20">
        <ModernStats />
      </div>

      {/* Story Card */}
      <div className="bg-white/50 dark:bg-gray-900/50 backdrop-blur-sm">
        <StoryCard />
      </div>

      {/* Footer */}
      <div className="bg-gradient-to-r from-blue-100/80 to-purple-100/80 dark:from-blue-900/20 dark:to-purple-900/20">
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