import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Person } from '@/types/person';
import { VolumeX, Volume2, Download, RefreshCw, Heart, Lightbulb, Star, Coffee, User, Sparkles, MessageCircleHeart } from 'lucide-react';

interface VoiceMessageGeneratorProps {
  person: Person;
  trigger?: React.ReactNode;
}

const messageTypes = [
  { 
    key: 'motivational', 
    label: 'Motivacional', 
    icon: Star, 
    description: 'Mensagem de encorajamento e motivação',
    color: 'bg-yellow-50 border-yellow-200 text-yellow-700'
  },
  { 
    key: 'caring', 
    label: 'Carinhosa', 
    icon: Heart, 
    description: 'Mensagem cheia de amor e carinho',
    color: 'bg-red-50 border-red-200 text-red-700'
  },
  { 
    key: 'wisdom', 
    label: 'Sabedoria', 
    icon: Lightbulb, 
    description: 'Conselho sábio e reflexivo',
    color: 'bg-blue-50 border-blue-200 text-blue-700'
  },
  { 
    key: 'daily', 
    label: 'Bom dia', 
    icon: Coffee, 
    description: 'Mensagem para começar bem o dia',
    color: 'bg-orange-50 border-orange-200 text-orange-700'
  },
  { 
    key: 'comfort', 
    label: 'Conforto', 
    icon: User, 
    description: 'Palavras de tranquilidade e paz',
    color: 'bg-green-50 border-green-200 text-green-700'
  },
  { 
    key: 'gratitude', 
    label: 'Gratidão', 
    icon: Sparkles, 
    description: 'Expressão de amor e gratidão',
    color: 'bg-purple-50 border-purple-200 text-purple-700'
  }
];

