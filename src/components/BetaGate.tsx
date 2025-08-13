import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { WaitlistForm } from './WaitlistForm';
import { BetaAccessForm } from './BetaAccessForm';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';

interface BetaGateProps {
  children: React.ReactNode;
}

export const BetaGate: React.FC<BetaGateProps> = ({ children }) => {
  const [hasAccess, setHasAccess] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [showAccessForm, setShowAccessForm] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    checkBetaAccess();
  }, []);

  const checkBetaAccess = async () => {
    try {
      setIsLoading(true);
      
      // Verifica se existe um código de acesso no localStorage
      const storedAccessCode = localStorage.getItem('beta_access_code');
      if (storedAccessCode) {
        const { data, error } = await supabase
          .from('beta_access')
          .select('*')
          .eq('access_code', storedAccessCode)
          .single();

        if (!error && data) {
          setHasAccess(true);
          return;
        }
      }

      setHasAccess(false);
    } catch (error) {
      console.error('Error checking beta access:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAccessGranted = (accessCode: string) => {
    localStorage.setItem('beta_access_code', accessCode);
    setHasAccess(true);
    toast({
      title: "Acesso liberado!",
      description: "Bem-vindo ao Beta do Eterna.",
    });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (hasAccess) {
    return <>{children}</>;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted flex items-center justify-center p-4">
      <div className="max-w-2xl w-full space-y-8">
        {/* Header */}
        <div className="text-center space-y-4">
          <div className="flex justify-center mb-6">
            <img 
              src="/lovable-uploads/4a3edab3-4083-4a1c-a748-c8c1d4626206.png" 
              alt="Eterna Logo" 
              className="h-12 w-auto dark:hidden"
            />
            <img 
              src="/lovable-uploads/0d1a58a9-f5b7-441f-a99a-ee72d330aa78.png" 
              alt="Eterna Logo" 
              className="h-12 w-auto hidden dark:block"
            />
          </div>
          <h1 className="text-4xl sm:text-5xl font-zilla font-medium italic text-foreground">
            Eterna está chegando
          </h1>
          <p className="text-xl font-work text-muted-foreground max-w-lg mx-auto">
            Estamos nos preparando para o lançamento e aceitando apenas um grupo seleto de beta testers.
          </p>
        </div>

        {/* Cards */}
        <div className="grid gap-6 md:grid-cols-2">
          {/* Waitlist Card */}
          <Card className="border-2 hover:border-primary/20 transition-colors">
            <CardHeader className="text-center">
              <CardTitle className="text-2xl font-zilla italic">
                Lista de Espera
              </CardTitle>
              <CardDescription>
                Junte-se à nossa lista de espera para ser notificado quando lançarmos
              </CardDescription>
            </CardHeader>
            <CardContent>
              <WaitlistForm />
            </CardContent>
          </Card>

          {/* Beta Access Card */}
          <Card className="border-2 border-primary/40 bg-primary/5">
            <CardHeader className="text-center">
              <CardTitle className="text-2xl font-zilla italic flex items-center justify-center gap-2">
                <span>🔑</span> Acesso Beta
              </CardTitle>
              <CardDescription>
                Já tem um convite? Entre com seu código de acesso
              </CardDescription>
            </CardHeader>
            <CardContent>
              {!showAccessForm ? (
                <Button 
                  onClick={() => setShowAccessForm(true)}
                  className="w-full"
                  variant="outline"
                >
                  Tenho um código de acesso
                </Button>
              ) : (
                <BetaAccessForm onAccessGranted={handleAccessGranted} />
              )}
            </CardContent>
          </Card>
        </div>

        {/* Footer */}
        <div className="text-center text-sm text-muted-foreground">
          <p>
            O Eterna utiliza IA para preservar vozes e criar conexões eternas com entes queridos.
          </p>
        </div>
      </div>
    </div>
  );
};