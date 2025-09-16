import React from 'react';
import { Button } from '@/components/ui/button';
import { LanguageSelector } from '@/components/ui/language-selector';
import { useLanguage } from '@/hooks/useLanguage';
import { useNavigate } from 'react-router-dom';
import { Heart, Mail, FileText, Shield, HelpCircle } from 'lucide-react';

interface LandingFooterProps {
  onTryFree: () => void;
  onSignIn: () => void;
}

import { getLandingContent } from '@/utils/translations';

export const LandingFooter: React.FC<LandingFooterProps> = ({ onTryFree, onSignIn }) => {
  const { currentLanguage } = useLanguage();
  const navigate = useNavigate();
  const content = getLandingContent(currentLanguage).footer;

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <footer className="bg-primary border-t border-border/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20 lg:py-24">
        
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 lg:gap-12 mb-12">
          
          {/* Brand */}
          <div className="lg:col-span-2 space-y-6">
            <div className="flex items-center gap-3">
              <img 
                src="/lovable-uploads/eterna-logo-black.png" 
                alt="Eterna Logo" 
                className="h-6 w-auto"
              />
            </div>
            
            <p className="text-primary-foreground/70 leading-relaxed max-w-md">
              {content.tagline}
            </p>

            <div className="space-y-4">
              <h4 className="font-semibold text-primary-foreground">
                {content.support}
              </h4>
              <p className="text-sm text-primary-foreground/70 leading-relaxed">
                We're here to help you preserve your family's most precious voices.
              </p>
              <div className="flex items-center gap-2 text-sm">
                <Mail className="w-4 h-4 text-primary-foreground" />
                <a 
                  href="mailto:support@eterna.chat"
                  className="text-primary-foreground hover:text-primary-foreground/80 transition-colors"
                >
                  support@eterna.chat
                </a>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-6">
            <h4 className="font-semibold text-primary-foreground">{content.quickLinks}</h4>
            <nav className="flex flex-col space-y-3">
              <button 
                onClick={() => scrollToSection('pricing')}
                className="text-primary-foreground/70 hover:text-primary-foreground transition-colors text-left"
              >
                Pricing
              </button>
              <button 
                onClick={onTryFree}
                className="text-primary-foreground/70 hover:text-primary-foreground transition-colors text-left"
              >
                {content.tryFree}
              </button>
              <button 
                onClick={onSignIn}
                className="text-primary-foreground/70 hover:text-primary-foreground transition-colors text-left"
              >
                {content.signIn}
              </button>
            </nav>
          </div>

          {/* Support & Updates */}
          <div className="space-y-6">
            <h4 className="font-semibold text-primary-foreground">{content.support}</h4>
            <nav className="flex flex-col space-y-3">
              <button 
                onClick={() => navigate('/changelog')}
                className="text-primary-foreground/70 hover:text-primary-foreground transition-colors flex items-center gap-2"
              >
                <FileText className="w-4 h-4 text-primary-foreground" />
                Changelog
              </button>
              <button className="text-primary-foreground/70 hover:text-primary-foreground transition-colors flex items-center gap-2">
                <Mail className="w-4 h-4 text-primary-foreground" />
                {content.contact}
              </button>
            </nav>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-primary-foreground/20">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            
            {/* Copyright */}
            <p className="text-sm text-primary-foreground/70 text-center sm:text-left">
              {content.copyright}
            </p>

            {/* Language Selector */}
            <div className="flex items-center gap-4">
              <LanguageSelector />
            </div>
            
          </div>
        </div>

      </div>
    </footer>
  );
};