import React from 'react';
import { Card } from '@/components/ui/card';
import { DemoState, Topic } from '../types';
import { useLanguage } from '@/contexts/LanguageContext';
import { motion } from 'framer-motion';
import { Cake, Heart, Utensils, Moon, Clock, Smile } from 'lucide-react';

interface Props {
  state: DemoState;
  setState: (s: Partial<DemoState>) => void;
}

const topics: { key: Topic; icon: React.ComponentType<any> }[] = [
  { key: 'Birthday message', icon: Cake },
  { key: 'Words of encouragement', icon: Heart },
  { key: 'Sunday lunch memory', icon: Utensils },
  { key: 'Bedtime story', icon: Moon },
  { key: 'Gentle reminder', icon: Clock },
  { key: 'A funny story', icon: Smile },
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
        {topics.map((item, index) => {
          const active = state.topic === item.key;
          const Icon = item.icon;
          return (
            <motion.div
              key={item.key}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
            >
              <Card
                role="button"
                tabIndex={0}
                onClick={() => setState({ topic: item.key })}
                onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') setState({ topic: item.key }); }}
                className={`
                  p-4 md:p-5 cursor-pointer transition-all duration-300 group
                  ${active 
                    ? 'ring-2 ring-primary bg-primary/10 scale-[1.02] shadow-lg' 
                    : 'hover:bg-muted/50 hover:scale-[1.01] hover:shadow-md'
                  }
                `}
              >
                <div className="flex items-center gap-3 mb-2">
                  <div className={`p-2 rounded-lg transition-colors ${active ? 'bg-primary text-primary-foreground' : 'bg-muted group-hover:bg-primary/10'}`}>
                    <Icon size={20} />
                  </div>
                  <div className="text-lg font-medium">{content.topics[item.key]}</div>
                </div>
                <div className="text-sm text-muted-foreground ml-11">{content.description}</div>
              </Card>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};
