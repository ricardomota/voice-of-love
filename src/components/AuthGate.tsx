import { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { InputWithVoice } from '@/components/ui/input-with-voice';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface AuthGateProps {
  children: React.ReactNode;
}

export function AuthGate({ children }: AuthGateProps) {
  const { user, loading, signIn, signUp } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

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
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary/20 via-background to-secondary/20 p-4">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle className="text-2xl text-center">Eterna</CardTitle>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="signin" className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="signin">Entrar</TabsTrigger>
                <TabsTrigger value="signup">Cadastrar</TabsTrigger>
              </TabsList>
              
              <TabsContent value="signin" className="space-y-4">
                <div className="space-y-2">
                  <InputWithVoice
                    type="email"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                  <InputWithVoice
                    type="password"
                    placeholder="Senha"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </div>
                <Button 
                  className="w-full" 
                  onClick={() => handleAuth('signin')}
                  disabled={isLoading}
                >
                  {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  Entrar
                </Button>
              </TabsContent>
              
              <TabsContent value="signup" className="space-y-4">
                <div className="space-y-2">
                  <InputWithVoice
                    type="email"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                  <InputWithVoice
                    type="password"
                    placeholder="Senha"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </div>
                <Button 
                  className="w-full" 
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
      </div>
    );
  }

  return <>{children}</>;
}