import React, { useState } from 'react';
import { Settings, Logout, User, Help, Information, Language } from '@carbon/icons-react';
import { Heart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { LanguageSelector } from '@/components/ui/language-selector';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { useAuth } from '@/hooks/useAuth';
import { useProfile } from '@/hooks/useProfile';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuLabel,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
} from '@/components/ui/dropdown-menu';
import { useLanguage, type Language as LanguageType } from '@/hooks/useLanguage';
import { Link } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import { ProfileModal } from '@/components/ProfileModal';

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
      language: "Language",
      signOut: "Sign out"
    },
    'pt-BR': {
      account: "Conta",
      profile: "Perfil",
      settings: "Configurações",
      help: "Ajuda e Suporte",
      about: "Sobre",
      language: "Idioma",
      signOut: "Sair"
    },
    es: {
      account: "Cuenta",
      profile: "Perfil", 
      settings: "Configuración",
      help: "Ayuda y Soporte",
      about: "Acerca de",
      language: "Idioma",
      signOut: "Cerrar sesión"
    }
  };

  return content[language as keyof typeof content] || content.en;
};

export const EternaHeader: React.FC<EternaHeaderProps> = ({
  onSettingsClick
}) => {
  const { user, signOut } = useAuth();
  const { profile, loading: profileLoading } = useProfile();
  const { currentLanguage, setLanguage } = useLanguage();
  const content = getContent(currentLanguage);
  const { toast } = useToast();
  const [showProfileModal, setShowProfileModal] = useState(false);

  // Add debugging
  console.log('EternaHeader - user:', !!user, 'profile:', !!profile, 'profileLoading:', profileLoading);

  const languageOptions: { code: LanguageType; label: string; flag: string }[] = [
    { code: 'en', label: 'English', flag: '🇺🇸' },
    { code: 'pt-BR', label: 'Português', flag: '🇧🇷' },
    { code: 'es', label: 'Español', flag: '🇪🇸' }
  ];

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
          {/* Only show standalone language selector when user is not logged in */}
          {!user && <LanguageSelector />}
          
          {user && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="w-9 h-9 rounded-lg bg-foreground text-background flex items-center justify-center hover:bg-foreground/90 transition-colors overflow-hidden">
                  {profile?.avatar_url ? (
                    <img 
                      src={profile.avatar_url} 
                      alt="Profile" 
                      className="w-full h-full object-cover rounded-lg"
                    />
                  ) : (
                    <span className="text-sm font-semibold">
                      {profile?.display_name?.[0]?.toUpperCase() || user.email?.[0]?.toUpperCase() || 'U'}
                    </span>
                  )}
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
                <DropdownMenuLabel className="font-normal">
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium leading-none">
                      {profile?.display_name || content.account}
                    </p>
                    <p className="text-xs leading-none text-muted-foreground">
                      {user.email}
                    </p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                
                <DropdownMenuItem 
                  onClick={() => setShowProfileModal(true)}
                  className="flex items-center gap-2 cursor-pointer"
                >
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
                
                <DropdownMenuSub>
                  <DropdownMenuSubTrigger className="flex items-center gap-2 cursor-pointer">
                    <Language size={16} />
                    {content.language}
                  </DropdownMenuSubTrigger>
                  <DropdownMenuSubContent>
                    {languageOptions.map((lang) => (
                      <DropdownMenuItem
                        key={lang.code}
                        onClick={() => setLanguage(lang.code)}
                        className={`flex items-center gap-2 cursor-pointer ${
                          currentLanguage === lang.code ? 'bg-muted' : ''
                        }`}
                      >
                        <span>{lang.flag}</span>
                        <span>{lang.label}</span>
                      </DropdownMenuItem>
                    ))}
                  </DropdownMenuSubContent>
                </DropdownMenuSub>
                
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
      
      {/* Profile Modal */}
      <ProfileModal 
        isOpen={showProfileModal} 
        onClose={() => setShowProfileModal(false)} 
      />
    </header>
  );
};