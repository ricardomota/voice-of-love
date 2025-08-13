import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Calendar, Zap, Bug, Sparkles } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const changelogEntries = [
  {
    version: "Beta v0.3.0",
    date: "2024-08-13",
    type: "major",
    changes: [
      {
        type: "new",
        title: "Lista de Espera Aprimorada",
        description: "Nova interface de lista de espera com validação em tempo real, posição na fila e opções de compartilhamento."
      },
      {
        type: "new", 
        title: "Integração Together.ai",
        description: "Adicionado suporte ao modelo Together.ai OSS-20B para usuários gratuitos, mantendo OpenAI GPT-5o para conversas premium."
      },
      {
        type: "improvement",
        title: "Fluxo de Onboarding",
        description: "Melhorias na experiência de primeiro acesso com informações mais claras sobre o produto."
      }
    ]
  },
  {
    version: "Beta v0.2.0", 
    date: "2024-08-10",
    type: "minor",
    changes: [
      {
        type: "new",
        title: "Sistema de Personalidade Adaptativa",
        description: "IA agora aprende e se adapta ao estilo de conversa da pessoa preservada."
      },
      {
        type: "improvement",
        title: "Qualidade de Voz",
        description: "Melhorias significativas na clonagem de voz com maior naturalidade."
      },
      {
        type: "fix",
        title: "Correções de Performance",
        description: "Otimizações gerais de performance e correção de bugs menores."
      }
    ]
  },
  {
    version: "Beta v0.1.0",
    date: "2024-08-05", 
    type: "major",
    changes: [
      {
        type: "new",
        title: "Lançamento Beta",
        description: "Primeira versão beta do Eterna com funcionalidades core de clonagem de voz e personalidade."
      },
      {
        type: "new",
        title: "Sistema de Memórias",
        description: "Capacidade de preservar histórias, memórias e conhecimentos pessoais."
      },
      {
        type: "new",
        title: "Interface Multilíngue",
        description: "Suporte inicial para Português, Inglês e Espanhol."
      }
    ]
  }
];

const getTypeIcon = (type: string) => {
  switch (type) {
    case 'new':
      return <Sparkles className="w-4 h-4 text-green-500" />;
    case 'improvement':
      return <Zap className="w-4 h-4 text-blue-500" />;
    case 'fix':
      return <Bug className="w-4 h-4 text-orange-500" />;
    default:
      return null;
  }
};

const getTypeBadge = (type: string) => {
  const variants: Record<string, "default" | "secondary" | "destructive" | "outline"> = {
    'new': 'default',
    'improvement': 'secondary', 
    'fix': 'outline'
  };
  
  const labels = {
    'new': 'Novo',
    'improvement': 'Melhoria',
    'fix': 'Correção'
  };
  
  return (
    <Badge variant={variants[type] || 'default'}>
      {labels[type as keyof typeof labels] || type}
    </Badge>
  );
};

export const Changelog: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-muted/30 to-background">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        
        {/* Header */}
        <div className="mb-8">
          <Button 
            variant="ghost" 
            onClick={() => navigate('/')}
            className="mb-4"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Voltar
          </Button>
          
          <div className="space-y-4">
            <h1 className="text-4xl font-bold text-foreground">
              Changelog
            </h1>
            <p className="text-xl text-muted-foreground">
              Acompanhe todas as novidades e melhorias do Eterna
            </p>
          </div>
        </div>

        {/* Changelog Entries */}
        <div className="space-y-8">
          {changelogEntries.map((entry, index) => (
            <Card key={entry.version} className="overflow-hidden">
              <CardHeader className="bg-muted/30">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-2xl font-semibold">
                    {entry.version}
                  </CardTitle>
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Calendar className="w-4 h-4" />
                    <span>{new Date(entry.date).toLocaleDateString('pt-BR')}</span>
                  </div>
                </div>
              </CardHeader>
              
              <CardContent className="pt-6">
                <div className="space-y-4">
                  {entry.changes.map((change, changeIndex) => (
                    <div 
                      key={changeIndex}
                      className="flex gap-4 p-4 rounded-lg bg-muted/20 border border-border/50"
                    >
                      <div className="flex-shrink-0 pt-1">
                        {getTypeIcon(change.type)}
                      </div>
                      
                      <div className="flex-1 space-y-2">
                        <div className="flex items-center gap-2">
                          <h3 className="font-semibold text-foreground">
                            {change.title}
                          </h3>
                          {getTypeBadge(change.type)}
                        </div>
                        
                        <p className="text-muted-foreground leading-relaxed">
                          {change.description}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Footer Message */}
        <div className="mt-12 text-center">
          <p className="text-muted-foreground">
            Mais atualizações em breve. Obrigado por fazer parte da nossa jornada! ❤️
          </p>
        </div>
        
      </div>
    </div>
  );
};