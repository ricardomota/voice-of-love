import { cn } from "@/lib/utils";

interface ProgressBarProps {
  currentStep: number;
  totalSteps: number;
  className?: string;
}

export const ProgressBar = ({ currentStep, totalSteps, className }: ProgressBarProps) => {
  const progress = (currentStep / totalSteps) * 100;
  
  // Determine color and message based on progress using design system colors
  const getProgressStyles = (progress: number) => {
    if (progress <= 25) {
      return {
        gradient: "from-red-400 via-red-500 to-red-600",
        message: "🌱 Começando nossa jornada...",
        emoji: "🚀"
      };
    }
    if (progress <= 50) {
      return {
        gradient: "from-orange-400 via-orange-500 to-orange-600", 
        message: "💫 Pegando o ritmo!",
        emoji: "⚡"
      };
    }
    if (progress <= 75) {
      return {
        gradient: "from-yellow-400 via-yellow-500 to-yellow-600",
        message: "🔥 Quase lá, você está arrasando!",
        emoji: "🎯"
      };
    }
    return {
      gradient: "from-green-400 via-green-500 to-green-600",
      message: "✨ Incrível! Estamos finalizando!",
      emoji: "🎉"
    };
  };

  const { gradient, message, emoji } = getProgressStyles(progress);

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
          <span className="text-sm font-bold text-primary">
            {Math.round(progress)}%
          </span>
        </div>
      </div>
      
      <div className="w-full bg-muted/30 rounded-full h-4 overflow-hidden border border-border/50">
        <div
          className={cn(
            "h-full rounded-full bg-gradient-to-r transition-all duration-1000 ease-out relative",
            gradient
          )}
          style={{ width: `${progress}%` }}
        >
          {/* Animated shimmer effect */}
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-pulse" />
          {/* Glow effect */}
          <div className="absolute inset-0 rounded-full shadow-lg" style={{
            boxShadow: `0 0 20px hsla(var(--accent), 0.3)`
          }} />
        </div>
      </div>
      
      <div className="flex justify-between mt-2 text-xs text-muted-foreground">
        <span>🌟 Início da magia</span>
        <span>🎊 Missão completa</span>
      </div>
    </div>
  );
};