import { cn } from "@/lib/utils";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Volume2, VolumeX } from "lucide-react";
import { useState } from "react";

interface MessageBubbleProps {
  content: string;
  isUser: boolean;
  personName?: string;
  personAvatar?: string;
  hasAudio?: boolean;
  className?: string;
}

export const MessageBubble = ({ 
  content, 
  isUser, 
  personName, 
  personAvatar, 
  hasAudio = false,
  className 
}: MessageBubbleProps) => {
  const [isPlaying, setIsPlaying] = useState(false);

  const handlePlayAudio = () => {
    // Placeholder for audio playback
    setIsPlaying(!isPlaying);
    // Simulate audio duration
    if (!isPlaying) {
      setTimeout(() => setIsPlaying(false), 3000);
    }
  };

  return (
    <div className={cn(
      "flex gap-3 max-w-[80%] animate-fade-in",
      isUser ? "ml-auto flex-row-reverse" : "mr-auto",
      className
    )}>
      {!isUser && (
        <Avatar className="w-8 h-8 shadow-soft">
          <AvatarImage src={personAvatar} alt={personName} />
          <AvatarFallback className="bg-memory text-memory-foreground text-xs">
            {personName?.charAt(0) || "E"}
          </AvatarFallback>
        </Avatar>
      )}
      
      <div className={cn(
        "rounded-2xl px-4 py-3 shadow-soft transition-smooth",
        isUser 
          ? "bg-primary text-primary-foreground rounded-br-lg" 
          : "bg-card text-card-foreground border border-border rounded-bl-lg"
      )}>
        <p className="text-sm leading-relaxed whitespace-pre-wrap">
          {content}
        </p>
        
        {hasAudio && !isUser && (
          <div className="flex items-center gap-2 mt-2 pt-2 border-t border-border/50">
            <Button
              variant="ghost"
              size="sm"
              onClick={handlePlayAudio}
              className="h-6 px-2 text-xs text-muted-foreground hover:text-accent-gold"
            >
              {isPlaying ? (
                <VolumeX className="w-3 h-3" />
              ) : (
                <Volume2 className="w-3 h-3" />
              )}
              <span className="ml-1">
                {isPlaying ? "Pausar" : "Ouvir"}
              </span>
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};