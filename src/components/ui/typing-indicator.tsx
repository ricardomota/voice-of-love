import { cn } from "@/lib/utils";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface TypingIndicatorProps {
  personName?: string;
  personAvatar?: string;
  className?: string;
}

export const TypingIndicator = ({ 
  personName, 
  personAvatar, 
  className 
}: TypingIndicatorProps) => {
  return (
    <div className={cn(
      "flex gap-3 max-w-[80%] mr-auto animate-fade-in",
      className
    )}>
      <Avatar className="w-8 h-8 shadow-soft">
        <AvatarImage src={personAvatar} alt={personName} />
        <AvatarFallback className="bg-memory text-memory-foreground text-xs">
          {personName?.split(' ').map(n => n[0]).join('').slice(0, 2) || "AI"}
        </AvatarFallback>
      </Avatar>
      
      <div className="bg-card text-card-foreground border border-border rounded-2xl rounded-bl-lg px-4 py-3 shadow-soft">
        <div className="flex items-center gap-1">
          <div className="w-2 h-2 bg-muted-foreground rounded-full animate-typing" style={{ animationDelay: "0ms" }} />
          <div className="w-2 h-2 bg-muted-foreground rounded-full animate-typing" style={{ animationDelay: "300ms" }} />
          <div className="w-2 h-2 bg-muted-foreground rounded-full animate-typing" style={{ animationDelay: "600ms" }} />
        </div>
      </div>
    </div>
  );
};