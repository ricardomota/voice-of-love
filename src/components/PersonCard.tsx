import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MessageCircle, Settings, Heart } from "lucide-react";
import { cn } from "@/lib/utils";

interface PersonCardProps {
  id: string;
  name: string;
  relationship: string;
  birthYear?: number;
  avatar?: string;
  memoriesCount: number;
  lastConversation?: Date;
  onChat: (id: string) => void;
  onSettings: (id: string) => void;
  className?: string;
}

export const PersonCard = ({
  id,
  name,
  relationship,
  birthYear,
  avatar,
  memoriesCount,
  lastConversation,
  onChat,
  onSettings,
  className
}: PersonCardProps) => {
  const getRelationshipColor = (rel: string) => {
    const lowerRel = rel.toLowerCase();
    if (lowerRel.includes('mãe') || lowerRel.includes('pai')) return 'love';
    if (lowerRel.includes('avô') || lowerRel.includes('avó')) return 'memory';
    return 'accent';
  };

  return (
    <Card className={cn(
      "group hover:shadow-medium transition-smooth cursor-pointer animate-scale-in",
      "bg-gradient-warm border-border/50",
      className
    )}>
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <Avatar className="w-12 h-12 shadow-soft border-2 border-white">
              <AvatarImage src={avatar} alt={name} />
              <AvatarFallback className="bg-memory text-memory-foreground font-medium">
                {name.charAt(0)}
              </AvatarFallback>
            </Avatar>
            
            <div>
              <h3 className="font-semibold text-foreground group-hover:text-primary transition-smooth">
                {name}
              </h3>
              <div className="flex items-center gap-2 mt-1">
                <Badge 
                  variant="secondary" 
                  className={cn(
                    "text-xs px-2 py-0.5",
                    getRelationshipColor(relationship) === 'love' && "bg-love text-love-foreground",
                    getRelationshipColor(relationship) === 'memory' && "bg-memory text-memory-foreground",
                    getRelationshipColor(relationship) === 'accent' && "bg-accent text-accent-foreground"
                  )}
                >
                  {relationship}
                </Badge>
                {birthYear && (
                  <span className="text-xs text-muted-foreground">
                    {new Date().getFullYear() - birthYear} anos
                  </span>
                )}
              </div>
            </div>
          </div>
          
          <Button
            variant="ghost"
            size="sm"
            onClick={(e) => {
              e.stopPropagation();
              onSettings(id);
            }}
            className="opacity-0 group-hover:opacity-100 transition-smooth"
          >
            <Settings className="w-4 h-4" />
          </Button>
        </div>
      </CardHeader>
      
      <CardContent className="pt-0">
        <div className="flex items-center justify-between text-sm text-muted-foreground mb-4">
          <div className="flex items-center gap-1">
            <Heart className="w-3 h-3" />
            <span>{memoriesCount} memórias</span>
          </div>
          
          {lastConversation && (
            <span>
              Última conversa há {Math.floor((Date.now() - lastConversation.getTime()) / (1000 * 60 * 60 * 24))} dias
            </span>
          )}
        </div>
        
        <Button 
          onClick={() => onChat(id)}
          className="w-full bg-primary hover:bg-primary/90 text-primary-foreground"
          size="sm"
        >
          <MessageCircle className="w-4 h-4 mr-2" />
          Conversar
        </Button>
      </CardContent>
    </Card>
  );
};