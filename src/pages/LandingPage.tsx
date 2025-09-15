import React, { useState } from 'react';
import { ModernHeader } from '@/components/layout/ModernHeader';
import { HeroSection } from '@/components/landing/HeroSection';
import { FeaturesSection } from '@/components/landing/FeaturesSection';
import { InteractiveHowItWorks } from '@/components/landing/InteractiveHowItWorks';
import { ModernStats } from '@/components/landing/ModernStats';
import { StoryCard } from '@/components/landing/StoryCard';
import { LandingFooter } from '@/components/landing/LandingFooter';

interface LandingPageProps {
  onTryFree: () => void;
  onLogin: () => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({ onTryFree, onLogin }) => {
  const scrollToPricing = () => {
    const element = document.getElementById('pricing-section');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    } else {
      window.location.href = '/pricing';
    }
  };

  return (
    <div className="min-h-screen bg-background relative">
      {/* Header */}
      <ModernHeader />

      {/* Hero Section */}
      <HeroSection 
        onTryFree={onTryFree}
        onSeePricing={scrollToPricing}
        onLogin={onLogin}
      />

      {/* Features Section */}
      <div className="-mt-16">
        <FeaturesSection />
      </div>

      {/* How It Works Section */}
      <div className="-mt-8">
        <InteractiveHowItWorks />
      </div>

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
          onTryFree={onTryFree}
          onSignIn={onLogin}
        />
      </div>
    </div>
  );
};