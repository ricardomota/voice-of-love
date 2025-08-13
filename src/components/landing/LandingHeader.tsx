import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { LanguageSelector } from '@/components/ui/language-selector';
import { useLanguage } from '@/hooks/useLanguage';
import { Menu, X } from 'lucide-react';
import { cn } from '@/lib/utils';

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
  const [scrollY, setScrollY] = useState(0);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { currentLanguage } = useLanguage();
  const content = getContent(currentLanguage);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      setScrollY(currentScrollY);
      setIsScrolled(currentScrollY > 50);
    };
    
    window.addEventListener('scroll', handleScroll, { passive: true });
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

  const isCompact = scrollY > 100;
  const showOnlyLogo = scrollY > 200;

  return (
    <header 
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-500 ease-out",
        isScrolled 
          ? "bg-white/95 backdrop-blur-xl shadow-sm border-b border-gray-200" 
          : "bg-white/90"
      )}
      style={{
        transform: `translateY(${Math.min(scrollY * 0.1, 2)}px)`,
      }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className={cn(
          "flex items-center justify-between transition-all duration-500 ease-out",
          isCompact ? "h-14" : "h-16 lg:h-20"
        )}>
          {/* Logo com animação */}
          <div className="flex items-center gap-3 relative">
            <div className={cn(
              "transition-all duration-500 ease-out transform",
              isCompact ? "scale-90" : "scale-100"
            )}>
              <img 
                src="/lovable-uploads/4a3edab3-4083-4a1c-a748-c8c1d4626206.png" 
                alt="Eterna Logo" 
                className={cn(
                  "w-auto dark:hidden transition-all duration-500",
                  showOnlyLogo ? "h-6" : "h-4"
                )}
              />
              <img 
                src="/lovable-uploads/0d1a58a9-f5b7-441f-a99a-ee72d330aa78.png" 
                alt="Eterna Logo" 
                className={cn(
                  "w-auto hidden dark:block transition-all duration-500",
                  showOnlyLogo ? "h-6" : "h-4"
                )}
              />
            </div>
            {/* Glow effect apenas no logo quando compacto */}
            {showOnlyLogo && (
              <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-accent/20 blur-xl rounded-full scale-150 opacity-30 animate-pulse" />
            )}
          </div>

          {/* Desktop Navigation com fade out inteligente */}
          <nav className={cn(
            "hidden lg:flex items-center gap-6 transition-all duration-500 ease-out",
            showOnlyLogo ? "opacity-0 translate-x-4 pointer-events-none" : "opacity-100 translate-x-0"
          )}>
            <button 
              onClick={() => handleNavigation('how-it-works')}
              className="text-muted-foreground hover:text-foreground transition-all duration-300 hover:scale-105 relative group"
            >
              {content.howItWorks}
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-primary transition-all duration-300 group-hover:w-full" />
            </button>
            <button 
              onClick={() => handleNavigation('pricing')}
              className="text-muted-foreground hover:text-foreground transition-all duration-300 hover:scale-105 relative group"
            >
              Preços
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-primary transition-all duration-300 group-hover:w-full" />
            </button>
            
            <div className={cn(
              "flex items-center gap-4 transition-all duration-500",
              isCompact ? "scale-90" : "scale-100"
            )}>
              <LanguageSelector />
              <button
                onClick={onSignIn}
                className="text-muted-foreground hover:text-foreground transition-all duration-300 hover:scale-105 px-3 py-2 rounded-md hover:bg-muted/50"
              >
                {content.signIn}
              </button>
              <Button 
                onClick={onTryFree} 
                variant="default" 
                size={isCompact ? "default" : "lg"}
                className="shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 bg-gradient-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary"
              >
                {content.tryFree}
              </Button>
            </div>
          </nav>

          {/* Mobile: Menu button ou CTA inteligente */}
          <div className="flex items-center gap-3 lg:hidden">
            {showOnlyLogo ? (
              // Quando só mostra logo, mostra CTA compacto
              <Button 
                onClick={onTryFree}
                size="sm"
                className="shadow-md hover:shadow-lg transition-all duration-300 hover:scale-105"
              >
                Testar
              </Button>
            ) : (
              <LanguageSelector />
            )}
            
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className={cn(
                "transition-all duration-300",
                isMobileMenuOpen ? "rotate-180" : "rotate-0"
              )}
            >
              {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </Button>
          </div>
        </div>

        {/* Mobile Menu melhorado */}
        {isMobileMenuOpen && (
          <div className="lg:hidden absolute top-full left-0 right-0 bg-white/95 backdrop-blur-xl border-t border-gray-200 shadow-xl animate-slide-down">
            <nav className="px-4 py-6 space-y-1">
              <button 
                onClick={() => handleNavigation('how-it-works')}
                className="block w-full text-left text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-all duration-300 py-3 px-3 rounded-lg"
              >
                {content.howItWorks}
              </button>
              <button 
                onClick={() => handleNavigation('pricing')}
                className="block w-full text-left text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-all duration-300 py-3 px-3 rounded-lg"
              >
                Preços
              </button>
              <button 
                onClick={onSignIn}
                className="block w-full text-left text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-all duration-300 py-3 px-3 rounded-lg"
              >
                {content.signIn}
              </button>
              
              <div className="pt-4 border-t border-gray-200 mt-4">
                {!showOnlyLogo && (
                  <div className="mb-4">
                    <LanguageSelector />
                  </div>
                )}
                <Button 
                  onClick={onTryFree} 
                  variant="default" 
                  size="lg" 
                  className="w-full shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 bg-gradient-to-r from-primary to-primary/90"
                >
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