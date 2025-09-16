import React, { useState, useEffect } from 'react';
import { Settings, LogOut, User, HelpCircle, Globe, Menu, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
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
} from '@/components/ui/dropdown-menu';
import { useLanguage, type Language as LanguageType } from '@/hooks/useLanguage';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import { ProfileModal } from '@/components/ProfileModal';
import { CreditCounter } from '@/components/ui/credit-counter';
import { motion, AnimatePresence } from 'framer-motion';

interface ModernHeaderProps {
  onSettingsClick?: () => void;
}

const getContent = (language: string) => {
  const content = {
    en: {
      account: "Account",
      profile: "Profile",
      settings: "Settings", 
      help: "Help & Support",
      language: "Language",
      signOut: "Sign out",
      menu: "Menu",
      howItWorks: "How it Works",
      pricing: "Pricing",
      signIn: "Sign In",
      startFree: "Get Started"
    },
    'pt-BR': {
      account: "Conta",
      profile: "Perfil",
      settings: "Configurações",
      help: "Ajuda e Suporte",
      language: "Idioma",
      signOut: "Sair",
      menu: "Menu",
      howItWorks: "Como Funciona",
      pricing: "Preços",
      signIn: "Entrar", 
      startFree: "Começar"
    },
    es: {
      account: "Cuenta",
      profile: "Perfil", 
      settings: "Configuración",
      help: "Ayuda y Soporte",
      language: "Idioma",
      signOut: "Cerrar sesión",
      menu: "Menú",
      howItWorks: "Cómo Funciona",
      pricing: "Precios",
      signIn: "Iniciar Sesión",
      startFree: "Empezar"
    },
    fr: {
      account: "Compte",
      profile: "Profil", 
      settings: "Paramètres",
      help: "Aide et Support",
      language: "Langue",
      signOut: "Se déconnecter",
      menu: "Menu",
      howItWorks: "Comment ça marche",
      pricing: "Tarifs",
      signIn: "Se connecter",
      startFree: "Commencer"
    },
    de: {
      account: "Konto",
      profile: "Profil", 
      settings: "Einstellungen",
      help: "Hilfe & Support",
      language: "Sprache",
      signOut: "Abmelden",
      menu: "Menü",
      howItWorks: "Wie es funktioniert",
      pricing: "Preise",
      signIn: "Anmelden",
      startFree: "Loslegen"
    },
    'zh-CN': {
      account: "账户",
      profile: "个人资料", 
      settings: "设置",
      help: "帮助与支持",
      language: "语言",
      signOut: "退出",
      menu: "菜单",
      howItWorks: "工作原理",
      pricing: "价格",
      signIn: "登录",
      startFree: "开始使用"
    }
  };

  return content[language as keyof typeof content] || content.en;
};

