import { useState, useMemo, memo, useCallback } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { InputWithVoice } from '@/components/ui/input-with-voice';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Loader2, ArrowLeft } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '@/hooks/useLanguage';
import { ProfileSetupModal } from '@/components/ProfileSetupModal';
import { motion } from 'framer-motion';
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
        subtitle: "A Personal Journey",
        paragraphs: [
          "When my grandmother passed away, I realized that while we preserve photos and videos, we lose something irreplaceable—their voice, their wisdom, their unique way of seeing the world.",
          "I spent countless nights wondering: What if technology could help us preserve not just memories, but the essence of who someone is? What if we could have one more conversation?",
          "Eterna was born from this deeply personal need—to create a bridge between memory and presence, allowing love to transcend time itself."
        ],
        conclusion: "Every conversation on Eterna is a testament to the enduring power of human connection.",
        founder: "— Riley Chen, Founder"
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
        subtitle: "Uma Jornada Pessoal",
        paragraphs: [
          "Quando minha avó faleceu, percebi que embora preservemos fotos e vídeos, perdemos algo insubstituível—sua voz, sua sabedoria, seu jeito único de ver o mundo.",
          "Passei inúmeras noites me perguntando: E se a tecnologia pudesse nos ajudar a preservar não apenas memórias, mas a essência de quem alguém é? E se pudéssemos ter mais uma conversa?",
          "A Eterna nasceu dessa necessidade profundamente pessoal—criar uma ponte entre memória e presença, permitindo que o amor transcenda o próprio tempo."
        ],
        conclusion: "Cada conversa na Eterna é um testemunho do poder duradouro da conexão humana.",
        founder: "— Riley Chen, Fundadora"
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
        subtitle: "Un Viaje Personal",
        paragraphs: [
          "Cuando mi abuela falleció, me di cuenta de que aunque preservamos fotos y videos, perdemos algo irreemplazable: su voz, su sabiduría, su forma única de ver el mundo.",
          "Pasé incontables noches preguntándome: ¿Y si la tecnología pudiera ayudarnos a preservar no solo recuerdos, sino la esencia de quien es alguien? ¿Y si pudiéramos tener una conversación más?",
          "Eterna nació de esta necesidad profundamente personal: crear un puente entre la memoria y la presencia, permitiendo que el amor trascienda el tiempo mismo."
        ],
        conclusion: "Cada conversación en Eterna es un testimonio del poder duradero de la conexión humana.",
        founder: "— Riley Chen, Fundadora"
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
    return <main className="min-h-screen bg-background">
        {/* Back Button */}
        <div className="pt-6 pb-4 px-4">
          <Button variant="ghost" size="sm" onClick={() => window.location.href = '/'} className="flex items-center gap-2 text-muted-foreground hover:text-foreground">
            <ArrowLeft className="h-4 w-4" />
            {content.backToHome}
          </Button>
        </div>

        <div className="grid lg:grid-cols-2 min-h-[calc(100vh-6rem)]">
          {/* Left side - Netflix/Apple TV Style Story Section */}
          <section className="relative overflow-hidden">
            {/* Dark background with gradient */}
            <div className="absolute inset-0 bg-gradient-to-br from-gray-950 via-gray-900 to-black" />
            
            {/* Ambient lighting effect */}
            <div className="absolute inset-0 bg-gradient-radial from-primary/10 via-transparent to-transparent opacity-30" />
            
            {/* Subtle grain texture overlay */}
            <div className="absolute inset-0 opacity-20" style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='1' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
            }} />
            
            <div className="relative z-10 flex flex-col justify-center h-full px-8 lg:px-12 py-16">
              <motion.div
                initial={{ opacity: 0, y: 60 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, ease: "easeOut" }}
                className="space-y-8"
              >
                {/* Subtitle */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.2 }}
                  className="mb-6"
                >
                  <span className="inline-block px-4 py-2 rounded-full border border-white/20 bg-white/5 backdrop-blur-sm text-white/80 text-sm font-medium tracking-wide uppercase">
                    {content.story.subtitle}
                  </span>
                </motion.div>

                {/* Main title */}
                <motion.h1
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: 0.4 }}
                  className="text-4xl md:text-5xl lg:text-6xl font-serif text-white leading-tight tracking-tight mb-8"
                >
                  {content.story.title}
                </motion.h1>

                {/* Story content */}
                <div className="space-y-6 max-w-2xl">
                  {content.story.paragraphs.map((paragraph, index) => (
                    <motion.p
                      key={index}
                      initial={{ opacity: 0, y: 40 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.8, delay: 0.6 + (index * 0.2) }}
                      className="text-lg md:text-xl text-white/90 leading-relaxed font-light"
                    >
                      {paragraph}
                    </motion.p>
                  ))}

                  {/* Conclusion */}
                  <motion.div
                    initial={{ opacity: 0, y: 40 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 1.4 }}
                    className="mt-12 pt-8 border-t border-white/10"
                  >
                    <p className="text-xl text-white/95 leading-relaxed mb-4 font-medium italic">
                      "{content.story.conclusion}"
                    </p>
                    <p className="text-sm text-white/70 font-light tracking-wider">
                      {content.story.founder}
                    </p>
                  </motion.div>
                </div>

                {/* Decorative elements */}
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 1.2, delay: 0.8 }}
                  className="absolute top-1/4 left-4 w-1 h-24 bg-gradient-to-b from-primary/30 to-transparent rounded-full"
                />
              </motion.div>
            </div>
          </section>

          {/* Right side - Authentication */}
          <section className="flex items-center justify-center p-8 bg-background">
            <Card className="w-full max-w-md shadow-xl border-2 border-primary/20">
              <CardHeader className="text-center space-y-2">
                <CardTitle className="text-2xl font-bold bg-gradient-to-r from-foreground to-foreground/80 bg-clip-text">Eterna</CardTitle>
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