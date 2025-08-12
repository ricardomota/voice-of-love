import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { LanguageSelector } from '@/components/ui/language-selector';
import { useLanguage } from '@/hooks/useLanguage';
import { Menu, X, Heart } from 'lucide-react';

interface LandingHeaderProps {
  onTryFree: () => void;
  onSignIn: () => void;
  onHowItWorks?: () => void;
}

const getContent = (language: string) => {
  const content = {
    en: {
      howItWorks: "How it Works",
      tryFree: "Try Eterna Free",
      signIn: "Sign In"
    },
    'pt-BR': {
      howItWorks: "Como Funciona",
      tryFree: "Testar Grátis", 
      signIn: "Entrar"
    },
    es: {
      howItWorks: "Cómo Funciona",
      tryFree: "Probar Gratis",
      signIn: "Iniciar Sesión" 
    }
  };
  return content[language as keyof typeof content] || content.en;
};

export const LandingHeader: React.FC<LandingHeaderProps> = ({ onTryFree, onSignIn, onHowItWorks }) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { currentLanguage } = useLanguage();
  const content = getContent(currentLanguage);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleNavigation = (section: string) => {
    if (section === 'how-it-works' && onHowItWorks) {
      onHowItWorks();
    } else if (section === 'pricing') {
      // Scroll to pricing section on same page
      scrollToSection('pricing');
    } else {
      // Fallback to scroll for same-page sections
      scrollToSection(section);
    }
    setIsMobileMenuOpen(false);
  };

  return (
    <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
      isScrolled ? 'bg-background/95 backdrop-blur-lg shadow-lg' : 'bg-transparent'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 lg:h-20">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <div className="w-4 h-4 sm:w-5 sm:h-5 bg-gradient-to-br from-[#441632] to-[#331122] rounded-xl flex items-center justify-center shadow-lg">
              <Heart className="w-2 h-2 sm:w-2.5 sm:h-2.5 text-[#FDFBCB]" />
            </div>
            <span className="text-lg sm:text-xl font-semibold text-foreground">Eterna</span>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-8">
            <button 
              onClick={() => handleNavigation('how-it-works')}
              className="text-muted-foreground hover:text-foreground transition-colors"
            >
              {content.howItWorks}
            </button>
            <button 
              onClick={() => handleNavigation('pricing')}
              className="text-muted-foreground hover:text-foreground transition-colors"
            >
              Preços
            </button>
            <LanguageSelector />
            <button
              onClick={onSignIn}
              className="text-muted-foreground hover:text-foreground transition-colors"
            >
              {content.signIn}
            </button>
            <Button onClick={onTryFree} variant="default" size="lg">
              {content.tryFree}
            </Button>
          </nav>

          {/* Mobile Menu Button */}
          <div className="flex items-center gap-3 lg:hidden">
            <LanguageSelector />
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </Button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="lg:hidden absolute top-full left-0 right-0 bg-background/95 backdrop-blur-lg border-t border-border/50 shadow-lg">
            <nav className="px-4 py-6 space-y-4">
              <button 
                onClick={() => handleNavigation('how-it-works')}
                className="block w-full text-left text-muted-foreground hover:text-foreground transition-colors py-2"
              >
                {content.howItWorks}
              </button>
              <button 
                onClick={() => handleNavigation('pricing')}
                className="block w-full text-left text-muted-foreground hover:text-foreground transition-colors py-2"
              >
                Preços
              </button>
              <button 
                onClick={onSignIn}
                className="block w-full text-left text-muted-foreground hover:text-foreground transition-colors py-2"
              >
                {content.signIn}
              </button>
              <div className="pt-4 border-t border-border/50">
                <Button onClick={onTryFree} variant="default" size="lg" className="w-full">
                  {content.tryFree}
                </Button>
              </div>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
};