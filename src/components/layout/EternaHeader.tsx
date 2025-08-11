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
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between px-4">
        {/* Logo */}
        <div className="flex items-center gap-2">
          <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-primary/10">
            <Heart className="w-6 h-6 text-primary fill-current" />
          </div>
          <div className="flex flex-col">
            <h1 className="text-xl font-bold tracking-tight">Eterna</h1>
            <p className="text-xs text-muted-foreground">Preserving memories</p>
          </div>
        </div>

        {/* Right side actions */}
        <div className="flex items-center gap-2">
          <LanguageSelector />
          
          {user && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="h-9 w-9">
                  <div className="w-7 h-7 rounded-full bg-primary/10 flex items-center justify-center">
                    <span className="text-sm font-medium text-primary">
                      {user.email?.[0]?.toUpperCase() || 'U'}
                    </span>
                  </div>
                </Button>
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