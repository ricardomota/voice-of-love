import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '@/hooks/useLanguage';
import { LandingHeader } from '@/components/landing/LandingHeader';
import { HowItWorksSection } from '@/components/landing/HowItWorksSection';
import { WhyEternaSection } from '@/components/landing/WhyEternaSection';
import { FeaturesSection } from '@/components/landing/FeaturesSection';
import { ConversionBand } from '@/components/landing/ConversionBand';
import { LandingFooter } from '@/components/landing/LandingFooter';

const getContent = (language: string) => {
  const content = {
    en: {
      title: "How Eterna Works",
      subtitle: "Discover how we help families preserve voices and create lasting connections through AI technology."
    },
    'pt-BR': {
      title: "Como o Eterna Funciona",
      subtitle: "Descubra como ajudamos famílias a preservar vozes e criar conexões duradouras através da tecnologia de IA."
    },
    es: {
      title: "Cómo Funciona Eterna",
      subtitle: "Descubre cómo ayudamos a las familias a preservar voces y crear conexiones duraderas a través de la tecnología de IA."
    }
  };
  return content[language as keyof typeof content] || content.en;
};

interface HowItWorksPageProps {
  onTryFree: () => void;
  onSignIn: () => void;
}

export const HowItWorksPage: React.FC<HowItWorksPageProps> = ({ onTryFree, onSignIn }) => {
  const navigate = useNavigate();
  const { currentLanguage } = useLanguage();
  const content = getContent(currentLanguage);
  
  return (
    <div className="min-h-screen bg-background">
      <LandingHeader 
        onTryFree={onTryFree} 
        onSignIn={onSignIn}
        onHowItWorks={() => navigate('/how-it-works')}
      />
      
      <main className="pt-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 text-center">
          <h1 className="text-4xl sm:text-5xl font-zilla font-medium italic text-foreground mb-6">
            {content.title}
          </h1>
          <p className="text-xl font-work text-muted-foreground mb-12">
            {content.subtitle}
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