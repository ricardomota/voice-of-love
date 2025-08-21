import React from 'react';
import { Button } from '@/components/ui/button';
import { ArrowLeft, ArrowRight, Check } from 'lucide-react';

interface FormStepProps {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
  onNext?: () => void;
  onBack?: () => void;
  onUpdate?: () => void;
  canNext?: boolean;
  isLast?: boolean;
  nextText?: string;
  backText?: string;
}

export const FormStep: React.FC<FormStepProps> = ({
  title,
  subtitle,
  children,
  onNext,
  onBack,
  onUpdate,
  canNext = true,
  isLast = false,
  nextText,
  backText = "Voltar"
}) => {
  return (
    <div className="bg-card/80 backdrop-blur-sm border border-border/50 rounded-xl sm:rounded-2xl p-6 sm:p-8 shadow-sm">
      <div className="text-center space-y-3 sm:space-y-4 mb-6 sm:mb-8">
        <h2 className="font-serif text-xl sm:text-2xl md:text-3xl text-foreground leading-tight">{title}</h2>
        {subtitle && (
          <p className="text-base sm:text-lg text-muted-foreground leading-relaxed max-w-3xl mx-auto">
            {subtitle}
          </p>
        )}
      </div>

      <div className="max-w-2xl mx-auto mb-6 sm:mb-8">
        {children}
      </div>

      <div className="flex items-center justify-between pt-6 sm:pt-8">
        <Button 
          onClick={onBack}
          variant="outline"
          className="px-4 sm:px-6 py-2 sm:py-3 flex items-center gap-2 bg-white/50 backdrop-blur-sm border-border/50"
        >
          <ArrowLeft className="w-4 h-4" />
          {backText}
        </Button>

        <div className="flex gap-3">
          {onUpdate && (
            <Button 
              onClick={onUpdate}
              variant="outline"
              className="px-4 sm:px-6 py-2 sm:py-3 flex items-center gap-2 bg-white/50 backdrop-blur-sm border-border/50"
            >
              <Check className="w-4 h-4" />
              Atualizar
            </Button>
          )}
          
          {onNext && (
            <Button 
              onClick={onNext}
              disabled={!canNext}
              className="px-4 sm:px-6 py-2 sm:py-3 flex items-center gap-2 bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 shadow-lg hover:shadow-xl transition-all duration-300"
            >
              {nextText || (isLast ? "Finalizar" : "Continuar")}
              {!isLast && <ArrowRight className="w-4 h-4" />}
              {isLast && <Check className="w-4 h-4" />}
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};