import React, { useState } from 'react';
import { ModernHeader } from '@/components/layout/ModernHeader';
import { HeroSection } from '@/components/landing/HeroSection';
import { FeaturesSection } from '@/components/landing/FeaturesSection';
import { HowItWorksSection } from '@/components/landing/HowItWorksSection';
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
    <div className="min-h-screen bg-background relative overflow-x-hidden">
      {/* Modern Floating Header */}
      <ModernHeader />

      {/* Hero Section */}
      <HeroSection 
        onTryFree={onTryFree}
        onSeePricing={scrollToPricing}
        onLogin={onLogin}
      />

      {/* Features Section */}
      <div className="relative">
        <FeaturesSection />
      </div>

      {/* How It Works Section */}
      <div className="relative">
        <HowItWorksSection />
      </div>

      {/* Modern Stats */}
      <div className="relative">
        <ModernStats />
      </div>

      {/* Story Card */}
      <div className="relative">
        <StoryCard />
      </div>

      {/* Footer */}
      <div className="relative">
        <LandingFooter 
          onTryFree={onTryFree}
          onSignIn={onLogin}
        />
      </div>
    </div>
  );
};