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
      <DialogContent className="max-w-6xl w-[95vw] max-h-[90vh] p-0 bg-background border [&>button]:hidden overflow-hidden">
        <div className="relative h-full flex flex-col p-4 md:p-6 lg:p-8">
          {/* Close button */}
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            className="absolute top-3 right-3 md:top-4 md:right-4 text-muted-foreground hover:text-foreground hover:bg-muted z-10"
          >
            <Close size={20} />
          </Button>

          <DialogHeader className="space-y-4 md:space-y-6 text-center mb-6 md:mb-8 pr-8">
            <DialogTitle className="text-2xl md:text-3xl lg:text-4xl font-serif text-foreground text-center">
              {showConfigurator ? 'Crie Sua Pessoa Especial' : 'Experience Eterna Demo'}
            </DialogTitle>
            <DialogDescription className="text-base md:text-lg text-muted-foreground max-w-2xl mx-auto text-center">
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
                <div className="text-center space-y-4 md:space-y-6 pt-6 md:pt-8">
                  <p className="text-sm md:text-base text-muted-foreground px-4 md:px-0">
                    Pronto para criar versões de IA dos seus próprios entes queridos?
                  </p>
                  <div className="flex flex-col sm:flex-row gap-3 md:gap-4 justify-center px-4 md:px-0">
                    <Button
                      onClick={handleReconfigure}
                      variant="outline"
                      className="w-full sm:w-auto"
                    >
                      Configurar Novamente
                    </Button>
                    <Button
                      onClick={handleTryFull}
                      className="min-w-[160px] flex items-center gap-2 w-full sm:w-auto"
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