import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Favorite, Add, Chat } from "@mui/icons-material";

interface WelcomeViewProps {
  onCreatePerson: () => void;
}

export const WelcomeView = ({ onCreatePerson }: WelcomeViewProps) => {
  return (
    <div className="h-screen flex items-center justify-center p-4 relative overflow-hidden">
      {/* Ambient background */}
      <div className="absolute inset-0 bg-gradient-to-br from-white via-white to-gray-50/20"></div>
      
      <Card className="max-w-xl w-full relative backdrop-blur-xl fade-in-up max-h-[90vh] overflow-y-auto">
        <CardContent className="p-8 text-center">
          <div className="w-24 h-24 bg-gradient-to-br from-accent/15 to-accent/5 rounded-3xl flex items-center justify-center mx-auto mb-8 backdrop-blur-sm shadow-lg">
            <span className="text-5xl">💖</span>
          </div>
          
          <CardTitle className="text-4xl font-light text-foreground mb-4">
            Bem-vindo ao Eterna
          </CardTitle>
          
          <p className="text-muted-foreground leading-relaxed text-lg mb-10 max-w-md mx-auto">
            Preserve memórias e mantenha conversas com pessoas queridas através de uma experiência única com inteligência artificial.
          </p>
          
          <Button 
            onClick={onCreatePerson}
            className="w-full mb-10"
            size="lg"
            variant="glass"
          >
            <Add className="w-6 h-6 mr-3" />
            Criar Primeira Pessoa Eterna
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
                <div className="flex items-center gap-2">
                  <Chat className="w-4 h-4 text-accent" />
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