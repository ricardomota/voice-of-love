import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Heart, Plus, MessageCircle } from "lucide-react";

interface WelcomeViewProps {
  onCreatePerson: () => void;
}

export const WelcomeView = ({ onCreatePerson }: WelcomeViewProps) => {
  return (
    <div className="min-h-screen bg-gradient-warm flex items-center justify-center p-4">
      <Card className="max-w-md w-full shadow-strong border-border/50 animate-scale-in">
        <CardHeader className="text-center pb-6">
          <div className="w-16 h-16 bg-gradient-memory rounded-full flex items-center justify-center mx-auto mb-4 shadow-medium">
            <Heart className="w-8 h-8 text-memory-foreground" />
          </div>
          
          <CardTitle className="text-2xl font-bold text-foreground mb-2">
            Bem-vindo ao Eterna
          </CardTitle>
          
          <p className="text-muted-foreground leading-relaxed">
            Preserve memórias e mantenha conversas com pessoas queridas através de uma experiência única com inteligência artificial.
          </p>
        </CardHeader>
        
        <CardContent className="space-y-4">
          <Button 
            onClick={onCreatePerson}
            className="w-full bg-primary hover:bg-primary/90 text-primary-foreground h-12"
            size="lg"
          >
            <Plus className="w-5 h-5 mr-2" />
            Criar Primeira Pessoa Eterna
          </Button>
          
          <div className="pt-4 border-t border-border">
            <h3 className="font-medium text-foreground mb-3">Como funciona:</h3>
            
            <div className="space-y-3 text-sm text-muted-foreground">
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 bg-accent rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-xs font-bold text-accent-foreground">1</span>
                </div>
                <p>Adicione memórias, traços de personalidade e frases marcantes</p>
              </div>
              
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 bg-accent rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-xs font-bold text-accent-foreground">2</span>
                </div>
                <p>A IA aprende e recria a personalidade única da pessoa</p>
              </div>
              
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 bg-accent rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-xs font-bold text-accent-foreground">3</span>
                </div>
                <div className="flex items-center gap-1">
                  <MessageCircle className="w-3 h-3" />
                  <p>Tenha conversas significativas a qualquer momento</p>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};