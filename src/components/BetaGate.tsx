import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { useToast } from '@/hooks/use-toast';
import { Heart, Users, Clock, CheckCircle, ArrowRight, Sparkles, Share2, Zap } from 'lucide-react';

interface BetaGateProps {
  children: React.ReactNode;
}

export const BetaGate: React.FC<BetaGateProps> = ({ children }) => {
  const [hasAccess, setHasAccess] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [userCount, setUserCount] = useState(0);
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    message: '',
    primaryInterest: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [emailValid, setEmailValid] = useState(true);
  const [waitlistPosition, setWaitlistPosition] = useState<number | null>(null);
  const { toast } = useToast();

  const MAX_BETA_USERS = 10;

  useEffect(() => {
    const checkAccess = async () => {
      try {
        setIsLoading(true);
        
        // Check if user already has access stored locally
        const hasStoredAccess = localStorage.getItem('beta_early_access') === 'true';
        if (hasStoredAccess) {
          setHasAccess(true);
          return;
        }

        // Get current user count from user_settings table
        const { count, error } = await supabase
          .from('user_settings')
          .select('*', { count: 'exact', head: true });
        
        if (error) {
          console.error('Error getting user count:', error);
          setUserCount(0);
        } else {
          setUserCount(count || 0);
        }

      } catch (error) {
        console.error('Error in checkAccess:', error);
        setUserCount(0);
      } finally {
        setIsLoading(false);
      }
    };

    checkAccess();
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

  const getWaitlistPosition = async () => {
    try {
      const { count } = await supabase
        .from('waitlist')
        .select('*', { count: 'exact', head: true });
      
      return (count || 0) + 1;
    } catch (error) {
      console.error('Error getting waitlist position:', error);
      return null;
    }
  };

  const handleEarlyAccessSubmit = async (e: React.FormEvent) => {
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
      // Grant immediate access for early users
      localStorage.setItem('beta_early_access', 'true');
      localStorage.setItem('beta_user_info', JSON.stringify({
        name: formData.fullName,
        email: formData.email,
        joinedAt: new Date().toISOString()
      }));

      setHasAccess(true);
      toast({
        title: "🎉 Acesso liberado!",
        description: "Bem-vindo ao Eterna! Você está entre os primeiros usuários.",
      });

    } catch (error) {
      console.error('Error granting early access:', error);
      toast({
        title: "Erro",
        description: "Ocorreu um erro. Tente novamente.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
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
      const position = await getWaitlistPosition();
      
      const { error } = await supabase
        .from('waitlist')
        .insert([
          {
            full_name: formData.fullName,
            email: formData.email,
            message: formData.message || null,
            primary_interest: formData.primaryInterest || null
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
        setWaitlistPosition(position);
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

  const shareWaitlist = () => {
    const url = window.location.origin;
    const text = "Descobri o Eterna - uma plataforma incrível que usa IA para preservar vozes e criar conexões eternas!";
    
    if (navigator.share) {
      navigator.share({
        title: 'Eterna - Conexões Eternas',
        text: text,
        url: url,
      });
    } else {
      navigator.clipboard.writeText(`${text} ${url}`);
      toast({
        title: "Link copiado!",
        description: "O link foi copiado para a área de transferência.",
      });
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="text-muted-foreground">Verificando disponibilidade...</p>
        </div>
      </div>
    );
  }

  if (hasAccess) {
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
                
                <h1 className="text-4xl font-zilla font-medium italic text-foreground">
                  Você está na lista! 🎉
                </h1>
                
                <div className="space-y-2">
                  <p className="text-lg text-muted-foreground">
                    Obrigado pelo seu interesse no Eterna
                  </p>
                  {waitlistPosition && (
                    <div className="flex items-center justify-center gap-2">
                      <Badge variant="secondary" className="text-sm px-3 py-1">
                        <Users className="w-4 h-4 mr-2" />
                        Posição #{waitlistPosition}
                      </Badge>
                    </div>
                  )}
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
                    <li className="flex items-center gap-2">
                      <ArrowRight className="w-3 h-3" />
                      Compartilhe para acelerar o lançamento
                    </li>
                  </ul>
                </div>

                <Button 
                  onClick={shareWaitlist}
                  variant="outline" 
                  className="gap-2"
                >
                  <Share2 className="w-4 h-4" />
                  Compartilhar com amigos
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  // Show early access form for first 10 users
  if (userCount < MAX_BETA_USERS) {
    const spotsLeft = MAX_BETA_USERS - userCount;
    
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
              <div className="flex items-center justify-center gap-2">
                <Badge variant="default" className="px-4 py-2 text-sm font-medium bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100">
                  <Zap className="w-4 h-4 mr-2" />
                  Acesso Imediato Disponível
                </Badge>
                <Badge variant="secondary" className="px-3 py-1 text-xs">
                  {spotsLeft} vagas restantes
                </Badge>
              </div>
              
              <h1 className="text-4xl sm:text-5xl font-zilla font-medium italic text-foreground">
                Entre agora no <span className="text-primary">Eterna</span>
              </h1>
              
              <p className="text-xl font-work text-muted-foreground max-w-2xl mx-auto">
                Você está entre os primeiros! Ganhe acesso imediato à plataforma que usa IA para preservar vozes e criar conexões eternas.
              </p>
            </div>
          </div>

          {/* Early Access Card */}
          <Card className="border-2 border-primary/20 hover:border-primary/40 transition-all duration-300 shadow-lg">
            <CardHeader className="text-center">
              <CardTitle className="text-2xl font-zilla italic flex items-center justify-center gap-2">
                <Zap className="w-6 h-6 text-primary" />
                Acesso Imediato
              </CardTitle>
              <CardDescription className="text-base">
                Preencha seus dados e comece a usar agora mesmo
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleEarlyAccessSubmit} className="space-y-6">
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

                <Button 
                  type="submit" 
                  className="w-full h-14 text-lg font-medium" 
                  disabled={isSubmitting || (formData.email && !emailValid)}
                >
                  {isSubmitting ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Liberando acesso...
                    </>
                  ) : (
                    <>
                      <Zap className="w-5 h-5 mr-2" />
                      Entrar agora no Eterna
                    </>
                  )}
                </Button>
              </form>
              
              <div className="mt-6 p-4 bg-primary/5 rounded-lg">
                <p className="text-sm text-muted-foreground text-center">
                  🚀 <strong>Acesso imediato:</strong> Você receberá acesso instantâneo após o cadastro. Apenas {spotsLeft} vagas disponíveis!
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  // Show waitlist form when 10+ users exist
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
              Lista de Espera Ativa
            </Badge>
            
            <h1 className="text-4xl sm:text-5xl font-zilla font-medium italic text-foreground">
              Junte-se à <span className="text-primary">lista de espera</span>
            </h1>
            
            <p className="text-xl font-work text-muted-foreground max-w-2xl mx-auto">
              Atingimos nossa capacidade inicial! Entre na lista de espera para ser notificado quando abrirmos novas vagas.
            </p>
          </div>

          {/* Progress indicator */}
          <div className="space-y-2 max-w-md mx-auto">
            <div className="flex items-center justify-between text-sm text-muted-foreground">
              <span>Beta fechado</span>
              <span>Próxima fase</span>
            </div>
            <Progress value={75} className="h-2" />
            <p className="text-xs text-muted-foreground">
              Lista de espera ativa - convites enviados semanalmente
            </p>
          </div>
        </div>

        {/* Waitlist Card */}
        <Card className="border-2 hover:border-primary/20 transition-all duration-300 shadow-lg">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl font-zilla italic flex items-center justify-center gap-2">
              <Heart className="w-6 h-6 text-primary" />
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
                  placeholder="Há alguém especial com quem você gostaria de conversar novamente? Conte-nos sobre essa pessoa..."
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
            
            <div className="mt-6 p-4 bg-muted/50 rounded-lg">
              <p className="text-sm text-muted-foreground text-center">
                📧 <strong>Notificações semanais:</strong> Enviamos convites toda semana conforme abrimos novas vagas
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};