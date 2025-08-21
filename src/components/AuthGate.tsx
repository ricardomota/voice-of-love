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
import { Auth } from '@/pages/Auth';
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
      } = type === 'signin' ? await signIn(email, password) : await signUp(email, password, currentLanguage);
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
    highlight.style.top = `-${100 + rotateY * 20}px`;
    highlight.style.right = `-${100 - rotateX * 20}px`;
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
    return <Auth language={currentLanguage} />;
  }
  
  return (
    <>
      {children}
      {/* Profile Setup Modal for new users */}
      <ProfileSetupModal isOpen={showProfileSetup} onComplete={handleProfileSetupComplete} />
    </>
  );
});