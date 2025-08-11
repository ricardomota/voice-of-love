import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Favorite, 
  Security, 
  Watson, 
  Microphone, 
  Group, 
  Chat, 
  Checkmark, 
  Menu, 
  Close, 
  ArrowRight, 
  PlayFilled, 
  SecurityServices, 
  Time, 
  Star, 
  Flash, 
  Globe, 
  Headphones, 
  Camera, 
  Document, 
  Settings, 
  Share, 
  Code, 
  DataBase,
  UserProfile,
  CloudUpload,
  VoiceActivate
} from '@carbon/icons-react';

interface RileyLandingPageProps {
  onTryFree: () => void;
  onSignIn: () => void;
  onLearnMore: () => void;
  onSeePricing?: () => void;
}

export default function RileyLandingPage({ onTryFree, onSignIn, onLearnMore }: RileyLandingPageProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const features = [
    {
      icon: <VoiceActivate size={32} />,
      title: "Clonagem de Voz",
      description: "IA avançada preserva os padrões únicos de voz e características de fala dos seus entes queridos."
    },
    {
      icon: <Group size={32} />,
      title: "Perfis da Família",
      description: "Crie perfis abrangentes com memórias, fotos e histórias pessoais para cada membro da família."
    },
    {
      icon: <Chat size={32} />,
      title: "Conversas Naturais",
      description: "Tenha diálogos significativos que se sentem autênticos e emocionalmente conectados."
    },
    {
      icon: <Security size={32} />,
      title: "Privacidade Primeiro",
      description: "As memórias da sua família são criptografadas e armazenadas com segurança de nível militar."
    },
    {
      icon: <Watson size={32} />,
      title: "Preservação de Memória",
      description: "IA aprende com conversas para manter traços de personalidade e memórias queridas."
    },
    {
      icon: <Favorite size={32} />,
      title: "Feito com Amor",
      description: "Criado especificamente para famílias afetadas pelo Alzheimer e perda de memória."
    }
  ];

  const steps = [
    {
      icon: <Microphone size={32} />,
      title: "Grave a Voz",
      description: "Capture a voz única do seu ente querido com apenas alguns minutos de gravação.",
      detail: "Nossa IA precisa de apenas 2-3 minutos de áudio para criar um clone de voz perfeito."
    },
    {
      icon: <Settings size={32} />,
      title: "Configure o Perfil",
      description: "Adicione memórias, fotos e histórias que definem a personalidade única.",
      detail: "Inclua experiências de vida, preferências e características pessoais marcantes."
    },
    {
      icon: <Chat size={32} />,
      title: "Converse Naturalmente",
      description: "Inicie conversas significativas que se sentem reais e emocionalmente conectadas.",
      detail: "Fale sobre lembranças, peça conselhos ou simplesmente desfrute de uma conversa casual."
    },
    {
      icon: <Share size={32} />,
      title: "Compartilhe com a Família",
      description: "Convide outros membros da família para preservar memórias juntos.",
      detail: "Múltiplos usuários podem interagir e adicionar suas próprias memórias e histórias."
    }
  ];

  const whyEternaPoints = [
    {
      icon: <Watson size={24} />,
      title: "Preservação Inteligente",
      description: "Nossa IA não apenas grava - ela aprende padrões de fala, preferências e memórias."
    },
    {
      icon: <Favorite size={24} />,
      title: "Conexão Emocional",
      description: "Criado por quem entende a dor da perda de memória. Cada recurso foi pensado com amor."
    },
    {
      icon: <SecurityServices size={24} />,
      title: "Privacidade Absoluta",
      description: "Suas memórias familiares são sagradas. Criptografia militar protege cada lembrança."
    },
    {
      icon: <Group size={24} />,
      title: "Para Toda a Família",
      description: "Múltiplos perfis, acesso compartilhado, e recursos pensados para todas as gerações."
    }
  ];

  const pricingPlans = [
    {
      name: "Gratuito",
      price: "R$ 0",
      period: "/mês",
      description: "Perfeito para começar",
      features: [
        "1 perfil familiar",
        "10 minutos de conversas por mês",
        "Clonagem básica de voz",
        "Memórias essenciais",
        "Suporte por email"
      ],
      buttonText: "Começar Grátis",
      isPopular: false
    },
    {
      name: "Família",
      price: "R$ 29",
      period: "/mês",
      description: "Para famílias que querem mais",
      features: [
        "5 perfis familiares",
        "Conversas ilimitadas",
        "Clonagem avançada de voz",
        "Todas as funcionalidades",
        "Upload de fotos e vídeos",
        "Suporte prioritário"
      ],
      buttonText: "Começar Teste",
      isPopular: true
    }
  ];

  // Removed fake stats and testimonials

  const techPoints = [
    {
      icon: <Code size={32} />,
      title: "GPT Open Source",
      description: "Construído com modelos de linguagem de código aberto, garantindo transparência e controle total sobre o processamento."
    },
    {
      icon: <SecurityServices size={32} />,
      title: "React + TypeScript",
      description: "Interface moderna e robusta desenvolvida com as melhores práticas de desenvolvimento web."
    },
    {
      icon: <DataBase size={32} />,
      title: "Supabase Backend",
      description: "Banco de dados PostgreSQL com autenticação segura e APIs em tempo real."
    },
    {
      icon: <Flash size={32} />,
      title: "Edge Functions",
      description: "Processamento de IA distribuído para respostas rápidas e experiência fluida."
    }
  ];

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Header */}
      <header className="fixed top-0 w-full bg-background/80 backdrop-blur-md border-b border-border z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-foreground rounded-lg flex items-center justify-center">
                <span className="text-background font-bold text-sm">E</span>
              </div>
              <span className="text-xl font-bold">Eterna</span>
            </div>
            
            <nav className="hidden md:flex items-center space-x-8">
              <button onClick={() => scrollToSection('como-funciona')} className="text-muted-foreground hover:text-foreground transition-colors">Como Funciona</button>
              <button onClick={() => scrollToSection('por-que-eterna')} className="text-muted-foreground hover:text-foreground transition-colors">Por Que Eterna</button>
              <button onClick={() => scrollToSection('precos')} className="text-muted-foreground hover:text-foreground transition-colors">Preços</button>
              <button onClick={() => scrollToSection('privacidade')} className="text-muted-foreground hover:text-foreground transition-colors">Privacidade</button>
            </nav>

            <div className="hidden md:flex items-center space-x-4">
              <Button variant="outline" onClick={onSignIn}>
                Entrar
              </Button>
              <Button onClick={onTryFree}>
                Experimente Grátis
              </Button>
            </div>

            <button
              className="md:hidden"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? <Close size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden bg-background/95 backdrop-blur-md border-t border-border">
            <div className="px-4 py-6 space-y-4">
              <button onClick={() => { scrollToSection('como-funciona'); setIsMenuOpen(false); }} className="block w-full text-left text-muted-foreground hover:text-foreground transition-colors">Como Funciona</button>
              <button onClick={() => { scrollToSection('por-que-eterna'); setIsMenuOpen(false); }} className="block w-full text-left text-muted-foreground hover:text-foreground transition-colors">Por Que Eterna</button>
              <button onClick={() => { scrollToSection('precos'); setIsMenuOpen(false); }} className="block w-full text-left text-muted-foreground hover:text-foreground transition-colors">Preços</button>
              <button onClick={() => { scrollToSection('privacidade'); setIsMenuOpen(false); }} className="block w-full text-left text-muted-foreground hover:text-foreground transition-colors">Privacidade</button>
              <div className="pt-4 space-y-2">
                <Button variant="outline" onClick={onSignIn} className="w-full">
                  Entrar
                </Button>
                <Button onClick={onTryFree} className="w-full">
                  Experimente Grátis
                </Button>
              </div>
            </div>
          </div>
        )}
      </header>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <Badge variant="outline" className="mb-6 px-4 py-2">
            Feito para Famílias com Alzheimer
          </Badge>
          
          <h1 className="text-4xl sm:text-6xl font-bold mb-6 leading-tight">
            Preserve a Voz
            <span className="block">Para Sempre</span>
          </h1>
          
          <p className="text-xl text-muted-foreground mb-4">
            Preservação de Memórias com IA
          </p>
          
          <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
            Mantenha vivas as vozes e memórias dos seus entes queridos com nossa tecnologia de IA avançada.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <Button size="lg" onClick={onTryFree}>
              Começar Gratuitamente
            </Button>
            <Button size="lg" variant="outline" onClick={onLearnMore}>
              <PlayFilled size={16} className="mr-2" />
              Ver Como Funciona
            </Button>
          </div>

          {/* Trust Indicators */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-6 text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <SecurityServices size={16} />
              <span>Privado por padrão</span>
            </div>
            <div className="flex items-center gap-2">
              <Favorite size={16} />
              <span>Feito para famílias</span>
            </div>
            <div className="flex items-center gap-2">
              <Flash size={16} />
              <span>Configuração em minutos</span>
            </div>
          </div>
        </div>
      </section>

      {/* Removed stats section with fake data */}

      {/* Simple How It Works Section */}
      <section id="como-funciona" className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-background to-muted/30">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">
              Como Funciona
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Transforme memórias em conversas eternas em apenas 4 passos simples
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {steps.map((step, index) => (
              <Card key={index} className="relative border hover:shadow-lg transition-all duration-300">
                <CardContent className="p-6">
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 w-8 h-8 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-sm font-bold">
                    {index + 1}
                  </div>
                  
                  <div className="mb-4 text-primary flex justify-center">
                    <div className="p-3 bg-primary/10 rounded-lg">
                      {step.icon}
                    </div>
                  </div>
                  
                  <div className="text-center">
                    <h3 className="text-lg font-semibold mb-2">{step.title}</h3>
                    <p className="text-muted-foreground text-sm mb-3">{step.description}</p>
                    <p className="text-xs text-muted-foreground/80">{step.detail}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
          
          <div className="text-center mt-12">
            <div className="bg-gradient-to-r from-primary/10 via-primary/5 to-primary/10 rounded-lg p-6 border border-primary/20">
              <p className="text-muted-foreground mb-4">
                <span className="text-primary font-semibold">*</span> Clonagem de voz personalizada disponível após completar o perfil
              </p>
              <Button size="lg" onClick={onTryFree}>
                Começar Sua Jornada Agora
                <ArrowRight size={16} className="ml-2" />
              </Button>
              <p className="text-sm text-muted-foreground mt-3">
                Gratuito para sempre • Sem cartão de crédito
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Why Eterna Section */}
      <section id="por-que-eterna" className="py-20 px-4 sm:px-6 lg:px-8 bg-muted/30">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">
              Por Que Escolher o Eterna?
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Mais do que tecnologia, oferecemos uma ponte emocional entre você e seus entes queridos.
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 gap-8">
            {whyEternaPoints.map((point, index) => (
              <Card key={index} className="border hover:shadow-lg transition-all duration-300">
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    <div className="flex-shrink-0 p-2 bg-muted rounded-lg">
                      {point.icon}
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold mb-2">{point.title}</h3>
                      <p className="text-muted-foreground">{point.description}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">
              Tudo o que Você Precisa
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Uma solução completa para preservar e interagir com as memórias dos seus entes queridos.
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <Card key={index} className="border hover:shadow-lg transition-all duration-300">
                <CardContent className="p-6">
                  <div className="mb-4 text-foreground">
                    {feature.icon}
                  </div>
                  <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                  <p className="text-muted-foreground">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Removed testimonials section with fake data */}

      {/* Pricing Section */}
      <section id="precos" className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">
              Preços Simples e Transparentes
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Escolha o plano que melhor se adapta às necessidades da sua família.
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {pricingPlans.map((plan, index) => (
              <Card key={index} className={`relative border ${plan.isPopular ? 'border-foreground shadow-lg' : ''}`}>
                {plan.isPopular && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                    <Badge className="bg-foreground text-background">Mais Popular</Badge>
                  </div>
                )}
                <CardContent className="p-6">
                  <div className="text-center mb-6">
                    <h3 className="text-xl font-bold mb-2">{plan.name}</h3>
                    <div className="mb-2">
                      <span className="text-3xl font-bold">{plan.price}</span>
                      <span className="text-muted-foreground">{plan.period}</span>
                    </div>
                    <p className="text-muted-foreground">{plan.description}</p>
                  </div>
                  
                  <ul className="space-y-3 mb-6">
                     {plan.features.map((feature, featureIndex) => (
                       <li key={featureIndex} className="flex items-center gap-2">
                         <Checkmark size={16} className="text-foreground flex-shrink-0" />
                         <span className="text-sm">{feature}</span>
                       </li>
                     ))}
                  </ul>
                  
                  <Button 
                    onClick={onTryFree} 
                    className={`w-full ${plan.isPopular ? '' : 'variant="outline"'}`}
                    variant={plan.isPopular ? 'default' : 'outline'}
                  >
                    {plan.buttonText}
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
          
          <div className="text-center mt-12">
            <p className="text-muted-foreground mb-4">
              Teste grátis por 14 dias. Cancele a qualquer momento.
            </p>
            <p className="text-muted-foreground">
              Todas as assinaturas incluem garantia de 30 dias.
            </p>
          </div>
        </div>
      </section>

      {/* Technology Section */}
      <section id="privacidade" className="py-20 px-4 sm:px-6 lg:px-8 bg-muted/30">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">
              Tecnologia Confiável
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Construído com tecnologias modernas e transparentes para preservar suas memórias com segurança.
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 gap-8">
            {techPoints.map((point, index) => (
              <Card key={index} className="border hover:shadow-lg transition-all duration-300">
                <CardContent className="p-6">
                  <div className="flex flex-col items-center text-center gap-4">
                    <div className="p-4 bg-muted rounded-xl">
                      {point.icon}
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold mb-3">{point.title}</h3>
                      <p className="text-muted-foreground leading-relaxed">{point.description}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
          
          <div className="text-center mt-12">
            <div className="inline-flex items-center gap-2 bg-background border rounded-lg px-4 py-2">
              <Code size={20} />
              <span className="font-medium">Open Source</span>
              <span className="text-muted-foreground">• Transparente • Controlado</span>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl sm:text-4xl font-bold mb-6">
            Comece a Preservar Memórias Hoje
          </h2>
          <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
            Não deixe as vozes e memórias dos seus entes queridos se perderem. 
            Comece gratuitamente e veja a magia acontecer em minutos.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" onClick={onTryFree}>
              Experimente Grátis Agora
              <ArrowRight size={16} className="ml-2" />
            </Button>
            <Button size="lg" variant="outline" onClick={() => scrollToSection('precos')}>
              Ver Preços
            </Button>
          </div>
          <p className="text-sm text-muted-foreground mt-4">
            Sem cartão de crédito • Configuração em 5 minutos • Suporte 24/7
          </p>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border bg-muted/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid md:grid-cols-4 gap-8">
            <div className="col-span-2">
              <div className="flex items-center space-x-2 mb-4">
                <div className="w-8 h-8 bg-foreground rounded-lg flex items-center justify-center">
                  <span className="text-background font-bold text-sm">E</span>
                </div>
                <span className="text-xl font-bold">Eterna</span>
              </div>
              <p className="text-muted-foreground mb-4 max-w-md">
                Preservando vozes e memórias familiares com tecnologia de IA avançada. 
                Feito com amor para famílias brasileiras.
              </p>
              <div className="flex space-x-4 text-muted-foreground">
                <span>contato@eterna.com.br</span>
              </div>
            </div>
            
            <div>
              <h3 className="font-semibold mb-4">Produto</h3>
              <ul className="space-y-2 text-muted-foreground">
                <li><button onClick={() => scrollToSection('como-funciona')} className="hover:text-foreground transition-colors">Como Funciona</button></li>
                <li><button onClick={() => scrollToSection('precos')} className="hover:text-foreground transition-colors">Preços</button></li>
                <li><button onClick={onTryFree} className="hover:text-foreground transition-colors">Teste Grátis</button></li>
              </ul>
            </div>
            
            <div>
              <h3 className="font-semibold mb-4">Suporte</h3>
              <ul className="space-y-2 text-muted-foreground">
                <li><a href="#" className="hover:text-foreground transition-colors">Ajuda e FAQ</a></li>
                <li><a href="#" className="hover:text-foreground transition-colors">Termos de Uso</a></li>
                <li><a href="#" className="hover:text-foreground transition-colors">Política de Privacidade</a></li>
                <li><a href="#" className="hover:text-foreground transition-colors">Contato</a></li>
              </ul>
            </div>
          </div>
          
          <div className="mt-12 pt-8 border-t border-border text-center">
            <p className="text-muted-foreground">
              © 2024 Eterna. Feito com ❤️ para preservar memórias que importam.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
