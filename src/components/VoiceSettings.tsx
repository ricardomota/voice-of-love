import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Settings, PlayArrow, Tune, Info, CheckCircle, Warning } from "@mui/icons-material";
import { Volume2 } from "lucide-react";
import { Person } from "@/types/person";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface VoiceSettingsProps {
  person: Person;
  onUpdate?: (updatedPerson: Person) => void;
}

export const VoiceSettings: React.FC<VoiceSettingsProps> = ({ person, onUpdate }) => {
  const { toast } = useToast();
  const [isOpen, setIsOpen] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  
  // Configurações de voz com valores padrão otimizados
  const [voiceConfig, setVoiceConfig] = useState({
    stability: (person.voiceSettings as any)?.stability || 0.5,
    similarityBoost: (person.voiceSettings as any)?.similarityBoost || 0.75,
    style: (person.voiceSettings as any)?.style || 0.0,
    useSpeakerBoost: (person.voiceSettings as any)?.useSpeakerBoost || true
  });

  const hasPersonalizedVoice = person.voiceSettings?.hasRecording && person.voiceSettings?.voiceId;
  const audioCount = person.voiceSettings?.audioFiles?.length || 0;

  const updateVoiceSettings = async () => {
    try {
      const updatedVoiceSettings = {
        ...person.voiceSettings,
        stability: voiceConfig.stability,
        similarityBoost: voiceConfig.similarityBoost,
        style: voiceConfig.style,
        useSpeakerBoost: voiceConfig.useSpeakerBoost
      };

      const { error } = await supabase
        .from('people')
        .update({ voice_settings: updatedVoiceSettings })
        .eq('id', person.id);

      if (error) throw error;

      toast({
        title: "Configurações salvas",
        description: "As configurações de voz foram atualizadas com sucesso.",
      });

      if (onUpdate) {
        onUpdate({
          ...person,
          voiceSettings: updatedVoiceSettings
        });
      }
    } catch (error) {
      console.error('Error updating voice settings:', error);
      toast({
        title: "Erro",
        description: "Não foi possível salvar as configurações de voz.",
        variant: "destructive"
      });
    }
  };

  const generateTestMessage = async () => {
    if (!hasPersonalizedVoice) return;

    setIsGenerating(true);
    try {
      const { data, error } = await supabase.functions.invoke('generate-voice-message', {
        body: {
          person: {
            ...person,
            voiceSettings: {
              ...person.voiceSettings,
              stability: voiceConfig.stability,
              similarityBoost: voiceConfig.similarityBoost,
              style: voiceConfig.style,
              useSpeakerBoost: voiceConfig.useSpeakerBoost
            }
          },
          messageType: 'daily'
        }
      });

      if (error) throw error;

      if (data.audioContent) {
        // Reproduzir áudio de teste
        const binaryString = atob(data.audioContent);
        const bytes = new Uint8Array(binaryString.length);
        for (let i = 0; i < binaryString.length; i++) {
          bytes[i] = binaryString.charCodeAt(i);
        }
        
        const audioBlob = new Blob([bytes], { type: 'audio/mpeg' });
        const audioUrl = URL.createObjectURL(audioBlob);
        const audio = new Audio(audioUrl);
        
        audio.play();
        audio.onended = () => URL.revokeObjectURL(audioUrl);

        toast({
          title: "Áudio de teste gerado",
          description: "Escute o resultado e ajuste as configurações conforme necessário.",
        });
      }
    } catch (error) {
      console.error('Error generating test message:', error);
      toast({
        title: "Erro",
        description: "Não foi possível gerar o áudio de teste.",
        variant: "destructive"
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const getQualityRecommendations = () => {
    const recommendations = [];
    
    if (audioCount < 3) {
      recommendations.push({
        type: 'warning',
        title: 'Poucos áudios',
        description: 'Adicione pelo menos 3-5 áudios para melhor qualidade.'
      });
    }
    
    if (audioCount >= 3 && audioCount < 7) {
      recommendations.push({
        type: 'info',
        title: 'Boa quantidade',
        description: 'Você tem uma boa base. Considere adicionar mais áudios variados.'
      });
    }
    
    if (audioCount >= 7) {
      recommendations.push({
        type: 'success',
        title: 'Excelente base',
        description: 'Você tem uma excelente base de áudios para treinamento.'
      });
    }

    return recommendations;
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className="flex items-center gap-2"
          disabled={!hasPersonalizedVoice}
        >
          <Tune className="w-4 h-4" />
          Ajustar Voz
        </Button>
      </DialogTrigger>
      
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Settings className="w-5 h-5" />
            Configurações de Voz - {person.name}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Status da voz */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Volume2 className="w-5 h-5" />
                Status da Voz
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Modelo de voz:</span>
                <Badge variant={hasPersonalizedVoice ? "default" : "secondary"}>
                  {hasPersonalizedVoice ? "Ativo" : "Não configurado"}
                </Badge>
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Áudios de treinamento:</span>
                <Badge variant="outline">
                  {audioCount} áudio{audioCount !== 1 ? 's' : ''}
                </Badge>
              </div>

              {hasPersonalizedVoice && (
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Voice ID:</span>
                  <code className="text-xs bg-muted px-2 py-1 rounded">
                    {person.voiceSettings?.voiceId}
                  </code>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Recomendações de qualidade */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Info className="w-5 h-5" />
                Recomendações de Qualidade
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {getQualityRecommendations().map((rec, index) => (
                <Alert key={index} className={
                  rec.type === 'success' ? 'border-green-200 bg-green-50' :
                  rec.type === 'warning' ? 'border-yellow-200 bg-yellow-50' :
                  'border-blue-200 bg-blue-50'
                }>
                  <div className="flex items-center gap-2">
                    {rec.type === 'success' && <CheckCircle className="w-4 h-4 text-green-600" />}
                    {rec.type === 'warning' && <Warning className="w-4 h-4 text-yellow-600" />}
                    {rec.type === 'info' && <Info className="w-4 h-4 text-blue-600" />}
                    <div>
                      <strong className="text-sm">{rec.title}</strong>
                      <AlertDescription className="text-xs mt-1">
                        {rec.description}
                      </AlertDescription>
                    </div>
                  </div>
                </Alert>
              ))}
            </CardContent>
          </Card>

          {/* Configurações avançadas */}
          {hasPersonalizedVoice && (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Configurações Avançadas</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Stability */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="stability">Estabilidade</Label>
                    <span className="text-sm text-muted-foreground">
                      {(voiceConfig.stability * 100).toFixed(0)}%
                    </span>
                  </div>
                  <Slider
                    id="stability"
                    min={0}
                    max={1}
                    step={0.05}
                    value={[voiceConfig.stability]}
                    onValueChange={(value) => 
                      setVoiceConfig(prev => ({ ...prev, stability: value[0] }))
                    }
                    className="w-full"
                  />
                  <p className="text-xs text-muted-foreground">
                    Maior estabilidade = mais consistente, menor variação emocional
                  </p>
                </div>

                <Separator />

                {/* Similarity Boost */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="similarity">Similaridade</Label>
                    <span className="text-sm text-muted-foreground">
                      {(voiceConfig.similarityBoost * 100).toFixed(0)}%
                    </span>
                  </div>
                  <Slider
                    id="similarity"
                    min={0}
                    max={1}
                    step={0.05}
                    value={[voiceConfig.similarityBoost]}
                    onValueChange={(value) => 
                      setVoiceConfig(prev => ({ ...prev, similarityBoost: value[0] }))
                    }
                    className="w-full"
                  />
                  <p className="text-xs text-muted-foreground">
                    Maior similaridade = mais parecido com os áudios originais
                  </p>
                </div>

                <Separator />

                {/* Style */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="style">Estilo/Emoção</Label>
                    <span className="text-sm text-muted-foreground">
                      {(voiceConfig.style * 100).toFixed(0)}%
                    </span>
                  </div>
                  <Slider
                    id="style"
                    min={0}
                    max={1}
                    step={0.05}
                    value={[voiceConfig.style]}
                    onValueChange={(value) => 
                      setVoiceConfig(prev => ({ ...prev, style: value[0] }))
                    }
                    className="w-full"
                  />
                  <p className="text-xs text-muted-foreground">
                    Maior estilo = mais expressividade e variação emocional
                  </p>
                </div>

                {/* Ações */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4">
                  <Button
                    onClick={generateTestMessage}
                    disabled={isGenerating}
                    size="lg"
                    className="w-full"
                  >
                    <PlayArrow className="w-4 h-4 mr-2" />
                    {isGenerating ? 'Gerando...' : 'Testar Voz'}
                  </Button>
                  
                  <Button
                    onClick={updateVoiceSettings}
                    variant="secondary"
                    size="lg"
                    className="w-full"
                  >
                    Salvar Configurações
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Dicas para melhorar */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Dicas para Melhorar a Voz</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3 text-sm">
                <div className="space-y-1">
                  <strong>📊 Qualidade dos áudios:</strong>
                  <ul className="ml-4 space-y-1 text-muted-foreground">
                    <li>• Use áudios sem ruído de fundo</li>
                    <li>• Cada áudio deve ter pelo menos 10-30 segundos</li>
                    <li>• Inclua diferentes emoções e tons de voz</li>
                  </ul>
                </div>
                
                <div className="space-y-1">
                  <strong>🎯 Variedade:</strong>
                  <ul className="ml-4 space-y-1 text-muted-foreground">
                    <li>• Palavras e frases diferentes</li>
                    <li>• Diferentes contextos (alegre, sério, carinhoso)</li>
                    <li>• Velocidade de fala variada</li>
                  </ul>
                </div>

                <div className="space-y-1">
                  <strong>⚙️ Configurações:</strong>
                  <ul className="ml-4 space-y-1 text-muted-foreground">
                    <li>• Similaridade alta (70-85%) para máxima fidelidade</li>
                    <li>• Estabilidade média (40-60%) para naturalidade</li>
                    <li>• Estilo baixo (0-20%) para começar</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </DialogContent>
    </Dialog>
  );
};