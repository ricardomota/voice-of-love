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
    <div className="bg-card border border-border rounded-xl p-8 shadow-sm">
      <div className="text-center space-y-4 mb-8">
        <h2 className="text-3xl font-bold text-foreground">{title}</h2>
        {subtitle && (
          <p className="text-lg text-muted-foreground leading-relaxed max-w-3xl mx-auto">
            {subtitle}
          </p>
        )}
      </div>

      <div className="max-w-2xl mx-auto mb-8">
        {children}
      </div>

      <div className="flex items-center justify-between pt-8">
        <Button 
          onClick={onBack}
          variant="outline"
          className="px-6 py-3 flex items-center gap-2"
        >
          <ArrowLeft className="w-4 h-4" />
          {backText}
        </Button>

        <div className="flex gap-3">
          {onUpdate && (
            <Button 
              onClick={onUpdate}
              variant="outline"
              className="px-6 py-3 flex items-center gap-2"
            >
              <Check className="w-4 h-4" />
              Atualizar
            </Button>
          )}
          
          {onNext && (
            <Button 
              onClick={onNext}
              disabled={!canNext}
              className="px-6 py-3 flex items-center gap-2"
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