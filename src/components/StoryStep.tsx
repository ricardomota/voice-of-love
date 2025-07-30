import { ReactNode } from "react";
import { Button } from "@/components/ui/button";
import { ArrowLeft, ArrowRight, Check } from "lucide-react";

interface StoryStepProps {
  children: ReactNode;
  title: string;
  subtitle?: string;
  onNext?: () => void;
  onBack?: () => void;
  onUpdate?: () => void;
  nextText?: string;
  backText?: string;
  updateText?: string;
  canNext?: boolean;
  className?: string;
}

export const StoryStep = ({
  children,
  title,
  subtitle,
  onNext,
  onBack,
  onUpdate,
  nextText = "Continuar",
  backText = "Voltar",
  updateText = "Atualizar perfil",
  canNext = true,
  className = ""
}: StoryStepProps) => {
  return (
    <div className={`animate-fade-in space-y-6 sm:space-y-8 ${className}`}>
      <div className="text-center space-y-3 sm:space-y-4 px-4">
        <h2 className="text-xl sm:text-2xl lg:text-3xl font-display font-medium text-foreground leading-tight">
          {title}
        </h2>
        {subtitle && (
          <p className="text-sm sm:text-base lg:text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            {subtitle}
          </p>
        )}
      </div>

      <div className="max-w-2xl mx-auto px-4">
        {children}
      </div>

      <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center items-center pt-4 sm:pt-6 px-4">
        {onBack && (
          <Button
            variant="outline"
            onClick={onBack}
            className="flex items-center gap-2 px-4 sm:px-6 w-full sm:w-auto order-3 sm:order-1 transition-all duration-200 hover:scale-105 hover:shadow-md"
          >
            <ArrowLeft className="w-4 h-4" />
            {backText}
          </Button>
        )}

        {onUpdate && onNext && (
          <div className="flex flex-col sm:flex-row items-center gap-3 sm:gap-4 order-2">
            <Button
              variant="outline"
              onClick={onUpdate}
              className="flex items-center gap-2 px-4 sm:px-6 w-full sm:w-auto transition-all duration-200 hover:scale-105 hover:shadow-md"
            >
              <Check className="w-4 h-4" />
              {updateText}
            </Button>
            
            <span className="text-muted-foreground text-sm font-medium">ou</span>
            
            <Button
              onClick={onNext}
              disabled={!canNext}
              className="flex items-center gap-2 px-4 sm:px-6 w-full sm:w-auto transition-all duration-200 hover:scale-105 hover:shadow-md"
            >
              {nextText}
              <ArrowRight className="w-4 h-4" />
            </Button>
          </div>
        )}

        {onUpdate && !onNext && (
          <Button
            variant="outline"
            onClick={onUpdate}
            className="flex items-center gap-2 px-4 sm:px-6 w-full sm:w-auto order-2 transition-all duration-200 hover:scale-105 hover:shadow-md"
          >
            <Check className="w-4 h-4" />
            {updateText}
          </Button>
        )}

        {onNext && !onUpdate && (
          <Button
            onClick={onNext}
            disabled={!canNext}
            className="flex items-center gap-2 px-4 sm:px-6 w-full sm:w-auto order-1 sm:order-3 transition-all duration-200 hover:scale-105 hover:shadow-md"
          >
            {nextText}
            <ArrowRight className="w-4 h-4" />
          </Button>
        )}
      </div>
    </div>
  );
};