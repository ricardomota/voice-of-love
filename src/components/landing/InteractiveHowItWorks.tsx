import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLanguage } from '@/hooks/useLanguage';
import { Upload, MessageCircle, Heart, Settings, ChevronRight, Play } from 'lucide-react';
import { Button } from '@/components/ui/button';

import { getLandingContent } from '@/utils/translations';

export const InteractiveHowItWorks: React.FC = () => {
  const { currentLanguage } = useLanguage();
  const content = getLandingContent(currentLanguage).features;
  const [activeStep, setActiveStep] = useState(0);
  
  // Add icons to steps
  const stepsWithIcons = content.steps.map((step, index) => ({
    ...step,
    icon: index === 0 ? Upload : index === 1 ? Settings : MessageCircle,
    demo: index === 0 ? "Upload memories, photos, voice notes..." : 
          index === 1 ? "Processing voice patterns and personality..." :
          "Having a conversation with your loved one..."
  }));

  return (
    <section className="py-20 relative">
      <div className="max-w-5xl mx-auto px-6 relative">
        
        {/* Header */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center max-w-2xl mx-auto mb-16"
        >
          <h2 className="text-2xl sm:text-3xl font-bold text-foreground mb-4 leading-tight">
            {content.title}
          </h2>
          
          <p className="text-muted-foreground">
            {content.subtitle}
          </p>
        </motion.div>

        {/* Interactive Steps */}
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          
          {/* Steps Navigation */}
          <div className="space-y-6">
            {stepsWithIcons.map((step, index) => {
              const IconComponent = step.icon;
              const isActive = activeStep === index;
              
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -30 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  className={`cursor-pointer group transition-all duration-300 ${
                    isActive ? 'scale-[1.02]' : 'hover:scale-[1.01]'
                  }`}
                  onClick={() => setActiveStep(index)}
                >
                  <div className={`relative p-6 rounded-xl transition-all duration-300 ${
                    isActive 
                      ? 'bg-muted/40' 
                      : 'hover:bg-muted/20'
                  }`}>
                    
                    {/* Step number and icon */}
                    <div className="flex items-center gap-4 mb-4">
                      <div className={`w-12 h-12 rounded-xl flex items-center justify-center transition-colors duration-300 ${
                        isActive ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'
                      }`}>
                        <IconComponent className="w-6 h-6" />
                      </div>
                      
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <span className={`text-sm font-medium ${
                            isActive ? 'text-primary' : 'text-muted-foreground'
                          }`}>
                            Step {index + 1}
                          </span>
                          <ChevronRight className={`w-4 h-4 transition-transform duration-300 ${
                            isActive ? 'text-primary rotate-90' : 'text-muted-foreground'
                          }`} />
                        </div>
                        <h3 className="text-lg font-semibold text-foreground">
                          {step.title}
                        </h3>
                      </div>
                    </div>
                    
                    {/* Description */}
                    <p className="text-muted-foreground leading-relaxed mb-3">
                      {step.description}
                    </p>
                    
                    {/* Expanded details */}
                    <AnimatePresence>
                      {isActive && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          exit={{ opacity: 0, height: 0 }}
                          transition={{ duration: 0.3 }}
                        >
                          <div className="pt-3 border-t border-border/20">
                            <p className="text-sm text-muted-foreground leading-relaxed">
                              {step.details}
                            </p>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </motion.div>
              );
            })}
          </div>

          {/* Visual Demo */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="relative"
          >
            <div className="relative bg-card/50 rounded-3xl border border-border/30 p-8 backdrop-blur-sm">
              
              {/* Demo content */}
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeStep}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.4 }}
                  className="text-center"
                >
                  <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-6">
                    <Play className="w-8 h-8 text-primary" />
                  </div>
                  
                  <h4 className="text-lg font-semibold text-foreground mb-4">
                    {stepsWithIcons[activeStep].title}
                  </h4>
                  
                  <div className="bg-muted/30 rounded-xl p-4 mb-6">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <div className="w-2 h-2 bg-primary/60 rounded-full animate-pulse" />
                      {stepsWithIcons[activeStep].demo}
                    </div>
                  </div>
                  
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="w-full"
                  >
                    Try it now
                  </Button>
                </motion.div>
              </AnimatePresence>
            </div>
            
            {/* Decorative elements */}
            <div className="absolute -top-4 -right-4 w-24 h-24 bg-primary/5 rounded-2xl blur-xl" />
            <div className="absolute -bottom-4 -left-4 w-32 h-32 bg-accent/5 rounded-2xl blur-xl" />
          </motion.div>
        </div>
      </div>
    </section>
  );
};