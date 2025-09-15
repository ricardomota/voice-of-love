import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { WhatsAppAudioRecorder } from '@/components/ui/whatsapp-audio-recorder';
import { useToast } from '@/hooks/use-toast';
import { Plus, Save, Trash2 } from 'lucide-react';
import { Memory } from '@/types/person';
import { getMediaType } from '@/utils/fileValidation';

interface QuickMemoryAdderProps {
  onSave: (memory: Omit<Memory, 'id'>) => Promise<void>;
  onCancel?: () => void;
  className?: string;
}

export const QuickMemoryAdder: React.FC<QuickMemoryAdderProps> = ({
  onSave,
  onCancel,
  className
}) => {
  const [text, setText] = useState('');
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
  const [audioDuration, setAudioDuration] = useState(0);
  const [isSaving, setIsSaving] = useState(false);
  const { toast } = useToast();

  const handleAudioSave = (blob: Blob, duration: number) => {
    setAudioBlob(blob);
    setAudioDuration(duration);
    
    toast({
      title: "Áudio gravado!",
      description: `${Math.round(duration)}s de áudio adicionado à memória.`,
    });
  };

  const handleSave = async () => {
    if (!text.trim() && !audioBlob) {
      toast({
        title: "Memória vazia",
        description: "Adicione um texto ou áudio para salvar a memória.",
        variant: "destructive"
      });
      return;
    }

    setIsSaving(true);
    try {
      let mediaUrl = '';
      let mediaType: Memory['mediaType'] = undefined;
      let fileName = '';

      if (audioBlob) {
        // Create a file from the blob
        const timestamp = Date.now();
        fileName = `audio-${timestamp}.webm`;
        mediaUrl = URL.createObjectURL(audioBlob);
        mediaType = 'audio';
      }

      const memory: Omit<Memory, 'id'> = {
        text: text.trim(),
        mediaUrl: mediaUrl || undefined,
        mediaType,
        fileName: fileName || undefined
      };

      await onSave(memory);
      
      // Reset form
      setText('');
      setAudioBlob(null);
      setAudioDuration(0);
      
      toast({
        title: "Memória salva!",
        description: "A memória foi adicionada com sucesso.",
      });

    } catch (error) {
      console.error('Error saving memory:', error);
      toast({
        title: "Erro ao salvar",
        description: "Não foi possível salvar a memória. Tente novamente.",
        variant: "destructive"
      });
    } finally {
      setIsSaving(false);
    }
  };

  const clearAudio = () => {
    if (audioBlob) {
      URL.revokeObjectURL(URL.createObjectURL(audioBlob));
    }
    setAudioBlob(null);
    setAudioDuration(0);
  };

  const hasContent = text.trim() || audioBlob;

  return (
    <Card className={className}>
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-lg">
          <Plus className="w-5 h-5" />
          Nova Memória
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <label className="text-sm font-medium text-muted-foreground mb-2 block">
            Descreva a memória
          </label>
          <Textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Conte uma história especial, um momento marcante, uma conversa importante..."
            className="min-h-24 resize-none"
          />
        </div>

        <div>
          <label className="text-sm font-medium text-muted-foreground mb-2 block">
            Ou grave um áudio
          </label>
          <WhatsAppAudioRecorder
            onAudioSave={handleAudioSave}
            disabled={isSaving}
          />
          {audioBlob && (
            <div className="mt-2 flex items-center justify-between bg-green-50 dark:bg-green-950/20 p-2 rounded-lg">
              <span className="text-sm text-green-700 dark:text-green-300">
                Áudio gravado ({Math.round(audioDuration)}s)
              </span>
              <Button
                variant="ghost"
                size="sm"
                onClick={clearAudio}
                className="text-red-500 hover:bg-red-100 dark:hover:bg-red-900"
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            </div>
          )}
        </div>

        <div className="flex justify-between pt-2">
          {onCancel && (
            <Button
              variant="outline"
              onClick={onCancel}
              disabled={isSaving}
            >
              Cancelar
            </Button>
          )}
          
          <Button
            onClick={handleSave}
            disabled={!hasContent || isSaving}
            className="ml-auto"
          >
            <Save className="w-4 h-4 mr-2" />
            {isSaving ? 'Salvando...' : 'Salvar Memória'}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};