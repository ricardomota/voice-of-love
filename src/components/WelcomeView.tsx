import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Favorite, Add, Chat } from "@mui/icons-material";

interface WelcomeViewProps {
  onCreatePerson: () => void;
}

export const WelcomeView = ({ onCreatePerson }: WelcomeViewProps) => {
  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Riley-inspired background */}
      <div className="absolute inset-0 bg-gradient-hero"></div>
      <div className="absolute top-0 left-0 w-full h-full">
        <div className="absolute top-20 left-20 w-72 h-72 bg-purple-200 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-float"></div>
        <div className="absolute top-40 right-20 w-72 h-72 bg-pink-200 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-float" style={{animationDelay: '2s'}}></div>
        <div className="absolute bottom-20 left-1/2 w-72 h-72 bg-yellow-200 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-float" style={{animationDelay: '4s'}}></div>
      </div>

      <div className="relative z-10 min-h-screen flex flex-col items-center justify-center p-8 gap-8">
        {/* Main Welcome Card */}
        <div className="glass-card max-w-xl w-full p-12 text-center fade-in-up hover-lift">
          <div className="alzheimer-badge mx-auto mb-8">
            ❤️ Made for Alzheimer's families
          </div>
          
          <div className="feature-icon mx-auto mb-8 bg-gradient-to-br from-purple-100 to-purple-50">
            💖
          </div>
          
          <h1 className="text-4xl font-zilla font-medium italic text-foreground mb-4">
            Bem-vindo ao Eterna
          </h1>
          
          <p className="text-muted-foreground leading-relaxed text-lg mb-8 max-w-md mx-auto font-work">
            Preserve memórias e mantenha conversas com pessoas queridas através de uma experiência única com inteligência artificial.
          </p>
          
          <button 
            onClick={onCreatePerson}
            className="btn-primary btn-large hover-lift hover-glow w-full max-w-xs mx-auto mb-10 px-8 py-4 rounded-xl font-semibold text-lg"
          >
            <Add className="w-5 h-5 mr-3" />
            Criar Primeira Pessoa Eterna
          </button>
          
          <div className="pt-8 border-t border-border/20">
            <h3 className="font-medium text-foreground mb-6 text-lg">Como funciona:</h3>
            
            <div className="space-y-6 text-left">
              <div className="flex items-start gap-4">
                <div className="feature-icon w-12 h-12 bg-gradient-to-br from-purple-100 to-purple-50 text-lg">
                  1
                </div>
                <p className="text-muted-foreground leading-relaxed">Adicione memórias, traços de personalidade e frases marcantes</p>
              </div>
              
              <div className="flex items-start gap-4">
                <div className="feature-icon w-12 h-12 bg-gradient-to-br from-pink-100 to-pink-50 text-lg">
                  2
                </div>
                <p className="text-muted-foreground leading-relaxed">A IA aprende e recria a personalidade única da pessoa</p>
              </div>
              
              <div className="flex items-start gap-4">
                <div className="feature-icon w-12 h-12 bg-gradient-to-br from-green-100 to-green-50 text-lg">
                  3
                </div>
                <p className="text-muted-foreground leading-relaxed">Tenha conversas significativas a qualquer momento</p>
              </div>
            </div>
          </div>
        </div>

        {/* Mission Card */}
        <div className="mission-section max-w-xl w-full p-8 text-center fade-in-up hover-lift" style={{animationDelay: '0.2s'}}>
          <h3 className="text-lg font-semibold text-foreground mb-4">Por que criei o Eterna?</h3>
          <p className="text-muted-foreground leading-relaxed text-sm mb-6">
            Criei esta ferramenta com amor usando o <span className="inline-flex items-center gap-1">Lovable <Favorite className="w-3 h-3 text-red-500" /></span>, motivado pela necessidade de manter minha mãe presente, mesmo com o Alzheimer. 
            Quero ajudar outras famílias a preservarem as memórias e personalidades de seus entes queridos.
          </p>
          
          <div className="flex items-center justify-center pt-4 border-t border-border/20">
            <a 
              href="https://www.alz.org/?form=FUNDHYMMBXU" 
              target="_blank" 
              rel="noopener noreferrer"
              className="hover:opacity-80 transition-opacity hover-lift"
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
};