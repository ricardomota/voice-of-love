import React from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card } from '@/components/ui/card';
import { DemoState } from '../types';
import { useLanguage } from '@/contexts/LanguageContext';

interface Props {
  state: DemoState;
  setState: (s: Partial<DemoState>) => void;
}

const getContent = (language: string) => {
  const content = {
    en: {
      title: "Let's make it personal",
      subtitle: "Add some details to make the conversation more meaningful.",
      memoryLabel: "Share a favorite memory you had together",
      memoryPlaceholder: "e.g., Sunday dinners, bedtime stories, garden walks...",
      timeLabel: "When did you usually spend time together?",
      detailLabel: "One special thing about them",
      detailPlaceholder: "e.g., always hummed while cooking, had the warmest hugs...",
      times: {
        morning: "Morning",
        afternoon: "Afternoon", 
        evening: "Evening"
      }
    },
    'pt-BR': {
      title: "Vamos personalizar",
      subtitle: "Adicione alguns detalhes para tornar a conversa mais significativa.",
      memoryLabel: "Compartilhe uma memória favorita que vocês tinham juntos",
      memoryPlaceholder: "ex: almoços de domingo, histórias na hora de dormir, caminhadas no jardim...",
      timeLabel: "Quando vocês geralmente passavam tempo juntos?",
      detailLabel: "Uma coisa especial sobre essa pessoa",
      detailPlaceholder: "ex: sempre cantarolava cozinhando, tinha os abraços mais calorosos...",
      times: {
        morning: "Manhã",
        afternoon: "Tarde",
        evening: "Noite"
      }
    },
    es: {
      title: "Hagámoslo personal",
      subtitle: "Agrega algunos detalles para hacer la conversación más significativa.",
      memoryLabel: "Comparte un recuerdo favorito que tenían juntos",
      memoryPlaceholder: "ej: cenas dominicales, cuentos antes de dormir, paseos por el jardín...",
      timeLabel: "¿Cuándo solían pasar tiempo juntos?",
      detailLabel: "Algo especial sobre esta persona",
      detailPlaceholder: "ej: siempre tarareaba cocinando, tenía los abrazos más cálidos...",
      times: {
        morning: "Mañana",
        afternoon: "Tarde", 
        evening: "Noche"
      }
    }
  };
  return content[language as keyof typeof content] || content.en;
};

export const StepPersonalization: React.FC<Props> = ({ state, setState }) => {
  const { currentLanguage } = useLanguage();
  const content = getContent(currentLanguage);

  const updatePersonalization = (updates: Partial<DemoState['personalization']>) => {
    setState({
      personalization: {
        ...state.personalization,
        ...updates
      }
    });
  };

  const times = ['morning', 'afternoon', 'evening'] as const;

  return (
    <div className="space-y-6">
      <div className="text-center space-y-2">
        <h3 className="text-2xl md:text-3xl font-serif">{content.title}</h3>
        <p className="text-muted-foreground">{content.subtitle}</p>
      </div>

      <div className="space-y-5">
        <Card className="p-4 md:p-5">
          <label htmlFor="favorite-memory" className="block text-sm font-medium mb-2">
            {content.memoryLabel}
          </label>
          <Textarea
            id="favorite-memory"
            placeholder={content.memoryPlaceholder}
            value={state.personalization?.favoriteMemory || ''}
            onChange={(e) => updatePersonalization({ favoriteMemory: e.target.value })}
            className="min-h-[80px] resize-none"
            aria-label={content.memoryLabel}
          />
        </Card>

        <Card className="p-4 md:p-5">
          <label className="block text-sm font-medium mb-3">
            {content.timeLabel}
          </label>
          <div className="grid grid-cols-3 gap-3">
            {times.map((time) => (
              <Button
                key={time}
                variant={state.personalization?.preferredTime === time ? 'default' : 'outline'}
                className="h-12 text-sm"
                onClick={() => updatePersonalization({ preferredTime: time })}
                aria-pressed={state.personalization?.preferredTime === time}
              >
                {content.times[time]}
              </Button>
            ))}
          </div>
        </Card>

        <Card className="p-4 md:p-5">
          <label htmlFor="personal-detail" className="block text-sm font-medium mb-2">
            {content.detailLabel}
          </label>
          <Textarea
            id="personal-detail"
            placeholder={content.detailPlaceholder}
            value={state.personalization?.personalDetail || ''}
            onChange={(e) => updatePersonalization({ personalDetail: e.target.value })}
            className="min-h-[80px] resize-none"
            aria-label={content.detailLabel}
          />
        </Card>
      </div>
    </div>
  );
};