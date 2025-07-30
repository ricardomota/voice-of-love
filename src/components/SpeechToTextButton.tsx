import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Mic, MicOff, Loader2 } from 'lucide-react';
import { useSpeechToText } from '@/hooks/useSpeechToText';
import { useToast } from '@/components/ui/use-toast';

interface SpeechToTextButtonProps {
  onTranscription: (text: string) => void;
  disabled?: boolean;
  variant?: 'compact' | 'full';
}

export const SpeechToTextButton = ({ onTranscription, disabled, variant = 'full' }: SpeechToTextButtonProps) => {
  const { isRecording, isProcessing, startRecording, stopRecording, error } = useSpeechToText();
  const { toast } = useToast();

  const handleClick = async () => {
    if (isRecording) {
      const transcription = await stopRecording();
      if (transcription) {
        onTranscription(transcription);
        toast({
          title: "Transcrição concluída",
          description: "O áudio foi convertido em texto com sucesso!",
        });
      } else if (error) {
        toast({
          title: "Erro na transcrição",
          description: error,
          variant: "destructive",
        });
      }
    } else {
      await startRecording();
      if (error) {
        toast({
          title: "Erro ao iniciar gravação",
          description: error,
          variant: "destructive",
        });
      }
    }
  };

  if (variant === 'compact') {
    return (
      <Button
        variant="ghost"
        size="icon"
        onClick={handleClick}
        disabled={disabled || isProcessing}
        className={`
          h-8 w-8 rounded-full transition-colors
          ${isRecording 
            ? 'text-red-500 hover:bg-red-50' 
            : 'text-muted-foreground hover:text-foreground hover:bg-accent/10'
          }
        `}
        title={isProcessing ? 'Processando...' : isRecording ? 'Parar gravação' : 'Gravar áudio'}
      >
        {isProcessing ? (
          <Loader2 className="w-4 h-4 animate-spin" />
        ) : isRecording ? (
          <MicOff className="w-4 h-4" />
        ) : (
          <Mic className="w-4 h-4" />
        )}
      </Button>
    );
  }

  return (
    <div className="flex flex-col items-center gap-2">
      <Button
        variant="outline"
        size="sm"
        onClick={handleClick}
        disabled={disabled || isProcessing}
        className={`
          transition-all duration-200
          ${isRecording 
            ? 'bg-red-50 border-red-200 text-red-600 hover:bg-red-100' 
            : 'hover:bg-accent/10'
          }
        `}
      >
        {isProcessing ? (
          <Loader2 className="w-4 h-4 animate-spin" />
        ) : isRecording ? (
          <MicOff className="w-4 h-4" />
        ) : (
          <Mic className="w-4 h-4" />
        )}
        <span className="ml-2 text-xs">
          {isProcessing 
            ? 'Processando...' 
            : isRecording 
              ? 'Parar gravação' 
              : 'Gravar áudio'
          }
        </span>
      </Button>
      
      {isRecording && (
        <div className="flex items-center gap-1 text-xs text-red-600">
          <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
          Gravando...
        </div>
      )}
    </div>
  );
};