import React from 'react';
import { useLanguage } from '@/hooks/useLanguage';
import { LanguageSelector } from '@/components/ui/language-selector';
import { Heart, Brain, Shield, Smartphone, Check, ArrowRight, Quote } from 'lucide-react';

interface RileyLandingPageProps {
  onTryFree: () => void;
  onSignIn: () => void;
  onLearnMore: () => void;
  onSeePricing?: () => void;
}

const getContent = (language: string) => {
  const content = {
    en: {
      logo: "Eterna",
      nav: {
        features: "Features",
        howItWorks: "How It Works",
        pricing: "Pricing",
      },
      cta: "Get Started",
      hero: {
        title: "Preserve the voices you love forever",
        subtitle: "AI-powered memory preservation for families facing Alzheimer's",
        description: "Transform precious memories into real conversations. Using advanced AI, you can hear the voice and feel the presence of those you love most, even as memories begin to fade.",
        buttonPrimary: "Start Free",
        buttonSecondary: "Learn More",
        features: ["No credit card required", "5 free conversations", "Setup in minutes"]
      },
      features: {
        title: "Built for what matters most",
        items: [{
          icon: Brain,
          title: "Voice Preservation",
          description: "Advanced AI captures the unique essence of speech patterns and personality, preserving not just words but the way they're spoken."
        }, {
          icon: Heart,
          title: "Family Memories",
          description: "Organize photos, stories, and special moments in one place. Each profile tells a unique and personal story."
        }, {
          icon: Shield,
          title: "Private & Secure",
          description: "Your memories are sacred. All data is encrypted and never shared. Only your family has access."
        }, {
          icon: Smartphone,
          title: "Easy to Use",
          description: "Simple interface designed for all ages. Start conversations with just a few taps."
        }]
      },
      howItWorks: {
        title: "Simple as having a conversation",
        steps: [{
          number: "01",
          title: "Share Memories",
          description: "Upload photos, voice recordings, and stories that capture their essence."
        }, {
          number: "02",
          title: "AI Learns",
          description: "Our technology carefully studies speech patterns and personality traits."
        }, {
          number: "03",
          title: "Start Talking",
          description: "Have natural conversations whenever you need to feel close to them."
        }]
      },
      stories: {
        title: "Stories that keep us close",
        readMore: "Read full story",
        items: [
          {
            title: "Grandma Anna's Sunday songs",
            excerpt: "Every Sunday, her voice would fill the house with warmth. We captured that feeling so the family can revisit it together.",
            author: "Lucas, grandson"
          },
          {
            title: "Dad's advice on tough days",
            excerpt: "When decisions get hard, hearing his tone brings clarity and calm—just like it used to.",
            author: "Marina, daughter"
          },
          {
            title: "The story behind the old photo",
            excerpt: "We discovered the meaning of a faded photograph through a conversation that felt real and present.",
            author: "Diego, nephew"
          }
        ]
      },
      pricing: {
        title: "Choose your plan",
        free: {
          name: "Free",
          price: "$0",
          period: "/month",
          description: "Perfect to get started",
          features: ["5 conversations/month", "1 voice profile", "Basic support"],
          button: "Start Free"
        },
        paid: {
          name: "Family",
          price: "$29",
          period: "/month",
          description: "For families who want more",
          features: ["Unlimited conversations", "Unlimited profiles", "Priority support", "Cloud backup"],
          button: "Try Free for 7 Days",
          popular: true
        }
      },
      finalCta: {
        title: "Your first conversation is just one click away",
        subtitle: "Don't let precious memories fade. Preserve the voice of those you love today.",
        button: "Create My First Conversation"
      }
    },
    'pt-BR': {
      logo: "Eterna",
      nav: {
        features: "Funcionalidades",
        howItWorks: "Como Funciona",
        pricing: "Preços",
      },
      cta: "Começar",
      hero: {
        title: "Preserve a voz de quem você ama para sempre",
        subtitle: "Preservação de memórias com IA para famílias enfrentando o Alzheimer",
        description: "Transforme memórias preciosas em conversas reais. Com inteligência artificial avançada, você pode ouvir a voz e sentir a presença de quem mais ama, mesmo quando as memórias começam a desaparecer.",
        buttonPrimary: "Começar Grátis",
        buttonSecondary: "Saiba Mais",
        features: ["Sem cartão de crédito", "5 conversas gratuitas", "Configuração em minutos"]
      },
      features: {
        title: "Criado para o que realmente importa",
        items: [{
          icon: Brain,
          title: "Preservação da Voz",
          description: "IA avançada captura a essência única dos padrões de fala e personalidade, preservando não apenas palavras, mas a forma como são ditas."
        }, {
          icon: Heart,
          title: "Memórias da Família",
          description: "Organize fotos, histórias e momentos especiais em um só lugar. Cada perfil conta uma história única e pessoal."
        }, {
          icon: Shield,
          title: "Privado e Seguro",
          description: "Suas memórias são sagradas. Todos os dados são criptografados e nunca compartilhados. Apenas sua família tem acesso."
        }, {
          icon: Smartphone,
          title: "Fácil de Usar",
          description: "Interface simples projetada para todas as idades. Inicie conversas com apenas alguns toques."
        }]
      },
      howItWorks: {
        title: "Simples como ter uma conversa",
        steps: [{
          number: "01",
          title: "Compartilhe Memórias",
          description: "Envie fotos, gravações de voz e histórias que capturam sua essência."
        }, {
          number: "02",
          title: "IA Aprende",
          description: "Nossa tecnologia estuda cuidadosamente padrões de fala e traços de personalidade."
        }, {
          number: "03",
          title: "Comece a Conversar",
          description: "Tenha conversas naturais sempre que precisar se sentir próximo a eles."
        }]
      },
      stories: {
        title: "Histórias que nos mantêm próximos",
        readMore: "Ler história completa",
        items: [
          {
            title: "Os cantos de domingo da Vó Maria",
            excerpt: "Todo domingo, a voz dela enchia a casa de calor. Registramos esse sentimento para a família reviver junta.",
            author: "Lucas, neto"
          },
          {
            title: "Os conselhos do pai nos dias difíceis",
            excerpt: "Quando as decisões ficam difíceis, ouvir o tom de voz dele traz clareza e calma — como sempre foi.",
            author: "Marina, filha"
          },
          {
            title: "A história por trás da foto antiga",
            excerpt: "Descobrimos o significado de uma fotografia desbotada em uma conversa que pareceu real e presente.",
            author: "Diego, sobrinho"
          }
        ]
      },
      pricing: {
        title: "Escolha seu plano",
        free: {
          name: "Gratuito",
          price: "R$0",
          period: "/mês",
          description: "Perfeito para começar",
          features: ["5 conversas/mês", "1 perfil de voz", "Suporte básico"],
          button: "Começar Grátis"
        },
        paid: {
          name: "Família",
          price: "R$29",
          period: "/mês",
          description: "Para famílias que querem mais",
          features: ["Conversas ilimitadas", "Perfis ilimitados", "Suporte prioritário", "Backup na nuvem"],
          button: "Teste 7 Dias Grátis",
          popular: true
        }
      },
      finalCta: {
        title: "Sua primeira conversa está a um clique de distância",
        subtitle: "Não deixe que memórias preciosas se percam. Preserve hoje a voz de quem você ama.",
        button: "Criar Minha Primeira Conversa"
      }
    },
    'es': {
      logo: "Eterna",
      nav: {
        features: "Características",
        howItWorks: "Cómo Funciona",
        pricing: "Precios",
      },
      cta: "Comenzar",
      hero: {
        title: "Preserva las voces que amas para siempre",
        subtitle: "Preservación de memorias con IA para familias que enfrentan Alzheimer",
        description: "Transforma recuerdos preciosos en conversaciones reales. Con inteligencia artificial avanzada, puedes escuchar la voz y sentir la presencia de quienes más amas, incluso cuando los recuerdos comienzan a desvanecerse.",
        buttonPrimary: "Comenzar Gratis",
        buttonSecondary: "Saber Más",
        features: ["Sin tarjeta de crédito", "5 conversaciones gratuitas", "Configuración en minutos"]
      },
      features: {
        title: "Creado para lo que realmente importa",
        items: [{
          icon: Brain,
          title: "Preservación de Voz",
          description: "IA avanzada captura la esencia única de los patrones de habla y personalidad, preservando no solo palabras sino la forma en que se dicen."
        }, {
          icon: Heart,
          title: "Memorias Familiares",
          description: "Organiza fotos, historias y momentos especiales en un solo lugar. Cada perfil cuenta una historia única y personal."
        }, {
          icon: Shield,
          title: "Privado y Seguro",
          description: "Tus memorias son sagradas. Todos los datos están encriptados y nunca se comparten. Solo tu familia tiene acceso."
        }, {
          icon: Smartphone,
          title: "Fácil de Usar",
          description: "Interfaz simple diseñada para todas las edades. Inicia conversaciones con solo unos toques."
        }]
      },
      howItWorks: {
        title: "Simple como tener una conversación",
        steps: [{
          number: "01",
          title: "Comparte Memorias",
          description: "Sube fotos, grabaciones de voz e historias que capturen su esencia."
        }, {
          number: "02",
          title: "IA Aprende",
          description: "Nuestra tecnología estudia cuidadosamente los patrones de habla y rasgos de personalidad."
        }, {
          number: "03",
          title: "Comienza a Hablar",
          description: "Ten conversaciones naturales cuando necesites sentirte cerca de ellos."
        }]
      },
      stories: {
        title: "Historias que nos mantienen cerca",
        readMore: "Leer historia completa",
        items: [
          {
            title: "Las canciones de los domingos de la abuela Ana",
            excerpt: "Cada domingo, su voz llenaba la casa de calidez. Capturamos esa sensación para que la familia la reviva junta.",
            author: "Lucas, nieto"
          },
          {
            title: "Los consejos de papá en días difíciles",
            excerpt: "Cuando las decisiones se vuelven duras, escuchar su tono trae claridad y calma—como siempre.",
            author: "Marina, hija"
          },
          {
            title: "La historia detrás de la foto antigua",
            excerpt: "Descubrimos el significado de una fotografía desvanecida en una conversación que se sintió real y presente.",
            author: "Diego, sobrino"
          }
        ]
      },
      pricing: {
        title: "Elige tu plan",
        free: {
          name: "Gratuito",
          price: "$0",
          period: "/mes",
          description: "Perfecto para empezar",
          features: ["5 conversaciones/mes", "1 perfil de voz", "Soporte básico"],
          button: "Comenzar Gratis"
        },
        paid: {
          name: "Familia",
          price: "$29",
          period: "/mes",
          description: "Para familias que quieren más",
          features: ["Conversaciones ilimitadas", "Perfiles ilimitados", "Soporte prioritario", "Respaldo en la nube"],
          button: "Prueba 7 Días Gratis",
          popular: true
        }
      },
      finalCta: {
        title: "Tu primera conversación está a un clic de distancia",
        subtitle: "No dejes que los recuerdos preciosos se desvanezcan. Preserva hoy la voz de quienes amas.",
        button: "Crear Mi Primera Conversación"
      }
    }
  };
  return content[language as keyof typeof content] || content.en;
};

