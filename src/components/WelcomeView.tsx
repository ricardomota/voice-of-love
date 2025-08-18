import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Favorite, Add, Chat } from "@mui/icons-material";
import { memo, useCallback } from "react";

interface WelcomeViewProps {
  onCreatePerson: () => void;
}

// Memoized welcome view to prevent unnecessary re-renders
export const WelcomeView = memo(({ onCreatePerson }: WelcomeViewProps) => {
  // Memoized click handler to prevent re-renders
  const handleCreatePerson = useCallback(() => {
    onCreatePerson();
  }, [onCreatePerson]);

  return (
    <div className="min-h-screen bg-background">
      <div className="min-h-screen flex flex-col items-center justify-center p-4 sm:p-8 gap-4 sm:gap-8">
        {/* Main Welcome Card */}
        <div className="bg-card border border-border rounded-xl shadow-sm max-w-xl w-full p-6 sm:p-12 text-center will-change-transform">
          <div className="inline-flex items-center gap-2 px-4 sm:px-6 py-2 sm:py-3 bg-gradient-to-r from-primary/10 to-accent/10 border border-primary/30 rounded-full text-xs sm:text-sm font-medium mb-6 sm:mb-8">
            ❤️ Feito com amor para famílias com Alzheimer
          </div>
          
          <div className="w-12 h-12 sm:w-16 sm:h-16 mx-auto mb-6 sm:mb-8 rounded-full bg-gradient-to-br from-primary to-primary/70 text-primary-foreground flex items-center justify-center text-lg sm:text-xl">
            E
          </div>
          
          <h1 className="font-serif text-2xl sm:text-3xl lg:text-4xl text-foreground mb-3 sm:mb-4 leading-none tracking-tight">
            Bem-vindo ao Eterna
          </h1>
          
          <p className="text-muted-foreground leading-relaxed text-base sm:text-lg mb-6 sm:mb-8 max-w-md mx-auto px-2">
            Preserve memórias preciosas e mantenha conversas eternas com pessoas queridas através de inteligência artificial.
          </p>
          
          <Button 
            onClick={handleCreatePerson}
            size="lg"
            className="w-full sm:max-w-xs mx-auto mb-8 sm:mb-10 bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 shadow-lg hover:shadow-xl transition-all will-change-transform text-sm sm:text-base"
          >
            <Add className="w-4 h-4 sm:w-5 sm:h-5 mr-2 sm:mr-3" />
            Criar Primeira Pessoa Eterna
          </Button>
          
          <div className="pt-6 sm:pt-8 border-t border-border">
            <h3 className="font-medium text-foreground mb-4 sm:mb-6 text-base sm:text-lg">Como funciona:</h3>
            
            <div className="space-y-4 sm:space-y-6 text-left">
              <div className="flex items-start gap-3 sm:gap-4 will-change-transform">
                <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-gradient-to-br from-primary to-primary/70 text-primary-foreground flex items-center justify-center font-bold text-base sm:text-lg shadow-lg flex-shrink-0">
                  1
                </div>
                <p className="text-muted-foreground leading-relaxed text-sm sm:text-base">Adicione memórias preciosas, traços de personalidade únicos e frases marcantes</p>
              </div>
              
              <div className="flex items-start gap-3 sm:gap-4 will-change-transform">
                <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-gradient-to-br from-accent to-accent/70 text-accent-foreground flex items-center justify-center font-bold text-base sm:text-lg shadow-lg flex-shrink-0">
                  2
                </div>
                <p className="text-muted-foreground leading-relaxed text-sm sm:text-base">A IA aprende e recria a personalidade única da pessoa</p>
              </div>
              
              <div className="flex items-start gap-3 sm:gap-4 will-change-transform">
                <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-gradient-to-br from-secondary to-secondary/70 text-secondary-foreground flex items-center justify-center font-bold text-base sm:text-lg shadow-lg flex-shrink-0">
                  3
                </div>
                <p className="text-muted-foreground leading-relaxed text-sm sm:text-base">Tenha conversas significativas a qualquer momento</p>
              </div>
            </div>
          </div>
        </div>

        {/* Mission Card */}
        <div className="bg-card border border-border rounded-xl shadow-sm max-w-xl w-full p-6 sm:p-8 text-center will-change-transform">
          <h3 className="text-base sm:text-lg font-semibold text-foreground mb-3 sm:mb-4">Por que criei o Eterna?</h3>
          <p className="text-muted-foreground leading-relaxed text-xs sm:text-sm mb-4 sm:mb-6 px-2">
            Criei esta ferramenta com muito amor usando o <span className="inline-flex items-center gap-1">Lovable <Favorite className="w-3 h-3 text-red-500" /></span>, motivado pela necessidade de manter minha mãe presente, mesmo com o Alzheimer. 
            Quero ajudar outras famílias a preservarem as memórias e personalidades de seus entes queridos para sempre.
          </p>
          
          <div className="flex items-center justify-center pt-3 sm:pt-4 border-t border-border">
            <a 
              href="https://www.alz.org/?form=FUNDHYMMBXU" 
              target="_blank" 
              rel="noopener noreferrer"
              className="hover:opacity-80 transition-opacity"
            >
              <img 
                src="/lovable-uploads/da7c745c-758a-4054-a38a-03a05da9fb7b.png" 
                alt="Alzheimer's Association" 
                className="h-4 sm:h-6 opacity-80"
              />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
});