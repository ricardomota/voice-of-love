import React from 'react';
import { Settings, Logout, User, Help, Information } from '@carbon/icons-react';
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
  DropdownMenuLabel,
} from '@/components/ui/dropdown-menu';
import { useLanguage } from '@/hooks/useLanguage';
import { Link } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';

interface EternaHeaderProps {
  onSettingsClick?: () => void;
}

const getContent = (language: string) => {
  const content = {
    en: {
      account: "Account",
      profile: "Profile",
      settings: "Settings", 
      help: "Help & Support",
      about: "About",
      signOut: "Sign out"
    },
    'pt-BR': {
      account: "Conta",
      profile: "Perfil",
      settings: "Configurações",
      help: "Ajuda e Suporte",
      about: "Sobre",
      signOut: "Sair"
    },
    es: {
      account: "Cuenta",
      profile: "Perfil", 
      settings: "Configuración",
      help: "Ayuda y Soporte",
      about: "Acerca de",
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
  const { toast } = useToast();

  const handleSignOut = async () => {
    try {
      await signOut();
      toast({
        title: "Logout realizado com sucesso",
        description: "Você foi desconectado da sua conta.",
      });
    } catch (error) {
      toast({
        title: "Erro ao fazer logout",
        description: "Tente novamente.",
        variant: "destructive"
      });
    }
  };

  return (
    <header className="fixed top-0 z-50 w-full border-b border-border backdrop-blur-xl bg-background/80">
      <div className="container flex h-16 items-center justify-between px-4">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-3" aria-label="Voltar à página inicial">
          <img 
            src="/lovable-uploads/2a9a0f83-672d-4d8e-9eda-ef4653426daf.png" 
            alt="Eterna Logo" 
            className="h-6 w-auto"
          />
        </Link>

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
              <DropdownMenuContent align="end" className="w-56 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
                <DropdownMenuLabel className="font-normal">
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium leading-none">{content.account}</p>
                    <p className="text-xs leading-none text-muted-foreground">
                      {user.email}
                    </p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                
                <DropdownMenuItem className="flex items-center gap-2 cursor-pointer">
                  <User size={16} />
                  {content.profile}
                </DropdownMenuItem>
                
                <DropdownMenuItem 
                  onClick={onSettingsClick}
                  className="flex items-center gap-2 cursor-pointer"
                >
                  <Settings size={16} />
                  {content.settings}
                </DropdownMenuItem>
                
                <DropdownMenuSeparator />
                
                <DropdownMenuItem className="flex items-center gap-2 cursor-pointer">
                  <Help size={16} />
                  {content.help}
                </DropdownMenuItem>
                
                <DropdownMenuItem className="flex items-center gap-2 cursor-pointer">
                  <Information size={16} />
                  {content.about}
                </DropdownMenuItem>
                
                <DropdownMenuSeparator />
                
                <DropdownMenuItem 
                  onClick={handleSignOut}
                  className="flex items-center gap-2 text-destructive cursor-pointer focus:text-destructive"
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