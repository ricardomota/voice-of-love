import React, { useMemo, useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { AnimatePresence, motion } from 'framer-motion';
import { StepRelationship } from './steps/StepRelationship';
import { StepStyle } from './steps/StepStyle';
import { StepTopic } from './steps/StepTopic';
import { StepOutput } from './steps/StepOutput';
import { StepPreview } from './steps/StepPreview';
import { DemoState } from './types';
import { Close } from '@carbon/icons-react';

interface DemoWizardModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const totalSteps = 5;

export const DemoWizardModal: React.FC<DemoWizardModalProps> = ({ isOpen, onClose }) => {
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
      case 2: return true;
      case 3: return Boolean(state.topic);
      case 4: return Boolean(state.output?.type);
      case 5: return true;
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
      case 2: return <StepStyle state={state} setState={setState} />;
      case 3: return <StepTopic state={state} setState={setState} />;
      case 4: return <StepOutput state={state} setState={setState} />;
      case 5: return <StepPreview state={state} setState={setState} onComplete={onComplete} />;
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
      <DialogContent className="max-w-3xl w-[95vw] h-[85vh] p-0 bg-card border overflow-hidden [&>button]:hidden">
        <div className="relative h-full flex flex-col" onKeyDown={handleKeyDown}>
          {/* Close */}
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            aria-label="Close demo"
            className="absolute top-4 right-4 text-muted-foreground hover:text-foreground hover:bg-muted z-20"
            type="button"
          >
            <Close size={20} />
          </Button>

          {/* Header */}
          <DialogHeader className="px-6 md:px-8 pt-6 md:pt-8 space-y-2 pr-12">
            <DialogTitle className="text-2xl md:text-3xl font-serif">Try a 60s Demo</DialogTitle>
            <DialogDescription className="text-muted-foreground">A gentle, 5‑step preview of Eterna’s memory companion.</DialogDescription>
            <div className="pt-4">
              <Progress value={progress} />
              <div className="text-xs text-muted-foreground pt-2">Step {step} of {totalSteps}</div>
            </div>
          </DialogHeader>

          {/* Content */}
          <div className="flex-1 overflow-y-auto px-6 md:px-8 py-6 md:py-8">
            <AnimatePresence mode="wait">
              <motion.div
                key={step}
                initial={{ opacity: 0, y: 10, scale: 0.98 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -10, scale: 0.98 }}
                transition={{ duration: 0.2 }}
                className="max-w-2xl mx-auto"
              >
                {renderStep()}
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Footer - Enhanced visibility */}
          <div className="border-t-2 bg-card px-6 md:px-8 py-6 shadow-lg z-30">
            <div className="max-w-2xl mx-auto flex flex-col sm:flex-row gap-4 justify-between items-center">
              <Button 
                variant="outline" 
                onClick={goBack} 
                disabled={step === 1} 
                className="w-full sm:w-auto min-w-[120px] h-12 text-base font-medium" 
                aria-label="Go back" 
                type="button"
              >
                Back
              </Button>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                Step {step} of {totalSteps}
              </div>
              <Button 
                onClick={step === totalSteps ? onComplete : goNext} 
                disabled={!canNext()} 
                className="w-full sm:w-auto min-w-[120px] h-12 text-base font-semibold bg-primary hover:bg-primary/90" 
                aria-label="Next step" 
                type="button"
              >
                {step === totalSteps ? 'Start Free Trial' : 'Next'}
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
