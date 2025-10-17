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
      <div className="inline-flex items-center gap-2 px-4 py-2.5 sm:gap-3 sm:px-6 md:px-8 sm:py-3 md:py-4 bg-[#FDE7E9] dark:bg-[#FEA8BF]/10 border border-[#FEA8BF]/30 dark:border-[#FEA8BF]/20 rounded-full shadow-sm max-w-full">
        <Info className="h-4 w-4 sm:h-5 sm:w-5 text-[#FEA8BF] flex-shrink-0" />
        <span className="text-sm sm:text-base font-medium text-[#FEA8BF] text-center leading-tight">
          {text.text}
        </span>
      </div>
    </div>
  );
};