import React, { useMemo, useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { AnimatePresence, motion } from 'framer-motion';
import { StepRelationship } from './steps/StepRelationship';
import { StepPersonalization } from './steps/StepPersonalization';
import { StepStyle } from './steps/StepStyle';
import { StepTopic } from './steps/StepTopic';
import { StepOutput } from './steps/StepOutput';
import { StepPreview } from './steps/StepPreview';
import { DemoState } from './types';
import { Close } from '@carbon/icons-react';
import { useIsMobile } from '@/hooks/use-mobile';
import { useLanguage } from '@/contexts/LanguageContext';

interface DemoWizardModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const totalSteps = 6;

const getContent = (language: string) => {
  const content = {
    en: {
      title: "Try a 60s Demo",
      description: "A gentle, 6-step preview of Eterna's memory companion.",
      step: (s: number, t: number) => `Step ${s} of ${t}`,
      back: "Back",
      next: "Next",
      startShort: "Start Trial",
      startLong: "Start Free Trial",
      ariaClose: "Close demo",
      ariaBack: "Go back",
      ariaNext: "Next step",
    },
    'pt-BR': {
      title: "Experimente uma demo de 60s",
      description: "Uma prévia suave, em 6 passos, do companheiro de memórias da Eterna.",
      step: (s: number, t: number) => `Passo ${s} de ${t}`,
      back: "Voltar",
      next: "Avançar",
      startShort: "Iniciar teste",
      startLong: "Iniciar teste grátis",
      ariaClose: "Fechar demonstração",
      ariaBack: "Voltar",
      ariaNext: "Próximo passo",
    },
    es: {
      title: "Prueba una demo de 60s",
      description: "Una vista previa amable, en 6 pasos, del compañero de memoria de Eterna.",
      step: (s: number, t: number) => `Paso ${s} de ${t}`,
      back: "Atrás",
      next: "Siguiente",
      startShort: "Iniciar prueba",
      startLong: "Iniciar prueba gratis",
      ariaClose: "Cerrar demostración",
      ariaBack: "Volver",
      ariaNext: "Siguiente paso",
    },
  } as const;
  return content[language as keyof typeof content] || content.en;
};

export const DemoWizardModal: React.FC<DemoWizardModalProps> = ({ isOpen, onClose }) => {
  const isMobile = useIsMobile();
  const { currentLanguage } = useLanguage();
  const content = getContent(currentLanguage);
  const [step, setStep] = useState(1);
  const [state, setStateInternal] = useState<DemoState>({
    style: { warmth: 'Gentle', formality: 'Neutral', energy: 'Calm', pace: 'Normal' },
    output: { type: 'text' },
  });

  useEffect(() => {
    if (isOpen) {
      setStep(1);
      setStateInternal({
        style: { warmth: 'Gentle', formality: 'Neutral', energy: 'Calm', pace: 'Normal' },
        output: { type: 'text' },
      });
    }
  }, [isOpen]);

  const setState = (patch: Partial<DemoState>) => setStateInternal((prev) => ({ ...prev, ...patch }));

  const progress = useMemo(() => (step / totalSteps) * 100, [step]);

  const canNext = () => {
    switch (step) {
      case 1: return Boolean(state.relationship);
      case 2: return true; // personalization is optional
      case 3: return true; // style is always valid
      case 4: return Boolean(state.topic);
      case 5: return Boolean(state.output?.type);
      case 6: return true;
      default: return false;
    }
  };

  const goNext = () => setStep((s) => Math.min(totalSteps, s + 1));
  const goBack = () => setStep((s) => Math.max(1, s - 1));

  const onComplete = () => {
    try {
      // optional analytics event
      (window as any).analytics?.track?.('demo_completed', state);
    } catch {}
    window.location.href = '/start?trial=voice5';
  };

  const renderStep = () => {
    switch (step) {
      case 1: return <StepRelationship state={state} setState={setState} />;
      case 2: return <StepPersonalization state={state} setState={setState} />;
      case 3: return <StepStyle state={state} setState={setState} />;
      case 4: return <StepTopic state={state} setState={setState} />;
      case 5: return <StepOutput state={state} setState={setState} />;
      case 6: return <StepPreview state={state} setState={setState} onComplete={onComplete} />;
      default: return null;
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && canNext()) {
      e.preventDefault();
      if (step === totalSteps) onComplete();
      else goNext();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className={`
        ${isMobile ? 'max-w-[100vw] w-[100vw] h-[100vh] rounded-none' : 'max-w-3xl w-[95vw] h-[85vh] rounded-lg'} 
        p-0 bg-card border overflow-hidden [&>button]:hidden
      `}>
        <div className="relative h-full min-h-0 flex flex-col" onKeyDown={handleKeyDown}>
          {/* Close */}
          <Button
            variant="ghost"
            size={isMobile ? "default" : "sm"}
            onClick={onClose}
            aria-label={content.ariaClose}
            className={`
              absolute ${isMobile ? 'top-3 right-3 h-10 w-10' : 'top-4 right-4'} 
              text-muted-foreground hover:text-foreground hover:bg-muted z-20
              ${isMobile ? 'min-h-[44px] min-w-[44px]' : ''}
            `}
            type="button"
          >
            <Close size={isMobile ? 24 : 20} />
          </Button>

          {/* Header */}
          <DialogHeader className={`
            ${isMobile ? 'px-4 pt-4 pb-3' : 'px-6 md:px-8 pt-6 md:pt-8'} 
            space-y-2 ${isMobile ? 'pr-14' : 'pr-12'}
          `}>
            <DialogTitle className={`
              ${isMobile ? 'text-xl' : 'text-2xl md:text-3xl'} 
              font-serif leading-tight
            `}>
              {content.title}
            </DialogTitle>
            <DialogDescription className={`
              text-muted-foreground ${isMobile ? 'text-sm' : 'text-base'}
            `}>
              {content.description}
            </DialogDescription>
            <div className={isMobile ? 'pt-3' : 'pt-4'}>
              <Progress value={progress} />
              <div className={`text-xs text-muted-foreground ${isMobile ? 'pt-1' : 'pt-2'}`}>
                 {content.step(step, totalSteps)}
              </div>
            </div>
          </DialogHeader>

          {/* Content */}
          <div className={`
            flex-1 min-h-0 overflow-y-auto 
            ${isMobile ? 'px-4 py-4' : 'px-6 md:px-8 py-6 md:py-8'}
          `}>
            <AnimatePresence mode="wait">
              <motion.div
                key={step}
                initial={{ opacity: 0, y: 10, scale: 0.98 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -10, scale: 0.98 }}
                transition={{ duration: 0.2 }}
                className={isMobile ? 'w-full' : 'max-w-2xl mx-auto'}
              >
                {renderStep()}
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Footer - Mobile optimized */}
          <div className={`
            sticky bottom-0 border-t bg-card shadow-lg z-30
            ${isMobile ? 'px-4 py-4' : 'px-6 md:px-8 py-6'}
          `}>
            <div className={`
              ${isMobile ? 'w-full' : 'max-w-2xl mx-auto'} 
              flex ${isMobile ? 'flex-col gap-3' : 'flex-col sm:flex-row gap-4 justify-between items-center'}
            `}>
              {/* Step indicator for mobile */}
              {isMobile && (
                <div className="text-center text-sm text-muted-foreground">
                   {content.step(step, totalSteps)}
                </div>
              )}
              
              {/* Buttons container */}
              <div className={`
                flex ${isMobile ? 'gap-3' : 'gap-4 justify-between items-center w-full sm:w-auto'}
              `}>
                <Button 
                  variant="outline" 
                  onClick={goBack} 
                  disabled={step === 1} 
                  className={`
                    ${isMobile ? 'flex-1 h-11 text-sm min-h-[44px]' : 'min-w-[120px] h-12 text-base'} 
                    font-medium
                  `}
                  aria-label={content.ariaBack} 
                  type="button"
                >
                  {content.back}
                </Button>
                
                {/* Step indicator for desktop */}
                {!isMobile && (
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    {content.step(step, totalSteps)}
                  </div>
                )}
                
                <Button 
                  onClick={step === totalSteps ? onComplete : goNext} 
                  disabled={!canNext()} 
                  className={`
                    ${isMobile ? 'flex-1 h-11 text-sm min-h-[44px]' : 'min-w-[120px] h-12 text-base'} 
                    font-semibold bg-primary hover:bg-primary/90
                  `}
                  aria-label={content.ariaNext} 
                  type="button"
                >
                  {step === totalSteps ? (isMobile ? content.startShort : content.startLong) : content.next}
                </Button>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};