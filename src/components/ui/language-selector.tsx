import React from 'react';
import { Globe } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useLanguage } from '@/hooks/useLanguage';

const languages = [
  { code: 'en', name: 'English', shortName: 'EN', flag: '🇺🇸' },
  { code: 'pt-BR', name: 'Português', shortName: 'PT', flag: '🇧🇷' },
  { code: 'es', name: 'Español', shortName: 'ES', flag: '🇪🇸' },
];

export const LanguageSelector: React.FC = () => {
  const { currentLanguage, setLanguage, isLoading } = useLanguage();
  
  const currentLang = languages.find(lang => lang.code === currentLanguage) || languages[0];

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="sm" className="h-9 px-3 py-2" disabled={isLoading}>
          <span className="text-sm font-medium">{currentLang.shortName}</span>
          <span className="sr-only">Select language</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-48">
        {languages.map((language) => (
          <DropdownMenuItem
            key={language.code}
            onClick={() => setLanguage(language.code as any)}
            className="flex items-center gap-3 cursor-pointer"
          >
            <span className="text-lg">{language.flag}</span>
            <span className="flex-1">{language.name}</span>
            {currentLanguage === language.code && (
              <div className="w-2 h-2 rounded-full bg-primary"></div>
            )}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};