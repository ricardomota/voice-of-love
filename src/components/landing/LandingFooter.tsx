import React from 'react';
import { Button } from '@/components/ui/button';
import { LanguageSelector } from '@/components/ui/language-selector';
import { useLanguage } from '@/hooks/useLanguage';
import { Heart, Mail, FileText, Shield, HelpCircle } from 'lucide-react';

interface LandingFooterProps {
  onTryFree: () => void;
  onSignIn: () => void;
}

const getContent = (language: string) => {
  const content = {
    en: {
      tagline: "Preserving voices, keeping stories alive",
      links: {
        pricing: "Pricing",
        tryFree: "Try Free",
        docs: "Help & FAQ",
        terms: "Terms of Service",
        privacy: "Privacy Policy",
        contact: "Contact"
      },
      support: {
        title: "Need Help?",
        description: "We're here to help you preserve your family's most precious voices.",
        email: "support@eterna.app"
      },
      copyright: "Made with ❤️ for families facing memory challenges"
    },
    'pt-BR': {
      tagline: "Preservando vozes, mantendo histórias vivas",
      links: {
        pricing: "Preços",
        tryFree: "Testar Grátis",
        docs: "Ajuda e FAQ",
        terms: "Termos de Serviço",
        privacy: "Política de Privacidade",
        contact: "Contato"
      },
      support: {
        title: "Precisa de Ajuda?",
        description: "Estamos aqui para ajudar você a preservar as vozes mais preciosas da sua família.",
        email: "suporte@eterna.app"
      },
      copyright: "Feito com ❤️ para famílias enfrentando desafios de memória"
    },
    es: {
      tagline: "Preservando voces, manteniendo historias vivas",
      links: {
        pricing: "Precios",
        tryFree: "Probar Gratis",
        docs: "Ayuda y FAQ",
        terms: "Términos de Servicio",
        privacy: "Política de Privacidad",
        contact: "Contacto"
      },
      support: {
        title: "¿Necesitas Ayuda?",
        description: "Estamos aquí para ayudarte a preservar las voces más preciosas de tu familia.",
        email: "soporte@eterna.app"
      },
      copyright: "Hecho con ❤️ para familias enfrentando desafíos de memoria"
    }
  };
  return content[language as keyof typeof content] || content.en;
};

export const LandingFooter: React.FC<LandingFooterProps> = ({ onTryFree, onSignIn }) => {
  const { currentLanguage } = useLanguage();
  const content = getContent(currentLanguage);

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <footer className="bg-gradient-to-br from-muted/30 to-background border-t border-border/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20">
        
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 lg:gap-12 mb-12">
          
          {/* Brand */}
          <div className="lg:col-span-2 space-y-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-primary/20 to-primary/10 rounded-xl flex items-center justify-center">
                <Heart className="w-5 h-5 text-primary" />
              </div>
              <span className="text-2xl font-semibold text-foreground">Eterna</span>
            </div>
            
            <p className="text-muted-foreground leading-relaxed max-w-md">
              {content.tagline}
            </p>

            <div className="space-y-4">
              <h4 className="font-semibold text-foreground">
                {content.support.title}
              </h4>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {content.support.description}
              </p>
              <div className="flex items-center gap-2 text-sm">
                <Mail className="w-4 h-4 text-primary" />
                <a 
                  href={`mailto:${content.support.email}`}
                  className="text-primary hover:text-primary/80 transition-colors"
                >
                  {content.support.email}
                </a>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-6">
            <h4 className="font-semibold text-foreground">Quick Links</h4>
            <nav className="flex flex-col space-y-3">
              <button 
                onClick={() => scrollToSection('pricing')}
                className="text-muted-foreground hover:text-foreground transition-colors text-left"
              >
                {content.links.pricing}
              </button>
              <button 
                onClick={onTryFree}
                className="text-muted-foreground hover:text-foreground transition-colors text-left"
              >
                {content.links.tryFree}
              </button>
              <button 
                onClick={onSignIn}
                className="text-muted-foreground hover:text-foreground transition-colors text-left"
              >
                Sign In
              </button>
            </nav>
          </div>

          {/* Support & Updates */}
          <div className="space-y-6">
            <h4 className="font-semibold text-foreground">Support & Updates</h4>
            <nav className="flex flex-col space-y-3">
              <button 
                onClick={() => window.open('/changelog', '_blank')}
                className="text-muted-foreground hover:text-foreground transition-colors flex items-center gap-2"
              >
                <FileText className="w-4 h-4" />
                Changelog
              </button>
              <button className="text-muted-foreground hover:text-foreground transition-colors flex items-center gap-2">
                <Mail className="w-4 h-4" />
                {content.links.contact}
              </button>
            </nav>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-border/50">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            
            {/* Copyright */}
            <p className="text-sm text-muted-foreground text-center sm:text-left">
              © 2024 Eterna. {content.copyright}
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