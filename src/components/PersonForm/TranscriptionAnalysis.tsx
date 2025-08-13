import { useState, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Sparkles, Brain, MessageSquare, Heart } from 'lucide-react';
import { transcriptionAnalysisService } from '@/services/transcritionAnalysisService';
import { useToast } from '@/hooks/use-toast';

interface TranscriptionAnalysisProps {
  transcriptionText: string;
  onAnalysisComplete: (analysis: {
    phrases: string[];
    personality: string[];
    talkingStyle: string;
    values: string[];
    topics: string[];
  }) => void;
}

export const TranscriptionAnalysis = ({ transcriptionText, onAnalysisComplete }: TranscriptionAnalysisProps) => {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysis, setAnalysis] = useState<any>(null);
  const { toast } = useToast();

  const performAnalysis = useCallback(async () => {
    if (!transcriptionText.trim()) {
      toast({
        title: "Transcrição necessária",
        description: "É necessário ter uma transcrição para analisar.",
        variant: "destructive"
      });
      return;
    }

    setIsAnalyzing(true);
    
    try {
      // Simular processamento
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const phrases = transcriptionAnalysisService.extractCharacteristicPhrases(transcriptionText);
      const personality = transcriptionAnalysisService.extractPersonalityTraits(transcriptionText);
      const talkingStyle = transcriptionAnalysisService.analyzeSpeechStyle(transcriptionText);
      const { values, topics } = transcriptionAnalysisService.extractValuesAndTopics(transcriptionText);
      
      const analysisResult = {
        phrases,
        personality,
        talkingStyle,
        values,
        topics
      };
      
      setAnalysis(analysisResult);
      
      toast({
        title: "✨ Análise concluída!",
        description: `Encontradas ${phrases.length} frases características e ${personality.length} traços de personalidade.`,
      });
    } catch (error) {
      console.error('Error analyzing transcription:', error);
      toast({
        title: "Erro na análise",
        description: "Não foi possível analisar a transcrição.",
        variant: "destructive"
      });
    } finally {
      setIsAnalyzing(false);
    }
  }, [transcriptionText, toast]);

  const handleApplyAnalysis = () => {
    if (analysis) {
      onAnalysisComplete(analysis);
      toast({
        title: "Análise aplicada!",
        description: "As características foram adicionadas ao formulário.",
      });
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Brain className="w-5 h-5" />
            Análise Inteligente de Personalidade
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-muted-foreground">
            Nossa IA pode analisar a transcrição da gravação e extrair automaticamente:
          </p>
          
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div className="flex items-center gap-2">
              <MessageSquare className="w-4 h-4 text-primary" />
              Frases características
            </div>
            <div className="flex items-center gap-2">
              <Heart className="w-4 h-4 text-primary" />
              Traços de personalidade
            </div>
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-primary" />
              Estilo de fala
            </div>
            <div className="flex items-center gap-2">
              <Brain className="w-4 h-4 text-primary" />
              Valores e tópicos favoritos
            </div>
          </div>

          <Button 
            onClick={performAnalysis}
            disabled={isAnalyzing || !transcriptionText.trim()}
            className="w-full"
          >
            {isAnalyzing ? (
              <>
                <div className="w-4 h-4 border-2 border-current border-t-transparent animate-spin rounded-full mr-2" />
                Analisando personalidade...
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4 mr-2" />
                Analisar Personalidade
              </>
            )}
          </Button>
        </CardContent>
      </Card>

      {analysis && (
        <Card>
          <CardHeader>
            <CardTitle>Resultados da Análise</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {analysis.phrases.length > 0 && (
              <div>
                <h4 className="font-medium mb-2">Frases Características ({analysis.phrases.length})</h4>
                <div className="flex flex-wrap gap-2">
                  {analysis.phrases.map((phrase: string, index: number) => (
                    <Badge key={index} variant="secondary">
                      "{phrase}"
                    </Badge>
                  ))}
                </div>
              </div>
            )}

            {analysis.personality.length > 0 && (
              <div>
                <h4 className="font-medium mb-2">Traços de Personalidade ({analysis.personality.length})</h4>
                <div className="flex flex-wrap gap-2">
                  {analysis.personality.map((trait: string, index: number) => (
                    <Badge key={index} variant="outline">
                      {trait}
                    </Badge>
                  ))}
                </div>
              </div>
            )}

            <div>
              <h4 className="font-medium mb-2">Estilo de Fala</h4>
              <Badge variant="default">{analysis.talkingStyle}</Badge>
            </div>

            {analysis.values.length > 0 && (
              <div>
                <h4 className="font-medium mb-2">Valores Importantes ({analysis.values.length})</h4>
                <div className="flex flex-wrap gap-2">
                  {analysis.values.map((value: string, index: number) => (
                    <Badge key={index} variant="secondary">
                      {value}
                    </Badge>
                  ))}
                </div>
              </div>
            )}

            {analysis.topics.length > 0 && (
              <div>
                <h4 className="font-medium mb-2">Tópicos Favoritos ({analysis.topics.length})</h4>
                <div className="flex flex-wrap gap-2">
                  {analysis.topics.map((topic: string, index: number) => (
                    <Badge key={index} variant="outline">
                      {topic}
                    </Badge>
                  ))}
                </div>
              </div>
            )}

            <Button onClick={handleApplyAnalysis} className="w-full">
              <Sparkles className="w-4 h-4 mr-2" />
              Aplicar Análise ao Formulário
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
};