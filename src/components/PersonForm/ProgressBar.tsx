import { cn } from "@/lib/utils";

interface ProgressBarProps {
  currentStep: number;
  totalSteps: number;
  className?: string;
}

export const ProgressBar = ({ currentStep, totalSteps, className }: ProgressBarProps) => {
  const progress = (currentStep / totalSteps) * 100;
  
  // Determine progress message based on progress 
  const getProgressStyles = (progress: number) => {
    if (progress <= 25) {
      return {
        message: "🌱 Começando nossa jornada...",
        emoji: "🚀"
      };
    }
    if (progress <= 50) {
      return {
        message: "💫 Pegando o ritmo!",
        emoji: "⚡"
      };
    }
    if (progress <= 75) {
      return {
        message: "🔥 Quase lá, você está arrasando!",
        emoji: "🎯"
      };
    }
    return {
      message: "✨ Incrível! Estamos finalizando!",
      emoji: "🎉"
    };
  };

  const { message, emoji } = getProgressStyles(progress);

  return (
    <div className={cn("w-full", className)}>
      <div className="flex justify-between items-center mb-3">
        <div className="flex items-center gap-2">
          <span className="text-lg">{emoji}</span>
          <span className="text-sm font-medium text-foreground">
            {message}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs text-muted-foreground">
            {currentStep}/{totalSteps}
          </span>
          <span className="text-sm font-bold text-foreground">
            {Math.round(progress)}%
          </span>
        </div>
      </div>
      
      <div className="w-full bg-muted rounded-full h-4 overflow-hidden border border-border">
        <div
          className="h-full rounded-full bg-foreground transition-all duration-1000 ease-out"
          style={{ width: `${progress}%` }}
        />
      </div>
      
      <div className="flex justify-between mt-2 text-xs text-muted-foreground">
        <span>🌟 Início da magia</span>
        <span>🎊 Missão completa</span>
      </div>
    </div>
  );
};