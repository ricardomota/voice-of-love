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
        gradient: "from-blue-200 via-blue-300 to-blue-400",
        glowColor: "213 94% 68%", // --ios-blue
        message: "🌱 Começando nossa jornada...",
        emoji: "🚀"
      };
    }
    if (progress <= 50) {
      return {
        gradient: "from-cyan-200 via-cyan-300 to-blue-400", 
        glowColor: "213 94% 68%",
        message: "💫 Pegando o ritmo!",
        emoji: "⚡"
      };
    }
    if (progress <= 75) {
      return {
        gradient: "from-indigo-200 via-indigo-300 to-blue-400",
        glowColor: "213 94% 68%",
        message: "🔥 Quase lá, você está arrasando!",
        emoji: "🎯"
      };
    }
    return {
      gradient: "from-blue-300 via-blue-400 to-blue-500",
      glowColor: "213 94% 68%",
      message: "✨ Incrível! Estamos finalizando!",
      emoji: "🎉"
    };
  };

  const { gradient, glowColor, message, emoji } = getProgressStyles(progress);

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
      
      <div className="w-full bg-muted/30 rounded-full h-4 overflow-hidden border border-border/50 backdrop-blur-sm">
        <div
          className={cn(
            "h-full rounded-full bg-gradient-to-r transition-all duration-1000 ease-out relative overflow-hidden",
            gradient
          )}
          style={{ width: `${progress}%` }}
        >
          {/* Animated flowing shimmer effect */}
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent animate-shimmer" />
          
          {/* Secondary animated gradient flow */}
          <div className="absolute inset-0 bg-gradient-to-r from-blue-100/30 via-blue-200/50 to-blue-100/30 animate-flow" />
          
          {/* Subtle glow effect */}
          <div 
            className="absolute inset-0 rounded-full"
            style={{
              boxShadow: `inset 0 1px 0 rgba(255,255,255,0.3), 0 0 15px hsla(${glowColor}, 0.4)`
            }} 
          />
        </div>
      </div>
      
      <div className="flex justify-between mt-2 text-xs text-muted-foreground">
        <span>🌟 Início da magia</span>
        <span>🎊 Missão completa</span>
      </div>
    </div>
  );
};