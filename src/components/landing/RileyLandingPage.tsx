import React from 'react';
import { useLanguage } from '@/hooks/useLanguage';
import { LanguageSelector } from '@/components/ui/language-selector';
import { Heart, Mic, Users, MessageCircle, Lock, Brain, Check, ArrowRight } from 'lucide-react';

interface RileyLandingPageProps {
  onTryFree: () => void;
  onSignIn: () => void;
  onLearnMore: () => void;
  onSeePricing?: () => void;
}

const getContent = (language: string) => {
  const content = {
    'pt-BR': {
      logo: "Eterna",
      nav: {
        features: "Como Funciona",
        howItWorks: "Preços", 
        pricing: "Nossa Missão",
      },
      cta: "Experimente Grátis",
      hero: {
        badge: "❤️ Feito para famílias com Alzheimer",
        title: "Mantenha Sua Voz Para Sempre",
        subtitle: "Preservação de Memórias com IA",
        description: "O Eterna transforma memórias queridas em conversas vivas. Preserve a voz e personalidade do seu ente querido com IA que entende o que mais importa para famílias enfrentando a perda de memória.",
        buttonPrimary: "Experimente Grátis",
        buttonSecondary: "Veja Como Funciona",
        features: ["Sem cartão de crédito necessário", "5 mensagens para começar"]
      },
      features: {
        title: "Tudo Que Você Precisa",
        subtitle: "Preserve Memórias, Conecte Corações",
        items: [{
          icon: Mic,
          title: "Clonagem de Voz",
          description: "IA avançada captura padrões únicos de fala e personalidade",
          gradient: "from-purple-400 to-purple-600"
        }, {
          icon: Users,
          title: "Perfis da Família",
          description: "Crie perfis detalhados para cada ente querido com fotos e memórias",
          gradient: "from-pink-400 to-rose-500"
        }, {
          icon: MessageCircle,
          title: "Conversas Naturais",
          description: "Converse naturalmente com IA que responde como seu ente querido",
          gradient: "from-yellow-400 to-orange-500"
        }, {
          icon: Lock,
          title: "Privacidade Primeiro",
          description: "Os dados da sua família são criptografados e nunca compartilhados com terceiros",
          gradient: "from-green-400 to-emerald-500"
        }, {
          icon: Brain,
          title: "Preservação de Memória",
          description: "Especialmente projetado para famílias enfrentando Alzheimer e demência",
          gradient: "from-blue-400 to-cyan-500"
        }, {
          icon: Heart,
          title: "Feito com Amor",
          description: "Criado por alguém que entende a dor da perda de memória",
          gradient: "from-rose-400 to-pink-500"
        }]
      },
      mission: {
        title: "Por Que Criei o Eterna",
        description: "Construí esta ferramenta com amor usando Lovable, motivado pela necessidade de manter minha mãe presente, mesmo com Alzheimer. Quero ajudar outras famílias a preservar as memórias e personalidades de seus entes queridos.",
        items: [{
          icon: Heart,
          title: "Feito com Amor",
          description: "Criado por alguém que entende a dor de ver memórias escaparem."
        }, {
          icon: Lock,
          title: "Privacidade Primeiro", 
          description: "As vozes e memórias da sua família são sagradas. As protegemos com a maior segurança."
        }, {
          icon: Brain,
          title: "Consciente do Alzheimer",
          description: "Especificamente projetado para famílias navegando perda de memória e desafios cognitivos."
        }]
      },
      pricing: {
        title: "Preços Simples e Acessíveis para a Família",
        subtitle: "Comece grátis, faça upgrade quando estiver pronto para preservar mais vozes e memórias",
        free: {
          name: "Gratuito",
          price: "R$0",
          period: "/mês",
          description: "Perfeito para experimentar o Eterna",
          features: [
            "5 mensagens por mês",
            "1 minuto de geração de voz",
            "Últimas 3 memórias armazenadas",
            "Vozes base disponíveis",
            "Todos os idiomas (EN, PT-BR, ES)"
          ],
          button: "Começar Grátis"
        },
        paid: {
          name: "Plano Família",
          price: "R$29",
          period: "/mês",
          priceNote: "(~US$5.99)",
          description: "Tudo que você precisa para preservar vozes da família",
          features: [
            "300 mensagens por mês",
            "15 minutos de geração de voz", 
            "Memórias ilimitadas armazenadas",
            "Clone de voz pessoal*",
            "Suporte prioritário",
            "Todos os idiomas (EN, PT-BR, ES)",
            "Configurações avançadas de personalidade"
          ],
          button: "Fazer Upgrade Agora",
          popular: true,
          note: "*Clone de voz pessoal disponível quando a capacidade permitir"
        }
      },
      finalCta: {
        title: "Pronto para ouvir uma memória ganhar vida?",
        subtitle: "Junte-se a famílias ao redor do mundo que estão preservando as vozes que mais amam.",
        button: "Experimente Grátis",
        features: [
          "Sem cartão de crédito necessário",
          "5 mensagens para começar",
          "1 minuto de geração de voz"
        ]
      }
    },
    en: {
      logo: "Eterna", 
      nav: {
        features: "How it Works",
        howItWorks: "Pricing",
        pricing: "Our Mission",
      },
      cta: "Try Eterna Free",
      hero: {
        badge: "❤️ Made for Alzheimer's families",
        title: "Keep Their Voice Forever", 
        subtitle: "AI-Powered Memory Preservation",
        description: "Eterna turns cherished memories into living conversations. Preserve your loved one's voice and personality with AI that understands what matters most to families facing memory loss.",
        buttonPrimary: "Try Eterna Free",
        buttonSecondary: "See How It Works",
        features: ["No credit card required", "5 messages to start"]
      },
      features: {
        title: "Everything You Need",
        subtitle: "Preserve Memories, Connect Hearts",
        items: [{
          icon: Mic,
          title: "Voice Cloning",
          description: "Advanced AI captures unique speech patterns and personality",
          gradient: "from-purple-400 to-purple-600"
        }, {
          icon: Users,
          title: "Family Profiles", 
          description: "Create detailed profiles for each loved one with photos and memories",
          gradient: "from-pink-400 to-rose-500"
        }, {
          icon: MessageCircle,
          title: "Natural Conversations",
          description: "Chat naturally with AI that responds like your loved one",
          gradient: "from-yellow-400 to-orange-500"
        }, {
          icon: Lock,
          title: "Privacy First",
          description: "Your family's data is encrypted and never shared with third parties",
          gradient: "from-green-400 to-emerald-500"
        }, {
          icon: Brain,
          title: "Memory Preservation",
          description: "Specially designed for families facing Alzheimer's and dementia",
          gradient: "from-blue-400 to-cyan-500"
        }, {
          icon: Heart,
          title: "Built with Love",
          description: "Created by someone who understands the pain of memory loss",
          gradient: "from-rose-400 to-pink-500"
        }]
      },
      mission: {
        title: "Why I Created Eterna",
        description: "I built this tool with love using Lovable, motivated by the need to keep my mother present, even with Alzheimer's. I want to help other families preserve the memories and personalities of their loved ones.",
        items: [{
          icon: Heart,
          title: "Built with Love",
          description: "Created by someone who understands the pain of watching memories slip away."
        }, {
          icon: Lock,
          title: "Privacy First",
          description: "Your family's voices and memories are sacred. We protect them with the highest security."
        }, {
          icon: Brain,
          title: "Alzheimer's Aware", 
          description: "Specifically designed for families navigating memory loss and cognitive challenges."
        }]
      },
      pricing: {
        title: "Simple, Family-Friendly Pricing",
        subtitle: "Start free, upgrade when you're ready to preserve more voices and memories",
        free: {
          name: "Free",
          price: "$0",
          period: "/month",
          description: "Perfect for trying Eterna",
          features: [
            "5 messages per month",
            "1 minute voice generation", 
            "Last 3 memories stored",
            "Base voices available",
            "All languages (EN, PT-BR, ES)"
          ],
          button: "Start Free"
        },
        paid: {
          name: "Family Plan",
          price: "$29",
          period: "/month", 
          priceNote: "",
          description: "Everything you need to preserve family voices",
          features: [
            "300 messages per month",
            "15 minutes voice generation",
            "Unlimited memories stored", 
            "Personal voice clone*",
            "Priority support",
            "All languages (EN, PT-BR, ES)",
            "Advanced personality settings"
          ],
          button: "Upgrade Now",
          popular: true,
          note: "*Personal voice clone available when capacity allows"
        }
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

  const scrollToPricing = () => {
    const element = document.getElementById('pricing');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b border-purple-100">
        <nav className="container mx-auto px-6 flex items-center justify-between py-4">
          <div className="flex items-center gap-2">
            <span className="text-2xl">❤️</span>
            <span className="text-xl font-bold text-purple-600">
              {content.logo}
            </span>
          </div>

          <ul className="hidden md:flex items-center gap-8">
            <li>
              <a href="#features" className="text-gray-600 hover:text-purple-600 transition-colors hover:scale-105 transform duration-200">
                {content.nav.features}
              </a>
            </li>
            <li>
              <a href="#pricing" className="text-gray-600 hover:text-purple-600 transition-colors hover:scale-105 transform duration-200">
                {content.nav.howItWorks}
              </a>
            </li>
            <li>
              <a href="#mission" className="text-gray-600 hover:text-purple-600 transition-colors hover:scale-105 transform duration-200">
                {content.nav.pricing}
              </a>
            </li>
          </ul>

          <div className="flex items-center gap-4">
            <LanguageSelector />
            <button 
              onClick={onTryFree} 
              className="px-6 py-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg font-medium hover:shadow-lg hover:scale-105 transition-all duration-300"
            >
              {content.cta}
            </button>
          </div>
        </nav>
      </header>

      {/* Hero Section */}
      <section className="pt-32 pb-20 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-purple-100/50 via-pink-50/50 to-orange-50/50"></div>
        <div className="container mx-auto px-6 relative z-10">
          <div className="max-w-4xl mx-auto text-center animate-fade-in-up">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-rose-500 to-pink-500 text-white rounded-full text-sm font-medium mb-8 animate-pulse">
              {content.hero.badge}
            </div>
            
            <h1 className="text-6xl md:text-7xl font-bold bg-gradient-to-r from-purple-600 via-pink-500 to-orange-500 bg-clip-text text-transparent mb-6 leading-tight">
              {content.hero.title}
            </h1>
            
            <h2 className="text-2xl md:text-3xl font-semibold text-gray-700 mb-6">
              {content.hero.subtitle}
            </h2>
            
            <p className="text-lg text-gray-600 mb-12 max-w-3xl mx-auto leading-relaxed">
              {content.hero.description}
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
              <button 
                onClick={onTryFree} 
                className="px-8 py-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl font-semibold text-lg hover:shadow-2xl hover:scale-105 transition-all duration-300 hover:shadow-purple-500/30"
              >
                {content.hero.buttonPrimary}
              </button>
              <button 
                onClick={onLearnMore} 
                className="px-8 py-4 border-2 border-purple-200 text-purple-600 rounded-xl font-semibold text-lg hover:bg-purple-50 hover:scale-105 transition-all duration-300"
              >
                {content.hero.buttonSecondary}
              </button>
            </div>

            <div className="flex flex-wrap justify-center gap-6 text-sm text-gray-600">
              {content.hero.features.map((feature, index) => (
                <div key={index} className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-green-500" />
                  {feature}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 bg-white">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4">
              {content.features.title}
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              {content.features.subtitle}
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {content.features.items.map((feature, index) => {
              const IconComponent = feature.icon;
              return (
                <div key={index} className="group bg-white rounded-2xl p-8 shadow-sm border border-gray-100 hover:shadow-xl hover:-translate-y-2 transition-all duration-300 hover:border-purple-200">
                  <div className={`w-16 h-16 mx-auto mb-6 rounded-2xl bg-gradient-to-br ${feature.gradient} flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}>
                    <IconComponent className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-800 mb-4 text-center">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600 leading-relaxed text-center">
                    {feature.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Mission Section */}
      <section id="mission" className="py-20 bg-gradient-to-br from-purple-50 to-pink-50 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-purple-100/20 to-pink-100/20"></div>
        <div className="container mx-auto px-6 relative z-10">
          <div className="max-w-4xl mx-auto text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-800 mb-8">
              {content.mission.title}
            </h2>
            <p className="text-xl text-gray-600 leading-relaxed max-w-3xl mx-auto">
              {content.mission.description}
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {content.mission.items.map((item, index) => {
              const IconComponent = item.icon;
              return (
                <div key={index} className="bg-white/80 backdrop-blur-sm rounded-2xl p-8 text-center hover:bg-white hover:shadow-xl hover:-translate-y-2 transition-all duration-300">
                  <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
                    <IconComponent className="w-8 h-8 text-white" />
                  </div>
                  <h4 className="text-xl font-bold text-gray-800 mb-4">
                    {item.title}
                  </h4>
                  <p className="text-gray-600 leading-relaxed">
                    {item.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-20 bg-white">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4">
              {content.pricing.title}
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              {content.pricing.subtitle}
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {/* Free Plan */}
            <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-200 hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
              <h3 className="text-2xl font-bold text-gray-800 mb-2">
                {content.pricing.free.name}
              </h3>
              <div className="mb-4">
                <span className="text-5xl font-bold text-gray-800">
                  {content.pricing.free.price}
                </span>
                <span className="text-gray-600 text-lg">
                  {content.pricing.free.period}
                </span>
              </div>
              <p className="text-gray-600 mb-8">
                {content.pricing.free.description}
              </p>
              <ul className="space-y-4 mb-8">
                {content.pricing.free.features.map((feature, index) => (
                  <li key={index} className="flex items-start gap-3">
                    <Check className="w-5 h-5 text-green-500 mt-0.5" />
                    <span className="text-gray-700">{feature}</span>
                  </li>
                ))}
              </ul>
              <button 
                onClick={onTryFree} 
                className="w-full py-3 border-2 border-purple-200 text-purple-600 rounded-xl font-semibold hover:bg-purple-50 transition-all duration-300"
              >
                {content.pricing.free.button}
              </button>
            </div>

            {/* Paid Plan */}
            <div className="bg-white rounded-2xl p-8 shadow-lg border-2 border-purple-300 relative hover:shadow-xl hover:-translate-y-1 transition-all duration-300 transform scale-105">
              <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                <span className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-6 py-2 rounded-full text-sm font-semibold">
                  Mais Popular
                </span>
              </div>
              <h3 className="text-2xl font-bold text-gray-800 mb-2">
                {content.pricing.paid.name}
              </h3>
              <div className="mb-4">
                <span className="text-5xl font-bold text-gray-800">
                  {content.pricing.paid.price}
                </span>
                <span className="text-gray-600 text-lg">
                  {content.pricing.paid.period}
                </span>
                {content.pricing.paid.priceNote && (
                  <p className="text-sm text-gray-500 mt-1">
                    {content.pricing.paid.priceNote}
                  </p>
                )}
              </div>
              <p className="text-gray-600 mb-8">
                {content.pricing.paid.description}
              </p>
              <ul className="space-y-4 mb-8">
                {content.pricing.paid.features.map((feature, index) => (
                  <li key={index} className="flex items-start gap-3">
                    <Check className="w-5 h-5 text-green-500 mt-0.5" />
                    <span className="text-gray-700">{feature}</span>
                  </li>
                ))}
              </ul>
              <button 
                onClick={onTryFree} 
                className="w-full py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl font-semibold hover:shadow-lg hover:scale-105 transition-all duration-300"
              >
                {content.pricing.paid.button}
              </button>
              {content.pricing.paid.note && (
                <p className="text-xs text-gray-500 text-center mt-4">
                  {content.pricing.paid.note}
                </p>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA Section */}
      <section className="py-20 bg-gradient-to-br from-purple-600 to-pink-600 text-white">
        <div className="container mx-auto px-6">
          <div className="text-center max-w-3xl mx-auto">
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              {content.finalCta.title}
            </h2>
            <p className="text-xl mb-8 opacity-90">
              {content.finalCta.subtitle}
            </p>
            <button 
              onClick={onTryFree} 
              className="px-8 py-4 bg-white text-purple-600 rounded-xl font-bold text-lg hover:shadow-2xl hover:scale-105 transition-all duration-300 mb-8 inline-flex items-center gap-2"
            >
              {content.finalCta.button}
              <ArrowRight className="w-5 h-5" />
            </button>
            <div className="space-y-2 text-sm opacity-80">
              {content.finalCta.features.map((feature, index) => (
                <p key={index}>{feature}</p>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 bg-gray-900 text-white">
        <div className="container mx-auto px-6 text-center">
          <div className="flex items-center justify-center gap-2 mb-4">
            <span className="text-2xl">❤️</span>
            <span className="text-xl font-bold">Eterna</span>
          </div>
          <p className="text-gray-400">
            © 2024 Eterna. Feito com amor para famílias.
          </p>
        </div>
      </footer>
    </div>
  );
};