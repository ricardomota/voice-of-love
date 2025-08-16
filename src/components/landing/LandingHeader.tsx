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
  const { scrollY: motionScrollY } = useScroll();
  
  // Advanced parallax transforms
  const headerY = useTransform(motionScrollY, [0, 300], [0, -50]);
  const logoScale = useTransform(motionScrollY, [0, 200], [1, 0.9]);
  const navOpacity = useTransform(motionScrollY, [0, 150], [1, 0.8]);

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
    <motion.header 
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-500 ease-out",
        isScrolled 
          ? "bg-background/95 backdrop-blur-xl shadow-sm border-b border-border" 
          : "bg-background/90"
      )}
      style={{ y: headerY }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div 
          className={cn(
            "flex items-center justify-between transition-all duration-500 ease-out",
            isCompact ? "h-14" : "h-16 lg:h-20"
          )}
          style={{ opacity: navOpacity }}
        >
          {/* Enhanced Logo with magnetic effect */}
          <motion.div 
            className="flex items-center gap-3 relative cursor-pointer"
            whileHover={{ scale: 1.05 }}
            transition={{ type: "spring", stiffness: 400, damping: 10 }}
          >
            <motion.div
              className={cn(
                "transition-all duration-500 ease-out transform relative",
                isCompact ? "scale-90" : "scale-100"
              )}
              style={{ scale: logoScale }}
              whileHover={{ rotate: [0, -2, 2, 0] }}
              transition={{ duration: 0.6 }}
            >
              <motion.img 
                src="/lovable-uploads/2a9a0f83-672d-4d8e-9eda-ef4653426daf.png" 
                alt="Eterna Logo" 
                className={cn(
                  "w-auto transition-all duration-500 hover:brightness-110",
                  showOnlyLogo ? "h-8" : "h-6"
                )}
                whileHover={{ scale: 1.05 }}
                transition={{ duration: 0.3 }}
              />
              
              {/* Enhanced glow effect */}
              <motion.div 
                className="absolute inset-0 bg-gradient-to-r from-primary/30 via-accent/30 to-secondary/30 blur-xl rounded-full scale-150 opacity-0"
                animate={{ 
                  opacity: showOnlyLogo ? [0, 0.4, 0] : 0,
                  scale: showOnlyLogo ? [1.5, 1.8, 1.5] : 1.5 
                }}
                transition={{ duration: 3, repeat: Infinity }}
              />
            </motion.div>
          </motion.div>

          {/* Enhanced Desktop Navigation */}
          <motion.nav 
            className={cn(
              "hidden lg:flex items-center gap-8 transition-all duration-500 ease-out",
              showOnlyLogo ? "opacity-0 translate-x-4 pointer-events-none" : "opacity-100 translate-x-0"
            )}
            style={{ opacity: navOpacity }}
          >
            <motion.button 
              onClick={() => handleNavigation('how-it-works')}
              className="text-muted-foreground hover:text-foreground transition-all duration-300 relative group text-lg font-medium"
              whileHover={{ y: -2 }}
              transition={{ type: "spring", stiffness: 400, damping: 10 }}
            >
              {content.howItWorks}
              <motion.span 
                className="absolute -bottom-1 left-0 h-0.5 bg-gradient-to-r from-primary to-accent origin-left"
                initial={{ scaleX: 0 }}
                whileHover={{ scaleX: 1 }}
                transition={{ duration: 0.3 }}
                style={{ width: "100%" }}
              />
            </motion.button>
            <motion.button 
              onClick={() => handleNavigation('pricing')}
              className="text-muted-foreground hover:text-foreground transition-all duration-300 relative group text-lg font-medium"
              whileHover={{ y: -2 }}
              transition={{ type: "spring", stiffness: 400, damping: 10 }}
            >
              Preços
              <motion.span 
                className="absolute -bottom-1 left-0 h-0.5 bg-gradient-to-r from-primary to-accent origin-left"
                initial={{ scaleX: 0 }}
                whileHover={{ scaleX: 1 }}
                transition={{ duration: 0.3 }}
                style={{ width: "100%" }}
              />
            </motion.button>
            
            <motion.div
              className={cn(
                "flex items-center gap-6 transition-all duration-500",
                isCompact ? "scale-90" : "scale-100"
              )}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
            >
              <LanguageSelector />
              <motion.button
                onClick={onSignIn}
                className="text-muted-foreground hover:text-foreground transition-all duration-300 px-4 py-2 rounded-xl hover:bg-muted/50 text-lg font-medium"
                whileHover={{ scale: 1.05, y: -1 }}
                whileTap={{ scale: 0.98 }}
              >
                {content.signIn}
              </motion.button>
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.98 }}
              >
                <Button 
                  onClick={onTryFree} 
                  variant="default" 
                  size={isCompact ? "default" : "lg"}
                  className="shadow-lg hover:shadow-2xl transition-all duration-500 bg-gradient-to-r from-primary via-primary/90 to-accent hover:from-primary/90 hover:via-primary/80 hover:to-accent/90 text-lg font-semibold px-8"
                >
                  {content.tryFree}
                </Button>
              </motion.div>
            </motion.div>
          </motion.nav>

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
        </motion.div>

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
                  { label: "Preços", action: () => handleNavigation('pricing') },
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
                  {!showOnlyLogo && (
                    <div className="mb-4">
                      <LanguageSelector />
                    </div>
                  )}
                  <motion.div
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <Button 
                      onClick={onTryFree} 
                      variant="default" 
                      size="lg" 
                      className="w-full shadow-lg hover:shadow-xl transition-all duration-300 bg-gradient-to-r from-primary to-accent text-lg font-semibold h-14"
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
    </motion.header>
  );
};