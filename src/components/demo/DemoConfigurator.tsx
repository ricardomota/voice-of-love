import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { ArrowRight, User, Heart, Brain, MessageSquare } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface DemoPersonaConfig {
  name: string;
  relationship: string;
  howTheyCallYou: string;
  personality: string[];
  avatar: string;
}

interface DemoConfiguratorProps {
  onComplete: (config: DemoPersonaConfig) => void;
}

const personalityOptions = [
  { id: 'carinhosa', label: 'Carinhosa', icon: '🥰' },
  { id: 'sabia', label: 'Sábia', icon: '🧠' },
  { id: 'divertida', label: 'Divertida', icon: '😄' },
  { id: 'protetora', label: 'Protetora', icon: '🛡️' },
  { id: 'paciente', label: 'Paciente', icon: '🕊️' },
  { id: 'energetica', label: 'Energética', icon: '⚡' },
  { id: 'tradicional', label: 'Tradicional', icon: '🏛️' },
  { id: 'moderna', label: 'Moderna', icon: '🌟' }
];

const relationshipOptions = [
  { id: 'avó', label: 'Minha avó', avatar: '/lovable-uploads/da7c745c-758a-4054-a38a-03a05da9fb7b.png' },
  { id: 'mãe', label: 'Minha mãe', avatar: '/lovable-uploads/2973a344-d482-4b1e-b436-caa0d08347c5.png' },
  { id: 'pai', label: 'Meu pai', avatar: '/lovable-uploads/4a3edab3-4083-4a1c-a748-c8c1d4626206.png' },
  { id: 'tio', label: 'Meu tio', avatar: '/lovable-uploads/91a8b058-4624-4dfd-a844-b72b970ebf11.png' }
];

