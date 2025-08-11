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
        badge: "❤️ Feito especialmente para famílias",
        title: "Preserve a Voz de Quem Você Ama",
        subtitle: "Para Sempre",
        description: "Transforme memórias preciosas em conversas reais. Com inteligência artificial avançada, você pode ouvir a voz e sentir a presença de quem mais ama, mesmo quando as memórias começam a desaparecer.",
        buttonPrimary: "Começar Agora - É Grátis",
        buttonSecondary: "Ver Como Funciona",
        note: "✨ Sem cartão de crédito • Primeiras 5 conversas gratuitas"
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
        badge: "❤️ Feito especialmente para famílias",
        title: "Preserve a Voz de Quem Você Ama",
        subtitle: "Para Sempre",
        description: "Transforme memórias preciosas em conversas reais. Com inteligência artificial avançada, você pode ouvir a voz e sentir a presença de quem mais ama, mesmo quando as memórias começam a desaparecer.",
        buttonPrimary: "Começar Agora - É Grátis",
        buttonSecondary: "Ver Como Funciona",
        note: "✨ Sem cartão de crédito • Primeiras 5 conversas gratuitas"
      },
      features: {
        title: "Criado para Momentos que Importam",
        subtitle: "Tecnologia que preserva o essencial: a conexão humana",
        items: [
          {
            icon: "🎤",
            title: "Voz Autêntica",
            description: "Capture cada nuance da voz que você ama. Nossa IA preserva não apenas as palavras, mas a essência de como elas eram ditas.",
            color: "card-voice-cloning"
          },
          {
            icon: "👨‍👩‍👧‍👦",
            title: "Memórias de Família",
            description: "Organize fotos, histórias e momentos especiais em um só lugar. Cada perfil conta uma história única e pessoal.", 
            color: "card-family-profiles"
          },
          {
            icon: "💬",
            title: "Conversas Reais",
            description: "Não é apenas texto na tela. É uma conversa genuína que traz de volta a sensação de estar presente com quem você ama.",
            color: "card-conversations"
          },
          {
            icon: "🔒",
            title: "Totalmente Privado",
            description: "Suas memórias são sagradas. Todos os dados são criptografados e nunca compartilhados. Apenas sua família tem acesso.",
            color: "card-privacy"
          },
          {
            icon: "🧠",
            title: "Feito para Durar",
            description: "Especialmente criado para famílias enfrentando o Alzheimer. Preservamos o que é mais importante: a pessoa por trás das palavras.",
            color: "card-memory"
          },
          {
            icon: "❤️",
            title: "Criado com Propósito",
            description: "Nasceu da necessidade real de uma filha que queria preservar a voz da mãe. Cada feature foi pensada com amor e cuidado.",
            color: "card-love"
          }
        ]
      },
      howItWorks: {
        title: "Simples Como uma Conversa",
        steps: [
          {
            icon: "1️⃣",
            title: "Compartilhe as Memórias",
            description: "Envie fotos, áudios da voz e conte as histórias que vocês viveram juntos. Cada detalhe importa para recriar a essência única da pessoa."
          },
          {
            icon: "2️⃣",
            title: "A IA Aprende com Amor", 
            description: "Nossa tecnologia estuda com carinho cada palavra, tom de voz e jeito de falar. É como ensinar a alguém especial sobre quem você mais ama."
          },
          {
            icon: "3️⃣",
            title: "Converse Quando Quiser",
            description: "Abra o app, faça uma pergunta ou apenas diga 'oi'. A voz familiar responderá com todo o amor e sabedoria que você sempre conheceu."
          }
        ]
      },
      finalCta: {
        title: "Sua Primeira Conversa Está a Um Clique de Distância",
        subtitle: "Não deixe que as memórias mais preciosas se percam. Preserve hoje a voz de quem você ama.",
        button: "Criar Minha Primeira Conversa",
        features: [
          "Totalmente gratuito para começar",
          "5 conversas incluídas", 
          "Configuração em 5 minutos"
        ]
      },
      pricing: {
        title: "Planos Feitos para Sua Família",
        subtitle: "Comece gratuitamente e cresça conforme sua família precisa",
        free: {
          name: "Descoberta",
          price: "R$0",
          period: "/mês",
          description: "Perfeito para suas primeiras conversas",
          features: [
            "5 conversas/mês",
            "1 minuto de voz/mês", 
            "1 perfil de pessoa",
            "Suporte por email"
          ],
          button: "Começar Agora",
          popular: false
        },
        paid: {
          name: "Família Conectada",
          price: "R$29",
          period: "/mês",
          description: "Para famílias que querem preservar mais histórias",
          features: [
            "Conversas ilimitadas",
            "15 minutos de voz/mês",
            "Perfis ilimitados",
            "Voz personalizada premium",
            "Suporte prioritário",
            "Backup automático"
          ],
          button: "Experimentar 7 Dias Grátis",
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
      <header className="fixed top-0 left-0 right-0 backdrop-blur-sm shadow-sm z-50 py-4" style={{backgroundColor: 'rgba(253, 251, 203, 0.95)'}}>
        <nav className="container flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Heart className="w-6 h-6 fill-current" style={{color: '#441632'}} />
            <span className="text-xl font-bold" style={{color: '#441632'}}>Eterna</span>
          </div>
          <ul className="hidden md:flex items-center gap-8">
            <li>
              <a href="#features" className="transition-colors font-medium hover:opacity-80" style={{color: '#441632'}}>
                {content.nav.features}
              </a>
            </li>
            <li>
              <a href="#how-it-works" className="transition-colors font-medium hover:opacity-80" style={{color: '#441632'}}>
                {content.nav.howItWorks}
              </a>
            </li>
            <li>
              <a href="#pricing" className="transition-colors font-medium hover:opacity-80" style={{color: '#441632'}}>
                {content.nav.pricing}
              </a>
            </li>
            <li>
              <a href="#download" className="transition-colors font-medium hover:opacity-80" style={{color: '#441632'}}>
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
            
            <h1 className="hero-title font-serif mb-lg" style={{color: '#441632'}}>
              {content.hero.title}
            </h1>
            
            <h2 className="hero-subtitle mb-xl" style={{color: '#441632', opacity: 0.8}}>
              {content.hero.subtitle}
            </h2>
            
            <p className="text-large mb-2xl leading-relaxed" style={{color: '#441632', opacity: 0.7}}>
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
            
            <p className="text-small flex items-center gap-2" style={{color: '#441632', opacity: 0.6}}>
              <span className="w-2 h-2 rounded-full" style={{backgroundColor: '#441632'}}></span>
              {content.hero.note}
            </p>
          </div>

          {/* Right Column - Image Placeholder */}
          <div className="hero-right">
            <div className="w-full h-96 rounded-2xl flex items-center justify-center border-2 shadow-lg" style={{backgroundColor: 'rgba(68, 22, 50, 0.05)', borderColor: '#441632'}}>
              <div className="text-center p-8">
                <Heart className="w-20 h-20 mx-auto mb-6" style={{color: '#441632'}} />
                <p className="font-medium" style={{color: '#441632'}}>Sua imagem aqui</p>
                <p className="text-sm mt-2" style={{color: '#441632', opacity: 0.6}}>500x400px recomendado</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-28" style={{backgroundColor: '#441632', color: '#FDFBCB'}}>
        <div className="container">
          <div className="text-center mb-20">
            <h2 className="font-serif text-4xl md:text-5xl font-bold mb-6" style={{color: '#FDFBCB'}}>{content.features.title}</h2>
            <p className="text-xl max-w-2xl mx-auto leading-relaxed" style={{color: '#FDFBCB', opacity: 0.8}}>{content.features.subtitle}</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {content.features.items.map((feature, index) => (
              <div 
                key={index}
                className="p-8 rounded-2xl hover-lift text-center transition-all duration-300 border-2 shadow-sm hover:shadow-md"
                style={{
                  backgroundColor: 'rgba(253, 251, 203, 0.1)', 
                  borderColor: 'rgba(253, 251, 203, 0.3)',
                  animationDelay: `${index * 0.1}s`
                }}
              >
                <div className="text-4xl mb-6">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-bold mb-4" style={{color: '#FDFBCB'}}>{feature.title}</h3>
                <p className="leading-relaxed" style={{color: '#FDFBCB', opacity: 0.8}}>{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="py-28" style={{backgroundColor: '#FDFBCB'}}>
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
                className="p-8 rounded-2xl text-center hover-lift transition-all duration-300 border-2 shadow-sm"
                style={{
                  backgroundColor: 'rgba(68, 22, 50, 0.05)', 
                  borderColor: '#441632',
                  animationDelay: `${index * 0.2}s`
                }}
              >
                <div className="w-16 h-16 mx-auto mb-6 rounded-full flex items-center justify-center text-2xl font-bold" style={{backgroundColor: '#441632', color: '#FDFBCB'}}>
                  {index + 1}
                </div>
                <h4 className="text-xl font-bold mb-4" style={{color: '#441632'}}>{step.title}</h4>
                <p className="leading-relaxed" style={{color: '#441632', opacity: 0.7}}>{step.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-28" style={{backgroundColor: '#441632', color: '#FDFBCB'}}>
        <div className="container">
          <div className="text-center mb-20">
            <h2 className="font-serif text-4xl md:text-5xl font-bold mb-6" style={{color: '#FDFBCB'}}>{content.pricing.title}</h2>
            <p className="text-xl max-w-2xl mx-auto leading-relaxed" style={{color: '#FDFBCB', opacity: 0.8}}>{content.pricing.subtitle}</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            {/* Free Plan */}
            <div className="p-8 rounded-2xl text-center border-2 shadow-sm hover:shadow-md transition-all" style={{backgroundColor: 'rgba(253, 251, 203, 0.1)', borderColor: 'rgba(253, 251, 203, 0.3)'}}>
              <h3 className="text-2xl font-bold mb-4" style={{color: '#FDFBCB'}}>{content.pricing.free.name}</h3>
              <div className="text-5xl font-bold mb-4" style={{color: '#FDFBCB'}}>
                {content.pricing.free.price}
                <span className="text-lg" style={{color: '#FDFBCB', opacity: 0.7}}>{content.pricing.free.period}</span>
              </div>
              <p className="mb-8 text-lg" style={{color: '#FDFBCB', opacity: 0.8}}>{content.pricing.free.description}</p>
              
              <ul className="space-y-4 mb-10 text-left">
                {content.pricing.free.features.map((feature, index) => (
                  <li key={index} className="flex items-center gap-3">
                    <Check className="w-5 h-5 flex-shrink-0" style={{color: '#FDFBCB'}} />
                    <span style={{color: '#FDFBCB', opacity: 0.9}}>{feature}</span>
                  </li>
                ))}
              </ul>
              
              <button 
                onClick={onTryFree}
                className="w-full py-4 rounded-xl font-semibold hover-lift text-lg transition-all border-2"
                style={{backgroundColor: '#FDFBCB', color: '#441632', borderColor: '#FDFBCB'}}
              >
                {content.pricing.free.button}
              </button>
            </div>

            {/* Paid Plan */}
            <div className="p-8 rounded-2xl text-center border-2 shadow-sm hover:shadow-md transition-all relative" style={{backgroundColor: 'rgba(253, 251, 203, 0.15)', borderColor: '#FDFBCB'}}>
              {content.pricing.paid.popular && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 px-6 py-2 rounded-full text-sm font-medium" style={{backgroundColor: '#FDFBCB', color: '#441632'}}>
                  Mais Popular
                </div>
              )}
              <h3 className="text-2xl font-bold mb-4" style={{color: '#FDFBCB'}}>{content.pricing.paid.name}</h3>
              <div className="text-5xl font-bold mb-4" style={{color: '#FDFBCB'}}>
                {content.pricing.paid.price}
                <span className="text-lg" style={{color: '#FDFBCB', opacity: 0.7}}>{content.pricing.paid.period}</span>
              </div>
              <p className="mb-8 text-lg" style={{color: '#FDFBCB', opacity: 0.8}}>{content.pricing.paid.description}</p>
              
              <ul className="space-y-4 mb-10 text-left">
                {content.pricing.paid.features.map((feature, index) => (
                  <li key={index} className="flex items-center gap-3">
                    <Check className="w-5 h-5 flex-shrink-0" style={{color: '#FDFBCB'}} />
                    <span className="font-medium" style={{color: '#FDFBCB', opacity: 0.9}}>{feature}</span>
                  </li>
                ))}
              </ul>
              
              <button 
                onClick={onSeePricing || onTryFree}
                className="w-full py-4 rounded-xl font-semibold hover-lift text-lg transition-all"
                style={{backgroundColor: '#FDFBCB', color: '#441632'}}
              >
                {content.pricing.paid.button}
              </button>
              
              <p className="text-xs mt-4" style={{color: '#FDFBCB', opacity: 0.6}}>7 dias grátis • Cancele a qualquer momento</p>
            </div>
          </div>
          
          {/* Support guarantee */}
          <div className="mt-16 text-center">
            <div className="inline-flex items-center gap-8 px-8 py-6 rounded-2xl border-2" style={{backgroundColor: 'rgba(253, 251, 203, 0.1)', borderColor: 'rgba(253, 251, 203, 0.3)'}}>
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full flex items-center justify-center" style={{backgroundColor: 'rgba(253, 251, 203, 0.2)'}}>
                  <Shield className="w-6 h-6" style={{color: '#FDFBCB'}} />
                </div>
                <div className="text-left">
                  <p className="font-semibold" style={{color: '#FDFBCB'}}>Garantia de 30 dias</p>
                  <p className="text-sm" style={{color: '#FDFBCB', opacity: 0.8}}>100% do seu dinheiro de volta</p>
                </div>
              </div>
              
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full flex items-center justify-center" style={{backgroundColor: 'rgba(253, 251, 203, 0.2)'}}>
                  <Heart className="w-6 h-6" style={{color: '#FDFBCB'}} />
                </div>
                <div className="text-left">
                  <p className="font-semibold" style={{color: '#FDFBCB'}}>Suporte 24/7</p>
                  <p className="text-sm" style={{color: '#FDFBCB', opacity: 0.8}}>Sempre aqui para ajudar</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA Section */}
      <section id="download" className="py-28" style={{backgroundColor: '#FDFBCB'}}>
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
                <div key={index} className="flex items-center justify-center gap-2 rounded-lg px-4 py-3 border-2" style={{backgroundColor: 'rgba(68, 22, 50, 0.05)', borderColor: '#441632'}}>
                  <span className="w-2 h-2 rounded-full" style={{backgroundColor: '#441632'}}></span>
                  <p className="text-sm font-medium" style={{color: '#441632'}}>{feature}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="section" style={{backgroundColor: '#441632', color: '#FDFBCB'}}>
        <div className="container">
          <div className="grid grid-3 gap-lg mb-xl">
            <div>
              <div className="flex items-center gap-2 mb-md">
                <Heart className="w-6 h-6 fill-current" style={{color: '#FDFBCB'}} />
                <span className="text-xl font-bold" style={{color: '#FDFBCB'}}>Eterna</span>
              </div>
              <p className="text-small mb-md" style={{color: '#FDFBCB', opacity: 0.8}}>
                Preserving memories with AI-powered conversations
              </p>
            </div>
            
            <div>
              <h6 className="font-bold mb-md" style={{color: '#FDFBCB'}}>Product</h6>
              <div className="space-y-2">
                <a href="#features" className="block text-small transition-colors hover:opacity-80" style={{color: '#FDFBCB'}}>Features</a>
                <a href="#pricing" className="block text-small transition-colors hover:opacity-80" style={{color: '#FDFBCB'}}>Pricing</a>
                <a href="#how-it-works" className="block text-small transition-colors hover:opacity-80" style={{color: '#FDFBCB'}}>How it Works</a>
              </div>
            </div>
            
            <div>
              <h6 className="font-bold mb-md" style={{color: '#FDFBCB'}}>Language</h6>
              <LanguageSelector />
            </div>
          </div>
          
          <div className="flex-between pt-lg" style={{borderTop: '1px solid rgba(253, 251, 203, 0.3)'}}>
            <p className="text-small" style={{color: '#FDFBCB', opacity: 0.8}}>
              © 2024 Eterna. All rights reserved.
            </p>
            <div className="flex gap-md">
              <button 
                onClick={onTryFree}
                className="btn btn-secondary"
                style={{backgroundColor: '#FDFBCB', color: '#441632'}}
              >
                Try Free
              </button>
              <button 
                onClick={onSignIn}
                className="text-small transition-colors hover:opacity-80"
                style={{color: '#FDFBCB'}}
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