export const RileyLandingPage: React.FC<RileyLandingPageProps> = ({
  onTryFree,
  onSignIn,
  onLearnMore,
  onSeePricing
}) => {
  const { currentLanguage } = useLanguage();
  const content = getContent(currentLanguage);

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md border-b border-border">
        <nav className="container flex items-center justify-between py-4">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-lg bg-primary">
              <Heart className="w-5 h-5 text-primary-foreground" />
            </div>
            <span className="text-xl font-semibold text-foreground">
              {content.logo}
            </span>
          </div>

          <ul className="hidden md:flex items-center gap-8">
            <li>
              <a href="#features" className="text-muted-foreground hover:text-foreground transition-colors">
                {content.nav.features}
              </a>
            </li>
            <li>
              <a href="#how-it-works" className="text-muted-foreground hover:text-foreground transition-colors">
                {content.nav.howItWorks}
              </a>
            </li>
            <li>
              <a href="#pricing" className="text-muted-foreground hover:text-foreground transition-colors">
                {content.nav.pricing}
              </a>
            </li>
          </ul>

          <div className="flex items-center gap-4">
            <LanguageSelector />
            <button 
              onClick={onTryFree} 
              className="btn-primary"
            >
              {content.cta}
            </button>
          </div>
        </nav>
      </header>

      {/* Hero Section */}
      <section className="pt-32 pb-20">
        <div className="container">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-5xl md:text-6xl font-bold text-foreground mb-6 leading-tight">
              {content.hero.title}
            </h1>
            
            <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto leading-relaxed">
              {content.hero.subtitle}
            </p>
            
            <p className="text-lg text-muted-foreground mb-12 max-w-3xl mx-auto">
              {content.hero.description}
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
              <button 
                onClick={onTryFree} 
                className="btn-primary text-lg px-8 py-4"
              >
                {content.hero.buttonPrimary}
              </button>
              <button 
                onClick={onLearnMore} 
                className="btn-secondary text-lg px-8 py-4"
              >
                {content.hero.buttonSecondary}
              </button>
            </div>

            <div className="flex flex-wrap justify-center gap-6 text-sm text-muted-foreground">
              {content.hero.features.map((feature, index) => (
                <div key={index} className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-primary" />
                  {feature}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20">
        <div className="container">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-foreground mb-4">
              {content.features.title}
            </h2>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {content.features.items.map((feature, index) => {
              const IconComponent = feature.icon;
              return (
                <div key={index} className="glass-card text-center">
                  <div className="w-12 h-12 mx-auto mb-4 rounded-lg bg-accent flex items-center justify-center">
                    <IconComponent className="w-6 h-6 text-accent-foreground" />
                  </div>
                  <h3 className="text-lg font-semibold text-foreground mb-3">
                    {feature.title}
                  </h3>
                  <p className="text-muted-foreground leading-relaxed">
                    {feature.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Stories Section */}
      <section id="stories" className="py-20">
        <div className="container">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-foreground mb-4 animate-fade-in-up">
              {content.stories.title}
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-6 max-w-6xl mx-auto">
            {content.stories.items.map((story, idx) => (
              <article key={idx} className="glass-card hover-scale animate-fade-in-up" style={{animationDelay: `${idx * 100}ms`}}>
                <div className="w-12 h-12 rounded-full bg-accent flex items-center justify-center mb-4">
                  <Quote className="w-6 h-6 text-accent-foreground" />
                </div>
                <h3 className="text-xl font-semibold text-foreground mb-2">{story.title}</h3>
                <p className="text-muted-foreground mb-4">{story.excerpt}</p>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">{story.author}</span>
                  <a href="#" className="story-link text-sm">
                    {content.stories.readMore}
                  </a>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="py-20">
        <div className="container">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-foreground mb-4">
              {content.howItWorks.title}
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            {content.howItWorks.steps.map((step, index) => (
              <div key={index} className="text-center">
                <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-2xl font-bold">
                  {step.number}
                </div>
                <h3 className="text-xl font-semibold text-foreground mb-4">
                  {step.title}
                </h3>
                <p className="text-muted-foreground leading-relaxed">
                  {step.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-20">
        <div className="container">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-foreground mb-4">
              {content.pricing.title}
            </h2>
          </div>

          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {/* Free Plan */}
            <div className="glass-card">
              <h3 className="text-2xl font-semibold text-foreground mb-2">
                {content.pricing.free.name}
              </h3>
              <div className="mb-4">
                <span className="text-4xl font-bold text-foreground">
                  {content.pricing.free.price}
                </span>
                <span className="text-muted-foreground">
                  {content.pricing.free.period}
                </span>
              </div>
              <p className="text-muted-foreground mb-6">
                {content.pricing.free.description}
              </p>
              <ul className="space-y-3 mb-8">
                {content.pricing.free.features.map((feature, index) => (
                  <li key={index} className="flex items-center gap-3">
                    <Check className="w-5 h-5 text-primary" />
                    <span className="text-foreground">{feature}</span>
                  </li>
                ))}
              </ul>
              <button 
                onClick={onTryFree} 
                className="btn-secondary w-full"
              >
                {content.pricing.free.button}
              </button>
            </div>

            {/* Paid Plan */}
            <div className="glass-card relative">
              {content.pricing.paid.popular && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                  <span className="bg-primary text-primary-foreground px-4 py-1 rounded-full text-sm font-medium">
                    Popular
                  </span>
                </div>
              )}
              <h3 className="text-2xl font-semibold text-foreground mb-2">
                {content.pricing.paid.name}
              </h3>
              <div className="mb-4">
                <span className="text-4xl font-bold text-foreground">
                  {content.pricing.paid.price}
                </span>
                <span className="text-muted-foreground">
                  {content.pricing.paid.period}
                </span>
              </div>
              <p className="text-muted-foreground mb-6">
                {content.pricing.paid.description}
              </p>
              <ul className="space-y-3 mb-8">
                {content.pricing.paid.features.map((feature, index) => (
                  <li key={index} className="flex items-center gap-3">
                    <Check className="w-5 h-5 text-primary" />
                    <span className="text-foreground">{feature}</span>
                  </li>
                ))}
              </ul>
              <button 
                onClick={onTryFree} 
                className="btn-primary w-full"
              >
                {content.pricing.paid.button}
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA Section */}
      <section className="py-20">
        <div className="container">
          <div className="text-center max-w-2xl mx-auto">
            <h2 className="text-4xl font-bold text-foreground mb-6">
              {content.finalCta.title}
            </h2>
            <p className="text-xl text-muted-foreground mb-8">
              {content.finalCta.subtitle}
            </p>
            <button 
              onClick={onTryFree} 
              className="btn-primary text-lg px-8 py-4 inline-flex items-center gap-2"
            >
              {content.finalCta.button}
              <ArrowRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 border-t border-border">
        <div className="container text-center">
          <p className="text-muted-foreground">
            © 2024 Eterna. Built with love for families.
          </p>
        </div>
      </footer>
    </div>
  );
};