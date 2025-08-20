import React from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { DemoState, Warmth, Formality, Energy, Pace } from '../types';
import { generatePreviewText } from '../generator';
import { useLanguage } from '@/contexts/LanguageContext';

interface Props {
  state: DemoState;
  setState: (s: Partial<DemoState>) => void;
}

const getContent = (language: string) => {
  const content = {
    en: {
      title: "Choose how they sound",
      preview: "Live preview",
      groups: {
        warmth: 'Warmth',
        formality: 'Formality', 
        energy: 'Energy',
        pace: 'Pace'
      },
      options: {
        warmth: { 'Gentle': 'Gentle', 'Balanced': 'Balanced', 'Direct': 'Direct' },
        formality: { 'Casual': 'Casual', 'Neutral': 'Neutral', 'Polite': 'Polite' },
        energy: { 'Calm': 'Calm', 'Balanced': 'Balanced', 'Lively': 'Lively' },
        pace: { 'Slow': 'Slow', 'Normal': 'Normal', 'Fast': 'Fast' }
      }
    },
    'pt-BR': {
      title: "Escolha como eles soam",
      preview: "Visualização ao vivo",
      groups: {
        warmth: 'Carinho',
        formality: 'Formalidade',
        energy: 'Energia', 
        pace: 'Ritmo'
      },
      options: {
        warmth: { 'Gentle': 'Carinhoso', 'Balanced': 'Equilibrado', 'Direct': 'Direto' },
        formality: { 'Casual': 'Casual', 'Neutral': 'Neutro', 'Polite': 'Educado' },
        energy: { 'Calm': 'Calmo', 'Balanced': 'Equilibrado', 'Lively': 'Animado' },
        pace: { 'Slow': 'Devagar', 'Normal': 'Normal', 'Fast': 'Rápido' }
      }
    },
    es: {
      title: "Elige cómo suenan",
      preview: "Vista previa en vivo",
      groups: {
        warmth: 'Calidez',
        formality: 'Formalidad',
        energy: 'Energía',
        pace: 'Ritmo'
      },
      options: {
        warmth: { 'Gentle': 'Gentil', 'Balanced': 'Equilibrado', 'Direct': 'Directo' },
        formality: { 'Casual': 'Casual', 'Neutral': 'Neutral', 'Polite': 'Cortés' },
        energy: { 'Calm': 'Calmado', 'Balanced': 'Equilibrado', 'Lively': 'Enérgico' },
        pace: { 'Slow': 'Lento', 'Normal': 'Normal', 'Fast': 'Rápido' }
      }
    }
  };
  return content[language as keyof typeof content] || content.en;
};

const groups: { key: keyof DemoState['style']; options: string[] }[] = [
  { key: 'warmth', options: ['Gentle','Balanced','Direct'] },
  { key: 'formality', options: ['Casual','Neutral','Polite'] },
  { key: 'energy', options: ['Calm','Balanced','Lively'] },
  { key: 'pace', options: ['Slow','Normal','Fast'] },
];

export const StepStyle: React.FC<Props> = ({ state, setState }) => {
  const { currentLanguage } = useLanguage();
  const content = getContent(currentLanguage);
  const { primary } = generatePreviewText(state, currentLanguage);

  return (
    <div className="space-y-6">
      <div className="text-center space-y-2">
        <h3 className="text-2xl md:text-3xl font-serif">{content.title}</h3>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {groups.map((g) => (
          <Card key={g.key as string} className="p-4 space-y-3">
            <div className="text-sm font-medium">{content.groups[g.key]}</div>
            <div className="flex gap-2 flex-wrap">
              {g.options.map((opt) => {
                const active = state.style[g.key] === opt;
                return (
                  <Button
                    key={opt}
                    size="sm"
                    variant={active ? 'default' : 'outline'}
                    onClick={() => setState({ style: { ...state.style, [g.key]: opt as any } })}
                    aria-pressed={active}
                    className="rounded-full"
                  >
                    {content.options[g.key][opt as keyof typeof content.options[typeof g.key]]}
                  </Button>
                );
              })}
            </div>
          </Card>
        ))}
      </div>

      <Card className="p-4">
        <div className="text-sm text-muted-foreground mb-2">{content.preview}</div>
        <p className="text-base md:text-lg">{primary}</p>
      </Card>
    </div>
  );
};
