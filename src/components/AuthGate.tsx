import { useState, useMemo, memo, useCallback, useRef } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { InputWithVoice } from '@/components/ui/input-with-voice';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Loader2, ArrowLeft, Heart, User } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '@/hooks/useLanguage';
import { ProfileSetupModal } from '@/components/ProfileSetupModal';
interface AuthGateProps {
  children: React.ReactNode;
}
// Memoized content getter to prevent recalculating on every render
const getContent = (language: string) => {
  const content = {
    en: {
      welcome: "Welcome to Eterna",
      subtitle: "Join us to preserve memories with security and simplicity",
      features: ["• Create unique voices and stories", "• Chat in real-time and save precious memories", "• Access from any device, anywhere"],
      signin: "Sign In",
      signup: "Sign Up",
      email: "Email",
      password: "Password",
      createAccount: "Create Account",
      backToHome: "Back to Home",
      story: {
        title: "Why I Created Eterna",
        text: "I created Eterna after witnessing my mother's journey with Alzheimer's. I realized how fragile our memories can be, and how easily the voices, stories, and essence of those we love can fade. Eterna was born from the desire to preserve these traces, so that future generations can not only remember, but also feel connected to the people who shaped their lives.",
        heart: "❤️"
      },
      errors: {
        fillFields: "Please fill in email and password",
        error: "Error"
      },
      success: {
        title: "Success!",
        accountCreated: "Account created! Check your email to confirm."
      }
    },
    'pt-BR': {
      welcome: "Bem-vindo ao Eterna",
      subtitle: "Entre para preservar memórias preciosas com segurança e simplicidade",
      features: ["• Crie vozes e histórias únicas", "• Converse em tempo real e salve memórias especiais", "• Acesse de qualquer dispositivo, em qualquer lugar"],
      signin: "Entrar",
      signup: "Cadastrar",
      email: "Email",
      password: "Senha",
      createAccount: "Criar Conta",
      backToHome: "Voltar ao Início",
      story: {
        title: "Por que Criei o Eterna",
        text: "Criei o Eterna após testemunhar a jornada da minha mãe com o Alzheimer. Percebi como nossas memórias podem ser frágeis, e como facilmente as vozes, histórias e essência daqueles que amamos podem desvanecer. O Eterna nasceu do desejo de preservar esses vestígios, para que as futuras gerações possam não apenas lembrar, mas também se sentir conectadas às pessoas que moldaram suas vidas.",
        heart: "❤️"
      },
      errors: {
        fillFields: "Por favor, preencha email e senha",
        error: "Erro"
      },
      success: {
        title: "Sucesso!",
        accountCreated: "Conta criada com sucesso! Verifique seu email para confirmar."
      }
    },
    es: {
      welcome: "Bienvenido a Eterna",
      subtitle: "Únete para preservar memorias con seguridad y simplicidad",
      features: ["• Crea voces e historias únicas", "• Conversa en tiempo real y guarda memorias", "• Accede desde cualquier dispositivo"],
      signin: "Iniciar Sesión",
      signup: "Registrarse",
      email: "Email",
      password: "Contraseña",
      createAccount: "Crear Cuenta",
      backToHome: "Volver al Inicio",
      story: {
        title: "Por qué Creé Eterna",
        text: "Creé Eterna después de presenciar el viaje de mi madre con el Alzheimer. Me di cuenta de lo frágiles que pueden ser nuestros recuerdos, y con qué facilidad pueden desvanecerse las voces, historias y esencia de quienes amamos. Eterna nació del deseo de preservar estos vestigios, para que las futuras generaciones puedan no solo recordar, sino también sentirse conectadas con las personas que moldearon sus vidas.",
        heart: "❤️"
      },
      errors: {
        fillFields: "Por favor, completa email y contraseña",
        error: "Error"
      },
      success: {
        title: "Éxito",
        accountCreated: "¡Cuenta creada! Verifica tu email para confirmar."
      }
    }
  };
  return content[language as keyof typeof content] || content.en;
};
// Memoized AuthGate component
export const AuthGate = memo(({
  children
}: AuthGateProps) => {
  const {
    user,
    loading,
    signIn,
    signUp
  } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showProfileSetup, setShowProfileSetup] = useState(false);
  
  // Apple TV card animation state
  const cardRef = useRef<HTMLDivElement>(null);
  const highlightRef = useRef<HTMLDivElement>(null);
  const [isCardTransitioning, setIsCardTransitioning] = useState(false);
  const {
    toast
  } = useToast();
  const navigate = useNavigate();
  const {
    currentLanguage
  } = useLanguage();
  
  // Memoize content to prevent recalculation
  const content = useMemo(() => getContent(currentLanguage), [currentLanguage]);

  // Memoized auth handler to prevent recreation on every render - MOVED OUTSIDE CONDITIONAL
  const handleAuth = useCallback(async (type: 'signin' | 'signup') => {
    if (!email || !password) {
      toast({
        title: content.errors.error,
        description: content.errors.fillFields,
        variant: "destructive"
      });
      return;
    }
    setIsLoading(true);
    try {
      const {
        error
      } = type === 'signin' ? await signIn(email, password) : await signUp(email, password);
      if (error) throw error;
      if (type === 'signup') {
        toast({
          title: content.success.title,
          description: content.success.accountCreated
        });
        // Show profile setup modal after successful signup
        setShowProfileSetup(true);
      } else {
        navigate('/auth');
      }
    } catch (error: any) {
      toast({
        title: content.errors.error,
        description: error.message,
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
   }, [email, password, content, toast, signIn, signUp, navigate]);
   
   // Apple TV card animation handlers
   const handleCardMouseEnter = useCallback(() => {
     setIsCardTransitioning(true);
     setTimeout(() => setIsCardTransitioning(false), 250);
   }, []);

   const handleCardMouseMove = useCallback((event: React.MouseEvent<HTMLDivElement>) => {
     if (!cardRef.current || !highlightRef.current) return;
     
     const card = cardRef.current;
     const highlight = highlightRef.current;
     const rect = card.getBoundingClientRect();
     
     const x = event.clientX - rect.left;
     const y = event.clientY - rect.top;
     const cardWidth = card.offsetWidth;
     const cardHeight = card.offsetHeight;
     const rotationLimit = 8;
     const middleX = cardWidth / 2;
     const middleY = cardHeight / 2;
     
     const rotateX = (x - middleX) * (rotationLimit / middleX);
     const rotateY = (middleY - y) * (rotationLimit / middleY);
     
     card.style.transform = `perspective(1200px) rotateX(${rotateY}deg) rotateY(${rotateX}deg) translateZ(20px)`;
     highlight.style.top = `-${100 + (rotateY * 20)}px`;
     highlight.style.right = `-${100 - (rotateX * 20)}px`;
   }, []);

   const handleCardMouseLeave = useCallback(() => {
     if (!cardRef.current || !highlightRef.current) return;
     
     setIsCardTransitioning(true);
     setTimeout(() => {
       if (cardRef.current && highlightRef.current) {
         cardRef.current.style.transform = '';
         highlightRef.current.style.top = '';
         highlightRef.current.style.right = '';
       }
     }, 250);
     setTimeout(() => setIsCardTransitioning(false), 500);
   }, []);
   
  const handleProfileSetupComplete = () => {
    setShowProfileSetup(false);
    // Don't navigate anywhere, let the user stay on the current page
    // They will be redirected by the auth state change
  };
  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>;
  }
  if (!user) {
    return <main className="min-h-screen bg-background px-4">
        {/* Back Button */}
        <div className="pt-6 pb-4">
          <Button variant="ghost" size="sm" onClick={() => window.location.href = '/'} className="flex items-center gap-2 text-muted-foreground hover:text-foreground">
            <ArrowLeft className="h-4 w-4" />
            {content.backToHome}
          </Button>
        </div>

        <div className="max-w-6xl mx-auto grid lg:grid-cols-2 gap-8 sm:gap-12 lg:gap-16 xl:gap-20 items-start px-4 sm:px-6 lg:px-8 pt-12 sm:pt-16 lg:pt-20 pb-8 sm:pb-12 lg:pb-16">
          {/* Left side - Introduction & Story */}
          <section className="space-y-8" aria-label="Introdução">
            <div>
              <h1 className="text-4xl font-bold tracking-tight mb-4">{content.welcome}</h1>
              <p className="text-muted-foreground mb-8">{content.subtitle}</p>
              <ul className="space-y-3 text-sm text-muted-foreground">
                {content.features.map((feature, index) => <li key={index}>{feature}</li>)}
              </ul>
            </div>

            {/* Apple TV Style Interactive Story Card */}
            <div 
              ref={cardRef}
              className={`
                relative w-full bg-gradient-to-br from-amber-50/95 via-orange-50/90 to-rose-50/85 
                backdrop-blur-md border-4 border-amber-200/60 rounded-2xl overflow-hidden cursor-pointer
                shadow-[0_8px_32px_rgba(251,146,60,0.25)] hover:shadow-[0_16px_64px_rgba(251,146,60,0.35)]
                transform-gpu will-change-transform group
                ${isCardTransitioning ? 'transition-all duration-500 ease-out' : ''}
              `}
              style={{ 
                transformStyle: 'preserve-3d',
                filter: 'drop-shadow(0 8px 16px rgba(0,0,0,0.25))'
              }}
              onMouseEnter={handleCardMouseEnter}
              onMouseMove={handleCardMouseMove}
              onMouseLeave={handleCardMouseLeave}
            >
              
              {/* Shimmer/Shine Effect */}
              <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700">
                <div 
                  className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent 
                  animate-[shimmer_2s_ease-in-out_infinite] transform -skew-x-12"
                  style={{
                    background: 'linear-gradient(110deg, transparent 25%, rgba(255,255,255,0.4) 50%, transparent 75%)',
                    animation: 'shimmer 3s ease-in-out infinite'
                  }}
                />
              </div>

              {/* Moving highlight overlay */}
              <div 
                ref={highlightRef}
                className="absolute -top-24 -right-24 w-96 h-96 bg-white rounded-full opacity-25 blur-[50px] pointer-events-none z-10"
                style={{ 
                  top: '-100px', 
                  right: '-100px',
                  transition: isCardTransitioning ? 'all 0.5s ease-out' : 'none'
                }}
              />
              
              {/* Card content */}
              <div className="relative p-8 z-20">
                <div className="flex items-center gap-4 mb-6">
                  <div className="flex items-center gap-3">
                    <img 
                      src="/lovable-uploads/2cade104-d8aa-4b3b-bbc1-10cb24bf11b3.png" 
                      alt="Family portrait"
                      className="w-16 h-16 rounded-full object-cover shadow-lg"
                    />
                    <div className="p-3 bg-gradient-to-br from-primary/20 to-primary/10 rounded-full">
                      <Heart className="h-6 w-6 text-primary" />
                    </div>
                  </div>
                  <h3 className="text-xl font-bold bg-gradient-to-r from-amber-800 to-rose-700 bg-clip-text text-transparent">
                    {content.story.title}
                  </h3>
                </div>
                <p className="text-muted-foreground leading-relaxed mb-6 text-base">
                  {content.story.text}
                </p>
                <div className="flex items-center gap-3 text-primary">
                  <span className="text-2xl">{content.story.heart}</span>
                  <span className="text-sm font-medium opacity-80">Made with love</span>
                </div>
              </div>
            </div>
          </section>

          {/* Right side - Authentication */}
          <section aria-label="Autenticação" className="lg:pt-12">
            <Card className="w-full max-w-md shadow-xl mx-auto border-2 border-primary/20">
              <CardHeader className="text-center space-y-4">
                <div className="flex flex-col items-center gap-3">
                  <div className="p-3 bg-primary/10 rounded-full">
                    <User className="h-8 w-8 text-primary" />
                  </div>
                  <CardTitle className="text-2xl font-bold bg-gradient-to-r from-foreground to-foreground/80 bg-clip-text">Eterna</CardTitle>
                </div>
                <p className="text-sm text-muted-foreground">{content.subtitle}</p>
              </CardHeader>
              <CardContent>
                <Tabs defaultValue="signin" className="w-full">
                  <TabsList className="grid w-full grid-cols-2 mb-6">
                    <TabsTrigger value="signin" className="text-sm">{content.signin}</TabsTrigger>
                    <TabsTrigger value="signup" className="text-sm">{content.signup}</TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="signin" className="space-y-4">
                    <div className="space-y-3">
                      <InputWithVoice type="email" placeholder={content.email} value={email} onChange={e => setEmail(e.target.value)} className="h-12" />
                      <InputWithVoice type="password" placeholder={content.password} value={password} onChange={e => setPassword(e.target.value)} className="h-12" />
                    </div>
                    <Button className="w-full h-12 font-medium bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 shadow-lg hover:shadow-xl transition-all" onClick={() => handleAuth('signin')} disabled={isLoading}>
                      {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                      {content.signin}
                    </Button>
                  </TabsContent>
                  
                  <TabsContent value="signup" className="space-y-4">
                    <div className="space-y-3">
                      <InputWithVoice type="email" placeholder={content.email} value={email} onChange={e => setEmail(e.target.value)} className="h-12" />
                      <InputWithVoice type="password" placeholder={content.password} value={password} onChange={e => setPassword(e.target.value)} className="h-12" />
                    </div>
                    <Button className="w-full h-12 font-medium bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 shadow-lg hover:shadow-xl transition-all" onClick={() => handleAuth('signup')} disabled={isLoading}>
                      {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                      {content.createAccount}
                    </Button>
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          </section>
        </div>
      </main>;
  }
  return (
    <>
      {children}
      {/* Profile Setup Modal for new users */}
      <ProfileSetupModal 
        isOpen={showProfileSetup} 
        onComplete={handleProfileSetupComplete} 
      />
    </>
  );
});