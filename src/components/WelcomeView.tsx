import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Favorite, Add, Chat } from "@mui/icons-material";

interface WelcomeViewProps {
  onCreatePerson: () => void;
}

export const WelcomeView = ({ onCreatePerson }: WelcomeViewProps) => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-8 relative overflow-hidden gap-8">
      {/* Ambient background */}
      <div className="absolute inset-0 bg-gradient-to-br from-white via-white to-gray-50/20"></div>
      
      {/* Card principal */}
      <Card className="max-w-xl w-full relative backdrop-blur-xl fade-in-up">
        <CardContent className="p-12 text-center">
          <div className="w-24 h-24 bg-gradient-to-br from-accent/15 to-accent/5 rounded-3xl flex items-center justify-center mx-auto mb-8 backdrop-blur-sm shadow-lg">
            <span className="text-5xl">💖</span>
          </div>
          
          <CardTitle className="text-4xl font-light text-foreground mb-4">
            Bem-vindo ao Eterna
          </CardTitle>
          
          <p className="text-muted-foreground leading-relaxed text-lg mb-8 max-w-md mx-auto">
            Preserve memórias e mantenha conversas com pessoas queridas através de uma experiência única com inteligência artificial.
          </p>
          
          <Button 
            onClick={onCreatePerson}
            className="w-full max-w-xs mx-auto md:max-w-full mb-10"
            size="xl"
            variant="cta"
          >
            <Add className="w-5 h-5 sm:w-6 sm:h-6 mr-3 flex-shrink-0" />
            <span className="whitespace-nowrap leading-tight text-center">Criar Primeira Pessoa Eterna</span>
          </Button>
          
          <div className="pt-8 border-t border-white/20">
            <h3 className="font-medium text-foreground mb-6 text-lg">Como funciona:</h3>
            
            <div className="space-y-6 text-left">
              <div className="flex items-start gap-4">
                <div className="w-8 h-8 bg-gradient-to-br from-accent/20 to-accent/10 rounded-2xl flex items-center justify-center flex-shrink-0 backdrop-blur-sm">
                  <span className="text-sm font-semibold text-accent">1</span>
                </div>
                <p className="text-muted-foreground leading-relaxed">Adicione memórias, traços de personalidade e frases marcantes</p>
              </div>
              
              <div className="flex items-start gap-4">
                <div className="w-8 h-8 bg-gradient-to-br from-accent/20 to-accent/10 rounded-2xl flex items-center justify-center flex-shrink-0 backdrop-blur-sm">
                  <span className="text-sm font-semibold text-accent">2</span>
                </div>
                <p className="text-muted-foreground leading-relaxed">A IA aprende e recria a personalidade única da pessoa</p>
              </div>
              
              <div className="flex items-start gap-4">
                <div className="w-8 h-8 bg-gradient-to-br from-accent/20 to-accent/10 rounded-2xl flex items-center justify-center flex-shrink-0 backdrop-blur-sm">
                  <span className="text-sm font-semibold text-accent">3</span>
                </div>
                <p className="text-muted-foreground leading-relaxed">Tenha conversas significativas a qualquer momento</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Card separado para a história */}
      <Card className="max-w-xl w-full relative backdrop-blur-xl fade-in-up">
        <CardContent className="p-8 text-center">
          <h3 className="text-lg font-medium text-foreground mb-3">Por que criei o Eterna?</h3>
          <p className="text-muted-foreground leading-relaxed text-sm mb-4">
            Criei esta ferramenta com amor usando o <span className="inline-flex items-center gap-1">Lovable <Favorite className="w-3 h-3 text-red-500" /></span>, motivado pela necessidade de manter minha mãe presente, mesmo com o Alzheimer. 
            Quero ajudar outras famílias a preservarem as memórias e personalidades de seus entes queridos.
          </p>
          
          {/* Logo e link da Alzheimer's Association */}
          <div className="flex items-center justify-center pt-4 border-t border-border/20">
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
        </CardContent>
      </Card>
    </div>
  );
};