import React from 'react';
import { Heart, Settings, LogOut } from 'lucide-react';
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
    <header className="fixed top-0 z-50 w-full border-0 border-b backdrop-blur-xl" style={{backgroundColor: '#F8F4E6', borderColor: '#E8E3C8'}}>
      <div className="container flex h-16 items-center justify-between px-4">
        {/* Logo */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{backgroundColor: '#441632'}}>
            <Heart className="w-5 h-5 fill-current" style={{color: '#FDFBCB'}} />
          </div>
          <div className="flex flex-col">
            <h1 className="text-xl font-zilla font-medium italic tracking-tight" style={{color: '#441632'}}>Eterna</h1>
            <p className="text-xs font-work" style={{color: '#331122'}}>Preserving memories</p>
          </div>
        </div>

        {/* Right side actions */}
        <div className="flex items-center gap-2">
          <LanguageSelector />
          
          {user && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="hover-lift w-9 h-9 rounded-lg flex items-center justify-center" style={{backgroundColor: '#441632'}}>
                  <span className="text-sm font-semibold" style={{color: '#FDFBCB'}}>
                    {user.email?.[0]?.toUpperCase() || 'U'}
                  </span>
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48 glass-card border border-border/20">
                <div className="px-2 py-1.5 text-sm text-muted-foreground">
                  {user.email}
                </div>
                <DropdownMenuSeparator />
                <DropdownMenuItem 
                  onClick={onSettingsClick}
                  className="flex items-center gap-2"
                >
                  <Settings className="w-4 h-4" />
                  {content.settings}
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem 
                  onClick={() => signOut()}
                  className="flex items-center gap-2 text-destructive"
                >
                  <LogOut className="w-4 h-4" />
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