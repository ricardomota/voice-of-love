import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Close, ArrowRight } from '@carbon/icons-react';
import { motion } from 'framer-motion';
import { DemoChat } from '@/components/demo/DemoChat';
import { DemoConfigurator } from '@/components/demo/DemoConfigurator';

interface DemoModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface DemoPersonaConfig {
  name: string;
  relationship: string;
  howTheyCallYou: string;
  personality: string[];
  avatar: string;
}

export const DemoModal: React.FC<DemoModalProps> = ({ isOpen, onClose }) => {
  const [showDemo, setShowDemo] = useState(true);
  const [showConfigurator, setShowConfigurator] = useState(true);
  const [personaConfig, setPersonaConfig] = useState<DemoPersonaConfig | undefined>();

  useEffect(() => {
    if (isOpen) {
      setShowDemo(true);
      setShowConfigurator(true);
      setPersonaConfig(undefined);
    }
  }, [isOpen]);

  const handleConfigComplete = (config: DemoPersonaConfig) => {
    setPersonaConfig(config);
    setShowConfigurator(false);
  };

  const handleReconfigure = () => {
    setShowConfigurator(true);
  };

  const handleStartDemo = () => {
    setShowDemo(true);
  };

  const handleTryFull = () => {
    window.location.href = '/auth';
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl w-full max-h-[90vh] p-0 bg-gradient-to-br from-primary via-primary/95 to-accent border-primary-foreground/20 [&>button]:hidden">
        <div className="relative p-8">
          {/* Close button */}
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            className="absolute top-4 right-4 text-primary-foreground/80 hover:text-primary-foreground hover:bg-white/10 z-10"
          >
            <Close size={20} />
          </Button>

          <DialogHeader className="space-y-6 text-center mb-8">
            <DialogTitle className="text-3xl md:text-4xl font-serif text-primary-foreground text-center">
              {showConfigurator ? 'Crie Sua Pessoa Especial' : 'Experience Eterna Demo'}
            </DialogTitle>
            <DialogDescription className="text-lg text-primary-foreground/90 max-w-2xl mx-auto text-center">
              {showConfigurator 
                ? 'Configure a personalidade e características da pessoa com quem você quer conversar'
                : 'Agora converse com a pessoa que você criou'
              }
            </DialogDescription>
          </DialogHeader>

          {/* Demo Area */}
          <div className="space-y-6">
            {showConfigurator ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="space-y-6"
              >
                <DemoConfigurator onComplete={handleConfigComplete} />
              </motion.div>
            ) : (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="space-y-6"
              >
                {/* Interactive Demo */}
                <DemoChat config={personaConfig} onReconfigure={handleReconfigure} />
                
                {/* Post-Demo CTA */}
                <div className="text-center space-y-4 pt-4">
                  <p className="text-primary-foreground/90">
                    Pronto para criar versões de IA dos seus próprios entes queridos?
                  </p>
                  <div className="flex gap-4 justify-center">
                    <Button
                      onClick={handleReconfigure}
                      variant="outline"
                      className="border-primary-foreground/30 text-primary-foreground hover:bg-primary-foreground/10"
                    >
                      Configurar Novamente
                    </Button>
                    <Button
                      onClick={handleTryFull}
                      variant="secondary"
                      className="min-w-[160px] flex items-center gap-2"
                    >
                      Usar Eterna Grátis
                      <ArrowRight size={16} />
                    </Button>
                  </div>
                </div>
              </motion.div>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};