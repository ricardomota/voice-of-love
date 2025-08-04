import { cn } from "@/lib/utils";

interface ProgressBarProps {
  currentStep: number;
  totalSteps: number;
  className?: string;
}

export const ProgressBar = ({ currentStep, totalSteps, className }: ProgressBarProps) => {
  const progress = (currentStep / totalSteps) * 100;
  
  // Determine color based on progress
  const getProgressColor = (progress: number) => {
    if (progress <= 25) return "bg-red-500";
    if (progress <= 50) return "bg-orange-500";
    if (progress <= 75) return "bg-yellow-500";
    return "bg-green-500";
  };

  const getProgressGradient = (progress: number) => {
    if (progress <= 25) return "from-red-500 to-red-600";
    if (progress <= 50) return "from-orange-500 to-orange-600";
    if (progress <= 75) return "from-yellow-500 to-yellow-600";
    return "from-green-500 to-green-600";
  };

  return (
    <div className={cn("w-full", className)}>
      <div className="flex justify-between items-center mb-2">
        <span className="text-sm font-medium text-foreground">
          Passo {currentStep} de {totalSteps}
        </span>
        <span className="text-sm text-muted-foreground">
          {Math.round(progress)}%
        </span>
      </div>
      
      <div className="w-full bg-muted/20 rounded-full h-3 overflow-hidden">
        <div
          className={cn(
            "h-full rounded-full bg-gradient-to-r transition-all duration-700 ease-out",
            getProgressGradient(progress)
          )}
          style={{ width: `${progress}%` }}
        >
          <div className="h-full w-full bg-gradient-to-r from-white/20 to-transparent animate-pulse" />
        </div>
      </div>
      
      <div className="flex justify-between mt-2 text-xs text-muted-foreground">
        <span>Início</span>
        <span>Completo</span>
      </div>
    </div>
  );
};