import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';

interface BetaGateProps {
  children: React.ReactNode;
}

export const BetaGate: React.FC<BetaGateProps> = ({ children }) => {
  const [hasAccess, setHasAccess] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [showAccessForm, setShowAccessForm] = useState(false);
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    message: '',
    accessCode: '',
    accessEmail: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const { toast } = useToast();

  console.log('BetaGate component loading...');

  useEffect(() => {
    const checkBetaAccess = async () => {
      try {
        console.log('Checking beta access...');
        setIsLoading(true);
        
        // Check localStorage first
        const storedAccessCode = localStorage.getItem('beta_access_code');
        if (storedAccessCode) {
          console.log('Found stored access code, validating...');
          try {
            const { data, error } = await supabase
              .from('beta_access')
              .select('*')
              .eq('access_code', storedAccessCode)
              .single();

            if (!error && data) {
              console.log('Access code validated successfully');
              setHasAccess(true);
              return;
            } else {
              console.log('Access code validation failed:', error);
            }
          } catch (dbError) {
            console.error('Database error checking access:', dbError);
          }
        }

        console.log('No valid access found, showing waitlist');
        setHasAccess(false);
      } catch (error) {
        console.error('Error in checkBetaAccess:', error);
        setHasAccess(false);
      } finally {
        setIsLoading(false);
      }
    };

    // Small delay to ensure everything is loaded
    const timer = setTimeout(checkBetaAccess, 100);
    return () => clearTimeout(timer);
  }, []);

  const handleWaitlistSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.fullName || !formData.email) {
      toast({
        title: "Campos obrigatórios",
        description: "Por favor, preencha nome e email.",
        variant: "destructive"
      });
      return;
    }

    setIsSubmitting(true);

    try {
      const { error } = await supabase
        .from('waitlist')
        .insert([
          {
            full_name: formData.fullName,
            email: formData.email,
            message: formData.message || null
          }
        ]);

      if (error) {
        if (error.code === '23505') {
          toast({
            title: "Email já cadastrado",
            description: "Este email já está na nossa lista de espera.",
            variant: "destructive"
          });
        } else {
          throw error;
        }
      } else {
        setIsSubmitted(true);
        toast({
          title: "Sucesso!",
          description: "Você foi adicionado à nossa lista de espera!",
        });
      }
    } catch (error) {
      console.error('Error submitting to waitlist:', error);
      toast({
        title: "Erro",
        description: "Ocorreu um erro ao cadastrar. Tente novamente.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleAccessSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.accessCode || !formData.accessEmail) {
      toast({
        title: "Campos obrigatórios",
        description: "Por favor, preencha email e código de acesso.",
        variant: "destructive"
      });
      return;
    }

    try {
      const { data, error } = await supabase
        .from('beta_access')
        .select('*')
        .eq('access_code', formData.accessCode.trim())
        .eq('email', formData.accessEmail.trim().toLowerCase())
        .single();

      if (error || !data) {
        toast({
          title: "Código inválido",
          description: "Código de acesso ou email incorretos.",
          variant: "destructive"
        });
        return;
      }

      // Mark as used
      await supabase
        .from('beta_access')
        .update({ used_at: new Date().toISOString() })
        .eq('id', data.id);

      localStorage.setItem('beta_access_code', formData.accessCode.trim());
      setHasAccess(true);
      toast({
        title: "Acesso liberado!",
        description: "Bem-vindo ao Beta do Eterna.",
      });
    } catch (error) {
      console.error('Error validating access code:', error);
      toast({
        title: "Erro",
        description: "Ocorreu um erro ao validar o código.",
        variant: "destructive"
      });
    }
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

  if (isSubmitted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted flex items-center justify-center p-4">
        <div className="max-w-lg w-full text-center space-y-8">
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
          
          <div className="text-4xl">✅</div>
          <h1 className="text-3xl font-zilla font-medium italic text-foreground">
            Obrigado!
          </h1>
          <p className="text-muted-foreground">
            Você foi adicionado à nossa lista de espera. Entraremos em contato em breve!
          </p>
        </div>
      </div>
    );
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
              <form onSubmit={handleWaitlistSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="fullName">Nome completo *</Label>
                  <Input
                    id="fullName"
                    type="text"
                    value={formData.fullName}
                    onChange={(e) => setFormData(prev => ({ ...prev, fullName: e.target.value }))}
                    placeholder="Seu nome completo"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">Email *</Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                    placeholder="seu@email.com"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="message">Mensagem (opcional)</Label>
                  <Textarea
                    id="message"
                    value={formData.message}
                    onChange={(e) => setFormData(prev => ({ ...prev, message: e.target.value }))}
                    placeholder="Conte-nos por que você gostaria de usar o Eterna..."
                    rows={3}
                  />
                </div>

                <Button 
                  type="submit" 
                  className="w-full" 
                  disabled={isSubmitting}
                >
                  {isSubmitting ? 'Cadastrando...' : 'Entrar na lista de espera'}
                </Button>
              </form>
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
                <form onSubmit={handleAccessSubmit} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="accessEmail">Email cadastrado</Label>
                    <Input
                      id="accessEmail"
                      type="email"
                      value={formData.accessEmail}
                      onChange={(e) => setFormData(prev => ({ ...prev, accessEmail: e.target.value }))}
                      placeholder="Email do convite"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="accessCode">Código de acesso</Label>
                    <Input
                      id="accessCode"
                      type="text"
                      value={formData.accessCode}
                      onChange={(e) => setFormData(prev => ({ ...prev, accessCode: e.target.value }))}
                      placeholder="Digite seu código"
                      required
                    />
                  </div>

                  <Button type="submit" className="w-full">
                    Acessar Beta
                  </Button>
                </form>
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