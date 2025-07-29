import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Favorite, Add, Chat } from "@mui/icons-material";

interface WelcomeViewProps {
  onCreatePerson: () => void;
}

export const WelcomeView = ({ onCreatePerson }: WelcomeViewProps) => {
  return (
    <div className="min-h-screen flex items-center justify-center p-8 relative overflow-hidden">
      {/* Ambient background */}
      <div className="absolute inset-0 bg-gradient-to-br from-white via-white to-gray-50/20"></div>
      
      <Card className="max-w-xl w-full relative backdrop-blur-xl fade-in-up">
        <CardContent className="p-12 text-center">
          <div className="w-24 h-24 bg-gradient-to-br from-accent/15 to-accent/5 rounded-3xl flex items-center justify-center mx-auto mb-8 backdrop-blur-sm shadow-lg">
            <span className="text-5xl">💖</span>
          </div>
          
          <h1 className="text-hero mb-6">
            Bem-vindo ao Eterna
          </h1>
          
          <p className="text-subtitle mb-8 max-w-lg mx-auto">
            Preserve memórias e mantenha conversas com pessoas queridas através de uma experiência única com inteligência artificial.
          </p>

          {/* História da criação */}
          <div className="bg-gradient-to-br from-purple-50/50 to-purple-100/30 rounded-3xl p-8 mb-10 border border-purple-200/20">
            <h3 className="mb-4">Por que criei o Eterna?</h3>
            <p className="text-base leading-relaxed text-muted-foreground">
              Criei esta ferramenta com amor usando o <span className="inline-flex items-center gap-1">Lovable <Favorite className="w-3 h-3 text-red-500" /></span>, motivado pela necessidade de manter minha mãe presente, mesmo com o Alzheimer. 
              Quero ajudar outras famílias a preservarem as memórias e personalidades de seus entes queridos.
            </p>
            
            {/* Logo e link da Alzheimer's Association */}
            <div className="flex items-center justify-center mt-4 pt-4 border-t border-purple-200/30">
              <div className="flex flex-col items-center gap-2">
                <img 
                  src="/lovable-uploads/da7c745c-758a-4054-a38a-03a05da9fb7b.png" 
                  alt="Alzheimer's Association" 
                  className="h-8 opacity-80"
                />
                <a 
                  href="https://www.alz.org/?form=FUNDHYMMBXU" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-xs text-purple-600 hover:text-purple-800 transition-colors underline"
                >
                  Apoie a Alzheimer's Association
                </a>
              </div>
            </div>
          </div>
          
          <Button 
            onClick={onCreatePerson}
            className="w-full mb-10"
            size="lg"
            variant="glass"
          >
            <Add className="w-6 h-6 mr-3" />
            Criar Primeira Pessoa Eterna
          </Button>
          
          <div className="pt-10 border-t border-white/20">
            <h4 className="mb-8 text-center">Como funciona:</h4>
            
            <div className="space-y-8 text-left max-w-md mx-auto">
              <div className="flex items-start gap-5">
                <div className="w-10 h-10 bg-gradient-to-br from-accent/20 to-accent/10 rounded-2xl flex items-center justify-center flex-shrink-0 backdrop-blur-sm">
                  <span className="text-base font-semibold text-accent">1</span>
                </div>
                <p className="text-muted-foreground leading-relaxed pt-2">Adicione memórias, traços de personalidade e frases marcantes</p>
              </div>
              
              <div className="flex items-start gap-5">
                <div className="w-10 h-10 bg-gradient-to-br from-accent/20 to-accent/10 rounded-2xl flex items-center justify-center flex-shrink-0 backdrop-blur-sm">
                  <span className="text-base font-semibold text-accent">2</span>
                </div>
                <p className="text-muted-foreground leading-relaxed pt-2">A IA aprende e recria a personalidade única da pessoa</p>
              </div>
              
              <div className="flex items-start gap-5">
                <div className="w-10 h-10 bg-gradient-to-br from-accent/20 to-accent/10 rounded-2xl flex items-center justify-center flex-shrink-0 backdrop-blur-sm">
                  <span className="text-base font-semibold text-accent">3</span>
                </div>
                <div className="flex items-center gap-3 pt-2">
                  <Chat className="w-5 h-5 text-accent flex-shrink-0" />
                  <p className="text-muted-foreground leading-relaxed">Tenha conversas significativas a qualquer momento</p>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};