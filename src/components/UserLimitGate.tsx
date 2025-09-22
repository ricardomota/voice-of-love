import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/hooks/useAuth';
import { toast } from "sonner";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { Heart, Users, Clock, CheckCircle, ArrowRight, Sparkles, Mail } from 'lucide-react';

interface UserLimitGateProps {
  children: React.ReactNode;
}

export const UserLimitGate: React.FC<UserLimitGateProps> = ({ children }) => {
  const { user } = useAuth();
  const [userCount, setUserCount] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [showWaitlist, setShowWaitlist] = useState(false);
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    message: '',
    primaryInterest: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [emailValid, setEmailValid] = useState(true);
  const { toast } = useToast();

  const MAX_USERS = 10;

  useEffect(() => {
    const checkUserCount = async () => {
      try {
        const { count, error } = await supabase
          .from('user_settings')
          .select('*', { count: 'exact', head: true });
        
        if (error) {
          console.error('Error getting user count:', error);
          setUserCount(0);
        } else {
          setUserCount(count || 0);
        }

        // If we have 10+ users, show waitlist
        if ((count || 0) >= MAX_USERS) {
          setShowWaitlist(true);
        }
      } catch (error) {
        console.error('Error checking user count:', error);
        setUserCount(0);
      } finally {
        setIsLoading(false);
      }
    };

    checkUserCount();
  }, []);

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const email = e.target.value;
    setFormData(prev => ({ ...prev, email }));
    if (email) {
      setEmailValid(validateEmail(email));
    } else {
      setEmailValid(true);
    }
  };

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

    if (!emailValid) {
      toast({
        title: "Email inválido",
        description: "Por favor, insira um email válido.",
        variant: "destructive"
      });
      return;
    }

    setIsSubmitting(true);

    try {
      // Check if user is authenticated, if not, guide them to sign in first
      if (!user?.id) {
        toast({
          title: "Autenticação necessária",
          description: "Faça login primeiro para entrar na lista de espera",
          variant: "destructive"
        });
        return;
      }

      // Use the waitlist-signup edge function instead of direct database calls
      const { data: result, error } = await supabase.functions.invoke('waitlist-signup', {
        body: {
          email: formData.email,
          full_name: formData.fullName,
          message: formData.message || null,
          primary_interest: formData.primaryInterest || null,
        },
      });

      if (error) {
        if (result?.message === 'ALREADY_EXISTS') {
          toast({
            title: "Email já cadastrado",
            description: "Este email já está na nossa lista de espera.",
            variant: "destructive"
          });
        } else {
          throw new Error(result?.error || error.message || 'Failed to join waitlist');
        }
      } else {
        setIsSubmitted(true);
        toast({
          title: "🎉 Bem-vindo à lista!",
          description: "Você foi adicionado com sucesso!",
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

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="text-muted-foreground">Carregando...</p>
        </div>
      </div>
    );
  }

  // Allow access if under 10 users
  if (!showWaitlist) {
    return <>{children}</>;
  }

  // Show thank you page after waitlist submission
  if (isSubmitted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted flex items-center justify-center p-4">
        <div className="max-w-2xl w-full">
          <Card className="border-2 border-green-200 dark:border-green-800 bg-green-50/50 dark:bg-green-950/30">
            <CardContent className="p-8 text-center space-y-8">
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
              
              <div className="space-y-4">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-100 dark:bg-green-900">
                  <CheckCircle className="w-8 h-8 text-green-600 dark:text-green-400" />
                </div>
                
                <h1 className="font-serif text-[clamp(2rem,5vw,4rem)] text-foreground leading-none tracking-tight">
                  Você está na lista! 🎉
                </h1>
                
                <p className="text-lg text-muted-foreground">
                  Atingimos nossa capacidade atual. Você será notificado quando abrirmos novas vagas.
                </p>
              </div>

              <div className="bg-background/50 rounded-lg p-4 space-y-3">
                <h3 className="font-semibold flex items-center justify-center gap-2">
                  <Sparkles className="w-4 h-4 text-primary" />
                  O que acontece agora?
                </h3>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li className="flex items-center gap-2">
                    <ArrowRight className="w-3 h-3" />
                    Você receberá updates por email
                  </li>
                  <li className="flex items-center gap-2">
                    <ArrowRight className="w-3 h-3" />
                    Convites serão enviados em breve
                  </li>
                </ul>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  // Show waitlist form when at capacity
  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted flex items-center justify-center p-4">
      <div className="max-w-2xl w-full space-y-8">
        {/* Header */}
        <div className="text-center space-y-6">
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
          
          <div className="space-y-4">
            <Badge variant="secondary" className="px-4 py-2 text-sm font-medium">
              <Clock className="w-4 h-4 mr-2" />
              Capacidade Atingida
            </Badge>
            
            <h1 className="font-serif text-[clamp(2rem,5vw,4rem)] text-foreground leading-none tracking-tight">
              Entre na <span className="text-primary">waitlist</span>
            </h1>
            
            <p className="text-xl font-work text-muted-foreground max-w-2xl mx-auto">
              Atingimos nossa capacidade atual. Entre na lista de espera para ser notificado quando abrirmos novas vagas.
            </p>
          </div>
        </div>

        {/* Waitlist Card */}
        <Card className="border-2 hover:border-primary/20 transition-all duration-300 shadow-lg">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl font-zilla italic flex items-center justify-center gap-2">
              <Mail className="w-6 h-6 text-primary" />
              Lista de Espera
            </CardTitle>
            <CardDescription className="text-base">
              Seja notificado quando abrirmos novas vagas
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleWaitlistSubmit} className="space-y-6">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="fullName">Nome completo *</Label>
                  <Input
                    id="fullName"
                    type="text"
                    value={formData.fullName}
                    onChange={(e) => setFormData(prev => ({ ...prev, fullName: e.target.value }))}
                    placeholder="Como posso te chamar?"
                    required
                    className="transition-colors focus:border-primary"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">Email *</Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={handleEmailChange}
                    placeholder="seu@email.com"
                    required
                    className={`transition-colors ${
                      !emailValid ? 'border-red-500 focus:border-red-500' : 'focus:border-primary'
                    }`}
                  />
                  {!emailValid && formData.email && (
                    <p className="text-sm text-red-500">Por favor, insira um email válido</p>
                  )}
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="primaryInterest">Com quem você gostaria de conversar?</Label>
                <select
                  id="primaryInterest"
                  value={formData.primaryInterest}
                  onChange={(e) => setFormData(prev => ({ ...prev, primaryInterest: e.target.value }))}
                  className="w-full p-3 border border-input rounded-md bg-background focus:border-primary focus:outline-none"
                >
                  <option value="">Selecione uma opção (opcional)</option>
                  <option value="family">Familiares que já partiram</option>
                  <option value="grandparents">Avós e pessoas mais velhas</option>
                  <option value="friends">Amigos especiais</option>
                  <option value="historical">Figuras históricas</option>
                  <option value="other">Outros</option>
                </select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="message">Conte-nos sua história (opcional)</Label>
                <Textarea
                  id="message"
                  value={formData.message}
                  onChange={(e) => setFormData(prev => ({ ...prev, message: e.target.value }))}
                  placeholder="Há alguém especial com quem você gostaria de conversar novamente?"
                  rows={4}
                  className="resize-none focus:border-primary"
                />
              </div>

              <Button 
                type="submit" 
                className="w-full h-14 text-lg font-medium" 
                disabled={isSubmitting || (formData.email && !emailValid)}
              >
                {isSubmitting ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Entrando na lista...
                  </>
                ) : (
                  <>
                    <Heart className="w-5 h-5 mr-2" />
                    Entrar na lista de espera
                  </>
                )}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};