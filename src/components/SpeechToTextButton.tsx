import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Mic, MicOff, Loader2 } from 'lucide-react';
import { useSpeechToText } from '@/hooks/useSpeechToText';
import { useToast } from '@/components/ui/use-toast';

interface SpeechToTextButtonProps {
  onTranscription: (text: string) => void;
  disabled?: boolean;
}

export const SpeechToTextButton = ({ onTranscription, disabled }: SpeechToTextButtonProps) => {
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
      
      <div className="text-xs text-muted-foreground text-center max-w-32">
        Powered by OpenAI Whisper
      </div>
    </div>
  );
};