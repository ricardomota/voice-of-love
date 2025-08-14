import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { Heart, Users, Clock, CheckCircle, Sparkles, Mail, ArrowRight } from 'lucide-react';

export const WaitlistSection: React.FC = () => {
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
                
                <h2 className="text-4xl font-zilla font-medium italic text-foreground">
                  Bem-vindo à família! 🎉
                </h2>
                
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
              </div>

              <div className="bg-background/50 rounded-lg p-6 space-y-3">
                <h3 className="font-semibold flex items-center justify-center gap-2">
                  <Sparkles className="w-4 h-4 text-primary" />
                  Próximos passos
                </h3>
                <ul className="text-sm text-muted-foreground space-y-2">
                  <li className="flex items-center justify-center gap-2">
                    <ArrowRight className="w-3 h-3" />
                    Você receberá updates por email sobre o progresso
                  </li>
                  <li className="flex items-center justify-center gap-2">
                    <ArrowRight className="w-3 h-3" />
                    Convites beta serão enviados gradualmente
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
        <div className="text-center space-y-6 mb-16">
          <Badge variant="secondary" className="px-4 py-2 text-sm font-medium">
            <Clock className="w-4 h-4 mr-2" />
            Beta Privado em Breve
          </Badge>
          
          <h2 className="text-4xl sm:text-5xl font-zilla font-medium italic text-foreground">
            Entre na <span className="text-primary">waitlist</span>
          </h2>
          
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Junte-se à nossa lista de espera e ganhe acesso antecipado à primeira plataforma 
            que preserva vozes e cria conexões eternas com IA.
          </p>

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