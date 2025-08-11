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
        subtitle: "Start preserving precious memories with advanced AI technology.",
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
        subtitle: "Preserve memórias preciosas com tecnologia de IA avançada.",
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
        subtitle: "Preserva memorias preciosas con tecnología de IA avanzada.",
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
      <section className="hero">
        <div className="hero-content container">
          {/* Left Column - Content */}
          <div className="hero-left">
            <div className="alzheimer-badge mb-xl">
              {content.hero.badge}
            </div>
            
            <h1 className="hero-title font-serif mb-lg">
              {content.hero.title}
            </h1>
            
            <h2 className="hero-subtitle mb-xl">
              {content.hero.subtitle}
            </h2>
            
            <p className="text-large mb-2xl leading-relaxed text-gray-600">
              {content.hero.description}
            </p>

            <div className="flex gap-lg mb-xl" style={{flexWrap: 'wrap'}}>
              <button 
                onClick={onTryFree}
                className="btn btn-primary btn-large"
              >
                {content.hero.buttonPrimary}
              </button>
              <button 
                onClick={onLearnMore}
                className="btn btn-secondary btn-large"
              >
                {content.hero.buttonSecondary}
              </button>
            </div>
            
            <p className="text-small flex items-center gap-2 text-gray-500">
              <span className="w-2 h-2 bg-gray-400 rounded-full"></span>
              {content.hero.note}
            </p>
          </div>

          {/* Right Column - Image Placeholder */}
          <div className="hero-right">
            <div className="w-full h-96 bg-white rounded-2xl flex items-center justify-center border-2 border-gray-200 shadow-lg">
              <div className="text-center p-8">
                <Heart className="w-20 h-20 mx-auto mb-6" style={{color: '#441632'}} />
                <p className="font-medium" style={{color: '#441632'}}>Sua imagem aqui</p>
                <p className="text-sm text-gray-500 mt-2">500x400px recomendado</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-28">
        <div className="container">
          <div className="text-center mb-20">
            <h2 className="font-serif text-4xl md:text-5xl font-bold mb-6 text-gray-800">{content.features.title}</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed">{content.features.subtitle}</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {content.features.items.map((feature, index) => (
              <div 
                key={index}
                className="bg-white p-8 rounded-2xl hover-lift text-center transition-all duration-300 border border-gray-200 shadow-sm hover:shadow-md"
                style={{animationDelay: `${index * 0.1}s`}}
              >
                <div className="text-4xl mb-6">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-bold mb-4 text-gray-800">{feature.title}</h3>
                <p className="text-gray-600 leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="py-28" style={{backgroundColor: '#F8F4E6'}}>
        <div className="container">
          <div className="text-center mb-20">
            <h2 className="font-serif text-4xl md:text-5xl font-bold mb-6" style={{color: '#441632'}}>{content.howItWorks.title}</h2>
            <p className="text-xl max-w-2xl mx-auto leading-relaxed" style={{color: '#441632', opacity: 0.8}}>
              Em apenas 3 passos simples, você pode começar a preservar memórias preciosas
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            {content.howItWorks.steps.map((step, index) => (
              <div 
                key={index}
                className="bg-white p-8 rounded-2xl text-center hover-lift transition-all duration-300 border border-gray-200 shadow-sm"
                style={{animationDelay: `${index * 0.2}s`}}
              >
                <div className="w-16 h-16 mx-auto mb-6 rounded-full flex items-center justify-center text-2xl font-bold text-white" style={{backgroundColor: '#441632'}}>
                  {index + 1}
                </div>
                <h4 className="text-xl font-bold mb-4" style={{color: '#441632'}}>{step.title}</h4>
                <p className="text-gray-600 leading-relaxed">{step.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-28">
        <div className="container">
          <div className="text-center mb-20">
            <h2 className="font-serif text-4xl md:text-5xl font-bold mb-6 text-gray-800">{content.pricing.title}</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed">{content.pricing.subtitle}</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            {/* Free Plan */}
            <div className="bg-white p-8 rounded-2xl text-center border border-gray-200 shadow-sm hover:shadow-md transition-all">
              <h3 className="text-2xl font-bold mb-4 text-gray-800">{content.pricing.free.name}</h3>
              <div className="text-5xl font-bold text-gray-800 mb-4">
                {content.pricing.free.price}
                <span className="text-lg text-gray-500">{content.pricing.free.period}</span>
              </div>
              <p className="text-gray-600 mb-8 text-lg">{content.pricing.free.description}</p>
              
              <ul className="space-y-4 mb-10 text-left">
                {content.pricing.free.features.map((feature, index) => (
                  <li key={index} className="flex items-center gap-3">
                    <Check className="w-5 h-5 text-gray-500 flex-shrink-0" />
                    <span className="text-gray-700">{feature}</span>
                  </li>
                ))}
              </ul>
              
              <button 
                onClick={onTryFree}
                className="btn-secondary w-full py-4 rounded-xl font-semibold hover-lift text-lg"
              >
                {content.pricing.free.button}
              </button>
            </div>

            {/* Paid Plan */}
            <div className="bg-white p-8 rounded-2xl text-center border-2 border-gray-800 shadow-sm hover:shadow-md transition-all relative">
              {content.pricing.paid.popular && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white px-6 py-2 rounded-full text-sm font-medium">
                  Mais Popular
                </div>
              )}
              <h3 className="text-2xl font-bold mb-4 text-gray-800">{content.pricing.paid.name}</h3>
              <div className="text-5xl font-bold text-gray-800 mb-4">
                {content.pricing.paid.price}
                <span className="text-lg text-gray-500">{content.pricing.paid.period}</span>
              </div>
              <p className="text-gray-600 mb-8 text-lg">{content.pricing.paid.description}</p>
              
              <ul className="space-y-4 mb-10 text-left">
                {content.pricing.paid.features.map((feature, index) => (
                  <li key={index} className="flex items-center gap-3">
                    <Check className="w-5 h-5 text-gray-500 flex-shrink-0" />
                    <span className="text-gray-700 font-medium">{feature}</span>
                  </li>
                ))}
              </ul>
              
              <button 
                onClick={onSeePricing || onTryFree}
                className="btn-primary w-full py-4 rounded-xl font-semibold hover-lift text-lg"
              >
                {content.pricing.paid.button}
              </button>
              
              <p className="text-xs text-gray-500 mt-4">7 dias grátis • Cancele a qualquer momento</p>
            </div>
          </div>
          
          {/* Support guarantee */}
          <div className="mt-16 text-center">
            <div className="inline-flex items-center gap-8 px-8 py-6 bg-white rounded-2xl border border-gray-200">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center">
                  <Shield className="w-6 h-6 text-gray-600" />
                </div>
                <div className="text-left">
                  <p className="font-semibold text-gray-800">Garantia de 30 dias</p>
                  <p className="text-sm text-gray-600">100% do seu dinheiro de volta</p>
                </div>
              </div>
              
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center">
                  <Heart className="w-6 h-6 text-gray-600" />
                </div>
                <div className="text-left">
                  <p className="font-semibold text-gray-800">Suporte 24/7</p>
                  <p className="text-sm text-gray-600">Sempre aqui para ajudar</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA Section */}
      <section id="download" className="py-28" style={{backgroundColor: '#F8F4E6'}}>
        <div className="container text-center">
          <div className="max-w-4xl mx-auto">
            <h2 className="font-serif text-4xl md:text-5xl font-bold mb-6" style={{color: '#441632'}}>{content.finalCta.title}</h2>
            <p className="text-xl mb-12 max-w-2xl mx-auto leading-relaxed" style={{color: '#441632', opacity: 0.8}}>
              Preserve as memórias mais preciosas com tecnologia de IA avançada.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
              <button 
                onClick={onTryFree}
                className="btn btn-primary btn-large hover-lift px-12 py-4 text-lg"
              >
                {content.finalCta.button}
              </button>
              <button 
                onClick={onLearnMore}
                className="btn btn-secondary btn-large px-12 py-4 text-lg"
              >
                Ver Demonstração
              </button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-2xl mx-auto">
              {content.finalCta.features.map((feature, index) => (
                <div key={index} className="flex items-center justify-center gap-2 bg-white rounded-lg px-4 py-3 border border-gray-200">
                  <span className="w-2 h-2 rounded-full" style={{backgroundColor: '#441632'}}></span>
                  <p className="text-sm font-medium" style={{color: '#441632'}}>{feature}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="section" style={{backgroundColor: 'var(--gray-800)', color: 'var(--white)'}}>
        <div className="container">
          <div className="grid grid-3 gap-lg mb-xl">
            <div>
              <div className="flex items-center gap-2 mb-md">
                <Heart className="w-6 h-6 text-primary fill-current" />
                <span className="text-xl font-bold">Eterna</span>
              </div>
              <p className="text-small mb-md" style={{color: 'var(--gray-400)'}}>
                Preserving memories with AI-powered conversations
              </p>
            </div>
            
            <div>
              <h6 className="font-bold mb-md text-white">Product</h6>
              <div className="space-y-2">
                <a href="#features" className="block text-small hover:text-primary transition-colors" style={{color: 'var(--gray-400)'}}>Features</a>
                <a href="#pricing" className="block text-small hover:text-primary transition-colors" style={{color: 'var(--gray-400)'}}>Pricing</a>
                <a href="#how-it-works" className="block text-small hover:text-primary transition-colors" style={{color: 'var(--gray-400)'}}>How it Works</a>
              </div>
            </div>
            
            <div>
              <h6 className="font-bold mb-md text-white">Language</h6>
              <LanguageSelector />
            </div>
          </div>
          
          <div className="flex-between pt-lg" style={{borderTop: '1px solid var(--gray-700)'}}>
            <p className="text-small" style={{color: 'var(--gray-400)'}}>
              © 2024 Eterna. All rights reserved.
            </p>
            <div className="flex gap-md">
              <button 
                onClick={onTryFree}
                className="btn btn-primary"
              >
                Try Free
              </button>
              <button 
                onClick={onSignIn}
                className="text-small hover:text-primary transition-colors"
                style={{color: 'var(--gray-400)'}}
              >
                Sign In
              </button>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};