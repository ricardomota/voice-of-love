import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { LanguageSelector } from '@/components/ui/language-selector';
import { useLanguage } from '@/hooks/useLanguage';
import { Menu, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence, useScroll, useTransform } from 'framer-motion';

interface LandingHeaderProps {
  onTryFree: () => void;
  onSignIn: () => void;
  onHowItWorks?: () => void;
}

const getContent = (language: string) => {
  const content = {
    en: {
      howItWorks: "How it Works",
      pricing: "Pricing",
      tryFree: "Get Started",
      signIn: "Sign In"
    },
    'pt-BR': {
      howItWorks: "Como Funciona",
      pricing: "Preços",
      tryFree: "Começar", 
      signIn: "Entrar"
    },
    es: {
      howItWorks: "Cómo Funciona",
      pricing: "Precios",
      tryFree: "Empezar",
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
      const currentScrollY = window.scrollY;
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

  return (
    <header 
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-300 ease-out",
        isScrolled 
          ? "bg-background/95 backdrop-blur-xl shadow-sm border-b border-border" 
          : "bg-background/90"
      )}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div 
          className={cn(
            "flex items-center justify-between transition-all duration-300 ease-out",
            isScrolled ? "h-14" : "h-16 lg:h-20"
          )}
        >
          {/* Simple Logo */}
          <div className="flex items-center gap-3 relative cursor-pointer">
            <img 
              src="/src/assets/eterna-logo.svg" 
              alt="Eterna Logo" 
              className={cn(
                "w-auto transition-all duration-300",
                isScrolled ? "h-4" : "h-5"
              )}
            />
          </div>

          {/* Simple Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-8">
            <button 
              onClick={() => handleNavigation('how-it-works')}
              className="text-muted-foreground hover:text-foreground transition-all duration-300 relative group text-lg font-medium px-4 py-2 rounded-xl hover:bg-primary/10 hover:scale-105"
            >
              {content.howItWorks}
            </button>
            <button 
              onClick={() => handleNavigation('pricing')}
              className="text-muted-foreground hover:text-foreground transition-all duration-300 relative group text-lg font-medium px-4 py-2 rounded-xl hover:bg-primary/10 hover:scale-105"
            >
              {content.pricing}
            </button>
            
            <div className="flex items-center gap-6">
              <LanguageSelector />
              <button
                onClick={onSignIn}
                className="text-muted-foreground hover:text-foreground transition-all duration-300 px-4 py-2 rounded-xl hover:bg-muted/50 text-lg font-medium hover:scale-105"
              >
                {content.signIn}
              </button>
              <Button 
                onClick={onTryFree} 
                variant="default" 
                size="lg"
                className="shadow-lg hover:shadow-2xl transition-all duration-300 bg-primary hover:bg-primary/90 text-lg font-semibold px-8 hover:scale-105"
              >
                {content.tryFree}
              </Button>
            </div>
          </nav>

          {/* Mobile: Menu button */}
          <div className="flex items-center gap-3 lg:hidden">
            <LanguageSelector />
            
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

        {/* Enhanced Mobile Menu */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div 
              className="lg:hidden absolute top-full left-0 right-0 bg-background/95 backdrop-blur-xl border-t border-border shadow-xl overflow-hidden"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3, ease: "easeOut" }}
            >
              <motion.nav 
                className="px-4 py-6 space-y-1"
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
              >
                {[
                  { label: content.howItWorks, action: () => handleNavigation('how-it-works') },
                  { label: content.pricing, action: () => handleNavigation('pricing') },
                  { label: content.signIn, action: onSignIn }
                ].map((item, index) => (
                  <motion.button
                    key={item.label}
                    onClick={item.action}
                    className="block w-full text-left text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-all duration-300 py-4 px-4 rounded-xl text-lg font-medium"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.1 + index * 0.05 }}
                    whileHover={{ x: 8, scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    {item.label}
                  </motion.button>
                ))}
                
                <motion.div 
                  className="pt-4 border-t border-border mt-4 space-y-4"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.3 }}
                >
                  <div className="mb-4">
                    <LanguageSelector />
                  </div>
                  <motion.div
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <Button 
                      onClick={onTryFree} 
                      variant="default" 
                      size="lg" 
                      className="w-full shadow-lg hover:shadow-xl transition-all duration-300 bg-primary hover:bg-primary/90 text-lg font-semibold h-14"
                    >
                      {content.tryFree}
                    </Button>
                  </motion.div>
                </motion.div>
              </motion.nav>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </header>
  );
};