export const ModernHeader: React.FC<ModernHeaderProps> = ({
  onSettingsClick
}) => {
  const { user, signOut } = useAuth();
  const { profile, loading: profileLoading } = useProfile();
  const { currentLanguage, setLanguage } = useLanguage();
  const content = getContent(currentLanguage);
  const { toast } = useToast();
  const navigate = useNavigate();
  const location = useLocation();
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const languageOptions: { code: LanguageType; label: string; flag: string }[] = [
    { code: 'en', label: 'English', flag: '🇺🇸' },
    { code: 'pt-BR', label: 'Português', flag: '🇧🇷' },
    { code: 'es', label: 'Español', flag: '🇪🇸' },
    { code: 'fr', label: 'Français', flag: '🇫🇷' },
    { code: 'de', label: 'Deutsch', flag: '🇩🇪' },
    { code: 'zh-CN', label: '简体中文', flag: '🇨🇳' }
  ];

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

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

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const handleHowItWorksClick = () => {
    if (location.pathname === '/') {
      const element = document.getElementById('how-it-works');
      element?.scrollIntoView({ behavior: 'smooth' });
    } else {
      navigate('/#how-it-works');
    }
  };

  const handlePricingClick = () => {
    if (location.pathname === '/') {
      const element = document.getElementById('pricing-section');
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      } else {
        navigate('/pricing');
      }
    } else {
      navigate('/pricing');
    }
  };

  const handleStartFreeClick = () => {
    navigate('/auth');
  };

  return (
    <>
      <motion.header 
        className={`fixed top-4 left-4 right-4 z-50 transition-all duration-300 ${
          isScrolled 
            ? 'bg-background/95 backdrop-blur-xl border border-border/50 shadow-lg' 
            : 'bg-background/80 backdrop-blur-sm border border-border/30'
        } rounded-2xl`}
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
      >
        <div className="container mx-auto flex h-16 items-center justify-between px-6">
          {/* Logo */}
          <Link to="/" className="flex items-center" aria-label="Voltar à página inicial">
            {/* Mobile Logo */}
            <img 
              src="/eterna-logo-mobile.svg" 
              alt="Eterna Logo" 
              className="h-6 w-auto md:hidden"
            />
            {/* Desktop Logo */}
            <img 
              src="/eterna-logo.svg" 
              alt="Eterna Logo" 
              className="h-6 w-auto hidden md:block"
            />
          </Link>

          {/* Desktop Navigation */}
          <div className="flex items-center gap-6">
            {/* Navigation Links for non-logged users */}
            {!user && (
              <>
                <nav className="hidden md:flex items-center gap-6">
                  <button 
                    onClick={handleHowItWorksClick}
                    className="text-foreground/80 hover:text-foreground transition-colors font-medium"
                  >
                    {content.howItWorks}
                  </button>
                  <button 
                    onClick={handlePricingClick}
                    className="text-foreground/80 hover:text-foreground transition-colors font-medium"
                  >
                    {content.pricing}
                  </button>
                  <Link 
                    to="/auth"
                    className="text-foreground/80 hover:text-foreground transition-colors font-medium"
                  >
                    {content.signIn}
                  </Link>
                </nav>
                
                <Button 
                  onClick={handleStartFreeClick}
                  className="hidden md:inline-flex bg-primary hover:bg-primary/90 text-primary-foreground px-6"
                >
                  {content.startFree}
                </Button>
              </>
            )}
            
            {/* Credit Counter for logged in users */}
            {user && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.2 }}
              >
                <CreditCounter />
              </motion.div>
            )}
            
            {/* Language Selector for non-logged users */}
            {!user && (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm" className="h-10 px-3 rounded-xl flex items-center gap-2">
                    <Globe className="h-4 w-4" />
                    <span className="text-sm font-medium">
                      {currentLanguage === 'pt-BR' ? 'PT' : 
                       currentLanguage === 'zh-CN' ? 'CN' : 
                       currentLanguage.toUpperCase()}
                    </span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-48 bg-background/95 backdrop-blur-xl border border-border/50">
                  {languageOptions.map((lang) => (
                    <DropdownMenuItem
                      key={lang.code}
                      onClick={() => setLanguage(lang.code)}
                      className={`flex items-center gap-3 cursor-pointer ${
                        currentLanguage === lang.code ? 'bg-muted' : ''
                      }`}
                    >
                      <span>{lang.flag}</span>
                      <span>{lang.label}</span>
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
            )}
            
            {/* User Menu */}
            {user && (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="h-10 w-10 p-0 rounded-xl overflow-hidden border border-border/30 hover:border-border/60">
                    {profile?.avatar_url ? (
                      <Avatar className="h-10 w-10">
                        <AvatarImage src={profile.avatar_url} alt="Profile" />
                        <AvatarFallback className="bg-primary text-primary-foreground">
                          {profile?.display_name?.[0]?.toUpperCase() || user.email?.[0]?.toUpperCase() || 'U'}
                        </AvatarFallback>
                      </Avatar>
                    ) : (
                      <div className="w-full h-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-medium">
                        {profile?.display_name?.[0]?.toUpperCase() || user.email?.[0]?.toUpperCase() || 'U'}
                      </div>
                    )}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-64 bg-background/95 backdrop-blur-xl border border-border/50">
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
                    className="flex items-center gap-3 cursor-pointer"
                  >
                    <User className="h-4 w-4" />
                    {content.profile}
                  </DropdownMenuItem>
                  
                  <DropdownMenuItem 
                    onClick={() => {
                      if (onSettingsClick) onSettingsClick();
                      else {
                        toast({
                          title: content.settings,
                          description: currentLanguage === 'pt-BR' ? 'Em breve.' : currentLanguage === 'es' ? 'Próximamente.' : 'Coming soon.'
                        });
                      }
                    }}
                    className="flex items-center gap-3 cursor-pointer"
                  >
                    <Settings className="h-4 w-4" />
                    {content.settings}
                  </DropdownMenuItem>
                  
                  <DropdownMenuSeparator />
                  
                  {/* Language in user menu */}
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <DropdownMenuItem className="flex items-center gap-3 cursor-pointer">
                        <Globe className="h-4 w-4" />
                        {content.language}
                      </DropdownMenuItem>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent side="left" className="bg-background/95 backdrop-blur-xl border border-border/50">
                      {languageOptions.map((lang) => (
                        <DropdownMenuItem
                          key={lang.code}
                          onClick={() => setLanguage(lang.code)}
                          className={`flex items-center gap-3 cursor-pointer ${
                            currentLanguage === lang.code ? 'bg-muted' : ''
                          }`}
                        >
                          <span>{lang.flag}</span>
                          <span>{lang.label}</span>
                        </DropdownMenuItem>
                      ))}
                    </DropdownMenuContent>
                  </DropdownMenu>
                  
                  <DropdownMenuItem 
                    className="flex items-center gap-3 cursor-pointer" 
                    onClick={() => toast({ 
                      title: content.help, 
                      description: currentLanguage === 'pt-BR' ? 'Em breve.' : currentLanguage === 'es' ? 'Próximamente.' : 'Coming soon.' 
                    })}
                  >
                    <HelpCircle className="h-4 w-4" />
                    {content.help}
                  </DropdownMenuItem>
                  
                  <DropdownMenuSeparator />
                  
                  <DropdownMenuItem 
                    onClick={handleSignOut}
                    className="flex items-center gap-3 text-destructive cursor-pointer focus:text-destructive"
                  >
                    <LogOut className="h-4 w-4" />
                    {content.signOut}
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <Button
              variant="ghost"
              size="sm"
              onClick={toggleMobileMenu}
              className="h-10 w-10 rounded-xl"
            >
              {isMobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
          </div>
        </div>
      </motion.header>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed top-24 left-4 right-4 z-40 md:hidden"
          >
            <div className="bg-background/95 backdrop-blur-xl border border-border/50 rounded-2xl p-6 shadow-lg">
              {user ? (
                <div className="space-y-4">
                  {/* User Info */}
                  <div className="flex items-center gap-3 pb-4 border-b border-border/50">
                    <div className="w-12 h-12 bg-primary text-primary-foreground rounded-xl flex items-center justify-center text-lg font-medium">
                      {profile?.display_name?.[0]?.toUpperCase() || user.email?.[0]?.toUpperCase() || 'U'}
                    </div>
                    <div>
                      <p className="font-medium">{profile?.display_name || content.account}</p>
                      <p className="text-sm text-muted-foreground">{user.email}</p>
                    </div>
                  </div>

                  {/* Credit Counter */}
                  <CreditCounter showDetails />

                  {/* Menu Items */}
                  <div className="space-y-2">
                    <Button
                      variant="ghost"
                      onClick={() => {
                        setShowProfileModal(true);
                        setIsMobileMenuOpen(false);
                      }}
                      className="w-full justify-start gap-3"
                    >
                      <User className="h-4 w-4" />
                      {content.profile}
                    </Button>
                    
                    <Button
                      variant="ghost"
                      onClick={() => {
                        if (onSettingsClick) onSettingsClick();
                        setIsMobileMenuOpen(false);
                      }}
                      className="w-full justify-start gap-3"
                    >
                      <Settings className="h-4 w-4" />
                      {content.settings}
                    </Button>
                    
                    <Button
                      variant="ghost"
                      onClick={() => {
                        toast({ title: content.help, description: 'Em breve.' });
                        setIsMobileMenuOpen(false);
                      }}
                      className="w-full justify-start gap-3"
                    >
                      <HelpCircle className="h-4 w-4" />
                      {content.help}
                    </Button>
                    
                    <Button
                      variant="ghost"
                      onClick={() => {
                        handleSignOut();
                        setIsMobileMenuOpen(false);
                      }}
                      className="w-full justify-start gap-3 text-destructive hover:text-destructive"
                    >
                      <LogOut className="h-4 w-4" />
                      {content.signOut}
                    </Button>
                  </div>

                    {/* Language Selection */}
                    <div className="pt-4 border-t border-border/50">
                      <p className="text-sm font-medium mb-2">{content.language}</p>
                      <div className="grid grid-cols-2 gap-2">
                        {languageOptions.map((lang) => (
                          <Button
                            key={lang.code}
                            variant={currentLanguage === lang.code ? "default" : "outline"}
                            size="sm"
                            onClick={() => {
                              setLanguage(lang.code);
                              setIsMobileMenuOpen(false);
                            }}
                            className="justify-start gap-2 text-xs"
                          >
                            <span>{lang.flag}</span>
                            <span className="truncate">{lang.label}</span>
                          </Button>
                        ))}
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {/* Navigation for non-logged users */}
                    <nav className="space-y-2">
                      <Button
                        variant="ghost"
                        onClick={() => {
                          handleHowItWorksClick();
                          setIsMobileMenuOpen(false);
                        }}
                        className="w-full justify-start"
                      >
                        {content.howItWorks}
                      </Button>
                      
                      <Button
                        variant="ghost"
                        onClick={() => {
                          handlePricingClick();
                          setIsMobileMenuOpen(false);
                        }}
                        className="w-full justify-start"
                      >
                        {content.pricing}
                      </Button>
                      
                      <Button
                        variant="ghost"
                        onClick={() => {
                          handleStartFreeClick();
                          setIsMobileMenuOpen(false);
                        }}
                        className="w-full justify-start"
                      >
                        {content.signIn}
                      </Button>
                    </nav>

                    {/* Language Selection for non-logged users */}
                    <div className="pt-4 border-t border-border/50">
                      <p className="text-sm font-medium mb-2">{content.language}</p>
                      <div className="grid grid-cols-2 gap-2">
                        {languageOptions.map((lang) => (
                          <Button
                            key={lang.code}
                            variant={currentLanguage === lang.code ? "default" : "outline"}
                            size="sm"
                            onClick={() => {
                              setLanguage(lang.code);
                              setIsMobileMenuOpen(false);
                            }}
                            className="justify-start gap-2 text-xs"
                          >
                            <span>{lang.flag}</span>
                            <span className="truncate">{lang.label}</span>
                          </Button>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      
      {/* Profile Modal */}
      <ProfileModal 
        isOpen={showProfileModal} 
        onClose={() => setShowProfileModal(false)} 
      />

      {/* Backdrop blur for mobile menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-background/80 backdrop-blur-sm z-30 md:hidden"
            onClick={() => setIsMobileMenuOpen(false)}
          />
        )}
      </AnimatePresence>
    </>
  );
};