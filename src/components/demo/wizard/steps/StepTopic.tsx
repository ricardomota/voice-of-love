import React from 'react';
import { Card } from '@/components/ui/card';
import { DemoState, Topic } from '../types';
import { useLanguage } from '@/contexts/LanguageContext';

interface Props {
  state: DemoState;
  setState: (s: Partial<DemoState>) => void;
}

const topics: Topic[] = [
  'Birthday message',
  'Words of encouragement',
  'Sunday lunch memory',
  'Bedtime story',
  'Gentle reminder',
  'A funny story',
];

const getContent = (language: string) => {
  const content = {
    en: {
      title: "Pick a moment to preview",
      description: "Preview a short message about this.",
      topics: {
        'Birthday message': 'Birthday message',
        'Words of encouragement': 'Words of encouragement',
        'Sunday lunch memory': 'Sunday lunch memory',
        'Bedtime story': 'Bedtime story',
        'Gentle reminder': 'Gentle reminder',
        'A funny story': 'A funny story'
      }
    },
    'pt-BR': {
      title: "Escolha um momento para visualizar",
      description: "Visualize uma mensagem curta sobre isso.",
      topics: {
        'Birthday message': 'Mensagem de aniversário',
        'Words of encouragement': 'Palavras de encorajamento',
        'Sunday lunch memory': 'Memória do almoço de domingo',
        'Bedtime story': 'História para dormir',
        'Gentle reminder': 'Lembrete carinhoso',
        'A funny story': 'Uma história engraçada'
      }
    },
    es: {
      title: "Elige un momento para previsualizar",
      description: "Previsualiza un mensaje corto sobre esto.",
      topics: {
        'Birthday message': 'Mensaje de cumpleaños',
        'Words of encouragement': 'Palabras de aliento',
        'Sunday lunch memory': 'Recuerdo del almuerzo dominical',
        'Bedtime story': 'Cuento para dormir',
        'Gentle reminder': 'Recordatorio gentil',
        'A funny story': 'Una historia divertida'
      }
    }
  };
  return content[language as keyof typeof content] || content.en;
};

export const StepTopic: React.FC<Props> = ({ state, setState }) => {
  const { currentLanguage } = useLanguage();
  const content = getContent(currentLanguage);

  return (
    <div className="space-y-6">
      <div className="text-center space-y-2">
        <h3 className="text-2xl md:text-3xl font-serif">{content.title}</h3>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {topics.map((t) => {
          const active = state.topic === t;
          return (
            <Card
              key={t}
              role="button"
              tabIndex={0}
              onClick={() => setState({ topic: t })}
              onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') setState({ topic: t }); }}
              className={`p-4 md:p-5 cursor-pointer transition-all ${active ? 'ring-2 ring-primary bg-primary/10' : 'hover:bg-muted/50'}`}
            >
              <div className="font-medium">{content.topics[t]}</div>
              <div className="text-sm text-muted-foreground">{content.description}</div>
            </Card>
          );
        })}
      </div>
    </div>
  );
};
