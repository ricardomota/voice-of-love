import { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { InputWithVoice } from '@/components/ui/input-with-voice';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useNavigate } from 'react-router-dom';

interface AuthGateProps {
  children: React.ReactNode;
}

export function AuthGate({ children }: AuthGateProps) {
  const { user, loading, signIn, signUp } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (!user) {
    const handleAuth = async (type: 'signin' | 'signup') => {
      if (!email || !password) {
        toast({
          title: "Erro",
          description: "Por favor, preencha email e senha",
          variant: "destructive"
        });
        return;
      }

      setIsLoading(true);
      try {
        const { error } = type === 'signin' 
          ? await signIn(email, password)
          : await signUp(email, password);

        if (error) throw error;

if (type === 'signup') {
  toast({
    title: "Sucesso",
    description: "Conta criada! Verifique seu email para confirmar."
  });
} else {
  // Redireciona para a área principal após login
  navigate('/auth');
}
      } catch (error: any) {
        toast({
          title: "Erro",
          description: error.message,
          variant: "destructive"
        });
      } finally {
        setIsLoading(false);
      }
    };

    return (
      <main className="min-h-screen bg-background pt-20 md:pt-24 px-4">
        <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-10 items-center">
          <section className="hidden md:block" aria-label="Introdução">
            <h1 className="text-4xl font-bold tracking-tight mb-4">Bem-vindo ao Eterna</h1>
            <p className="text-muted-foreground mb-8">Entre para preservar memórias com segurança e simplicidade.</p>
            <ul className="space-y-3 text-sm text-muted-foreground">
              <li>• Crie vozes e histórias únicas</li>
              <li>• Converse em tempo real e salve memórias</li>
              <li>• Acesse de qualquer dispositivo</li>
            </ul>
          </section>

          <section aria-label="Autenticação">
            <Card className="w-full max-w-md shadow-lg mx-auto">
              <CardHeader className="text-center space-y-2">
                <div className="flex items-center justify-center space-x-2 mb-2">
                  <div className="w-8 h-8 bg-foreground rounded-lg flex items-center justify-center">
                    <span className="text-background font-bold">E</span>
                  </div>
                </div>
                <CardTitle className="text-2xl font-bold">Eterna</CardTitle>
                <p className="text-sm text-muted-foreground">Entre para preservar memórias</p>
              </CardHeader>
              <CardContent>
                <Tabs defaultValue="signin" className="w-full">
                  <TabsList className="grid w-full grid-cols-2 mb-6">
                    <TabsTrigger value="signin" className="text-sm">Entrar</TabsTrigger>
                    <TabsTrigger value="signup" className="text-sm">Cadastrar</TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="signin" className="space-y-4">
                    <div className="space-y-3">
                      <InputWithVoice
                        type="email"
                        placeholder="Email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="h-12"
                      />
                      <InputWithVoice
                        type="password"
                        placeholder="Senha"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="h-12"
                      />
                    </div>
                    <Button 
                      className="w-full h-12 font-medium" 
                      onClick={() => handleAuth('signin')}
                      disabled={isLoading}
                    >
                      {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                      Entrar
                    </Button>
                  </TabsContent>
                  
                  <TabsContent value="signup" className="space-y-4">
                    <div className="space-y-3">
                      <InputWithVoice
                        type="email"
                        placeholder="Email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="h-12"
                      />
                      <InputWithVoice
                        type="password"
                        placeholder="Senha"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="h-12"
                      />
                    </div>
                    <Button 
                      className="w-full h-12 font-medium" 
                      onClick={() => handleAuth('signup')}
                      disabled={isLoading}
                    >
                      {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                      Criar Conta
                    </Button>
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          </section>
        </div>
      </main>
    );
  }

  return <>{children}</>;
}