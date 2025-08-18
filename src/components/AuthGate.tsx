import { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { InputWithVoice } from '@/components/ui/input-with-voice';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Loader2, ArrowLeft, Heart } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '@/hooks/useLanguage';
interface AuthGateProps {
  children: React.ReactNode;
}
const getContent = (language: string) => {
  const content = {
    en: {
      welcome: "🌟 Welcome to Eterna",
      subtitle: "Join us to preserve memories with security and simplicity ✨",
      features: ["• 🎭 Create unique voices and stories", "• 💬 Chat in real-time and save precious memories", "• 📱 Access from any device, anywhere"],
      signin: "Sign In",
      signup: "Sign Up",
      email: "Email",
      password: "Password",
      createAccount: "Create Account",
      backToHome: "Back to Home",
      story: {
        title: "Why I Created Eterna",
        text: "I created Eterna after losing my grandmother to Alzheimer's. I realized that while we take thousands of photos, we rarely preserve the voices and stories of those we love. Eterna was born from the desire to ensure that future generations can not only see, but also hear and interact with the memories of their loved ones. ✨",
        heart: "❤️"
      },
      errors: {
        fillFields: "Please fill in email and password",
        error: "Error"
      },
      success: {
        title: "🎉 Success!",
        accountCreated: "Account created! Check your email to confirm. ✨📧"
      }
    },
    'pt-BR': {
      welcome: "🌟 Bem-vindo ao Eterna!",
      subtitle: "Entre para preservar memórias preciosas com segurança e simplicidade ✨",
      features: ["• 🎭 Crie vozes e histórias únicas", "• 💬 Converse em tempo real e salve memórias especiais", "• 📱 Acesse de qualquer dispositivo, em qualquer lugar"],
      signin: "Entrar",
      signup: "Cadastrar",
      email: "Email",
      password: "Senha",
      createAccount: "Criar Conta",
      backToHome: "Voltar ao Início",
      story: {
        title: "Por que Criei o Eterna",
        text: "Criei o Eterna após perder minha avó para o Alzheimer. Percebi que, embora tiremos milhares de fotos, raramente preservamos as vozes e histórias daqueles que amamos. O Eterna nasceu do desejo de garantir que as futuras gerações possam não apenas ver, mas também ouvir e interagir com as memórias de seus entes queridos. ✨",
        heart: "❤️"
      },
      errors: {
        fillFields: "Por favor, preencha email e senha",
        error: "Erro"
      },
      success: {
        title: "🎉 Sucesso!",
        accountCreated: "Conta criada com sucesso! Verifique seu email para confirmar. ✨📧"
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
        text: "Creé Eterna después de perder a mi abuela por Alzheimer. Me di cuenta de que, aunque tomamos miles de fotos, rara vez preservamos las voces e historias de quienes amamos. Eterna nació del deseo de asegurar que las futuras generaciones puedan no solo ver, sino también escuchar e interactuar con los recuerdos de sus seres queridos.",
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
export function AuthGate({
  children
}: AuthGateProps) {
  const {
    user,
    loading,
    signIn,
    signUp
  } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const {
    toast
  } = useToast();
  const navigate = useNavigate();
  const {
    currentLanguage
  } = useLanguage();
  const content = getContent(currentLanguage);
  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>;
  }
  if (!user) {
    const handleAuth = async (type: 'signin' | 'signup') => {
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
        } else {
          // Redireciona para a área principal após login
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
    };
    return <main className="min-h-screen bg-background px-4">
        {/* Back Button */}
        <div className="pt-6 pb-4">
          <Button variant="ghost" size="sm" onClick={() => navigate('/')} className="flex items-center gap-2 text-muted-foreground hover:text-foreground">
            <ArrowLeft className="h-4 w-4" />
            {content.backToHome}
          </Button>
        </div>

        <div className="max-w-6xl mx-auto grid lg:grid-cols-2 gap-12 items-start pt-8">
          {/* Left side - Introduction & Story */}
          <section className="space-y-8" aria-label="Introdução">
            <div>
              <h1 className="text-4xl font-bold tracking-tight mb-4">{content.welcome}</h1>
              <p className="text-muted-foreground mb-8">{content.subtitle}</p>
              <ul className="space-y-3 text-sm text-muted-foreground">
                {content.features.map((feature, index) => <li key={index}>{feature}</li>)}
              </ul>
            </div>

            {/* Story Section */}
            <Card className="bg-card/50 border-border/50">
              <CardContent className="p-6">
                <div className="flex items-center gap-2 mb-4">
                  
                  <h3 className="text-lg font-semibold">{content.story.title}</h3>
                </div>
                <p className="text-muted-foreground leading-relaxed mb-4">
                  {content.story.text}
                </p>
                <div className="flex items-center gap-2 text-sm text-primary">
                  
                  <span className="font-medium">{content.story.heart}</span>
                </div>
              </CardContent>
            </Card>
          </section>

          {/* Right side - Authentication */}
          <section aria-label="Autenticação" className="lg:pt-12">
            <Card className="w-full max-w-md shadow-xl mx-auto border-2 border-primary/20">
              <CardHeader className="text-center space-y-2">
                <div className="flex items-center justify-center space-x-2 mb-2">
                  <div className="w-8 h-8 bg-gradient-to-br from-primary to-primary/70 rounded-lg flex items-center justify-center shadow-lg">
                    <span className="text-primary-foreground font-bold">✨</span>
                  </div>
                </div>
                <CardTitle className="text-2xl font-bold bg-gradient-to-r from-foreground to-foreground/80 bg-clip-text">🌟 Eterna</CardTitle>
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
                      🚀 {content.signin}
                    </Button>
                  </TabsContent>
                  
                  <TabsContent value="signup" className="space-y-4">
                    <div className="space-y-3">
                      <InputWithVoice type="email" placeholder={content.email} value={email} onChange={e => setEmail(e.target.value)} className="h-12" />
                      <InputWithVoice type="password" placeholder={content.password} value={password} onChange={e => setPassword(e.target.value)} className="h-12" />
                    </div>
                    <Button className="w-full h-12 font-medium bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 shadow-lg hover:shadow-xl transition-all" onClick={() => handleAuth('signup')} disabled={isLoading}>
                      {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                      ✨ {content.createAccount}
                    </Button>
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          </section>
        </div>
      </main>;
  }
  return <>{children}</>;
}