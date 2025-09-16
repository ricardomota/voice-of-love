import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLanguage } from '@/hooks/useLanguage';
import { Upload, MessageCircle, Heart, Settings, ChevronRight, Play, Mic, Plus, Volume2, Image, Clock, CheckCircle, Sparkles, BarChart3 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { MessageBubble } from '@/components/ui/message-bubble';
import { TypingIndicator } from '@/components/ui/typing-indicator';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';

import { getLandingContent } from '@/utils/translations';

export const InteractiveHowItWorks: React.FC = () => {
  const { currentLanguage } = useLanguage();
  const content = getLandingContent(currentLanguage).features;
  const [activeStep, setActiveStep] = useState(0);
  const [animationKey, setAnimationKey] = useState(0);
  
  // Cycle through steps automatically for engagement
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveStep((prev) => (prev + 1) % content.steps.length);
      setAnimationKey(prev => prev + 1);
    }, 8000);
    
    return () => clearInterval(interval);
  }, [content.steps.length]);
  
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
              
              {/* Enhanced Demo content */}
              <AnimatePresence mode="wait">
                <motion.div
                  key={`${activeStep}-${animationKey}`}
                  initial={{ opacity: 0, y: 30, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -30, scale: 0.95 }}
                  transition={{ duration: 0.6, ease: [0.68, -0.55, 0.265, 1.55] }}
                  className="w-full max-w-sm mx-auto"
                >
                  {/* Step 1: Upload Memories - Enhanced */}
                  {activeStep === 0 && (
                    <div className="space-y-4">
                      {/* Person Profile Card */}
                      <motion.div 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2, duration: 0.5 }}
                        className="bg-card border border-border rounded-xl p-4 space-y-3 shadow-lg"
                      >
                        <div className="flex items-start gap-3">
                          <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{ delay: 0.4, type: "spring", stiffness: 200 }}
                          >
                            <Avatar className="w-12 h-12 ring-2 ring-primary/20">
                              <AvatarFallback className="bg-gradient-to-br from-primary/20 to-accent/20 text-foreground font-medium">
                                MA
                              </AvatarFallback>
                            </Avatar>
                          </motion.div>
                          <div className="flex-1 min-w-0">
                            <motion.h4 
                              initial={{ opacity: 0, x: -10 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ delay: 0.5 }}
                              className="font-semibold text-foreground text-sm"
                            >
                              Maria Silva
                            </motion.h4>
                            <motion.div
                              initial={{ opacity: 0, x: -10 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ delay: 0.6 }}
                            >
                              <Badge variant="secondary" className="text-xs mt-1 bg-primary/10 text-primary">
                                Mãe • 72 anos
                              </Badge>
                            </motion.div>
                          </div>
                          <motion.div
                            initial={{ opacity: 0, scale: 0 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: 0.7, type: "spring" }}
                            className="w-2 h-2 bg-green-500 rounded-full"
                          />
                        </div>
                        
                        <motion.div 
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.8 }}
                          className="grid grid-cols-3 gap-3 text-xs"
                        >
                          <div className="flex items-center gap-1 text-muted-foreground">
                            <Heart className="w-3 h-3 text-red-500" />
                            <motion.span
                              initial={{ opacity: 0 }}
                              animate={{ opacity: 1 }}
                              transition={{ delay: 1 }}
                            >
                              24 memórias
                            </motion.span>
                          </div>
                          <div className="flex items-center gap-1 text-muted-foreground">
                            <Image className="w-3 h-3 text-blue-500" />
                            <motion.span
                              initial={{ opacity: 0 }}
                              animate={{ opacity: 1 }}
                              transition={{ delay: 1.1 }}
                            >
                              18 fotos
                            </motion.span>
                          </div>
                          <div className="flex items-center gap-1 text-muted-foreground">
                            <Mic className="w-3 h-3 text-purple-500" />
                            <motion.span
                              initial={{ opacity: 0 }}
                              animate={{ opacity: 1 }}
                              transition={{ delay: 1.2 }}
                            >
                              7 áudios
                            </motion.span>
                          </div>
                        </motion.div>
                        
                        {/* Recent memories preview */}
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: "auto" }}
                          transition={{ delay: 1.3, duration: 0.5 }}
                          className="space-y-2"
                        >
                          <div className="text-xs text-muted-foreground border-t pt-2">Memórias recentes:</div>
                          {["Receita de bolo de chocolate", "História da infância", "Canção de ninar favorita"].map((memory, i) => (
                            <motion.div
                              key={memory}
                              initial={{ opacity: 0, x: -10 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ delay: 1.4 + i * 0.1 }}
                              className="text-xs bg-muted/50 rounded px-2 py-1 truncate"
                            >
                              {memory}
                            </motion.div>
                          ))}
                        </motion.div>
                      </motion.div>
                      
                      {/* Add Memory Button */}
                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 1.8 }}
                      >
                        <Button 
                          variant="outline" 
                          size="sm" 
                          className="w-full hover:bg-gradient-to-r hover:from-primary/10 hover:to-accent/10 transition-all duration-300 group"
                        >
                          <motion.div
                            whileHover={{ rotate: 90 }}
                            transition={{ duration: 0.2 }}
                          >
                            <Plus className="w-3 h-3 mr-2" />
                          </motion.div>
                          <span className="group-hover:text-primary transition-colors">
                            Adicionar nova memória
                          </span>
                        </Button>
                      </motion.div>
                    </div>
                  )}

                  {/* Step 2: AI Processing - Enhanced */}
                  {activeStep === 1 && (
                    <div className="space-y-4">
                      {/* Processing Status */}
                      <motion.div 
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.2, duration: 0.5 }}
                        className="bg-gradient-to-r from-primary/10 to-accent/10 border border-primary/20 rounded-lg p-4 relative overflow-hidden"
                      >
                        {/* Animated background */}
                        <motion.div
                          className="absolute inset-0 bg-gradient-to-r from-primary/5 to-transparent"
                          animate={{ x: [-100, 300] }}
                          transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                        />
                        
                        <div className="relative z-10">
                          <div className="flex items-center gap-2 text-sm mb-3">
                            <motion.div
                              animate={{ rotate: 360 }}
                              transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                            >
                              <Sparkles className="w-4 h-4 text-primary" />
                            </motion.div>
                            <span className="font-medium text-foreground">IA Processando Memórias</span>
                          </div>
                          
                          <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: "100%" }}
                            transition={{ delay: 0.5, duration: 2 }}
                          >
                            <Progress value={85} className="h-2 mb-2" />
                          </motion.div>
                          
                          <motion.p
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 1 }}
                            className="text-xs text-muted-foreground"
                          >
                            Analisando padrões de fala e características únicas...
                          </motion.p>
                        </div>
                      </motion.div>
                      
                      {/* Analysis Details */}
                      <motion.div 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.7 }}
                        className="bg-card border border-border rounded-xl p-4 space-y-3 shadow-lg"
                      >
                        <div className="text-xs font-medium text-foreground mb-3">Análise em Tempo Real</div>
                        
                        {[
                          { label: "Padrões de Voz", progress: 95, delay: 0.8, color: "bg-green-500" },
                          { label: "Personalidade", progress: 78, delay: 1.2, color: "bg-blue-500" },
                          { label: "Memórias Contextuais", progress: 63, delay: 1.6, color: "bg-purple-500" },
                          { label: "Estilo de Conversa", progress: 41, delay: 2.0, color: "bg-orange-500" }
                        ].map((item, i) => (
                          <motion.div
                            key={item.label}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: item.delay }}
                            className="flex items-center justify-between"
                          >
                            <div className="flex items-center gap-2">
                              <motion.div
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                transition={{ delay: item.delay + 0.1, type: "spring" }}
                                className={`w-2 h-2 rounded-full ${item.color}`}
                              />
                              <span className="text-xs text-muted-foreground">{item.label}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <motion.div
                                initial={{ width: 0 }}
                                animate={{ width: "40px" }}
                                transition={{ delay: item.delay + 0.2, duration: 0.8 }}
                                className="w-10 h-1 bg-muted rounded-full overflow-hidden"
                              >
                                <motion.div
                                  initial={{ width: 0 }}
                                  animate={{ width: `${item.progress}%` }}
                                  transition={{ delay: item.delay + 0.5, duration: 1 }}
                                  className={`h-full ${item.color} rounded-full`}
                                />
                              </motion.div>
                              <motion.span
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ delay: item.delay + 1.2 }}
                                className="text-xs font-medium text-foreground min-w-[24px]"
                              >
                                {item.progress}%
                              </motion.span>
                            </div>
                          </motion.div>
                        ))}
                        
                        <motion.div
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 2.5 }}
                          className="flex items-center gap-2 mt-3 pt-3 border-t border-border/50"
                        >
                          <CheckCircle className="w-3 h-3 text-green-500" />
                          <span className="text-xs text-green-600 font-medium">Pronto para conversar!</span>
                        </motion.div>
                      </motion.div>
                    </div>
                  )}

                  {/* Step 3: Chat Interface - Enhanced */}
                  {activeStep === 2 && (
                    <div className="space-y-3">
                      {/* Chat Messages */}
                      <motion.div 
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        transition={{ delay: 0.2, duration: 0.5 }}
                        className="space-y-3 bg-muted/20 rounded-xl p-3 max-h-40 overflow-hidden relative"
                      >
                        {/* Background pattern */}
                        <div className="absolute inset-0 opacity-[0.02] bg-[radial-gradient(circle_at_1px_1px,currentColor_1px,transparent_0)]" />
                        
                        <motion.div
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.5 }}
                          className="relative z-10"
                        >
                          <MessageBubble
                            content="Oi meu amor! Como foi seu dia de trabalho hoje?"
                            isUser={false}
                            personName="Maria"
                            className="text-xs [&>div]:shadow-md"
                          />
                        </motion.div>
                        
                        <motion.div
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 1.2 }}
                          className="relative z-10"
                        >
                          <MessageBubble
                            content="Oi mãe! Foi bem corrido, mas consegui terminar o projeto. Como está se sentindo?"
                            isUser={true}
                            className="text-xs [&>div]:shadow-md"
                          />
                        </motion.div>
                        
                        <motion.div
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 2.0 }}
                          className="relative z-10"
                        >
                          <TypingIndicator
                            personName="Maria"
                            className="text-xs [&>div]:shadow-md"
                          />
                        </motion.div>
                      </motion.div>
                      
                      {/* Message Input */}
                      <motion.div 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 2.5 }}
                        className="flex gap-2 bg-card border border-border rounded-xl p-2 shadow-sm"
                      >
                        <motion.div
                          initial={{ opacity: 0.5 }}
                          animate={{ opacity: [0.5, 1, 0.5] }}
                          transition={{ duration: 2, repeat: Infinity }}
                          className="flex-1 bg-muted/50 rounded-lg px-3 py-2 text-xs text-muted-foreground flex items-center"
                        >
                          <span>Estou bem, obrigada por perguntar...</span>
                          <motion.div
                            animate={{ opacity: [0, 1, 0] }}
                            transition={{ duration: 1, repeat: Infinity }}
                            className="ml-1 w-0.5 h-3 bg-primary"
                          />
                        </motion.div>
                        
                        <motion.div
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                        >
                          <Button size="sm" variant="outline" className="px-3 hover:bg-primary/10">
                            <Volume2 className="w-3 h-3" />
                          </Button>
                        </motion.div>
                        
                        <motion.div
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                        >
                          <Button size="sm" className="px-3">
                            <MessageCircle className="w-3 h-3" />
                          </Button>
                        </motion.div>
                      </motion.div>
                      
                      {/* Voice Feature Indicator */}
                      <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 3 }}
                        className="text-center"
                      >
                        <div className="inline-flex items-center gap-1 px-2 py-1 bg-gradient-to-r from-primary/10 to-purple/10 rounded-full text-xs text-muted-foreground">
                          <motion.div
                            animate={{ scale: [1, 1.2, 1] }}
                            transition={{ duration: 2, repeat: Infinity }}
                          >
                            <BarChart3 className="w-3 h-3 text-primary" />
                          </motion.div>
                          <span>Voz com IA personalizada</span>
                        </div>
                      </motion.div>
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