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
    <footer className="relative border-t border-border/20 overflow-hidden" style={{ background: 'var(--gradient-footer)' }}>
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={{ 
        backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
        backgroundRepeat: 'repeat'
      }} />
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20 lg:py-24">
        
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 lg:gap-12 mb-12">
          
          {/* Brand */}
          <div className="lg:col-span-2 space-y-6">
            <div className="flex items-center gap-3">
              <img 
                src="/eterna-logo-grey-blue.svg" 
                alt="Eterna Logo" 
                className="h-6 w-auto"
              />
            </div>
            
            <p className="text-gray-300 leading-relaxed max-w-md">
              {content.tagline}
            </p>

            <div className="space-y-4">
              <h4 className="font-semibold text-white">
                {content.support}
              </h4>
              <p className="text-sm text-gray-300 leading-relaxed">
                We're here to help you preserve your family's most precious voices.
              </p>
              <div className="flex items-center gap-2 text-sm">
                <Mail className="w-4 h-4 text-white" />
                <a 
                  href="mailto:contact@eterna.chat"
                  className="text-white hover:text-gray-200 transition-colors"
                >
                  contact@eterna.chat
                </a>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-6">
            <h4 className="font-semibold text-white">{content.quickLinks}</h4>
            <nav className="flex flex-col space-y-3">
              <button 
                onClick={() => scrollToSection('pricing')}
                className="text-gray-300 hover:text-white transition-colors text-left"
              >
                Pricing
              </button>
              <button 
                onClick={onTryFree}
                className="text-gray-300 hover:text-white transition-colors text-left"
              >
                {content.tryFree}
              </button>
              <button 
                onClick={onSignIn}
                className="text-gray-300 hover:text-white transition-colors text-left"
              >
                {content.signIn}
              </button>
            </nav>
          </div>

          {/* Support & Updates */}
          <div className="space-y-6">
            <h4 className="font-semibold text-white">{content.support}</h4>
            <nav className="flex flex-col space-y-3">
              <button 
                onClick={() => navigate('/changelog')}
                className="text-gray-300 hover:text-white transition-colors flex items-center gap-2"
              >
                <FileText className="w-4 h-4 text-white" />
                Changelog
              </button>
              <button className="text-gray-300 hover:text-white transition-colors flex items-center gap-2">
                <Mail className="w-4 h-4 text-white" />
                {content.contact}
              </button>
            </nav>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-white/10">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            
            {/* Copyright */}
            <p className="text-sm text-gray-300 text-center sm:text-left">
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