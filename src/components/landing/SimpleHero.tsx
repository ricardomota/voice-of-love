import React from 'react';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/hooks/useLanguage';
import { Heart, Play, ArrowRight, Sparkles } from 'lucide-react';
interface SimpleHeroProps {
  onTryFree: () => void;
  onLearnMore: () => void;
}
const getContent = (language: string) => {
  const content = {
    en: {
      headline: "Keep Their Voice Forever",
      subhead: "Eterna turns cherished memories into living conversations. Preserve your loved one's voice and personality with AI that understands what matters most.",
      tryFree: "Try Eterna Free",
      learnMore: "Learn How It Works",
      features: ["Private by design", "Family-first approach", "Voice cloning technology"]
    },
    'pt-BR': {
      headline: "Mantenha Sua Voz Para Sempre",
      subhead: "Eterna transforma memórias queridas em conversas vivas. Preserve a voz e personalidade do seu ente querido com IA que entende o que é mais importante.",
      tryFree: "Testar Grátis",
      learnMore: "Saiba Como Funciona",
      features: ["Privado por design", "Abordagem familiar", "Tecnologia de clonagem de voz"]
    },
    'zh-CN': {
      headline: "永远保存他们的声音",
      subhead: "Eterna将珍贵记忆转化为生动对话。用理解最重要事情的AI保存您所爱之人的声音和个性。",
      tryFree: "免费试用Eterna",
      learnMore: "了解工作原理",
      features: ["隐私设计", "家庭优先方法", "声音克隆技术"]
    },
    fr: {
      headline: "Préservez Leur Voix Pour Toujours",
      subhead: "Eterna transforme les souvenirs chéris en conversations vivantes. Préservez la voix et la personnalité de votre proche avec une IA qui comprend ce qui compte le plus.",
      tryFree: "Essayer Gratuitement",
      learnMore: "Apprenez Comment Ça Marche",
      features: ["Privé par conception", "Approche familiale", "Technologie de clonage vocal"]
    },
    de: {
      headline: "Bewahren Sie Ihre Stimme Für Immer",
      subhead: "Eterna verwandelt geschätzte Erinnerungen in lebendige Gespräche. Bewahren Sie die Stimme und Persönlichkeit Ihres Liebsten mit KI, die versteht, was am wichtigsten ist.",
      tryFree: "Kostenlos Testen",
      learnMore: "Erfahren Sie Wie Es Funktioniert",
      features: ["Privat by Design", "Familienorientierter Ansatz", "Stimmklonungs-Technologie"]
    },
    es: {
      headline: "Mantén Su Voz Para Siempre",
      subhead: "Eterna convierte recuerdos queridos en conversaciones vivas. Preserva la voz y personalidad de tu ser querido con IA que entiende lo que más importa.",
      tryFree: "Probar Gratis",
      learnMore: "Aprende Cómo Funciona",
      features: ["Privado por diseño", "Enfoque familiar", "Tecnología de clonación de voz"]
    }
  };
  return content[language as keyof typeof content] || content.en;
};
export const SimpleHero: React.FC<SimpleHeroProps> = ({
  onTryFree,
  onLearnMore
}) => {
  const {
    currentLanguage
  } = useLanguage();
  const content = getContent(currentLanguage);
  return <section className="min-h-screen flex items-center justify-center pt-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto text-center space-y-12">
        
        {/* Icon */}
        

        {/* Main Content */}
        <div className="space-y-8">
          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-zilla font-medium italic text-foreground leading-tight">
            {content.headline}
          </h1>
          
          <p className="text-xl sm:text-2xl font-work text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            {content.subhead}
          </p>
        </div>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
          <Button onClick={onTryFree} size="xl" className="min-w-[250px] bg-primary hover:bg-primary/90 text-primary-foreground font-bold text-lg h-16 rounded-2xl shadow-2xl hover:shadow-accent/20 hover:scale-105 transition-all duration-300">
            <Play className="w-6 h-6 mr-3" />
            {content.tryFree}
          </Button>
          
          <Button onClick={onLearnMore} variant="ghost" size="xl" className="min-w-[250px] text-primary hover:text-primary/80 border-2 border-primary/20 hover:border-primary/40 h-16 rounded-2xl font-semibold text-lg hover:bg-primary/5">
            {content.learnMore}
            <ArrowRight className="w-5 h-5 ml-3" />
          </Button>
        </div>

        {/* Trust Features */}
        <div className="flex flex-wrap justify-center gap-6 pt-8">
          {content.features.map((feature, index) => <div key={index} className="flex items-center gap-2 bg-card/50 px-4 py-2 rounded-full border border-border/30 backdrop-blur-sm">
              <Sparkles className="w-4 h-4 text-accent" />
              <span className="text-sm font-medium text-muted-foreground">{feature}</span>
            </div>)}
        </div>

      </div>
    </section>;
};