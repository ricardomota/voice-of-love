import React from 'react';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/hooks/useLanguage';
import { Play, ArrowRight, Heart, Shield, Brain } from 'lucide-react';
import heroPhone from '@/assets/hero-phone-mockup.png';

interface ModernHeroProps {
  onTryFree: () => void;
  onLearnMore: () => void;
}

const getContent = (language: string) => {
  const content = {
    en: {
      headline: "Keep Their Voice Forever",
      subheadline: "AI-Powered Memory Preservation",
      description: "Eterna turns cherished memories into living conversations. Preserve your loved one's voice and personality with AI that understands what matters most to families facing memory loss.",
      tryFree: "Get Started",
      learnMore: "See How It Works",
      features: [
        { text: "Private by Design", icon: Shield },
        { text: "Voice Cloning Technology", icon: Brain },
        { text: "Built with Love for Families", icon: Heart }
      ]
    },
    'pt-BR': {
      headline: "Mantenha Sua Voz Para Sempre",
      subheadline: "Preservação de Memória com IA",
      description: "Eterna transforma memórias queridas em conversas vivas. Preserve a voz e personalidade do seu ente querido com IA que entende o que é mais importante para famílias enfrentando perda de memória.",
      tryFree: "Começar",
      learnMore: "Veja Como Funciona",
      features: [
        { text: "Privado por Design", icon: Shield },
        { text: "Tecnologia de Clonagem de Voz", icon: Brain },
        { text: "Feito com Amor para Famílias", icon: Heart }
      ]
    },
    'zh-CN': {
      headline: "永远保存他们的声音",
      subheadline: "AI驱动的记忆保存",
      description: "Eterna将珍贵记忆转化为生动对话。用理解面临记忆丧失家庭最重要需求的AI保存您所爱之人的声音和个性。",
      tryFree: "开始使用",
      learnMore: "了解工作原理",
      features: [
        { text: "隐私设计", icon: Shield },
        { text: "声音克隆技术", icon: Brain },
        { text: "为家庭用爱打造", icon: Heart }
      ]
    },
    es: {
      headline: "Mantén Su Voz Para Siempre",
      subheadline: "Preservación de Memoria con IA",
      description: "Eterna convierte recuerdos queridos en conversaciones vivas. Preserva la voz y personalidad de tu ser querido con IA que entiende lo que más importa a las familias enfrentando pérdida de memoria.",
      tryFree: "Empezar",
      learnMore: "Ve Cómo Funciona",
      features: [
        { text: "Privado por Diseño", icon: Shield },
        { text: "Tecnología de Clonación de Voz", icon: Brain },
        { text: "Hecho con Amor para Familias", icon: Heart }
      ]
    }
  };
  return content[language as keyof typeof content] || content.en;
};

export const ModernHero: React.FC<ModernHeroProps> = ({
  onTryFree,
  onLearnMore
}) => {
  const { currentLanguage } = useLanguage();
  const content = getContent(currentLanguage);

  return (
    <section className="min-h-screen flex items-center justify-center px-4 sm:px-6 lg:px-8 pt-20 pb-12 bg-gradient-to-br from-background via-background to-accent/10">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          
          {/* Left Content */}
          <div className="space-y-8 lg:pr-8">
            <div className="space-y-6">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-accent/10 rounded-full border border-accent/20">
                <Heart className="w-4 h-4 text-accent" />
                <span className="text-sm font-work font-medium text-accent">Made for Alzheimer's families</span>
              </div>
              
              <h1 className="font-serif text-[clamp(2rem,5vw,4rem)] text-foreground leading-none tracking-tight">
                {content.headline}
              </h1>
              
              <h2 className="text-2xl sm:text-3xl font-work font-medium text-muted-foreground">
                {content.subheadline}
              </h2>
            </div>

            <p className="text-xl font-work text-muted-foreground leading-relaxed max-w-2xl">
              {content.description}
            </p>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row gap-4">
              <Button 
                onClick={onTryFree} 
                size="xl" 
                className="bg-primary hover:bg-primary/90 text-primary-foreground font-bold text-lg h-14 px-8 rounded-2xl shadow-2xl hover:shadow-accent/20 hover:scale-105 transition-all duration-300 font-work"
              >
                <Play className="w-5 h-5 mr-3" />
                {content.tryFree}
              </Button>
              
              <Button 
                onClick={onLearnMore} 
                variant="ghost" 
                size="xl" 
                className="text-primary hover:text-primary/80 border-2 border-primary/20 hover:border-primary/40 h-14 px-8 rounded-2xl font-semibold text-lg hover:bg-primary/5 font-work"
              >
                {content.learnMore}
                <ArrowRight className="w-5 h-5 ml-3" />
              </Button>
            </div>

            {/* Features */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-8">
              {content.features.map((feature, index) => {
                const IconComponent = feature.icon;
                return (
                  <div key={index} className="flex items-center gap-3 p-4 bg-card/50 rounded-xl border border-border/30 backdrop-blur-sm hover:bg-card/70 transition-colors">
                    <div className="w-10 h-10 bg-accent/10 rounded-lg flex items-center justify-center flex-shrink-0">
                      <IconComponent className="w-5 h-5 text-accent" />
                    </div>
                    <span className="text-sm font-work font-medium text-muted-foreground">{feature.text}</span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Right Visual */}
          <div className="relative lg:pl-8">
            <div className="relative">
              {/* Gradient Background */}
              <div className="absolute inset-0 bg-gradient-to-br from-accent/20 to-primary/20 rounded-3xl blur-3xl transform -rotate-6 scale-110"></div>
              
              {/* Phone Mockup */}
              <div className="relative z-10 flex justify-center">
                <div className="relative animate-fade-in">
                  <img 
                    src={heroPhone} 
                    alt="Eterna App Interface" 
                    className="w-full max-w-md lg:max-w-lg drop-shadow-2xl hover:scale-105 transition-transform duration-500"
                  />
                  
                  {/* Floating Elements */}
                  <div className="absolute -top-4 -left-4 w-16 h-16 bg-accent/20 rounded-full blur-xl animate-pulse"></div>
                  <div className="absolute -bottom-8 -right-8 w-24 h-24 bg-primary/20 rounded-full blur-xl animate-pulse" style={{ animationDelay: '1s' }}></div>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};