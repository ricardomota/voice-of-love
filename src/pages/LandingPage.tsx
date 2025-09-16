import React, { useState } from 'react';
import { ModernHeader } from '@/components/layout/ModernHeader';
import { HeroSection } from '@/components/landing/HeroSection';
import { FeaturesSection } from '@/components/landing/FeaturesSection';
import { InteractiveHowItWorks } from '@/components/landing/InteractiveHowItWorks';
import { ModernStats } from '@/components/landing/ModernStats';
import { StoryCard } from '@/components/landing/StoryCard';
import { LandingFooter } from '@/components/landing/LandingFooter';
import { WaitlistSection } from '@/components/landing/WaitlistSection';
import { UpdatedPricingSection } from '@/components/landing/UpdatedPricingSection';

interface LandingPageProps {
  onTryFree: () => void;
  onLogin: () => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({ onTryFree, onLogin }) => {
  const scrollToWaitlist = () => {
    const element = document.getElementById('waitlist');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const scrollToPricing = () => {
    const element = document.getElementById('pricing');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen bg-background relative">
      {/* Header */}
      <ModernHeader />

      {/* Hero Section */}
      <HeroSection 
        onTryFree={scrollToWaitlist}
        onSeePricing={scrollToPricing}
        onLogin={onLogin}
      />

      {/* Waitlist Section */}
      <WaitlistSection onJoinWaitlist={() => {}} />

      {/* Features Section */}
      <div className="-mt-16">
        <FeaturesSection />
      </div>

      {/* How It Works Section */}
      <div className="-mt-8">
        <InteractiveHowItWorks />
      </div>

      {/* Pricing Section */}
      <UpdatedPricingSection onJoinWaitlist={scrollToWaitlist} />

      {/* Stats */}
      <div className="-mt-8">
        <ModernStats />
      </div>

      {/* Story Card */}
      <div className="-mt-4">
        <StoryCard />
      </div>

      {/* Footer */}
      <div className="-mt-8">
        <LandingFooter 
          onTryFree={scrollToWaitlist}
          onSignIn={scrollToWaitlist}
        />
      </div>
    </div>
  );
};