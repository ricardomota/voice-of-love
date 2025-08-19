import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Favorite, Add, Chat } from "@mui/icons-material";
import { memo, useCallback } from "react";
import { useLanguage } from "@/hooks/useLanguage";

interface WelcomeViewProps {
  onCreatePerson: () => void;
}

const getContent = (language: string) => {
  const content = {
    en: {
      madeWithLove: "❤️ Made with love for families with Alzheimer's",
      welcome: "Welcome to Eterna",
      description: "Preserve precious memories and maintain eternal conversations with beloved people through artificial intelligence.",
      createButton: "Create First Eternal Person",
      howItWorks: "How it works:",
      steps: [
        "Add precious memories, unique personality traits and memorable phrases",
        "AI learns and recreates the person's unique personality", 
        "Have meaningful conversations at any time"
      ],
      whyCreated: "Why did I create Eterna?",
      mission: "I created this tool with great love using Lovable, motivated by the need to keep my mother present, even with Alzheimer's. I want to help other families preserve the memories and personalities of their loved ones forever."
    },
    'pt-BR': {
      madeWithLove: "❤️ Feito com amor para famílias com Alzheimer",
      welcome: "Bem-vindo ao Eterna", 
      description: "Preserve memórias preciosas e mantenha conversas eternas com pessoas queridas através de inteligência artificial.",
      createButton: "Criar Primeira Pessoa Eterna",
      howItWorks: "Como funciona:",
      steps: [
        "Adicione memórias preciosas, traços de personalidade únicos e frases marcantes",
        "A IA aprende e recria a personalidade única da pessoa",
        "Tenha conversas significativas a qualquer momento"
      ],
      whyCreated: "Por que criei o Eterna?",
      mission: "Criei esta ferramenta com muito amor usando o Lovable, motivado pela necessidade de manter minha mãe presente, mesmo com o Alzheimer. Quero ajudar outras famílias a preservarem as memórias e personalidades de seus entes queridos para sempre."
    },
    es: {
      madeWithLove: "❤️ Hecho con amor para familias con Alzheimer", 
      welcome: "Bienvenido a Eterna",
      description: "Preserva recuerdos preciosos y mantén conversaciones eternas con personas queridas a través de inteligencia artificial.",
      createButton: "Crear Primera Persona Eterna", 
      howItWorks: "Cómo funciona:",
      steps: [
        "Agrega recuerdos preciosos, rasgos de personalidad únicos y frases memorables",
        "La IA aprende y recrea la personalidad única de la persona",
        "Ten conversaciones significativas en cualquier momento"  
      ],
      whyCreated: "¿Por qué creé Eterna?",
      mission: "Creé esta herramienta con mucho amor usando Lovable, motivado por la necesidad de mantener presente a mi madre, incluso con Alzheimer. Quiero ayudar a otras familias a preservar los recuerdos y personalidades de sus seres queridos para siempre."
    }
  };

  return content[language as keyof typeof content] || content.en;
};

// Memoized welcome view to prevent unnecessary re-renders
export const WelcomeView = memo(({ onCreatePerson }: WelcomeViewProps) => {
  const { currentLanguage } = useLanguage();
  const content = getContent(currentLanguage);
  
  // Memoized click handler to prevent re-renders
  const handleCreatePerson = useCallback(() => {
    onCreatePerson();
  }, [onCreatePerson]);

  return (
    <div className="min-h-screen bg-background">
      <div className="min-h-screen flex flex-col items-center justify-center p-8 gap-8">
        {/* Main Welcome Card */}
        <div className="bg-card border border-border rounded-xl shadow-sm max-w-xl w-full p-12 text-center will-change-transform">
          <div className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-primary/10 to-accent/10 border border-primary/30 rounded-full text-sm font-medium mb-8">
            {content.madeWithLove}
          </div>
          
          <div className="w-16 h-16 mx-auto mb-8 rounded-full bg-gradient-to-br from-primary to-primary/70 text-primary-foreground flex items-center justify-center text-xl">
            E
          </div>
          
          <h1 className="font-serif text-[clamp(2rem,5vw,4rem)] text-foreground mb-4 leading-none tracking-tight">
            {content.welcome}
          </h1>
          
          <p className="text-muted-foreground leading-relaxed text-lg mb-8 max-w-md mx-auto">
            {content.description}
          </p>
          
          <Button 
            onClick={handleCreatePerson}
            size="lg"
            className="w-full max-w-xs mx-auto mb-10 bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 shadow-lg hover:shadow-xl transition-all will-change-transform"
          >
            <Add className="w-5 h-5 mr-3" />
            {content.createButton}
          </Button>
          
          <div className="pt-8 border-t border-border">
            <h3 className="font-medium text-foreground mb-6 text-lg">{content.howItWorks}</h3>
            
            <div className="space-y-6 text-left">
              <div className="flex items-start gap-4 will-change-transform">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary to-primary/70 text-primary-foreground flex items-center justify-center font-bold text-lg shadow-lg">
                  1
                </div>
                <p className="text-muted-foreground leading-relaxed">{content.steps[0]}</p>
              </div>
              
              <div className="flex items-start gap-4 will-change-transform">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-accent to-accent/70 text-accent-foreground flex items-center justify-center font-bold text-lg shadow-lg">
                  2
                </div>
                <p className="text-muted-foreground leading-relaxed">{content.steps[1]}</p>
              </div>
              
              <div className="flex items-start gap-4 will-change-transform">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-secondary to-secondary/70 text-secondary-foreground flex items-center justify-center font-bold text-lg shadow-lg">
                  3
                </div>
                <p className="text-muted-foreground leading-relaxed">{content.steps[2]}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Mission Card */}
        <div className="bg-card border border-border rounded-xl shadow-sm max-w-xl w-full p-8 text-center will-change-transform">
          <h3 className="text-lg font-semibold text-foreground mb-4">{content.whyCreated}</h3>
          <p className="text-muted-foreground leading-relaxed text-sm mb-6">
            {content.mission}
          </p>
          
          <div className="flex items-center justify-center pt-4 border-t border-border">
            <a 
              href="https://www.alz.org/?form=FUNDHYMMBXU" 
              target="_blank" 
              rel="noopener noreferrer"
              className="hover:opacity-80 transition-opacity"
            >
              <img 
                src="/lovable-uploads/da7c745c-758a-4054-a38a-03a05da9fb7b.png" 
                alt="Alzheimer's Association" 
                className="h-6 opacity-80"
              />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
});