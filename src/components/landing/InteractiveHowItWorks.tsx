import React from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowRight, ArrowDown } from 'lucide-react';
import { useStaggeredAnimation, useScrollAnimation } from '@/hooks/useScrollAnimation';

interface Step {
  icon: React.ReactNode;
  title: string;
  description: string;
  detail: string;
}

interface InteractiveHowItWorksProps {
  steps: Step[];
  onTryFree: () => void;
}

const InteractiveHowItWorks: React.FC<InteractiveHowItWorksProps> = ({ steps, onTryFree }) => {
  const { elementRef: titleRef, isVisible: titleVisible } = useScrollAnimation();
  const { containerRef, visibleItems } = useStaggeredAnimation(steps.length, 300);
  const { elementRef: ctaRef, isVisible: ctaVisible } = useScrollAnimation();

  return (
    <div className="max-w-7xl mx-auto">
      {/* Animated Title */}
      <div 
        ref={titleRef}
        className={`text-center mb-20 transition-all duration-1000 ${
          titleVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
        }`}
      >
        <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-6 bg-gradient-to-r from-foreground to-muted-foreground bg-clip-text text-transparent">
          Como Funciona
        </h2>
        <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
          Transforme memórias em conversas eternas em apenas 4 passos simples
        </p>
      </div>

      {/* Interactive Steps with Connecting Lines */}
      <div ref={containerRef} className="relative">
        {/* Vertical Connecting Line for Mobile */}
        <div className="absolute left-1/2 transform -translate-x-0.5 top-20 bottom-20 w-0.5 bg-gradient-to-b from-primary via-primary/50 to-transparent lg:hidden" />
        
        {/* Horizontal Connecting Line for Desktop */}
        <div className="hidden lg:block absolute top-1/2 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-primary to-transparent transform -translate-y-1/2" />

        <div className="grid lg:grid-cols-4 gap-8 lg:gap-12">
          {steps.map((step, index) => {
            const isVisible = visibleItems[index];
            const isEven = index % 2 === 0;
            
            return (
              <div key={index} className="relative">
                {/* Step Card */}
                <Card 
                  className={`relative border-2 transition-all duration-700 hover:shadow-2xl hover:scale-105 ${
                    isVisible 
                      ? 'opacity-100 translate-y-0 border-primary/20 shadow-lg' 
                      : 'opacity-0 translate-y-12 border-transparent'
                  }`}
                  style={{ transitionDelay: `${index * 100}ms` }}
                >
                  <CardContent className="p-8">
                    {/* Step Number */}
                    <div className={`absolute -top-6 left-1/2 transform -translate-x-1/2 w-12 h-12 rounded-full flex items-center justify-center text-lg font-bold transition-all duration-500 ${
                      isVisible 
                        ? 'bg-primary text-primary-foreground scale-100 rotate-0' 
                        : 'bg-muted text-muted-foreground scale-75 rotate-12'
                    }`}>
                      {index + 1}
                    </div>

                    {/* Icon with Pulse Animation */}
                    <div className={`mb-6 text-primary transition-all duration-500 flex justify-center ${
                      isVisible ? 'scale-100' : 'scale-75'
                    }`}>
                      <div className={`p-4 rounded-xl bg-primary/10 ${isVisible ? 'animate-pulse' : ''}`}>
                        {React.cloneElement(step.icon as React.ReactElement, { 
                          className: "w-8 h-8",
                          strokeWidth: 1.5 
                        })}
                      </div>
                    </div>

                    {/* Content */}
                    <div className="text-center">
                      <h3 className={`text-xl font-bold mb-3 transition-all duration-500 ${
                        isVisible ? 'text-foreground' : 'text-muted-foreground'
                      }`}>
                        {step.title}
                      </h3>
                      <p className={`text-muted-foreground mb-4 transition-all duration-500 ${
                        isVisible ? 'opacity-100' : 'opacity-60'
                      }`}>
                        {step.description}
                      </p>
                      <p className={`text-sm text-muted-foreground/80 transition-all duration-500 ${
                        isVisible ? 'opacity-100' : 'opacity-40'
                      }`}>
                        {step.detail}
                      </p>
                    </div>
                  </CardContent>
                </Card>

                {/* Arrow Connector for Desktop */}
                {index < steps.length - 1 && (
                  <div className={`hidden lg:block absolute top-1/2 -right-6 transform -translate-y-1/2 transition-all duration-700 ${
                    isVisible ? 'opacity-100 scale-100' : 'opacity-0 scale-75'
                  }`}>
                    <ArrowRight className="w-6 h-6 text-primary animate-pulse" />
                  </div>
                )}

                {/* Arrow Connector for Mobile */}
                {index < steps.length - 1 && (
                  <div className={`lg:hidden flex justify-center mt-6 mb-2 transition-all duration-700 ${
                    isVisible ? 'opacity-100 scale-100' : 'opacity-0 scale-75'
                  }`}>
                    <ArrowDown className="w-6 h-6 text-primary animate-pulse" />
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Animated CTA Section */}
      <div 
        ref={ctaRef}
        className={`text-center mt-20 transition-all duration-1000 ${
          ctaVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
        }`}
      >
        <div className="bg-gradient-to-r from-primary/10 via-primary/5 to-primary/10 rounded-2xl p-8 border border-primary/20">
          <p className="text-muted-foreground mb-8 text-lg">
            <span className="text-primary font-semibold">*</span> Clonagem de voz personalizada disponível após completar o perfil
          </p>
          
          <Button 
            onClick={onTryFree} 
            size="lg" 
            className="text-lg px-8 py-4 hover:scale-105 transition-transform duration-300 shadow-lg hover:shadow-xl"
          >
            Começar Sua Jornada Agora
            <ArrowRight className="w-5 h-5 ml-2" />
          </Button>
          
          <p className="text-sm text-muted-foreground mt-4">
            Gratuito para sempre • Sem cartão de crédito
          </p>
        </div>
      </div>
    </div>
  );
};

export default InteractiveHowItWorks;