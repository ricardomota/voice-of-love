import React, { useState } from 'react';
import { ModernHeader } from '@/components/layout/ModernHeader';
import { HeroSection } from '@/components/landing/HeroSection';
import { FeaturesSection } from '@/components/landing/FeaturesSection';
import { EnhancedHowItWorks } from '@/components/landing/EnhancedHowItWorks';
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
    <div className="min-h-screen bg-gradient-to-br from-slate-50/80 via-blue-50/30 to-indigo-50/50 dark:from-gray-950 dark:via-slate-900 dark:to-gray-950 transition-colors duration-700">
      {/* Header */}
      <div className="relative bg-white/70 dark:bg-gray-950/90 backdrop-blur-sm border-b border-gray-200/50 dark:border-gray-800/50">
        <ModernHeader />
      </div>

      {/* Hero Section */}
      <div className="relative">
        <HeroSection 
          onTryFree={openWaitlistModal}
          onSeePricing={scrollToPricing}
          onLogin={onLogin}
        />
      </div>

      {/* Features Section */}
      <div className="relative bg-white/60 dark:bg-gray-900/40 backdrop-blur-sm border-y border-gray-200/30 dark:border-gray-800/30 transition-all duration-700">
        <FeaturesSection />
      </div>

      {/* How It Works Section */}
      <div className="relative bg-gradient-to-r from-slate-50/50 to-blue-50/30 dark:from-gray-900/30 dark:to-slate-800/20 transition-all duration-700">
        <EnhancedHowItWorks />
      </div>

      {/* Pricing Section */}
      <div className="relative bg-white/70 dark:bg-gray-800/20 backdrop-blur-sm border-y border-gray-200/30 dark:border-gray-800/30 transition-all duration-700">
        <SimplePricingSection onJoinWaitlist={openWaitlistModal} />
      </div>

      {/* Stats */}
      <div className="relative bg-gradient-to-r from-indigo-50/40 to-slate-50/60 dark:from-slate-900/20 dark:to-gray-900/30 transition-all duration-700">
        <ModernStats />
      </div>

      {/* Story Card */}
      <div className="relative bg-white/50 dark:bg-gray-900/30 backdrop-blur-sm border-y border-gray-200/20 dark:border-gray-800/20 transition-all duration-700">
        <StoryCard />
      </div>

      {/* Footer */}
      <div className="relative bg-gradient-to-r from-slate-100/80 to-gray-100/60 dark:from-gray-900/60 dark:to-slate-900/80 border-t border-gray-200/40 dark:border-gray-800/40 transition-all duration-700">
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