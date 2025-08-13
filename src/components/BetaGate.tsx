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
import { Heart, Users, Clock, CheckCircle, ArrowRight, Sparkles, Share2 } from 'lucide-react';

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
    accessEmail: '',
    howDidYouHear: '',
    primaryInterest: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [emailValid, setEmailValid] = useState(true);
  const [waitlistPosition, setWaitlistPosition] = useState<number | null>(null);
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
    const text = "Descobri o Eterna - uma plataforma incrível que usa IA para preservar vozes e criar conexões eternas. Junte-se à lista de espera!";
    
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
                  Bem-vindo à família! 🎉
                </h1>
                
                <div className="space-y-2">
                  <p className="text-lg text-muted-foreground">
                    Você foi adicionado com sucesso à nossa lista de espera
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

                {/* Progress indicator */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm text-muted-foreground">
                    <span>Lista de espera</span>
                    <span>Beta privado</span>
                  </div>
                  <Progress value={20} className="h-2" />
                  <p className="text-xs text-muted-foreground">
                    Estimativa: 2-4 semanas para acesso antecipado
                  </p>
                </div>

                {/* Next steps */}
                <div className="bg-background/50 rounded-lg p-4 space-y-3">
                  <h3 className="font-semibold flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-primary" />
                    Próximos passos
                  </h3>
                  <ul className="text-sm text-muted-foreground space-y-1 text-left">
                    <li className="flex items-center gap-2">
                      <ArrowRight className="w-3 h-3" />
                      Você receberá updates por email sobre o progresso
                    </li>
                    <li className="flex items-center gap-2">
                      <ArrowRight className="w-3 h-3" />
                      Convites beta serão enviados gradualmente
                    </li>
                    <li className="flex items-center gap-2">
                      <ArrowRight className="w-3 h-3" />
                      Compartilhe com amigos para acelerar o lançamento
                    </li>
                  </ul>
                </div>

                {/* Share section */}
                <div className="pt-4 border-t border-border/50">
                  <p className="text-sm text-muted-foreground mb-3">
                    Ajude-nos a crescer e acelere o lançamento!
                  </p>
                  <Button 
                    onClick={shareWaitlist}
                    variant="outline" 
                    className="gap-2"
                  >
                    <Share2 className="w-4 h-4" />
                    Compartilhar Eterna
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

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
              Beta Privado em Breve
            </Badge>
            
            <h1 className="text-4xl sm:text-5xl font-zilla font-medium italic text-foreground">
              Preserve vozes, crie <span className="text-primary">conexões eternas</span>
            </h1>
            
            <p className="text-xl font-work text-muted-foreground max-w-2xl mx-auto">
              A primeira plataforma que usa IA para preservar a essência de quem você ama, 
              criando conversas autênticas que duram para sempre.
            </p>
          </div>

          {/* Social proof */}
          <div className="flex items-center justify-center gap-8 text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <Users className="w-4 h-4" />
              <span>500+ na lista</span>
            </div>
            <div className="flex items-center gap-2">
              <Heart className="w-4 h-4 text-red-500" />
              <span>Famílias reunidas</span>
            </div>
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-primary" />
              <span>IA Avançada</span>
            </div>
          </div>
        </div>

        {/* Cards */}
        <div className="grid gap-6 md:grid-cols-2">
          {/* Waitlist Card */}
          <Card className="border-2 hover:border-primary/20 transition-all duration-300 hover:shadow-lg">
            <CardHeader className="text-center">
              <CardTitle className="text-2xl font-zilla italic flex items-center justify-center gap-2">
                <Heart className="w-6 h-6 text-primary" />
                Lista de Espera
              </CardTitle>
              <CardDescription className="text-base">
                Seja um dos primeiros a experimentar o futuro das conexões humanas
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

                <div className="space-y-2">
                  <Label htmlFor="primaryInterest">Com quem você gostaria de conversar? *</Label>
                  <select
                    id="primaryInterest"
                    value={formData.primaryInterest}
                    onChange={(e) => setFormData(prev => ({ ...prev, primaryInterest: e.target.value }))}
                    className="w-full p-2 border border-input rounded-md bg-background focus:border-primary focus:outline-none"
                    required
                  >
                    <option value="">Selecione uma opção</option>
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
                    rows={3}
                    className="resize-none focus:border-primary"
                  />
                </div>

                <Button 
                  type="submit" 
                  className="w-full h-12 text-lg font-medium" 
                  disabled={isSubmitting || (formData.email && !emailValid)}
                >
                  {isSubmitting ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Cadastrando...
                    </>
                  ) : (
                    <>
                      <Heart className="w-4 h-4 mr-2" />
                      Entrar na lista de espera
                    </>
                  )}
                </Button>
              </form>
              
              <div className="mt-4 p-3 bg-muted/50 rounded-lg">
                <p className="text-xs text-muted-foreground text-center">
                  ✨ Cadastre-se agora e ganhe acesso antecipado ao beta privado
                </p>
              </div>
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