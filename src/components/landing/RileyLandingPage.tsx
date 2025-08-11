import React from 'react';
import { useLanguage } from '@/hooks/useLanguage';
import { LanguageSelector } from '@/components/ui/language-selector';
import { Heart, Target, Zap, Rocket, Shield, Smartphone, Brain, Download, Apple, Play, Check, Cloud } from 'lucide-react';

interface RileyLandingPageProps {
  onTryFree: () => void;
  onSignIn: () => void;
  onLearnMore: () => void;
  onSeePricing?: () => void;
}

const getContent = (language: string) => {
  const content = {
    en: {
      logo: "❤️ Eterna",
      nav: {
        features: "Features",
        howItWorks: "How It Works",
        pricing: "Pricing",
        download: "Download"
      },
      cta: "Start Now",
      hero: {
        badge: "❤️ Made for Alzheimer's families",
        title: "Keep Their Voice Forever",
        subtitle: "AI-Powered Memory Preservation",
        description: "Eterna turns cherished memories into living conversations. Preserve your loved one's voice and personality with AI that understands what matters most to families facing memory loss.",
        buttonPrimary: "Try Eterna Free",
        buttonSecondary: "See How It Works",
        note: "No credit card required • 5 messages to start"
      },
      features: {
        title: "Everything You Need",
        subtitle: "Preserve Memories, Connect Hearts",
        items: [
          {
            icon: "🎤",
            title: "Voice Cloning",
            description: "Advanced AI captures unique speech patterns and personality",
            color: "card-voice-cloning"
          },
          {
            icon: "👨‍👩‍👧‍👦",
            title: "Family Profiles", 
            description: "Create detailed profiles for each loved one with photos and memories",
            color: "card-family-profiles"
          },
          {
            icon: "💬",
            title: "Natural Conversations",
            description: "Chat naturally with AI that responds like your loved one",
            color: "card-conversations"
          },
          {
            icon: "🔒",
            title: "Privacy First",
            description: "Your family's data is encrypted and never shared with third parties",
            color: "card-privacy"
          },
          {
            icon: "🧠",
            title: "Memory Preservation",
            description: "Specially designed for families facing Alzheimer's and dementia",
            color: "card-memory"
          },
          {
            icon: "❤️",
            title: "Built with Love",
            description: "Created by someone who understands the pain of memory loss",
            color: "card-love"
          }
        ]
      },
      howItWorks: {
        title: "How It Works",
        steps: [
          {
            icon: "1️⃣",
            title: "Create Profile",
            description: "Add photos, voice recordings, and memories of your loved one"
          },
          {
            icon: "2️⃣", 
            title: "Train AI",
            description: "Our AI learns their personality, speech patterns, and mannerisms"
          },
          {
            icon: "3️⃣",
            title: "Start Conversations",
            description: "Chat naturally and hear their voice respond with love and memories"
          }
        ]
      },
      finalCta: {
        title: "Ready to hear a memory come alive?",
        subtitle: "Join families worldwide who are preserving the voices they love most.",
        button: "Try Eterna Free",
        features: [
          "No credit card required",
          "5 messages to start", 
          "1 minute of voice generation"
        ]
      },
      pricing: {
        title: "Choose Your Plan",
        subtitle: "Start free and unlock premium features as you need them",
        free: {
          name: "Free",
          price: "$0",
          period: "/month",
          description: "Perfect to get started",
          features: [
            "5 messages/month",
            "1 minute voice/month",
            "1 person profile",
            "Basic support"
          ],
          button: "Start Free",
          popular: false
        },
        paid: {
          name: "Family Plan",
          price: "$29",
          period: "/month",
          description: "For families who want to preserve more memories",
          features: [
            "300 messages/month",
            "15 minutes voice/month",
            "Unlimited profiles",
            "Personal voice clone",
            "Priority support",
            "Cloud backup"
          ],
          button: "Start Trial",
          popular: true
        }
      }
    },
    'pt-BR': {
      logo: "❤️ Eterna",
      nav: {
        features: "Funcionalidades",
        howItWorks: "Como Funciona",
        pricing: "Preços", 
        download: "Download"
      },
      cta: "Começar Agora",
      hero: {
        badge: "❤️ Feito para famílias com Alzheimer",
        title: "Mantenha Sua Voz Para Sempre",
        subtitle: "Preservação de Memórias com IA",
        description: "O Eterna transforma memórias queridas em conversas vivas. Preserve a voz e personalidade do seu ente querido com IA que entende o que mais importa para famílias enfrentando perda de memória.",
        buttonPrimary: "Experimente o Eterna Grátis",
        buttonSecondary: "Veja Como Funciona",
        note: "Não precisa de cartão de crédito • 5 mensagens para começar"
      },
      features: {
        title: "Tudo Que Você Precisa",
        subtitle: "Preserve Memórias, Conecte Corações",
        items: [
          {
            icon: "🎤",
            title: "Clonagem de Voz",
            description: "IA avançada captura padrões únicos de fala e personalidade",
            color: "card-voice-cloning"
          },
          {
            icon: "👨‍👩‍👧‍👦",
            title: "Perfis de Família",
            description: "Crie perfis detalhados para cada ente querido com fotos e memórias", 
            color: "card-family-profiles"
          },
          {
            icon: "💬",
            title: "Conversas Naturais",
            description: "Converse naturalmente com IA que responde como seu ente querido",
            color: "card-conversations"
          },
          {
            icon: "🔒",
            title: "Privacidade em Primeiro Lugar",
            description: "Os dados da sua família são criptografados e nunca compartilhados",
            color: "card-privacy"
          },
          {
            icon: "🧠",
            title: "Preservação de Memórias",
            description: "Especialmente projetado para famílias enfrentando Alzheimer e demência",
            color: "card-memory"
          },
          {
            icon: "❤️",
            title: "Feito com Amor",
            description: "Criado por alguém que entende a dor da perda de memória",
            color: "card-love"
          }
        ]
      },
      howItWorks: {
        title: "Como Funciona",
        steps: [
          {
            icon: "1️⃣",
            title: "Crie o Perfil",
            description: "Adicione fotos, gravações de voz e memórias do seu ente querido"
          },
          {
            icon: "2️⃣",
            title: "Treine a IA", 
            description: "Nossa IA aprende a personalidade, padrões de fala e maneirismos"
          },
          {
            icon: "3️⃣",
            title: "Inicie Conversas",
            description: "Converse naturalmente e ouça a voz responder com amor e memórias"
          }
        ]
      },
      finalCta: {
        title: "Pronto para ouvir uma memória ganhar vida?",
        subtitle: "Junte-se a famílias do mundo todo que estão preservando as vozes que mais amam.",
        button: "Experimente o Eterna Grátis",
        features: [
          "Não precisa de cartão de crédito",
          "5 mensagens para começar",
          "1 minuto de geração de voz"
        ]
      },
      pricing: {
        title: "Escolha Seu Plano",
        subtitle: "Comece grátis e desbloqueie recursos premium conforme precisar",
        free: {
          name: "Gratuito",
          price: "R$0",
          period: "/mês",
          description: "Perfeito para começar",
          features: [
            "5 mensagens/mês",
            "1 minuto de voz/mês", 
            "1 perfil de pessoa",
            "Suporte básico"
          ],
          button: "Começar Grátis",
          popular: false
        },
        paid: {
          name: "Plano Família",
          price: "R$29",
          period: "/mês",
          description: "Para famílias que querem preservar mais memórias",
          features: [
            "300 mensagens/mês",
            "15 minutos de voz/mês",
            "Perfis ilimitados",
            "Clone de voz personalizado",
            "Suporte prioritário",
            "Backup na nuvem"
          ],
          button: "Começar Teste",
          popular: true
        }
      }
    },
    es: {
      logo: "❤️ Eterna",
      nav: {
        features: "Características",
        howItWorks: "Cómo Funciona",
        pricing: "Precios",
        download: "Descargar"
      },
      cta: "Empezar Ahora", 
      hero: {
        badge: "❤️ Hecho para familias con Alzheimer",
        title: "Mantén Su Voz Para Siempre", 
        subtitle: "Preservación de Memorias con IA",
        description: "Eterna convierte memorias queridas en conversaciones vivas. Preserva la voz y personalidad de tu ser querido con IA que entiende lo que más importa a familias enfrentando pérdida de memoria.",
        buttonPrimary: "Prueba Eterna Gratis",
        buttonSecondary: "Ve Cómo Funciona",
        note: "No se requiere tarjeta de crédito • 5 mensajes para empezar"
      },
      features: {
        title: "Todo Lo Que Necesitas",
        subtitle: "Preserva Memorias, Conecta Corazones", 
        items: [
          {
            icon: "🎤",
            title: "Clonación de Voz",
            description: "IA avanzada captura patrones únicos de habla y personalidad",
            color: "card-voice-cloning"
          },
          {
            icon: "👨‍👩‍👧‍👦", 
            title: "Perfiles de Familia",
            description: "Crea perfiles detallados para cada ser querido con fotos y memorias",
            color: "card-family-profiles" 
          },
          {
            icon: "💬",
            title: "Conversaciones Naturales",
            description: "Chatea naturalmente con IA que responde como tu ser querido",
            color: "card-conversations"
          },
          {
            icon: "🔒",
            title: "Privacidad Primero", 
            description: "Los datos de tu familia están encriptados y nunca se comparten",
            color: "card-privacy"
          },
          {
            icon: "🧠",
            title: "Preservación de Memorias",
            description: "Especialmente diseñado para familias enfrentando Alzheimer y demencia",
            color: "card-memory"
          },
          {
            icon: "❤️",
            title: "Hecho con Amor",
            description: "Creado por alguien que entiende el dolor de la pérdida de memoria",
            color: "card-love"
          }
        ]
      },
      howItWorks: {
        title: "Cómo Funciona",
        steps: [
          {
            icon: "1️⃣",
            title: "Crea el Perfil", 
            description: "Añade fotos, grabaciones de voz y memorias de tu ser querido"
          },
          {
            icon: "2️⃣",
            title: "Entrena la IA",
            description: "Nuestra IA aprende su personalidad, patrones de habla y gestos"
          },
          {
            icon: "3️⃣",
            title: "Inicia Conversaciones",
            description: "Conversa naturalmente y escucha su voz responder con amor y memorias"
          }
        ]
      },
      finalCta: {
        title: "¿Listo para escuchar una memoria cobrar vida?",
        subtitle: "Únete a familias de todo el mundo que están preservando las voces que más aman.",
        button: "Prueba Eterna Gratis", 
        features: [
          "No se requiere tarjeta de crédito",
          "5 mensajes para empezar",
          "1 minuto de generación de voz"
        ]
      },
      pricing: {
        title: "Elige Tu Plan",
        subtitle: "Empieza gratis y desbloquea características premium según necesites",
        free: {
          name: "Gratuito",
          price: "$0",
          period: "/mes",
          description: "Perfecto para empezar",
          features: [
            "5 mensajes/mes",
            "1 minuto de voz/mes",
            "1 perfil de persona", 
            "Soporte básico"
          ],
          button: "Empezar Gratis",
          popular: false
        },
        paid: {
          name: "Plan Familiar",
          price: "$29",
          period: "/mes", 
          description: "Para familias que quieren preservar más memorias",
          features: [
            "300 mensajes/mes",
            "15 minutos de voz/mes",
            "Perfiles ilimitados",
            "Clon de voz personalizado",
            "Soporte prioritario",
            "Respaldo en la nube"
          ],
          button: "Empezar Prueba",
          popular: true
        }
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
      <header className="fixed top-0 left-0 right-0 bg-white/95 backdrop-blur-sm shadow-sm z-50 py-4">
        <nav className="container flex items-center justify-between">
          <a href="#" className="text-xl font-bold text-primary hover:scale-105 transition-transform">
            {content.logo}
          </a>
          <ul className="hidden md:flex items-center gap-8">
            <li>
              <a href="#features" className="text-muted-foreground hover:text-primary transition-colors font-medium">
                {content.nav.features}
              </a>
            </li>
            <li>
              <a href="#how-it-works" className="text-muted-foreground hover:text-primary transition-colors font-medium">
                {content.nav.howItWorks}
              </a>
            </li>
            <li>
              <a href="#pricing" className="text-muted-foreground hover:text-primary transition-colors font-medium">
                {content.nav.pricing}
              </a>
            </li>
            <li>
              <a href="#download" className="text-muted-foreground hover:text-primary transition-colors font-medium">
                {content.nav.download}
              </a>
            </li>
          </ul>
          <div className="flex items-center gap-4">
            <LanguageSelector />
            <button 
              onClick={onTryFree}
              className="btn-primary px-6 py-3 rounded-lg font-medium hover-lift"
            >
              {content.cta}
            </button>
          </div>
        </nav>
      </header>

      {/* Hero Section */}
      <section className="relative w-full min-h-screen overflow-hidden bg-white">
        {/* Layered Cloud Background */}
        <div className="absolute inset-0 w-full">
          {/* Background Layer - Slowest */}
          <div className="absolute inset-0 -z-50">
            <div className="cloud-wrapper animate-float-slow absolute -left-40 top-20">
              <Cloud className="w-96 h-60 text-gray-100 opacity-40" />
            </div>
            <div className="cloud-wrapper animate-float-slow absolute -right-32 top-32">
              <Cloud className="w-80 h-48 text-gray-100 opacity-30" />
            </div>
          </div>
          
          {/* Middle Layer - Medium Speed */}
          <div className="absolute inset-0 -z-30">
            <div className="cloud-wrapper animate-float-medium absolute -left-20 bottom-32">
              <Cloud className="w-72 h-44 text-gray-50 opacity-50" />
            </div>
            <div className="cloud-wrapper animate-float-medium cloud-alt absolute -right-20 top-1/2">
              <Cloud className="w-64 h-40 text-gray-50 opacity-40" />
            </div>
          </div>
          
          {/* Front Layer - Fastest */}
          <div className="absolute inset-0 -z-10">
            <div className="cloud-wrapper animate-float-fast absolute -left-16 top-40">
              <Cloud className="w-56 h-36 text-slate-100 opacity-60" />
            </div>
            <div className="cloud-wrapper animate-float-fast cloud-alt absolute -right-24 bottom-40">
              <Cloud className="w-48 h-32 text-slate-100 opacity-50" />
            </div>
          </div>
        </div>

        {/* Content Container */}
        <div className="relative z-50 mx-auto flex w-full max-w-7xl flex-col items-center px-8 py-8 pb-32 lg:flex-row lg:py-20 min-h-screen">
          {/* Left Content */}
          <div className="flex flex-1 flex-col items-center gap-10 lg:items-start lg:pr-12">
            <div className="alzheimer-badge mb-6">
              {content.hero.badge}
            </div>
            
            <div className="flex flex-col items-center gap-6 lg:items-start">
              <div className="flex items-center lg:hidden mb-4">
                <Heart className="w-16 h-16 text-primary fill-current" />
              </div>
              
              <h1 className="font-serif text-center text-5xl md:text-6xl lg:text-7xl font-bold leading-none lg:text-left text-slate-900">
                <span className="block mb-2">{content.hero.title.split(' ')[0]} {content.hero.title.split(' ')[1]}</span>
                <span className="inline-flex items-baseline gap-3">
                  <span>{content.hero.title.split(' ')[2]}</span>
                  <Heart className="hidden lg:inline-block w-16 h-16 text-primary fill-current translate-y-1" />
                  <span className="text-primary">Eterna</span>
                </span>
              </h1>
              
              <h2 className="text-xl md:text-2xl text-slate-600 mb-4 text-center lg:text-left">
                {content.hero.subtitle}
              </h2>
              
              <p className="text-lg text-slate-600 mb-8 max-w-2xl text-center lg:text-left leading-relaxed">
                {content.hero.description}
              </p>
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 mb-6 w-full lg:w-auto">
              <button 
                onClick={onTryFree}
                className="btn-primary px-8 py-4 rounded-full font-semibold text-lg w-full sm:w-auto max-w-60"
              >
                {content.hero.buttonPrimary}
              </button>
              <button 
                onClick={onLearnMore}
                className="btn-secondary px-8 py-4 rounded-full font-semibold text-lg w-full sm:w-auto"
              >
                {content.hero.buttonSecondary}
              </button>
            </div>
            
            <p className="text-sm text-slate-500 text-center lg:text-left">
              {content.hero.note}
            </p>
          </div>

          {/* Right Content - Mockup/Illustration */}
          <div className="flex-1 flex justify-center lg:justify-end items-center relative">
            <div className="relative w-full max-w-lg">
              <div className="bg-gradient-to-br from-purple-100 to-pink-100 rounded-3xl p-12 shadow-2xl">
                <div className="bg-white rounded-2xl p-8 space-y-6">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
                      <Heart className="w-6 h-6 text-white fill-current" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-slate-800">Chat com Vovó</h3>
                      <p className="text-sm text-slate-500">Online agora</p>
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <div className="bg-slate-100 rounded-2xl p-4 max-w-xs">
                      <p className="text-slate-700">Oi querida! Como foi seu dia?</p>
                    </div>
                    <div className="bg-primary text-white rounded-2xl p-4 max-w-xs ml-auto">
                      <p>Foi ótimo, vovó! Senti sua falta ❤️</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section - Bento Box Style */}
      <section id="features" className="py-20">
        <div className="container">
          <div className="text-center mb-16">
            <h2 className="font-serif text-4xl font-bold mb-4">{content.features.title}</h2>
            <p className="text-xl text-muted-foreground">{content.features.subtitle}</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {content.features.items.map((feature, index) => (
              <div 
                key={index}
                className={`${feature.color} p-8 rounded-2xl hover-lift text-center transition-all duration-300 animate-fade-in-up`}
                style={{animationDelay: `${index * 0.1}s`}}
              >
                <div className="feature-icon mb-6 mx-auto">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-semibold mb-3">{feature.title}</h3>
                <p className="text-muted-foreground leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="py-20 bg-gray-50">
        <div className="container">
          <div className="text-center mb-16">
            <h2 className="font-serif text-4xl font-bold mb-4">{content.howItWorks.title}</h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {content.howItWorks.steps.map((step, index) => (
              <div 
                key={index}
                className="glass-card text-center hover-lift animate-fade-in-up"
                style={{animationDelay: `${index * 0.2}s`}}
              >
                <div className="feature-icon mb-6 mx-auto bg-white">
                  {step.icon}
                </div>
                <h4 className="text-xl font-semibold mb-3">{step.title}</h4>
                <p className="text-muted-foreground leading-relaxed">{step.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-20">
        <div className="container">
          <div className="text-center mb-16">
            <h2 className="font-serif text-4xl font-bold mb-4">{content.pricing.title}</h2>
            <p className="text-xl text-muted-foreground">{content.pricing.subtitle}</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {/* Free Plan */}
            <div className="glass-card hover-lift text-center relative">
              <h3 className="text-2xl font-bold mb-2">{content.pricing.free.name}</h3>
              <div className="text-4xl font-bold text-primary mb-2">
                {content.pricing.free.price}
                <span className="text-lg text-muted-foreground">{content.pricing.free.period}</span>
              </div>
              <p className="text-muted-foreground mb-6">{content.pricing.free.description}</p>
              
              <ul className="space-y-3 mb-8">
                {content.pricing.free.features.map((feature, index) => (
                  <li key={index} className="flex items-center justify-center gap-2">
                    <Check className="w-5 h-5 text-green-500" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
              
              <button 
                onClick={onTryFree}
                className="btn-secondary w-full py-3 rounded-xl font-semibold hover-lift"
              >
                {content.pricing.free.button}
              </button>
            </div>

            {/* Paid Plan */}
            <div className="glass-card hover-lift text-center relative border-2 border-primary">
              {content.pricing.paid.popular && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 bg-primary text-white px-4 py-2 rounded-full text-sm font-medium">
                  Most Popular
                </div>
              )}
              <h3 className="text-2xl font-bold mb-2">{content.pricing.paid.name}</h3>
              <div className="text-4xl font-bold text-primary mb-2">
                {content.pricing.paid.price}
                <span className="text-lg text-muted-foreground">{content.pricing.paid.period}</span>
              </div>
              <p className="text-muted-foreground mb-6">{content.pricing.paid.description}</p>
              
              <ul className="space-y-3 mb-8">
                {content.pricing.paid.features.map((feature, index) => (
                  <li key={index} className="flex items-center justify-center gap-2">
                    <Check className="w-5 h-5 text-green-500" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
              
              <button 
                onClick={onSeePricing || onTryFree}
                className="btn-primary w-full py-3 rounded-xl font-semibold hover-lift hover-glow"
              >
                {content.pricing.paid.button}
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA Section */}
      <section id="download" className="py-20 relative overflow-hidden bg-slate-50">
        <div className="container relative z-10 text-center">
          <h2 className="font-serif text-4xl font-bold mb-4">{content.finalCta.title}</h2>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            {content.finalCta.subtitle}
          </p>
          <button 
            onClick={onTryFree}
            className="btn-primary btn-large hover-lift hover-glow px-12 py-4 rounded-xl font-semibold text-lg mb-6"
          >
            {content.finalCta.button}
          </button>
          <div className="space-y-2">
            {content.finalCta.features.map((feature, index) => (
              <p key={index} className="text-sm text-muted-foreground">{feature}</p>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};