export const VoiceMessageGenerator: React.FC<VoiceMessageGeneratorProps> = ({ 
  person, 
  trigger 
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [currentMessage, setCurrentMessage] = useState<{
    text: string;
    audioUrl: string;
    type: string;
    hasCustomVoice: boolean;
  } | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [audio, setAudio] = useState<HTMLAudioElement | null>(null);
  const { toast } = useToast();

  const generateMessage = async (messageType: string) => {
    try {
      setIsGenerating(true);
      
      const { data, error } = await supabase.functions.invoke('generate-voice-message', {
        body: {
          person: person,
          messageType: messageType
        }
      });

      if (error) {
        throw new Error(error.message || 'Erro ao gerar mensagem');
      }

      if (!data.success) {
        throw new Error(data.error || 'Erro desconhecido ao gerar mensagem');
      }

      // Converter base64 para blob URL de forma segura
      let audioUrl: string;
      try {
        const binaryString = atob(data.audioContent);
        const bytes = new Uint8Array(binaryString.length);
        for (let i = 0; i < binaryString.length; i++) {
          bytes[i] = binaryString.charCodeAt(i);
        }
        
        const audioBlob = new Blob([bytes], { type: 'audio/mpeg' });
        audioUrl = URL.createObjectURL(audioBlob);
      } catch (base64Error) {
        console.error('Error converting base64 to blob:', base64Error);
        throw new Error('Erro ao processar o áudio gerado');
      }

      setCurrentMessage({
        text: data.message,
        audioUrl,
        type: messageType,
        hasCustomVoice: data.hasCustomVoice
      });

      toast({
        title: "Mensagem gerada!",
        description: `${person.name} tem uma mensagem especial para você.`,
      });

    } catch (error) {
      console.error('Error generating message:', error);
      toast({
        title: "Erro",
        description: error instanceof Error ? error.message : 'Não foi possível gerar a mensagem',
        variant: "destructive"
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const playMessage = () => {
    if (!currentMessage) return;

    if (audio) {
      audio.pause();
      setAudio(null);
      setIsPlaying(false);
    }

    const newAudio = new Audio(currentMessage.audioUrl);
    newAudio.onended = () => {
      setIsPlaying(false);
      setAudio(null);
    };
    newAudio.onerror = () => {
      setIsPlaying(false);
      setAudio(null);
      toast({
        title: "Erro",
        description: "Não foi possível reproduzir o áudio",
        variant: "destructive"
      });
    };

    newAudio.play();
    setAudio(newAudio);
    setIsPlaying(true);
  };

  const stopMessage = () => {
    if (audio) {
      audio.pause();
      setAudio(null);
      setIsPlaying(false);
    }
  };

  const downloadMessage = () => {
    if (!currentMessage) return;

    const link = document.createElement('a');
    link.href = currentMessage.audioUrl;
    link.download = `mensagem-${person.name}-${Date.now()}.mp3`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const resetMessage = () => {
    if (audio) {
      audio.pause();
      setAudio(null);
    }
    
    if (currentMessage?.audioUrl) {
      URL.revokeObjectURL(currentMessage.audioUrl);
    }
    
    setCurrentMessage(null);
    setIsPlaying(false);
  };

  const defaultTrigger = (
    <Button variant="outline" className="flex items-center gap-2">
      <MessageCircleHeart className="w-4 h-4" />
      Receber mensagem
    </Button>
  );

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        {trigger || defaultTrigger}
      </DialogTrigger>
      
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-3">
            <div className="w-8 h-8 bg-gradient-to-br from-purple-400 to-pink-400 rounded-lg flex items-center justify-center">
              <MessageCircleHeart className="w-4 h-4 text-white" />
            </div>
            Mensagem especial de {person.name}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Informações da pessoa */}
          <div className="flex items-center gap-3 p-4 bg-muted/50 rounded-lg">
            <div className="w-12 h-12 bg-gradient-to-br from-accent/20 to-accent/10 rounded-full flex items-center justify-center">
              <span className="text-lg font-semibold text-accent">
                {person.name[0]}
              </span>
            </div>
            <div>
              <h3 className="font-medium">{person.name}</h3>
              <p className="text-sm text-muted-foreground">{person.relationship}</p>
              {person.voiceSettings?.hasRecording && (
                <Badge variant="secondary" className="mt-1">
                  <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
                  Voz personalizada
                </Badge>
              )}
            </div>
          </div>

          {/* Mensagem atual */}
          {currentMessage && (
            <Card className="border-accent/20">
              <CardHeader>
                <CardTitle className="text-base flex items-center justify-between">
                  <span>Sua mensagem está pronta!</span>
                  <Badge variant="outline">
                    {messageTypes.find(t => t.key === currentMessage.type)?.label}
                  </Badge>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="p-4 bg-muted/30 rounded-lg">
                  <p className="text-sm leading-relaxed italic">
                    "{currentMessage.text}"
                  </p>
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={isPlaying ? stopMessage : playMessage}
                      className="flex items-center gap-2"
                    >
                      {isPlaying ? (
                        <>
                          <VolumeX className="w-4 h-4" />
                          Pausar
                        </>
                      ) : (
                        <>
                          <Volume2 className="w-4 h-4" />
                          Ouvir
                        </>
                      )}
                    </Button>
                    
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={downloadMessage}
                      className="flex items-center gap-2"
                    >
                      <Download className="w-4 h-4" />
                      Baixar
                    </Button>
                  </div>
                  
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={resetMessage}
                    className="flex items-center gap-2"
                  >
                    <RefreshCw className="w-4 h-4" />
                    Nova mensagem
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Tipos de mensagem */}
          {!currentMessage && (
            <div>
              <h3 className="font-medium mb-4">Que tipo de mensagem você gostaria de receber?</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {messageTypes.map((type) => {
                  const Icon = type.icon;
                  return (
                    <Card 
                      key={type.key}
                      className={`cursor-pointer transition-all hover:shadow-md border-2 ${type.color}`}
                      onClick={() => !isGenerating && generateMessage(type.key)}
                    >
                      <CardContent className="p-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-lg bg-white/50 flex items-center justify-center">
                            <Icon className="w-5 h-5" />
                          </div>
                          <div className="flex-1">
                            <h4 className="font-medium">{type.label}</h4>
                            <p className="text-xs opacity-80">{type.description}</p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            </div>
          )}

          {/* Loading state */}
          {isGenerating && (
            <div className="flex items-center justify-center py-8">
              <div className="flex items-center gap-3">
                <div className="w-6 h-6 border-2 border-accent/30 border-t-accent rounded-full animate-spin"></div>
                <span className="text-muted-foreground">
                  {person.name} está preparando sua mensagem...
                </span>
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};