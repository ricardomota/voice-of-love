import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Heart, Lock, Brain, Mic, Users, MessageCircle, Check, Menu, X } from 'lucide-react';

export default function RileyLandingPage() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const features = [
    {
      icon: <Mic className="w-8 h-8" />,
      title: "Clonagem de Voz",
      description: "IA avançada preserva os padrões únicos de voz e características de fala dos seus entes queridos."
    },
    {
      icon: <Users className="w-8 h-8" />,
      title: "Perfis da Família",
      description: "Crie perfis abrangentes com memórias, fotos e histórias pessoais para cada membro da família."
    },
    {
      icon: <MessageCircle className="w-8 h-8" />,
      title: "Conversas Naturais",
      description: "Tenha diálogos significativos que se sentem autênticos e emocionalmente conectados."
    },
    {
      icon: <Lock className="w-8 h-8" />,
      title: "Privacidade Primeiro",
      description: "As memórias da sua família são criptografadas e armazenadas com segurança de nível militar."
    },
    {
      icon: <Brain className="w-8 h-8" />,
      title: "Preservação de Memória",
      description: "IA aprende com conversas para manter traços de personalidade e memórias queridas."
    },
    {
      icon: <Heart className="w-8 h-8" />,
      title: "Feito com Amor",
      description: "Criado especificamente para famílias afetadas pelo Alzheimer e perda de memória."
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
              <a href="#como-funciona" className="text-muted-foreground hover:text-foreground transition-colors">Como Funciona</a>
              <a href="#precos" className="text-muted-foreground hover:text-foreground transition-colors">Preços</a>
              <a href="#missao" className="text-muted-foreground hover:text-foreground transition-colors">Nossa Missão</a>
            </nav>

            <div className="hidden md:flex items-center space-x-4">
              <Button variant="outline" asChild>
                <a href="/auth">Entrar</a>
              </Button>
              <Button asChild>
                <a href="/auth">Experimente Grátis</a>
              </Button>
            </div>

            <button
              className="md:hidden"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
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
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" asChild>
              <a href="/auth">Começar Gratuitamente</a>
            </Button>
            <Button size="lg" variant="outline" asChild>
              <a href="#como-funciona">Saiba Mais</a>
            </Button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="como-funciona" className="py-20 px-4 sm:px-6 lg:px-8 bg-muted/30">
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

      {/* Footer */}
      <footer className="border-t border-border bg-muted/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center space-x-2 mb-4 md:mb-0">
              <div className="w-6 h-6 bg-foreground rounded flex items-center justify-center">
                <span className="text-background font-bold text-xs">E</span>
              </div>
              <span className="text-xl font-bold">Eterna</span>
            </div>
            <div className="flex space-x-6">
              <a href="#" className="text-muted-foreground hover:text-foreground transition-colors">Privacidade</a>
              <a href="#" className="text-muted-foreground hover:text-foreground transition-colors">Termos</a>
              <a href="#" className="text-muted-foreground hover:text-foreground transition-colors">Suporte</a>
            </div>
          </div>
          <div className="mt-8 pt-8 border-t border-border text-center">
            <p className="text-muted-foreground">© 2024 Eterna. Feito com ❤️ para preservar memórias.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}