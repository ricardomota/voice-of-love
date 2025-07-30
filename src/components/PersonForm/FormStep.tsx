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
    <div className="space-y-8">
      <div className="text-center space-y-3">
        <h2 className="text-2xl font-bold text-foreground">{title}</h2>
        {subtitle && (
          <p className="text-muted-foreground text-lg leading-relaxed max-w-3xl mx-auto">
            {subtitle}
          </p>
        )}
      </div>

      <div className="max-w-2xl mx-auto">
        {children}
      </div>

      <div className="flex items-center justify-between pt-8">
        <Button variant="outline" onClick={onBack} className="flex items-center gap-2">
          <ArrowLeft className="w-4 h-4" />
          {backText}
        </Button>

        <div className="flex gap-3">
          {onUpdate && (
            <Button 
              onClick={onUpdate}
              variant="outline"
              className="flex items-center gap-2"
            >
              <Check className="w-4 h-4" />
              Atualizar
            </Button>
          )}
          
          {onNext && (
            <Button 
              onClick={onNext}
              disabled={!canNext}
              className="flex items-center gap-2"
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