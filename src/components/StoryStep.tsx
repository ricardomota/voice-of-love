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
      <div className="text-center space-y-4">
        <h2 className="text-3xl font-bold text-foreground leading-tight">
          {title}
        </h2>
        {subtitle && (
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            {subtitle}
          </p>
        )}
      </div>

      <div className="max-w-2xl mx-auto">
        {children}
      </div>

      <div className="flex gap-4 justify-center pt-6">
        {onBack && (
          <Button
            variant="outline"
            onClick={onBack}
            className="flex items-center gap-2 px-6"
          >
            <ArrowLeft className="w-4 h-4" />
            {backText}
          </Button>
        )}
        {onNext && (
          <Button
            onClick={onNext}
            disabled={!canNext}
            className="flex items-center gap-2 px-8 bg-primary hover:bg-primary/90"
          >
            {nextText}
            <ArrowRight className="w-4 h-4" />
          </Button>
        )}
      </div>
    </div>
  );
};