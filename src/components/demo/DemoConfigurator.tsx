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
            <div className="text-center space-y-4">
              <div className="w-16 h-16 bg-secondary/20 rounded-full flex items-center justify-center mx-auto">
                <User className="w-8 h-8 text-secondary" />
              </div>
              <div>
                <h3 className="font-serif text-2xl text-primary-foreground mb-2">
                  Qual o nome desta pessoa especial?
                </h3>
                <p className="text-primary-foreground/70">
                  Vamos começar criando sua pessoa querida
                </p>
              </div>
            </div>
            <Input
              placeholder="Ex: Vovó Maria, Mamãe..."
              value={config.name}
              onChange={(e) => setConfig(prev => ({ ...prev, name: e.target.value }))}
              className="text-lg h-14 bg-primary-foreground/5 border-primary-foreground/20 text-primary-foreground placeholder:text-primary-foreground/50"
            />
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
            <div className="text-center space-y-4">
              <div className="w-16 h-16 bg-secondary/20 rounded-full flex items-center justify-center mx-auto">
                <Heart className="w-8 h-8 text-secondary" />
              </div>
              <div>
                <h3 className="font-serif text-2xl text-primary-foreground mb-2">
                  Qual é a sua relação?
                </h3>
                <p className="text-primary-foreground/70">
                  Escolha o tipo de relacionamento que vocês tinham
                </p>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              {relationshipOptions.map((option) => (
                <Card
                  key={option.id}
                  className={`p-4 cursor-pointer transition-all hover:scale-105 ${
                    config.relationship === option.label
                      ? 'ring-2 ring-secondary bg-secondary/10'
                      : 'bg-primary-foreground/5 hover:bg-primary-foreground/10'
                  }`}
                  onClick={() => selectRelationship(option.label, option.avatar)}
                >
                  <div className="flex flex-col items-center space-y-3">
                    <Avatar className="w-16 h-16">
                      <AvatarImage src={option.avatar} />
                      <AvatarFallback className="bg-secondary/20 text-secondary">
                        {option.label.slice(0, 2)}
                      </AvatarFallback>
                    </Avatar>
                    <span className="font-medium text-primary-foreground text-center">
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
            <div className="text-center space-y-4">
              <div className="w-16 h-16 bg-secondary/20 rounded-full flex items-center justify-center mx-auto">
                <MessageSquare className="w-8 h-8 text-secondary" />
              </div>
              <div>
                <h3 className="font-serif text-2xl text-primary-foreground mb-2">
                  Como {config.name} te chamava?
                </h3>
                <p className="text-primary-foreground/70">
                  Esses detalhes fazem toda diferença na conversa
                </p>
              </div>
            </div>
            <Input
              placeholder="Ex: meu bem, filho, amor, querido..."
              value={config.howTheyCallYou}
              onChange={(e) => setConfig(prev => ({ ...prev, howTheyCallYou: e.target.value }))}
              className="text-lg h-14 bg-primary-foreground/5 border-primary-foreground/20 text-primary-foreground placeholder:text-primary-foreground/50"
            />
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
            <div className="text-center space-y-4">
              <div className="w-16 h-16 bg-secondary/20 rounded-full flex items-center justify-center mx-auto">
                <Brain className="w-8 h-8 text-secondary" />
              </div>
              <div>
                <h3 className="font-serif text-2xl text-primary-foreground mb-2">
                  Como era a personalidade de {config.name}?
                </h3>
                <p className="text-primary-foreground/70">
                  Escolha até 3 características que mais definem essa pessoa
                </p>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              {personalityOptions.map((trait) => (
                <Badge
                  key={trait.id}
                  variant={config.personality.includes(trait.id) ? "default" : "outline"}
                  className={`p-3 cursor-pointer transition-all hover:scale-105 justify-center ${
                    config.personality.includes(trait.id)
                      ? 'bg-secondary text-secondary-foreground'
                      : 'bg-primary-foreground/5 border-primary-foreground/20 text-primary-foreground hover:bg-primary-foreground/10'
                  }`}
                  onClick={() => togglePersonality(trait.id)}
                >
                  <span className="mr-2">{trait.icon}</span>
                  {trait.label}
                </Badge>
              ))}
            </div>
            {config.personality.length > 0 && (
              <div className="text-center">
                <p className="text-sm text-primary-foreground/60">
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
    <div className="space-y-8">
      {/* Progress Bar */}
      <div className="w-full bg-primary-foreground/10 rounded-full h-2">
        <div 
          className="bg-secondary h-2 rounded-full transition-all duration-300"
          style={{ width: `${(step / totalSteps) * 100}%` }}
        />
      </div>

      {/* Step Counter */}
      <div className="text-center">
        <span className="text-sm text-primary-foreground/70">
          Passo {step} de {totalSteps}
        </span>
      </div>

      {/* Step Content */}
      <div className="min-h-[400px] flex items-center">
        <AnimatePresence mode="wait">
          {renderStep()}
        </AnimatePresence>
      </div>

      {/* Navigation */}
      <div className="flex justify-between">
        <Button 
          onClick={handleBack}
          variant="ghost"
          className="text-primary-foreground/80 hover:text-primary-foreground hover:bg-white/10"
          disabled={step === 1}
        >
          Voltar
        </Button>
        <Button 
          onClick={handleNext}
          disabled={!canProceed()}
          className="bg-secondary hover:bg-secondary/90 text-secondary-foreground min-w-[120px]"
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