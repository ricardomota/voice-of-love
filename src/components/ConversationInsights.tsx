import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Brain, Heart, TrendingUp, MessageCircle, Star, Zap } from "lucide-react";
import { ConversationAnalysis } from "@/services/conversationAnalyzer";

interface ConversationInsightsProps {
  analysis: ConversationAnalysis;
  isVisible: boolean;
  onClose: () => void;
}

export const ConversationInsights: React.FC<ConversationInsightsProps> = ({
  analysis,
  isVisible,
  onClose
}) => {
  if (!isVisible) return null;

  const getMoodColor = (mood: string) => {
    switch (mood.toLowerCase()) {
      case 'happy': case 'joy': case 'excited': return 'text-green-600';
      case 'sad': case 'melancholy': return 'text-blue-600';
      case 'angry': case 'frustrated': return 'text-red-600';
      case 'calm': case 'peaceful': return 'text-blue-400';
      case 'anxious': case 'worried': return 'text-yellow-600';
      default: return 'text-gray-600';
    }
  };

  const getQualityColor = (score: number) => {
    if (score >= 0.8) return 'text-green-600';
    if (score >= 0.6) return 'text-yellow-600';
    return 'text-red-600';
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-background rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b flex justify-between items-center">
          <h2 className="text-2xl font-bold flex items-center gap-2">
            <Brain className="h-6 w-6 text-primary" />
            Análise da Conversa
          </h2>
          <button
            onClick={onClose}
            className="text-muted-foreground hover:text-foreground"
          >
            ✕
          </button>
        </div>

        <div className="p-6 space-y-6">
          {/* Análise de Sentimentos */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Heart className="h-5 w-5 text-pink-500" />
                Análise Emocional
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h4 className="font-medium text-sm mb-2">Seu Humor</h4>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Positivo</span>
                      <span>{Math.round(analysis.sentimentAnalysis.userSentiment.positive * 100)}%</span>
                    </div>
                    <Progress value={analysis.sentimentAnalysis.userSentiment.positive * 100} className="h-2" />
                  </div>
                </div>
                <div>
                  <h4 className="font-medium text-sm mb-2">Humor do Personagem</h4>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Positivo</span>
                      <span>{Math.round(analysis.sentimentAnalysis.characterSentiment.positive * 100)}%</span>
                    </div>
                    <Progress value={analysis.sentimentAnalysis.characterSentiment.positive * 100} className="h-2" />
                  </div>
                </div>
              </div>
              
              <div className="flex flex-wrap gap-2">
                <Badge variant="secondary" className={getMoodColor(analysis.sentimentAnalysis.overallMood)}>
                  Humor Geral: {analysis.sentimentAnalysis.overallMood}
                </Badge>
                {analysis.sentimentAnalysis.dominantEmotions.map((emotion, index) => (
                  <Badge key={index} variant="outline">
                    {emotion}
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Dinâmicas do Relacionamento */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MessageCircle className="h-5 w-5 text-blue-500" />
                Dinâmicas do Relacionamento
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Intimidade</span>
                    <span className={getQualityColor(analysis.relationshipDynamics.intimacyLevel)}>
                      {Math.round(analysis.relationshipDynamics.intimacyLevel * 100)}%
                    </span>
                  </div>
                  <Progress value={analysis.relationshipDynamics.intimacyLevel * 100} className="h-2" />
                </div>
                
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Qualidade da Comunicação</span>
                    <span className={getQualityColor(analysis.relationshipDynamics.communicationQuality)}>
                      {Math.round(analysis.relationshipDynamics.communicationQuality * 100)}%
                    </span>
                  </div>
                  <Progress value={analysis.relationshipDynamics.communicationQuality * 100} className="h-2" />
                </div>
                
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Engajamento</span>
                    <span className={getQualityColor(analysis.relationshipDynamics.engagementLevel)}>
                      {Math.round(analysis.relationshipDynamics.engagementLevel * 100)}%
                    </span>
                  </div>
                  <Progress value={analysis.relationshipDynamics.engagementLevel * 100} className="h-2" />
                </div>
              </div>

              {analysis.relationshipDynamics.conflictDetected && (
                <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                  <p className="text-sm text-yellow-800">
                    ⚠️ Possível tensão detectada na conversa
                  </p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Qualidade da Conversa */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Star className="h-5 w-5 text-yellow-500" />
                Qualidade da Conversa
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {Object.entries(analysis.conversationQuality).map(([key, value]) => (
                  <div key={key} className="text-center">
                    <div className={`text-2xl font-bold ${getQualityColor(value)}`}>
                      {Math.round(value * 100)}%
                    </div>
                    <div className="text-sm text-muted-foreground capitalize">
                      {key.replace('_', ' ')}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Tópicos Discutidos */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-purple-500" />
                Tópicos da Conversa
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {analysis.topicsDiscussed.map((topic, index) => (
                  <Badge key={index} variant="secondary">
                    {topic}
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Insights de Personalidade */}
          {analysis.personalityInsights.observedTraits.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Zap className="h-5 w-5 text-orange-500" />
                  Insights de Personalidade
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div>
                    <h4 className="font-medium text-sm mb-2">Traços Observados</h4>
                    <div className="flex flex-wrap gap-2">
                      {analysis.personalityInsights.observedTraits.map((trait, index) => (
                        <Badge key={index} variant="outline">
                          {trait}
                        </Badge>
                      ))}
                    </div>
                  </div>
                  
                  {analysis.personalityInsights.behaviorPatterns.length > 0 && (
                    <div>
                      <h4 className="font-medium text-sm mb-2">Padrões de Comportamento</h4>
                      <div className="flex flex-wrap gap-2">
                        {analysis.personalityInsights.behaviorPatterns.map((pattern, index) => (
                          <Badge key={index} variant="outline">
                            {pattern}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Momentos Importantes */}
          {analysis.keyMoments.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Momentos Importantes</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {analysis.keyMoments.map((moment, index) => (
                    <li key={index} className="flex items-start gap-2">
                      <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></div>
                      <span className="text-sm">{moment}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};