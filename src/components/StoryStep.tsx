import { ReactNode } from "react";
import { Button } from "@/components/ui/button";
import { ArrowLeft, ArrowRight } from "lucide-react";

interface StoryStepProps {
  children: ReactNode;
  title: string;
  subtitle?: string;
  onNext?: () => void;
  onBack?: () => void;
  nextText?: string;
  backText?: string;
  canNext?: boolean;
  className?: string;
}

export const StoryStep = ({
  children,
  title,
  subtitle,
  onNext,
  onBack,
  nextText = "Continuar",
  backText = "Voltar",
  canNext = true,
  className = ""
}: StoryStepProps) => {
  return (
    <div className={`animate-fade-in space-y-8 ${className}`}>
      <div className="text-center space-y-6">
        <h2 className="text-4xl font-bold text-foreground leading-tight tracking-tight animate-slide-up">
          {title}
        </h2>
        {subtitle && (
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed animate-slide-up animate-stagger-1">
            {subtitle}
          </p>
        )}
      </div>

      <div className="max-w-3xl mx-auto animate-slide-up animate-stagger-2">
        {children}
      </div>

      <div className="flex gap-4 justify-center pt-8 animate-slide-up animate-stagger-3">
        {onBack && (
          <Button
            variant="outline"
            onClick={onBack}
            className="flex items-center gap-2 px-6 py-3 hover-lift text-base"
          >
            <ArrowLeft className="w-4 h-4" />
            {backText}
          </Button>
        )}
        {onNext && (
          <Button
            onClick={onNext}
            disabled={!canNext}
            className="flex items-center gap-2 px-8 py-3 bg-gradient-primary hover:shadow-glow disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 text-base font-medium"
          >
            {nextText}
            <ArrowRight className="w-4 h-4" />
          </Button>
        )}
      </div>
    </div>
  );
};