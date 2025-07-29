import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Chat, Settings, Favorite, CalendarToday, Add } from "@mui/icons-material";
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
  onAddMemory?: (id: string) => void;
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
  onAddMemory,
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
      "group cursor-pointer parallax-slow ios-focus overflow-hidden hover:shadow-xl transition-all duration-300 border-2 hover:border-accent/20",
      className
    )}>
      <CardContent className="p-8 relative">
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
              <div className="flex items-center gap-3 flex-wrap">
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
                
                {/* Last conversation - beside relationship */}
                {lastConversation && (
                  <div className="text-xs text-muted-foreground/70">
                    {(() => {
                      const daysAgo = Math.floor((Date.now() - lastConversation.getTime()) / (1000 * 60 * 60 * 24));
                      if (daysAgo === 0) return "conversaram hoje";
                      if (daysAgo === 1) return "conversaram ontem";
                      if (daysAgo <= 7) return `conversaram há ${daysAgo} dias`;
                      if (daysAgo <= 30) return `conversaram há ${Math.floor(daysAgo / 7)} semanas`;
                      return `conversaram há ${Math.floor(daysAgo / 30)} meses`;
                    })()}
                  </div>
                )}
              </div>
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

        <div className="space-y-4 mb-6">
          <div className="flex items-center justify-between text-sm text-muted-foreground bg-white/30 rounded-2xl px-4 py-2 backdrop-blur-sm">
            {birthYear && (
              <div className="flex items-center">
                <CalendarToday className="w-4 h-4 mr-2" />
                <span>{new Date().getFullYear() - birthYear} anos</span>
              </div>
            )}
            <div className="flex items-center">
              <Favorite className="w-4 h-4 mr-2" />
              <span>{memoriesCount} memórias</span>
            </div>
          </div>
          
          {onAddMemory && (
            <Button
              variant="outline"
              size="sm"
              onClick={(e) => {
                e.stopPropagation();
                onAddMemory(id);
              }}
              className="w-full bg-white/20 border-white/30 text-accent hover:bg-accent/10 hover:border-accent/30 backdrop-blur-sm rounded-xl transition-all duration-200"
            >
              <Add className="w-4 h-4 mr-2" />
              <span>Adicionar Memória</span>
            </Button>
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