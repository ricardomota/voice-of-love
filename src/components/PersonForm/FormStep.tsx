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
    <div className="glass-card p-8 fade-in-up hover-lift">
      <div className="text-center space-y-4 mb-8">
        <h2 className="text-3xl font-zilla font-medium italic" style={{color: '#441632'}}>{title}</h2>
        {subtitle && (
          <p className="text-lg font-work leading-relaxed max-w-3xl mx-auto" style={{color: '#331122'}}>
            {subtitle}
          </p>
        )}
      </div>

      <div className="max-w-2xl mx-auto mb-8">
        {children}
      </div>

      <div className="flex items-center justify-between pt-8">
        <button 
          onClick={onBack} 
          className="px-6 py-3 rounded-xl font-semibold hover-lift flex items-center gap-2 transition-all border-2"
          style={{backgroundColor: '#F8F4E6', borderColor: '#E8E3C8', color: '#441632'}}
        >
          <ArrowLeft className="w-4 h-4" />
          {backText}
        </button>

        <div className="flex gap-3">
          {onUpdate && (
            <button 
              onClick={onUpdate}
              className="px-6 py-3 rounded-xl font-semibold hover-lift flex items-center gap-2 transition-all border-2"
              style={{backgroundColor: '#F8F4E6', borderColor: '#E8E3C8', color: '#441632'}}
            >
              <Check className="w-4 h-4" />
              Atualizar
            </button>
          )}
          
          {onNext && (
            <button 
              onClick={onNext}
              disabled={!canNext}
              className="px-6 py-3 rounded-xl font-semibold hover-lift disabled:opacity-50 flex items-center gap-2 transition-all"
              style={{backgroundColor: canNext ? '#441632' : '#D4CBA0', color: canNext ? '#FDFBCB' : '#331122'}}
            >
              {nextText || (isLast ? "Finalizar" : "Continuar")}
              {!isLast && <ArrowRight className="w-4 h-4" />}
              {isLast && <Check className="w-4 h-4" />}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};