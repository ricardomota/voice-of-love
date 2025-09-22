import React from 'react';
import { Progress } from '@/components/ui/progress';
import { MessageSquare, Mic, AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/hooks/useLanguage';

interface UsageBarProps {
  messagesUsed: number;
  messagesLimit: number;
  ttsUsed: number;
  ttsLimit: number;
  onUpgrade: () => void;
  className?: string;
}

const getContent = (language: string) => {
  const content = {
    en: {
      messages: "messages used",
      voice: "voice minutes used",
      upgrade: "Upgrade"
    },
    'pt-BR': {
      messages: "mensagens usadas", 
      voice: "minutos de voz usados",
      upgrade: "Fazer Upgrade"
    },
    es: {
      messages: "mensajes usados",
      voice: "minutos de voz usados", 
      upgrade: "Actualizar"
    }
  };

  return content[language as keyof typeof content] || content.en;
};

export const UsageBar: React.FC<UsageBarProps> = ({
  messagesUsed,
  messagesLimit,
  ttsUsed,
  ttsLimit,
  onUpgrade,
  className = ""
}) => {
  const { currentLanguage } = useLanguage();
  const content = getContent(currentLanguage);

  const messagePercent = Math.min((messagesUsed / messagesLimit) * 100, 100);
  const ttsPercent = Math.min((ttsUsed / ttsLimit) * 100, 100);
  
  const isNearMessageLimit = messagePercent >= 80;
  const isNearTtsLimit = ttsPercent >= 80;
  const shouldShowUpgrade = isNearMessageLimit || isNearTtsLimit;

  const formatTime = (seconds: number): string => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  return (
    <div className={`space-y-3 p-4 bg-muted/50 rounded-lg ${className}`}>
      {/* Messages Usage */}
      <div className="space-y-2">
        <div className="flex items-center justify-between text-sm">
          <div className="flex items-center gap-2">
            <MessageSquare className="w-4 h-4" />
            <span>{messagesUsed}/{messagesLimit} {content.messages}</span>
          </div>
          {isNearMessageLimit && (
            <AlertTriangle className="w-4 h-4 text-warning" />
          )}
        </div>
        <Progress 
          value={messagePercent} 
          className={`h-2 ${isNearMessageLimit ? '[&>div]:bg-warning' : ''}`}
        />
      </div>

      {/* TTS Usage */}
      <div className="space-y-2">
        <div className="flex items-center justify-between text-sm">
          <div className="flex items-center gap-2">
            <Mic className="w-4 h-4" />
            <span>{formatTime(ttsUsed)}/{formatTime(ttsLimit)} {content.voice}</span>
          </div>
          {isNearTtsLimit && (
            <AlertTriangle className="w-4 h-4 text-warning" />
          )}
        </div>
        <Progress 
          value={ttsPercent} 
          className={`h-2 ${isNearTtsLimit ? '[&>div]:bg-warning' : ''}`}
        />
      </div>

      {/* Upgrade CTA */}
      {shouldShowUpgrade && (
        <Button 
          variant="outline" 
          size="sm" 
          onClick={onUpgrade}
          className="w-full mt-3"
        >
          {content.upgrade}
        </Button>
      )}
    </div>
  );
};