export const DemoConfigurator: React.FC<DemoConfiguratorProps> = ({ onComplete }) => {
  const [step, setStep] = useState(1);
  const [config, setConfig] = useState<DemoPersonaConfig>({
    name: '',
    relationship: '',
    howTheyCallYou: '',
    personality: [],
    avatar: ''
  });

  const totalSteps = 4;

  const handleNext = () => {
    if (step < totalSteps) {
      setStep(step + 1);
    } else {
      onComplete(config);
    }
  };

  const handleBack = () => {
    if (step > 1) {
      setStep(step - 1);
    }
  };

  const canProceed = () => {
    switch (step) {
      case 1: return config.name.trim() !== '';
      case 2: return config.relationship !== '';
      case 3: return config.howTheyCallYou.trim() !== '';
      case 4: return config.personality.length > 0;
      default: return false;
    }
  };

  const selectRelationship = (relationship: string, avatar: string) => {
    setConfig(prev => ({ ...prev, relationship, avatar }));
  };

  const togglePersonality = (trait: string) => {
    setConfig(prev => ({
      ...prev,
      personality: prev.personality.includes(trait)
        ? prev.personality.filter(p => p !== trait)
        : [...prev.personality, trait].slice(0, 3) // Max 3 traits
    }));
  };

  const renderStep = () => {
    switch (step) {
      case 1:
        return (
          <motion.div
            key="step1"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-6"
          >
            <div className="text-center space-y-4 md:space-y-6">
              <div className="w-16 h-16 md:w-20 md:h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto">
                <User className="w-8 h-8 md:w-10 md:h-10 text-primary" />
              </div>
              <div className="space-y-2 md:space-y-3">
                <h3 className="font-serif text-xl md:text-2xl lg:text-3xl text-foreground">
                  Qual o nome desta pessoa especial?
                </h3>
                <p className="text-sm md:text-base text-muted-foreground px-4 md:px-0">
                  Vamos começar criando sua pessoa querida
                </p>
              </div>
            </div>
            <div className="px-4 md:px-0">
              <Input
                placeholder="Ex: Vovó Maria, Mamãe..."
                value={config.name}
                onChange={(e) => setConfig(prev => ({ ...prev, name: e.target.value }))}
                className="text-base md:text-lg h-12 md:h-14 w-full"
              />
            </div>
          </motion.div>
        );

      case 2:
        return (
          <motion.div
            key="step2"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-6"
          >
            <div className="text-center space-y-4 md:space-y-6">
              <div className="w-16 h-16 md:w-20 md:h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto">
                <Heart className="w-8 h-8 md:w-10 md:h-10 text-primary" />
              </div>
              <div className="space-y-2 md:space-y-3">
                <h3 className="font-serif text-xl md:text-2xl lg:text-3xl text-foreground">
                  Qual é a sua relação?
                </h3>
                <p className="text-sm md:text-base text-muted-foreground px-4 md:px-0">
                  Escolha o tipo de relacionamento que vocês tinham
                </p>
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 md:gap-4 px-4 md:px-0">
              {relationshipOptions.map((option) => (
                <Card
                  key={option.id}
                  className={`p-4 md:p-6 cursor-pointer transition-all duration-200 hover:scale-[1.02] ${
                    config.relationship === option.label
                      ? 'ring-2 ring-primary bg-primary/10'
                      : 'hover:bg-muted/50 hover:shadow-md'
                  }`}
                  onClick={() => selectRelationship(option.label, option.avatar)}
                >
                  <div className="flex flex-col items-center space-y-3">
                    <Avatar className="w-14 h-14 md:w-16 md:h-16">
                      <AvatarImage src={option.avatar} />
                      <AvatarFallback className="bg-primary/10 text-primary text-sm">
                        {option.label.slice(0, 2)}
                      </AvatarFallback>
                    </Avatar>
                    <span className="font-medium text-foreground text-center text-sm md:text-base">
                      {option.label}
                    </span>
                  </div>
                </Card>
              ))}
            </div>
          </motion.div>
        );

      case 3:
        return (
          <motion.div
            key="step3"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-6"
          >
            <div className="text-center space-y-4 md:space-y-6">
              <div className="w-16 h-16 md:w-20 md:h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto">
                <MessageSquare className="w-8 h-8 md:w-10 md:h-10 text-primary" />
              </div>
              <div className="space-y-2 md:space-y-3">
                <h3 className="font-serif text-xl md:text-2xl lg:text-3xl text-foreground">
                  Como {config.name} te chamava?
                </h3>
                <p className="text-sm md:text-base text-muted-foreground px-4 md:px-0">
                  Esses detalhes fazem toda diferença na conversa
                </p>
              </div>
            </div>
            <div className="px-4 md:px-0">
              <Input
                placeholder="Ex: meu bem, filho, amor, querido..."
                value={config.howTheyCallYou}
                onChange={(e) => setConfig(prev => ({ ...prev, howTheyCallYou: e.target.value }))}
                className="text-base md:text-lg h-12 md:h-14 w-full"
              />
            </div>
          </motion.div>
        );

      case 4:
        return (
          <motion.div
            key="step4"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-6"
          >
            <div className="text-center space-y-4 md:space-y-6">
              <div className="w-16 h-16 md:w-20 md:h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto">
                <Brain className="w-8 h-8 md:w-10 md:h-10 text-primary" />
              </div>
              <div className="space-y-2 md:space-y-3">
                <h3 className="font-serif text-xl md:text-2xl lg:text-3xl text-foreground">
                  Como era a personalidade de {config.name}?
                </h3>
                <p className="text-sm md:text-base text-muted-foreground px-4 md:px-0">
                  Escolha até 3 características que mais definem essa pessoa
                </p>
              </div>
            </div>
            <div className="grid grid-cols-2 lg:grid-cols-3 gap-3 md:gap-4 px-4 md:px-0">
              {personalityOptions.map((trait) => (
                <Badge
                  key={trait.id}
                  variant={config.personality.includes(trait.id) ? "default" : "outline"}
                  className="p-3 md:p-4 cursor-pointer transition-all duration-200 hover:scale-[1.02] justify-center text-sm md:text-base"
                  onClick={() => togglePersonality(trait.id)}
                >
                  <span className="mr-2">{trait.icon}</span>
                  {trait.label}
                </Badge>
              ))}
            </div>
            {config.personality.length > 0 && (
              <div className="text-center pt-2">
                <p className="text-sm text-muted-foreground bg-muted/30 px-3 py-1 rounded-full inline-block">
                  {config.personality.length}/3 características selecionadas
                </p>
              </div>
            )}
          </motion.div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="max-w-3xl mx-auto bg-background rounded-xl border shadow-lg p-6 md:p-8 lg:p-10 space-y-6 md:space-y-8">
      {/* Progress Bar */}
      <div className="w-full bg-muted rounded-full h-2.5">
        <div 
          className="bg-primary h-2.5 rounded-full transition-all duration-500 ease-out"
          style={{ width: `${(step / totalSteps) * 100}%` }}
        />
      </div>

      {/* Step Counter */}
      <div className="text-center">
        <span className="text-sm font-medium text-muted-foreground bg-muted/50 px-3 py-1 rounded-full">
          Passo {step} de {totalSteps}
        </span>
      </div>

      {/* Step Content */}
      <div className="min-h-[320px] md:min-h-[400px] flex items-center justify-center">
        <div className="w-full max-w-2xl">
          <AnimatePresence mode="wait">
            {renderStep()}
          </AnimatePresence>
        </div>
      </div>

      {/* Navigation */}
      <div className="flex flex-col-reverse sm:flex-row justify-between gap-4 pt-6 border-t">
        <Button 
          onClick={handleBack}
          variant="ghost"
          disabled={step === 1}
          className="w-full sm:w-auto"
        >
          Voltar
        </Button>
        <Button 
          onClick={handleNext}
          disabled={!canProceed()}
          className="min-w-[120px] w-full sm:w-auto"
        >
          {step === totalSteps ? (
            <>
              Começar Chat
              <ArrowRight className="ml-2 w-4 h-4" />
            </>
          ) : (
            'Próximo'
          )}
        </Button>
      </div>
    </div>
  );
};