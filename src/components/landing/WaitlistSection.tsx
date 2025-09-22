import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/hooks/useAuth';
import { toast } from "sonner";
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { Heart, Users, Clock, CheckCircle, Sparkles, Mail, ArrowRight, AlertTriangle } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useLanguage } from '@/hooks/useLanguage';

interface WaitlistSectionProps {
  onJoinWaitlist?: () => void;
}

export const WaitlistSection: React.FC<WaitlistSectionProps> = ({ onJoinWaitlist }) => {
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
  const { currentLanguage } = useLanguage();

  const content = {
    en: {
      title: "Join Our Community",
      subtitle: "Be among the first to experience Eterna when we launch. Help us build something meaningful together.",
      disclaimer: "Eterna is currently in beta development. This waitlist helps us understand our community's needs. Payments are not active yet — everything is free during our testing phase.",
      earlyAccess: "Waitlist members get early access 2-4 weeks before public launch",
      form: {
        name: "Full Name",
        email: "Email Address",
        interest: "Who would you like to connect with?",
        message: "Tell us your story (optional)",
        namePlaceholder: "Your name",
        emailPlaceholder: "your@email.com",
        messagePlaceholder: "Is there someone special you'd like to reconnect with? Tell us about them...",
        submit: "Join the Waitlist",
        submitting: "Joining..."
      },
      interests: {
        family: "Family members who have passed",
        grandparents: "Grandparents and elders",
        friends: "Special friends",
        support: "Need emotional support",
        memories: "Preserve family memories",
        other: "Other"
      },
      success: {
        title: "Welcome to the family! 🎉",
        subtitle: "You've been successfully added to our waitlist",
        nextSteps: "Next steps",
        step1: "You'll receive updates via email about our progress",
        step2: "Beta invites will be sent out gradually",
        step3: "Early access for waitlist members coming soon"
      }
    },
    'pt-BR': {
      title: "Junte-se à Nossa Comunidade",
      subtitle: "Seja um dos primeiros a experimentar o Eterna quando lançarmos. Ajude-nos a construir algo significativo juntos.",
      disclaimer: "Eterna está atualmente em desenvolvimento beta. Esta lista de espera nos ajuda a entender as necessidades da nossa comunidade. Pagamentos não estão ativos ainda — tudo é gratuito durante nossa fase de testes.",
      earlyAccess: "Membros da lista de espera recebem acesso antecipado 2-4 semanas antes do lançamento público",
      form: {
        name: "Nome Completo",
        email: "Endereço de Email",
        interest: "Com quem você gostaria de se conectar?",
        message: "Conte-nos sua história (opcional)",
        namePlaceholder: "Seu nome",
        emailPlaceholder: "seu@email.com",
        messagePlaceholder: "Há alguém especial com quem você gostaria de se reconectar? Conte-nos sobre eles...",
        submit: "Entrar na Lista de Espera",
        submitting: "Entrando..."
      },
      interests: {
        family: "Familiares que partiram",
        grandparents: "Avós e pessoas mais velhas",
        friends: "Amigos especiais",
        support: "Preciso de apoio emocional",
        memories: "Preservar memórias da família",
        other: "Outro"
      },
      success: {
        title: "Bem-vindo à família! 🎉",
        subtitle: "Você foi adicionado com sucesso à nossa lista de espera",
        nextSteps: "Próximos passos",
        step1: "Você receberá atualizações por email sobre nosso progresso",
        step2: "Convites beta serão enviados gradualmente",
        step3: "Acesso antecipado para membros da lista de espera em breve"
      }
    }
  };

  const text = content[currentLanguage as keyof typeof content] || content.en;

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

  const handleSubmit = async (e: React.FormEvent) => {
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
      
      // Use the working approach: direct database insert with status 'pending'
      const { data: insertData, error: insertError } = await supabase
        .from('waitlist')
        .insert({
          email: formData.email.trim().toLowerCase(),
          full_name: formData.fullName,
          user_id: null,
          status: 'pending', // This status works!
          primary_interest: formData.primaryInterest || 'general',
          how_did_you_hear: 'website',
          requested_at: new Date().toISOString()
        });

      if (insertError) {
        // Handle duplicate constraint
        if (insertError.code === '23505') {
          toast({
            title: currentLanguage === 'pt-BR' ? "Email já cadastrado" : "Email already registered",
            description: currentLanguage === 'pt-BR' ? "Este email já está na nossa lista de espera." : "This email is already on our waitlist.",
            variant: "destructive"
          });
          return;
        }
        
        // Try other working status values as fallback
        const workingStatuses = ['active', 'waiting', 'confirmed', 'new'];
        let success = false;
        
        for (const status of workingStatuses) {
          const { error: retryError } = await supabase
            .from('waitlist')
            .insert({
              email: formData.email.trim().toLowerCase(),
              full_name: formData.fullName,
              user_id: null,
              status: status,
              primary_interest: formData.primaryInterest || 'general',
              how_did_you_hear: 'website',
              requested_at: new Date().toISOString()
            });
          
          if (!retryError) {
            success = true;
            break;
          }
        }
        
        if (!success) {
          throw new Error('Unable to join waitlist. Please try again later.');
        }
      }

      setWaitlistPosition(position);
      setIsSubmitted(true);
      toast({
        title: currentLanguage === 'pt-BR' ? "🎉 Bem-vindo à lista!" : "🎉 Welcome to the list!",
        description: currentLanguage === 'pt-BR' ? "Você foi adicionado com sucesso!" : "You've been successfully added!",
      });
      if (onJoinWaitlist) {
        onJoinWaitlist();
      }
    } catch (error) {
      console.error('Error submitting to waitlist:', error);
      toast({
        title: currentLanguage === 'pt-BR' ? "Erro" : "Error",
        description: currentLanguage === 'pt-BR' ? "Ocorreu um erro ao cadastrar. Tente novamente." : "An error occurred while signing up. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSubmitted) {
    return (
      <section id="waitlist" className="py-24 bg-gradient-to-br from-muted/30 via-background to-muted/50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <Card className="border-2 border-green-200 dark:border-green-800 bg-green-50/50 dark:bg-green-950/30">
            <CardContent className="p-12 text-center space-y-8">
              <div className="space-y-4">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-100 dark:bg-green-900">
                  <CheckCircle className="w-8 h-8 text-green-600 dark:text-green-400" />
                </div>
                
                <h2 className="text-4xl font-bold text-foreground">
                  {text.success.title}
                </h2>
                
                <div className="space-y-2">
                  <p className="text-lg text-muted-foreground">
                    {text.success.subtitle}
                  </p>
                  {waitlistPosition && (
                    <div className="flex items-center justify-center gap-2">
                      <Badge variant="secondary" className="text-sm px-3 py-1">
                        <Users className="w-4 h-4 mr-2" />
                        #{waitlistPosition}
                      </Badge>
                    </div>
                  )}
                </div>
              </div>

              <div className="bg-background/50 rounded-lg p-6 space-y-3">
                <h3 className="font-semibold flex items-center justify-center gap-2">
                  <Sparkles className="w-4 h-4 text-primary" />
                  {text.success.nextSteps}
                </h3>
                <ul className="text-sm text-muted-foreground space-y-2">
                  <li className="flex items-center justify-center gap-2">
                    <ArrowRight className="w-3 h-3" />
                    {text.success.step1}
                  </li>
                  <li className="flex items-center justify-center gap-2">
                    <ArrowRight className="w-3 h-3" />
                    {text.success.step2}
                  </li>
                  <li className="flex items-center justify-center gap-2">
                    <ArrowRight className="w-3 h-3" />
                    {text.success.step3}
                  </li>
                </ul>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>
    );
  }

  return (
    <section id="waitlist" className="py-24 bg-gradient-to-br from-muted/30 via-background to-muted/50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Beta disclaimer */}
        <div className="max-w-3xl mx-auto mb-12">
          <Alert className="bg-amber-50 border-amber-200 dark:bg-amber-950/20 dark:border-amber-800">
            <AlertTriangle className="h-4 w-4 text-amber-600 dark:text-amber-400" />
            <AlertDescription className="text-amber-800 dark:text-amber-200">
              <strong>{currentLanguage === 'pt-BR' ? 'Aviso Beta' : 'Beta Notice'}:</strong> {text.disclaimer}
            </AlertDescription>
          </Alert>
        </div>

        <div className="text-center space-y-6 mb-16">
          <Badge variant="secondary" className="px-4 py-2 text-sm font-medium">
            <Clock className="w-4 h-4 mr-2" />
            {currentLanguage === 'pt-BR' ? 'Beta Privado em Breve' : 'Private Beta Coming Soon'}
          </Badge>
          
          <h2 className="text-4xl sm:text-5xl font-bold text-foreground">
            {text.title}
          </h2>
          
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            {text.subtitle}
          </p>

          {/* Early access note */}
          <div className="bg-primary/10 rounded-lg p-4 max-w-2xl mx-auto">
            <p className="text-sm font-medium text-primary">
              ✨ {text.earlyAccess}
            </p>
          </div>
        </div>

        <div className="max-w-2xl mx-auto">
          <Card className="border-2 hover:border-primary/20 transition-all duration-300 hover:shadow-lg">
            <CardHeader className="text-center">
              <CardTitle className="text-2xl font-zilla italic flex items-center justify-center gap-2">
                <Mail className="w-6 h-6 text-primary" />
                Waitlist
              </CardTitle>
              <CardDescription className="text-base">
                Preencha os dados abaixo e seja notificado quando lançarmos
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
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
                  <Label htmlFor="primaryInterest">Com quem você gostaria de conversar? *</Label>
                  <select
                    id="primaryInterest"
                    value={formData.primaryInterest}
                    onChange={(e) => setFormData(prev => ({ ...prev, primaryInterest: e.target.value }))}
                    className="w-full p-3 border border-input rounded-md bg-background focus:border-primary focus:outline-none"
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
                      Cadastrando...
                    </>
                  ) : (
                    <>
                      <Heart className="w-5 h-5 mr-2" />
                      Entrar na lista de espera VIP
                    </>
                  )}
                </Button>
              </form>
              
              <div className="mt-6 p-4 bg-muted/50 rounded-lg">
                <p className="text-sm text-muted-foreground text-center">
                  ✨ <strong>Acesso antecipado:</strong> Membros da lista VIP recebem convites 2-4 semanas antes do lançamento público
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
};