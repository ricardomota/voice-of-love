import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Heart, Smile, Lightbulb, Clock } from "lucide-react";

interface SuggestedMessagesProps {
  onSelectMessage: (message: string) => void;
  personName?: string;
}

export const SuggestedMessages = ({ onSelectMessage, personName }: SuggestedMessagesProps) => {
  const suggestions = [
    {
      icon: Heart,
      text: "Conte-me uma lembrança feliz",
      color: "text-love-foreground bg-love hover:bg-love/80"
    },
    {
      icon: Lightbulb,
      text: "Qual é o seu conselho mais valioso?",
      color: "text-accent-foreground bg-accent hover:bg-accent/80"
    },
    {
      icon: Smile,
      text: "O que faz você sorrir?",
      color: "text-memory-foreground bg-memory hover:bg-memory/80"
    },
    {
      icon: Clock,
      text: `Como era a vida quando você tinha minha idade?`,
      color: "text-muted-foreground bg-muted hover:bg-muted/80"
    }
  ];

  return (
    <Card className="p-4 bg-gradient-warm border-border/50 shadow-soft">
      <h3 className="text-sm font-medium text-muted-foreground mb-3">
        Perguntas sugeridas {personName && `para ${personName}`}
      </h3>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
        {suggestions.map((suggestion, index) => {
          const IconComponent = suggestion.icon;
          return (
            <Button
              key={index}
              variant="secondary"
              onClick={() => onSelectMessage(suggestion.text)}
              className={`
                ${suggestion.color}
                text-left justify-start h-auto p-3 transition-smooth
                hover:scale-[1.02] hover:shadow-soft
              `}
            >
              <IconComponent className="w-4 h-4 mr-2 flex-shrink-0" />
              <span className="text-sm leading-relaxed">
                {suggestion.text}
              </span>
            </Button>
          );
        })}
      </div>
    </Card>
  );
};