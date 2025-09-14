import React, { memo } from 'react';
import { Button } from '@/components/ui/button';
import { ArrowRight, Heart, Shield, Zap } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

// Simplified, performance-optimized landing page
const FastLanding = memo(() => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background/95 to-primary/5">
      {/* Simple Header */}
      <header className="border-b bg-background/80 backdrop-blur-sm">
        <div className="container max-w-6xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Heart className="w-8 h-8 text-primary" />
              <div>
                <h1 className="text-xl font-bold">Eterna</h1>
                <p className="text-sm text-muted-foreground">Memórias que Vivem</p>
              </div>
            </div>
            <div className="flex gap-3">
              <Button variant="ghost" onClick={() => navigate('/auth')}>
                Entrar
              </Button>
              <Button onClick={() => navigate('/auth')}>
                Começar Grátis
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="container max-w-6xl mx-auto px-4 py-20">
        <div className="text-center max-w-4xl mx-auto">
          <h1 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
            Preservando Conversas
            <br />
            com Amor
          </h1>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            Crie um clone conversacional terapêutico do seu ente querido usando IA, 
            oferecendo conforto e preservando memórias preciosas.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <Button size="lg" className="text-lg px-8 py-4" onClick={() => navigate('/auth')}>
              Começar Gratuitamente
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
            <Button size="lg" variant="outline" className="text-lg px-8 py-4" onClick={() => navigate('/simple-pricing')}>
              Ver Preços
            </Button>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="container max-w-6xl mx-auto px-4 py-16">
        <div className="grid md:grid-cols-3 gap-8">
          <div className="text-center p-6">
            <Heart className="w-12 h-12 text-primary mx-auto mb-4" />
            <h3 className="text-xl font-semibold mb-2">Terapêutico</h3>
            <p className="text-muted-foreground">
              Projetado para conforto emocional e reminiscência terapêutica
            </p>
          </div>
          
          <div className="text-center p-6">
            <Shield className="w-12 h-12 text-primary mx-auto mb-4" />
            <h3 className="text-xl font-semibold mb-2">Privado</h3>
            <p className="text-muted-foreground">
              Seus dados são criptografados e nunca compartilhados
            </p>
          </div>
          
          <div className="text-center p-6">
            <Zap className="w-12 h-12 text-primary mx-auto mb-4" />
            <h3 className="text-xl font-semibold mb-2">Inteligente</h3>
            <p className="text-muted-foreground">
              IA avançada que captura o estilo e personalidade únicos
            </p>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-primary/5 border-t">
        <div className="container max-w-6xl mx-auto px-4 py-16 text-center">
          <h2 className="text-3xl font-bold mb-4">
            Pronto para Preservar Memórias Preciosas?
          </h2>
          <p className="text-xl text-muted-foreground mb-8">
            Comece seu teste grátis de 7 dias hoje
          </p>
          <Button size="lg" className="text-lg px-8 py-4" onClick={() => navigate('/auth')}>
            Começar Agora
            <ArrowRight className="w-5 h-5 ml-2" />
          </Button>
        </div>
      </section>
    </div>
  );
});

FastLanding.displayName = 'FastLanding';

export default FastLanding;