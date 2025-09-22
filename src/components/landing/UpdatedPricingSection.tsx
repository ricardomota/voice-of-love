import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Check, AlertTriangle, Heart, MessageCircle, Users } from 'lucide-react';
import { motion } from 'framer-motion';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useLanguage } from '@/hooks/useLanguage';

interface UpdatedPricingSectionProps {
  onJoinWaitlist: () => void;
}

interface PlanData {
  title: string;
  slogan: string;
  price: string;
  period?: string;
  features: string[];
  cta: string;
  popular: boolean;
}

export const UpdatedPricingSection: React.FC<UpdatedPricingSectionProps> = ({ onJoinWaitlist }) => {
  const { currentLanguage } = useLanguage();

  const content = {
    en: {
      title: "Transparent Pricing for When We Launch",
      subtitle: "See our planned pricing structure. During beta, everything is completely free while we perfect the experience.",
      disclaimer: "Beta Notice: Eterna is currently in development. All features shown are free during our testing phase. Payments will only be activated after we exit beta.",
      betaAccess: "All features available free during beta testing",
      plans: {
        free: {
          title: "First Memories",
          slogan: "Start preserving with love",
          price: "Always Free",
          features: [
            "1 loved one profile",
            "Basic personality traits",
            "Text-based conversations",
            "Photo memory uploads",
            "Community support"
          ],
          cta: "Join Waitlist",
          popular: false
        } as PlanData,
        family: {
          title: "Family Circle",
          slogan: "For close family connections",
          price: "$29",
          period: "/month",
          features: [
            "Up to 3 loved ones",
            "Voice message generation",
            "Advanced personality modeling",
            "Audio memory uploads",
            "Family sharing (5 members)",
            "Priority support"
          ],
          cta: "Join Waitlist",
          popular: true
        } as PlanData,
        legacy: {
          title: "Eternal Legacy",
          slogan: "Preserve everything forever",
          price: "$79",
          period: "/month",
          features: [
            "Unlimited profiles",
            "Custom voice cloning",
            "Video memory integration",
            "Advanced AI interactions",
            "Extended family sharing",
            "White-glove setup support"
          ],
          cta: "Join Waitlist",
          popular: false
        } as PlanData
      }
    },
    'pt-BR': {
      title: "Preços Transparentes para Quando Lançarmos",
      subtitle: "Veja nossa estrutura de preços planejada. Durante o beta, tudo é completamente gratuito enquanto aperfeiçoamos a experiência.",
      disclaimer: "Aviso Beta: Eterna está atualmente em desenvolvimento. Todos os recursos mostrados são gratuitos durante nossa fase de testes. Pagamentos só serão ativados após sairmos do beta.",
      betaAccess: "Todos os recursos disponíveis gratuitamente durante os testes beta",
      plans: {
        free: {
          title: "Primeiras Memórias",
          slogan: "Comece a preservar com amor",
          price: "Sempre Grátis",
          features: [
            "1 perfil de ente querido",
            "Traços básicos de personalidade",
            "Conversas baseadas em texto",
            "Upload de memórias em foto",
            "Suporte da comunidade"
          ],
          cta: "Entrar na Lista",
          popular: false
        } as PlanData,
        family: {
          title: "Círculo Familiar",
          slogan: "Para conexões familiares próximas",
          price: "R$ 149",
          period: "/mês",
          features: [
            "Até 3 entes queridos",
            "Geração de mensagens de voz",
            "Modelagem avançada de personalidade",
            "Upload de memórias em áudio",
            "Compartilhamento familiar (5 membros)",
            "Suporte prioritário"
          ],
          cta: "Entrar na Lista",
          popular: true
        } as PlanData,
        legacy: {
          title: "Legado Eterno",
          slogan: "Preserve tudo para sempre",
          price: "R$ 399",
          period: "/mês",
          features: [
            "Perfis ilimitados",
            "Clonagem de voz personalizada",
            "Integração de memórias em vídeo",
            "Interações avançadas de IA",
            "Compartilhamento familiar estendido",
            "Suporte de configuração personalizada"
          ],
          cta: "Entrar na Lista",
          popular: false
        } as PlanData
      }
    }
  };

  const text = content[currentLanguage as keyof typeof content] || content.en;
  const planOrder = [text.plans.free, text.plans.family, text.plans.legacy];

  return (
    <section id="pricing" className="py-24 bg-gradient-to-br from-background via-background/98 to-background/95">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Beta Disclaimer */}
        <div className="max-w-4xl mx-auto mb-16">
          <Alert className="bg-amber-50 border-amber-200 dark:bg-amber-950/20 dark:border-amber-800">
            <AlertTriangle className="h-4 w-4 text-amber-600 dark:text-amber-400" />
            <AlertDescription className="text-amber-800 dark:text-amber-200 font-medium">
              <strong>{currentLanguage === 'pt-BR' ? 'Aviso Beta' : 'Beta Notice'}:</strong> {text.disclaimer}
            </AlertDescription>
          </Alert>
        </div>

        {/* Header */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center max-w-4xl mx-auto mb-16"
        >
          <h2 className="text-4xl sm:text-5xl md:text-6xl font-bold text-foreground mb-8 tracking-tight leading-tight">
            {text.title}
          </h2>
          <p className="text-xl sm:text-2xl text-muted-foreground/80 leading-relaxed font-light max-w-4xl mx-auto mb-8">
            {text.subtitle}
          </p>
          
          {/* Beta access badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 text-sm font-medium">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
            {text.betaAccess}
          </div>
        </motion.div>

        {/* Pricing Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {planOrder.map((plan, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
            >
              <Card className={`relative h-full transition-all duration-300 border hover:shadow-xl bg-card/80 backdrop-blur-sm rounded-2xl overflow-hidden group hover:scale-[1.02] ${
                plan.popular ? 'border-primary/50 shadow-lg' : 'border-border/30 hover:border-primary/20'
              }`}>
                {plan.popular && (
                  <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                    <Badge className="bg-primary text-primary-foreground px-3 py-1">
                      {currentLanguage === 'pt-BR' ? 'Mais Popular' : 'Most Popular'}
                    </Badge>
                  </div>
                )}

                <CardContent className="p-10 space-y-8">
                  {/* Plan header */}
                  <div className="text-center space-y-4">
                    <div className={`w-16 h-16 mx-auto rounded-2xl flex items-center justify-center ${
                      index === 0 ? 'bg-gradient-to-br from-accent/20 to-accent/10' :
                      index === 1 ? 'bg-gradient-to-br from-primary/20 to-primary/10' :
                      'bg-gradient-to-br from-primary/30 to-primary/20'
                    }`}>
                      {index === 0 && <Heart className="w-8 h-8 text-accent" />}
                      {index === 1 && <MessageCircle className="w-8 h-8 text-primary" />}
                      {index === 2 && <Users className="w-8 h-8 text-primary" />}
                    </div>
                    
                    <div>
                      <h3 className="text-2xl font-bold text-foreground mb-2">
                        {plan.title}
                      </h3>
                      <p className="text-muted-foreground italic text-base leading-relaxed">
                        "{plan.slogan}"
                      </p>
                    </div>

                    {/* Price */}
                    <div className="flex items-baseline justify-center gap-1">
                      <span className="text-4xl font-bold text-foreground">
                        {plan.price}
                      </span>
                      {plan.period && (
                        <span className="text-lg text-muted-foreground">
                          {plan.period}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Features */}
                  <div className="space-y-4">
                    {plan.features.map((feature, featureIndex) => (
                      <div key={featureIndex} className="flex items-start gap-3">
                        <div className="flex-shrink-0 w-5 h-5 bg-primary/10 rounded-full flex items-center justify-center mt-0.5">
                          <Check className="w-3 h-3 text-primary" />
                        </div>
                        <span className="text-muted-foreground text-sm leading-relaxed">
                          {feature}
                        </span>
                      </div>
                    ))}
                  </div>

                  {/* CTA Button */}
                  <Button 
                    onClick={onJoinWaitlist}
                    className={`w-full h-14 text-lg font-medium transition-all duration-200 ${
                      plan.popular 
                        ? 'bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg hover:shadow-xl' 
                        : 'bg-secondary hover:bg-secondary/80 text-secondary-foreground'
                    }`}
                  >
                    {plan.cta}
                  </Button>

                  {/* Beta note */}
                  <p className="text-xs text-center text-muted-foreground italic">
                    {currentLanguage === 'pt-BR' 
                      ? 'Gratuito durante o beta - junte-se à lista para acesso antecipado'
                      : 'Free during beta - join waitlist for early access'
                    }
                  </p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Additional info */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="text-center mt-16"
        >
          <p className="text-sm text-muted-foreground max-w-2xl mx-auto">
            {currentLanguage === 'pt-BR' 
              ? 'Nossos preços são transparentes e justos. Durante o beta, você pode experimentar todos os recursos gratuitamente enquanto desenvolvemos a plataforma perfeita para preservar suas memórias mais preciosas.'
              : 'Our pricing is transparent and fair. During beta, you can experience all features for free while we develop the perfect platform to preserve your most precious memories.'
            }
          </p>
        </motion.div>
      </div>
    </section>
  );
};