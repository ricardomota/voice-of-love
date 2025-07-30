import React, { useState, useEffect } from 'react';
import { Brain, TrendingUp, Clock, Star } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { adaptiveLearningService } from '@/services/adaptiveLearningService';

interface LearningProgressProps {
  personId: string;
  personName: string;
}

export const LearningProgress: React.FC<LearningProgressProps> = ({ personId, personName }) => {
  const [progress, setProgress] = useState<any>(null);
  const [history, setHistory] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadProgress();
  }, [personId]);

  const loadProgress = async () => {
    try {
      const [progressData, historyData] = await Promise.all([
        adaptiveLearningService.getLearningProgress(personId),
        adaptiveLearningService.getPersonalityEvolutionHistory(personId)
      ]);
      
      setProgress(progressData);
      setHistory(historyData);
    } catch (error) {
      console.error('Error loading learning progress:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center space-x-2">
            <div className="w-4 h-4 border-2 border-current border-t-transparent animate-spin rounded-full" />
            <span>Carregando progresso...</span>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!progress) {
    return null;
  }

  const getEvolutionQuality = (confidence: number) => {
    if (confidence >= 0.8) return { label: 'Excelente', color: 'bg-green-500' };
    if (confidence >= 0.6) return { label: 'Boa', color: 'bg-blue-500' };
    if (confidence >= 0.4) return { label: 'Moderada', color: 'bg-yellow-500' };
    return { label: 'Baixa', color: 'bg-red-500' };
  };

  const learningRate = progress.totalConversations > 0 
    ? (progress.evolutionCount / progress.totalConversations) * 100 
    : 0;

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Brain className="h-5 w-5" />
            Progresso de Aprendizado
          </CardTitle>
          <CardDescription>
            Como {personName} está evoluindo através das conversas
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Estatísticas principais */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-primary">{progress.totalConversations}</div>
              <div className="text-sm text-muted-foreground">Conversas</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-primary">{progress.evolutionCount}</div>
              <div className="text-sm text-muted-foreground">Evoluções</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-primary">{learningRate.toFixed(1)}%</div>
              <div className="text-sm text-muted-foreground">Taxa de Aprendizado</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-primary">
                {(progress.averageConfidence * 100).toFixed(0)}%
              </div>
              <div className="text-sm text-muted-foreground">Confiança Média</div>
            </div>
          </div>

          {/* Barra de progresso */}
          <div>
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-medium">Nível de Personalização</span>
              <span className="text-sm text-muted-foreground">
                {Math.min(100, learningRate * 2).toFixed(0)}%
              </span>
            </div>
            <Progress value={Math.min(100, learningRate * 2)} className="h-2" />
          </div>

          {/* Última evolução */}
          {progress.lastEvolution && (
            <div className="flex items-center gap-2 p-3 bg-muted/50 rounded-lg">
              <Clock className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm">
                Última evolução: {new Date(progress.lastEvolution).toLocaleDateString('pt-BR')}
              </span>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Histórico de evoluções */}
      {history.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              Histórico de Evoluções
            </CardTitle>
            <CardDescription>
              Mudanças na personalidade ao longo do tempo
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {history.slice(0, 5).map((evolution, index) => {
                const quality = getEvolutionQuality(evolution.confidence_score || 0);
                
                return (
                  <div key={evolution.id} className="flex items-start gap-3 p-3 border rounded-lg">
                    <div className={`w-3 h-3 rounded-full ${quality.color} mt-2`} />
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-sm font-medium">
                          Evolução #{history.length - index}
                        </span>
                        <Badge variant="outline" className="text-xs">
                          {quality.label}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground mb-2">
                        {evolution.evolution_reason}
                      </p>
                      <span className="text-xs text-muted-foreground">
                        {new Date(evolution.created_at).toLocaleDateString('pt-BR')} às{' '}
                        {new Date(evolution.created_at).toLocaleTimeString('pt-BR', { 
                          hour: '2-digit', 
                          minute: '2-digit' 
                        })}
                      </span>
                    </div>
                  </div>
                );
              })}
              
              {history.length > 5 && (
                <div className="text-center pt-2">
                  <span className="text-sm text-muted-foreground">
                    +{history.length - 5} evoluções anteriores
                  </span>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Dicas de aprendizado */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Star className="h-5 w-5" />
            Dicas para Acelerar o Aprendizado
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="space-y-2 text-sm">
            <li className="flex items-start gap-2">
              <span className="text-primary">•</span>
              Tenha conversas mais longas e pessoais
            </li>
            <li className="flex items-start gap-2">
              <span className="text-primary">•</span>
              Compartilhe memórias específicas e detalhadas
            </li>
            <li className="flex items-start gap-2">
              <span className="text-primary">•</span>
              Reaja às respostas da IA para melhorar a conexão
            </li>
            <li className="flex items-start gap-2">
              <span className="text-primary">•</span>
              Use o botão "Analisar & Aprender" após boas conversas
            </li>
          </ul>
        </CardContent>
      </Card>
    </div>
  );
};