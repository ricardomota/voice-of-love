import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLanguage } from '@/hooks/useLanguage';
import { Upload, MessageCircle, Heart, Settings, ChevronRight, Play, Mic, Plus, Volume2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { MessageBubble } from '@/components/ui/message-bubble';
import { TypingIndicator } from '@/components/ui/typing-indicator';
import { Badge } from '@/components/ui/badge';

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
                  className="w-full max-w-sm mx-auto"
                >
                  {/* Step 1: Upload Memories */}
                  {activeStep === 0 && (
                    <div className="space-y-4">
                      <div className="bg-card border border-border rounded-xl p-4 space-y-3">
                        <div className="flex items-start gap-3">
                          <Avatar className="w-12 h-12">
                            <AvatarImage src="/lovable-uploads/mom-avatar.png" alt="Mom" />
                            <AvatarFallback className="bg-muted text-muted-foreground">
                              MA
                            </AvatarFallback>
                          </Avatar>
                          <div className="flex-1 min-w-0">
                            <h4 className="font-medium text-foreground text-sm">Maria</h4>
                            <Badge variant="secondary" className="text-xs mt-1">
                              Mãe
                            </Badge>
                          </div>
                        </div>
                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
                          <Heart className="w-3 h-3" />
                          <span>12 memórias</span>
                          <Mic className="w-3 h-3 ml-2" />
                          <span>3 áudios</span>
                        </div>
                      </div>
                      
                      <Button variant="outline" size="sm" className="w-full">
                        <Plus className="w-3 h-3 mr-2" />
                        Adicionar memória
                      </Button>
                    </div>
                  )}

                  {/* Step 2: AI Processing */}
                  {activeStep === 1 && (
                    <div className="space-y-4">
                      <div className="bg-gradient-to-r from-primary/10 to-accent/10 border border-primary/20 rounded-lg p-3">
                        <div className="flex items-center gap-2 text-xs">
                          <Heart className="w-3 h-3 text-primary flex-shrink-0" />
                          <span className="text-foreground">
                            <span className="font-medium">IA Processando:</span> Analisando personalidade e memórias...
                          </span>
                        </div>
                      </div>
                      
                      <div className="bg-card border border-border rounded-xl p-4 space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-xs text-muted-foreground">Análise de Voz</span>
                          <div className="w-2 h-2 bg-green-500 rounded-full" />
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-xs text-muted-foreground">Padrões de Fala</span>
                          <div className="w-2 h-2 bg-primary rounded-full animate-pulse" />
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-xs text-muted-foreground">Personalidade</span>
                          <div className="w-2 h-2 bg-muted rounded-full" />
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Step 3: Chat Interface */}
                  {activeStep === 2 && (
                    <div className="space-y-3">
                      <div className="space-y-2 max-h-32 overflow-hidden">
                        <MessageBubble
                          content="Oi meu amor, como foi seu dia?"
                          isUser={false}
                          personName="Maria"
                          className="text-xs"
                        />
                        <MessageBubble
                          content="Oi mãe! Foi ótimo, obrigado por perguntar."
                          isUser={true}
                          className="text-xs"
                        />
                        <TypingIndicator
                          personName="Maria"
                          className="text-xs"
                        />
                      </div>
                      
                      <div className="flex gap-2">
                        <div className="flex-1 bg-muted rounded-full px-3 py-2 text-xs text-muted-foreground">
                          Digite sua mensagem...
                        </div>
                        <Button size="sm" variant="outline" className="px-3">
                          <Volume2 className="w-3 h-3" />
                        </Button>
                      </div>
                    </div>
                  )}
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