import React from 'react';
import { motion } from 'framer-motion';
import { Check } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

interface Props {
  currentStep: number;
  totalSteps: number;
  completedSteps: number[];
}

const getContent = (language: string) => {
  const content = {
    en: {
      steps: [
        'Relationship',
        'Personalization', 
        'Voice Style',
        'Topic',
        'Output',
        'Preview'
      ]
    },
    'pt-BR': {
      steps: [
        'Relacionamento',
        'Personalização',
        'Estilo de Voz', 
        'Tópico',
        'Saída',
        'Visualização'
      ]
    },
    es: {
      steps: [
        'Relación',
        'Personalización',
        'Estilo de Voz',
        'Tema', 
        'Salida',
        'Vista Previa'
      ]
    }
  };
  return content[language as keyof typeof content] || content.en;
};

export const StepProgress: React.FC<Props> = ({ currentStep, totalSteps, completedSteps }) => {
  const { currentLanguage } = useLanguage();
  const content = getContent(currentLanguage);

  return (
    <div className="flex items-center justify-between max-w-md mx-auto">
      {Array.from({ length: totalSteps }, (_, i) => {
        const stepNumber = i + 1;
        const isCompleted = completedSteps.includes(stepNumber);
        const isCurrent = stepNumber === currentStep;
        const isUpcoming = stepNumber > currentStep;
        
        return (
          <React.Fragment key={stepNumber}>
            <div className="flex flex-col items-center">
              <motion.div
                className={`
                  w-10 h-10 rounded-full flex items-center justify-center text-sm font-medium
                  transition-all duration-300 relative overflow-hidden
                  ${isCompleted 
                    ? 'bg-primary text-primary-foreground' 
                    : isCurrent 
                    ? 'bg-primary/20 text-primary ring-2 ring-primary' 
                    : 'bg-muted text-muted-foreground'
                  }
                `}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                {isCompleted ? (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ duration: 0.3 }}
                  >
                    <Check size={16} />
                  </motion.div>
                ) : (
                  stepNumber
                )}
                {isCurrent && (
                  <motion.div
                    className="absolute inset-0 bg-primary/30 rounded-full"
                    animate={{ scale: [1, 1.2, 1] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  />
                )}
              </motion.div>
              <span className={`
                text-xs mt-1 text-center max-w-[60px] leading-tight
                ${isCurrent ? 'text-primary font-medium' : 'text-muted-foreground'}
              `}>
                {content.steps[i]}
              </span>
            </div>
            {i < totalSteps - 1 && (
              <motion.div
                className={`
                  h-px flex-1 mx-2 transition-colors duration-300
                  ${isCompleted ? 'bg-primary' : 'bg-muted'}
                `}
                initial={{ scaleX: 0 }}
                animate={{ scaleX: isCompleted ? 1 : 0.3 }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
              />
            )}
          </React.Fragment>
        );
      })}
    </div>
  );
};