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
  { code: 'fr', name: 'Français', shortName: 'FR', flag: '🇫🇷' },
  { code: 'de', name: 'Deutsch', shortName: 'DE', flag: '🇩🇪' },
  { code: 'it', name: 'Italiano', shortName: 'IT', flag: '🇮🇹' },
  { code: 'ru', name: 'Русский', shortName: 'RU', flag: '🇷🇺' },
  { code: 'ja', name: '日本語', shortName: 'JP', flag: '🇯🇵' },
  { code: 'zh-CN', name: '简体中文', shortName: 'CN', flag: '🇨🇳' },
  { code: 'zh-TW', name: '繁體中文', shortName: 'TW', flag: '🇹🇼' },
  { code: 'ko', name: '한국어', shortName: 'KO', flag: '🇰🇷' },
  { code: 'ar', name: 'العربية', shortName: 'AR', flag: '🇸🇦' },
  { code: 'hi', name: 'हिन्दी', shortName: 'HI', flag: '🇮🇳' },
  { code: 'nl', name: 'Nederlands', shortName: 'NL', flag: '🇳🇱' },
  { code: 'sv', name: 'Svenska', shortName: 'SV', flag: '🇸🇪' },
  { code: 'no', name: 'Norsk', shortName: 'NO', flag: '🇳🇴' },
  { code: 'da', name: 'Dansk', shortName: 'DA', flag: '🇩🇰' },
  { code: 'fi', name: 'Suomi', shortName: 'FI', flag: '🇫🇮' },
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
      <DropdownMenuContent align="end" className="w-56 max-h-80 overflow-y-auto">
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