import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { DemoState, Warmth, Formality, Energy, Pace } from '../types';
import { generatePreviewText } from '../generator';
import { useLanguage } from '@/contexts/LanguageContext';
import { motion, AnimatePresence } from 'framer-motion';
import { Volume2 } from 'lucide-react';

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
  const [previewKey, setPreviewKey] = useState(0);
  const { primary } = generatePreviewText(state, currentLanguage);

  // Update preview when style changes
  useEffect(() => {
    setPreviewKey(prev => prev + 1);
  }, [state.style]);

  return (
    <div className="space-y-6">
      <div className="text-center space-y-2">
        <h3 className="text-2xl md:text-3xl font-serif">{content.title}</h3>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {groups.map((g, groupIndex) => (
          <motion.div
            key={g.key as string}
            initial={{ opacity: 0, x: groupIndex % 2 === 0 ? -20 : 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4, delay: groupIndex * 0.1 }}
          >
            <Card className="p-4 space-y-3 hover:shadow-md transition-shadow duration-300">
              <div className="text-sm font-medium text-primary">{content.groups[g.key]}</div>
              <div className="flex gap-2 flex-wrap">
                {g.options.map((opt) => {
                  const active = state.style[g.key] === opt;
                  return (
                    <motion.div
                      key={opt}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <Button
                        size="sm"
                        variant={active ? 'default' : 'outline'}
                        onClick={() => setState({ style: { ...state.style, [g.key]: opt as any } })}
                        aria-pressed={active}
                        className={`
                          rounded-full transition-all duration-300
                          ${active ? 'shadow-lg scale-105' : 'hover:bg-primary/10'}
                        `}
                      >
                        {content.options[g.key][opt as keyof typeof content.options[typeof g.key]]}
                      </Button>
                    </motion.div>
                  );
                })}
              </div>
            </Card>
          </motion.div>
        ))}
      </div>

      <Card className="p-4 relative overflow-hidden">
        <div className="flex items-center justify-between mb-3">
          <div className="text-sm text-muted-foreground">{content.preview}</div>
          <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
            <Volume2 size={16} />
          </Button>
        </div>
        <AnimatePresence mode="wait">
          <motion.div
            key={previewKey}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3 }}
            className="relative"
          >
            <p className="text-base md:text-lg leading-relaxed">{primary}</p>
            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-primary/20 to-transparent rounded"
              initial={{ x: '-100%' }}
              animate={{ x: '100%' }}
              transition={{ duration: 1.5, ease: "easeInOut" }}
            />
          </motion.div>
        </AnimatePresence>
      </Card>
    </div>
  );
};
