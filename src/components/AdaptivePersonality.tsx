import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { TrendingUp, CheckCircle, XCircle, Info } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Person } from "@/types/person";
import { useToast } from "@/hooks/use-toast";

interface PersonalityEvolution {
  id: string;
  evolution_date: string;
  previous_traits: any;
  new_traits: any;
  evolution_reason: string;
  confidence_score: number;
  applied: boolean;
}

interface AdaptivePersonalityProps {
  person: Person;
  onPersonUpdate: (updatedPerson: Person) => void;
}

export const AdaptivePersonality: React.FC<AdaptivePersonalityProps> = ({
  person,
  onPersonUpdate
}) => {
  const [suggestions, setSuggestions] = useState<PersonalityEvolution[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    loadPersonalityEvolutions();
  }, [person.id]);

  const loadPersonalityEvolutions = async () => {
    try {
      const { data, error } = await supabase
        .from('personality_evolution')
        .select('*')
        .eq('person_id', person.id)
        .eq('applied', false)
        .order('created_at', { ascending: false })
        .limit(5);

      if (error) throw error;
      setSuggestions(data || []);
    } catch (error) {
      console.error('Error loading personality evolutions:', error);
    } finally {
      setLoading(false);
    }
  };

  const applyEvolution = async (evolution: PersonalityEvolution) => {
    try {
      // Atualizar a pessoa com os novos traços
      const updatedPerson = {
        ...person,
        temperature: evolution.new_traits.temperature || person.temperature,
        verbosity: evolution.new_traits.verbosity || person.verbosity,
        emotionalTone: evolution.new_traits.emotionalTone || person.emotionalTone,
      };

      const { error: updateError } = await supabase
        .from('people')
        .update({
          temperature: updatedPerson.temperature,
          verbosity: updatedPerson.verbosity,
          emotional_tone: updatedPerson.emotionalTone,
          updated_at: new Date().toISOString()
        })
        .eq('id', person.id);

      if (updateError) throw updateError;

      // Marcar evolução como aplicada
      const { error: evolutionError } = await supabase
        .from('personality_evolution')
        .update({ applied: true })
        .eq('id', evolution.id);

      if (evolutionError) throw evolutionError;

      onPersonUpdate(updatedPerson);
      await loadPersonalityEvolutions();

      toast({
        title: "✨ Personalidade Evoluída!",
        description: "Os traços do personagem foram atualizados baseado nas interações.",
      });

    } catch (error) {
      console.error('Error applying evolution:', error);
      toast({
        title: "Erro",
        description: "Não foi possível aplicar a evolução da personalidade.",
        variant: "destructive",
      });
    }
  };

  const rejectEvolution = async (evolutionId: string) => {
    try {
      const { error } = await supabase
        .from('personality_evolution')
        .update({ applied: true }) // Marca como aplicada para não aparecer mais
        .eq('id', evolutionId);

      if (error) throw error;

      await loadPersonalityEvolutions();

      toast({
        title: "Sugestão Rejeitada",
        description: "A evolução da personalidade foi rejeitada.",
      });

    } catch (error) {
      console.error('Error rejecting evolution:', error);
    }
  };

  const getTraitChanges = (previous: any, updated: any) => {
    const changes = [];
    
    if (previous.temperature !== updated.temperature) {
      changes.push({
        trait: 'Criatividade',
        from: Math.round(previous.temperature * 100),
        to: Math.round(updated.temperature * 100),
        type: updated.temperature > previous.temperature ? 'increase' : 'decrease'
      });
    }
    
    if (previous.verbosity !== updated.verbosity) {
      changes.push({
        trait: 'Verbosidade',
        from: previous.verbosity || 'Padrão',
        to: updated.verbosity || 'Padrão',
        type: 'change'
      });
    }
    
    if (previous.emotionalTone !== updated.emotionalTone) {
      changes.push({
        trait: 'Tom Emocional',
        from: previous.emotionalTone || 'Padrão',
        to: updated.emotionalTone || 'Padrão',
        type: 'change'
      });
    }
    
    return changes;
  };

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5" />
            Evolução da Personalidade
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center py-8">
            <div className="text-muted-foreground">Carregando sugestões...</div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (suggestions.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5" />
            Evolução da Personalidade
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <div className="text-muted-foreground mb-2">
              Nenhuma sugestão de evolução disponível
            </div>
            <div className="text-sm text-muted-foreground">
              Continue conversando para que o sistema possa sugerir melhorias
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5" />
            Evolução da Personalidade
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-sm text-muted-foreground mb-4">
            Baseado nas interações recentes, sugerimos os seguintes ajustes para melhorar a autenticidade:
          </div>
        </CardContent>
      </Card>

      {suggestions.map((suggestion) => {
        const changes = getTraitChanges(suggestion.previous_traits, suggestion.new_traits);
        
        return (
          <Card key={suggestion.id} className="border-l-4 border-l-primary">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <Badge variant="outline">
                      Confiança: {Math.round(suggestion.confidence_score * 100)}%
                    </Badge>
                    <Badge variant="secondary">
                      {new Date(suggestion.evolution_date).toLocaleDateString()}
                    </Badge>
                  </div>
                  <Progress value={suggestion.confidence_score * 100} className="w-32 h-2" />
                </div>
              </div>
            </CardHeader>
            
            <CardContent className="space-y-4">
              <div className="flex items-start gap-2">
                <Info className="h-4 w-4 text-blue-500 mt-0.5 flex-shrink-0" />
                <div className="text-sm text-muted-foreground">
                  {suggestion.evolution_reason}
                </div>
              </div>

              {changes.length > 0 && (
                <div className="space-y-2">
                  <h4 className="font-medium text-sm">Mudanças Propostas:</h4>
                  <div className="space-y-2">
                    {changes.map((change, index) => (
                      <div key={index} className="flex items-center justify-between p-2 bg-muted rounded-md">
                        <span className="text-sm font-medium">{change.trait}</span>
                        <div className="flex items-center gap-2 text-sm">
                          <span className="text-muted-foreground">{change.from}</span>
                          <span>→</span>
                          <span className={
                            change.type === 'increase' ? 'text-green-600' :
                            change.type === 'decrease' ? 'text-red-600' : 'text-blue-600'
                          }>
                            {change.to}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="flex gap-2 pt-2">
                <Button
                  size="sm"
                  onClick={() => applyEvolution(suggestion)}
                  className="flex items-center gap-2"
                >
                  <CheckCircle className="h-4 w-4" />
                  Aplicar
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => rejectEvolution(suggestion.id)}
                  className="flex items-center gap-2"
                >
                  <XCircle className="h-4 w-4" />
                  Rejeitar
                </Button>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
};