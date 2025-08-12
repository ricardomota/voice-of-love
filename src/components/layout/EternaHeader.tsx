import React from 'react';
import { Settings, Logout } from '@carbon/icons-react';
import { Heart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { LanguageSelector } from '@/components/ui/language-selector';
import { useAuth } from '@/hooks/useAuth';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useLanguage } from '@/hooks/useLanguage';

interface EternaHeaderProps {
  onSettingsClick?: () => void;
}

const getContent = (language: string) => {
  const content = {
    en: {
      settings: "Settings",
      signOut: "Sign out"
    },
    'pt-BR': {
      settings: "Configurações",
      signOut: "Sair"
    },
    es: {
      settings: "Configuración", 
      signOut: "Cerrar sesión"
    }
  };

  return content[language as keyof typeof content] || content.en;
};

export const EternaHeader: React.FC<EternaHeaderProps> = ({
  onSettingsClick
}) => {
  const { user, signOut } = useAuth();
  const { currentLanguage } = useLanguage();
  const content = getContent(currentLanguage);

  return (
    <header className="fixed top-0 z-50 w-full border-b border-border backdrop-blur-xl bg-background/80">
      <div className="container flex h-16 items-center justify-between px-4">
        {/* Logo */}
        <div className="flex items-center gap-3">
          <div className="w-4 h-4 sm:w-5 sm:h-5 bg-gradient-to-br from-[#441632] to-[#331122] rounded-xl flex items-center justify-center shadow-lg">
            <Heart className="w-2 h-2 sm:w-2.5 sm:h-2.5 text-[#FDFBCB]" />
          </div>
          <span className="text-lg sm:text-xl font-semibold text-foreground">Eterna</span>
        </div>

        {/* Right side actions */}
        <div className="flex items-center gap-2">
          <LanguageSelector />
          
          {user && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="w-9 h-9 rounded-lg bg-foreground text-background flex items-center justify-center hover:bg-foreground/90 transition-colors">
                  <span className="text-sm font-semibold">
                    {user.email?.[0]?.toUpperCase() || 'U'}
                  </span>
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                <div className="px-2 py-1.5 text-sm text-muted-foreground">
                  {user.email}
                </div>
                <DropdownMenuSeparator />
                <DropdownMenuItem 
                  onClick={onSettingsClick}
                  className="flex items-center gap-2"
                >
                  <Settings size={16} />
                  {content.settings}
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem 
                  onClick={() => signOut()}
                  className="flex items-center gap-2 text-destructive"
                >
                  <Logout size={16} />
                  {content.signOut}
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>
      </div>
    </header>
  );
};