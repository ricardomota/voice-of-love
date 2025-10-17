import React from 'react';
import { Info } from 'lucide-react';
import { useLanguage } from '@/hooks/useLanguage';

export const BetaDisclaimer: React.FC = () => {
  const { currentLanguage } = useLanguage();
  
  const content = {
    en: {
      text: "Currently in beta - all features free during development"
    },
    'pt-BR': {
      text: "Atualmente em beta - todos os recursos gratuitos durante o desenvolvimento"
    }
  };

  const text = content[currentLanguage as keyof typeof content] || content.en;

  return (
    <div className="flex justify-center py-6 px-4 sm:py-8 sm:px-6">
      <div className="inline-flex items-center gap-2 px-4 py-2.5 sm:gap-3 sm:px-6 md:px-8 sm:py-3 md:py-4 bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-800 rounded-full shadow-sm max-w-full">
        <Info className="h-4 w-4 sm:h-5 sm:w-5 text-blue-600 dark:text-blue-400 flex-shrink-0" />
        <span className="text-sm sm:text-base font-medium text-blue-800 dark:text-blue-200 text-center leading-tight">
          {text.text}
        </span>
      </div>
    </div>
  );
};