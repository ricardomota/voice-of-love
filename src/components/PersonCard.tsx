import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Chat, Settings, Favorite, CalendarToday } from "@mui/icons-material";
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
      "group cursor-pointer transition-all duration-500 hover:shadow-xl parallax-slow",
      className
    )}>
      <CardContent className="p-8">
        <div className="flex items-start justify-between mb-6">
          <div className="flex items-center space-x-5">
            <Avatar className="w-20 h-20 border-2 border-white/50 shadow-lg backdrop-blur-sm">
              <AvatarImage src={avatar} alt={name} />
              <AvatarFallback className="bg-gradient-to-br from-accent/20 to-accent/10 text-accent-foreground font-semibold text-xl backdrop-blur-sm">
                {name.split(' ').map(n => n[0]).join('').slice(0, 2)}
              </AvatarFallback>
            </Avatar>
            <div>
              <h3 className="font-semibold text-xl text-foreground leading-tight mb-2">{name}</h3>
              <Badge 
                variant="secondary" 
                className={cn(
                  "backdrop-blur-sm border border-white/30 px-3 py-1 rounded-full",
                  getRelationshipColor(relationship) === 'love' && "bg-red-50/60 text-red-600",
                  getRelationshipColor(relationship) === 'memory' && "bg-blue-50/60 text-blue-600",
                  getRelationshipColor(relationship) === 'accent' && "bg-accent-soft/60 text-accent"
                )}
              >
                {relationship}
              </Badge>
            </div>
          </div>
          
          <Button
            variant="ghost"
            size="icon"
            onClick={(e) => {
              e.stopPropagation();
              onSettings(id);
            }}
            className="opacity-0 group-hover:opacity-100 transition-all duration-300 hover:bg-white/30 backdrop-blur-sm rounded-2xl"
          >
            <Settings className="w-5 h-5" />
          </Button>
        </div>

        <div className="space-y-4 mb-8">
          {birthYear && (
            <div className="flex items-center text-sm text-muted-foreground bg-white/30 rounded-2xl px-4 py-3 backdrop-blur-sm">
              <CalendarToday className="w-4 h-4 mr-3" />
              <span>{new Date().getFullYear() - birthYear} anos</span>
            </div>
          )}
          
          <div className="flex items-center text-sm text-muted-foreground bg-white/30 rounded-2xl px-4 py-3 backdrop-blur-sm">
            <Favorite className="w-4 h-4 mr-3" />
            <span>{memoriesCount} memórias</span>
          </div>
          
          {lastConversation && (
            <div className="flex items-center text-sm text-muted-foreground bg-white/30 rounded-2xl px-4 py-3 backdrop-blur-sm">
              <span>Última conversa há {Math.floor((Date.now() - lastConversation.getTime()) / (1000 * 60 * 60 * 24))} dias</span>
            </div>
          )}
        </div>

        <Button 
          onClick={() => onChat(id)}
          className="w-full"
          size="lg"
          variant="glass"
        >
          <Chat className="w-5 h-5 mr-3" />
          Conversar
        </Button>
      </CardContent>
    </Card>
  );
};