import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLanguage } from '@/hooks/useLanguage';
import { 
  Upload, 
  Settings, 
  MessageCircle, 
  Heart, 
  Mic, 
  Brain, 
  Sparkles,
  Users,
  Clock,
  Volume2
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { MessageBubble } from '@/components/ui/message-bubble';
import { TypingIndicator } from '@/components/ui/typing-indicator';
import { Progress } from '@/components/ui/progress';

export const EnhancedHowItWorks: React.FC = () => {
  const { currentLanguage } = useLanguage();
  const [activeStep, setActiveStep] = useState(0);
  const [progress, setProgress] = useState(0);

  // Auto-cycle through steps
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveStep((prev) => (prev + 1) % 3);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  // Animate progress bar
  useEffect(() => {
    setProgress(0);
    const timer = setTimeout(() => setProgress(100), 100);
    return () => clearTimeout(timer);
  }, [activeStep]);

  const content = {
    en: {
      title: "How Eterna Works",
      subtitle: "Three simple steps to preserve and connect with your loved ones",
      steps: [
        {
          title: "Upload & Preserve",
          description: "Share memories, photos, voice recordings, and personal stories",
          details: "Our secure platform safely stores all precious memories while our AI learns their unique voice patterns and personality traits.",
          items: ["Voice recordings", "Personal photos", "Written memories", "Video messages"]
        },
        {
          title: "AI Processing",
          description: "Advanced AI analyzes speech patterns and creates a personalized voice model",
          details: "Using cutting-edge machine learning, we create a digital representation that captures their essence, mannerisms, and speaking style.",
          items: ["Voice synthesis", "Personality mapping", "Speech patterns", "Emotional tone"]
        },
        {
          title: "Connect & Chat",
          description: "Have natural conversations that feel authentic and meaningful",
          details: "Experience lifelike interactions that preserve their wisdom, humor, and love, creating new memories while honoring the past.",
          items: ["Natural dialogue", "Voice responses", "Emotional connection", "Lasting memories"]
        }
      ]
    }
  };

  const text = content[currentLanguage as keyof typeof content] || content.en;
  const stepIcons = [Upload, Brain, MessageCircle];

  return (
    <section className="py-24 relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-50/30 via-transparent to-blue-50/20 dark:from-slate-900/20 dark:to-transparent" />
      
      <div className="max-w-7xl mx-auto px-6 relative">
        {/* Header */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center max-w-3xl mx-auto mb-20"
        >
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-semibold text-gray-900 dark:text-white mb-6 leading-tight">
            {text.title}
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-400 leading-relaxed">
            {text.subtitle}
          </p>
        </motion.div>

        {/* Main Content Grid */}
        <div className="grid lg:grid-cols-12 gap-16 items-center">
          
          {/* Left Side - Steps */}
          <div className="lg:col-span-5 space-y-8">
            {text.steps.map((step, index) => {
              const IconComponent = stepIcons[index];
              const isActive = activeStep === index;
              
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -40 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: index * 0.15 }}
                  className={`relative cursor-pointer group transition-all duration-500 ${
                    isActive ? 'scale-105' : 'hover:scale-102'
                  }`}
                  onClick={() => setActiveStep(index)}
                >
                  <div className={`relative p-8 rounded-2xl transition-all duration-500 ${
                    isActive 
                      ? 'bg-white/80 dark:bg-gray-800/60 shadow-xl shadow-blue-500/10 border border-blue-200/50 dark:border-blue-800/30' 
                      : 'bg-white/40 dark:bg-gray-900/20 hover:bg-white/60 dark:hover:bg-gray-800/30 border border-gray-200/30 dark:border-gray-700/20'
                  }`}>
                    
                    {/* Step indicator */}
                    <div className="flex items-start gap-6">
                      <div className={`relative w-16 h-16 rounded-2xl flex items-center justify-center transition-all duration-500 ${
                        isActive 
                          ? 'bg-gradient-to-br from-blue-500 to-indigo-600 text-white shadow-lg shadow-blue-500/25' 
                          : 'bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400'
                      }`}>
                        <IconComponent className="w-8 h-8" />
                        {isActive && (
                          <motion.div
                            className="absolute inset-0 rounded-2xl bg-gradient-to-br from-blue-400 to-indigo-500 opacity-20"
                            animate={{ scale: [1, 1.1, 1] }}
                            transition={{ duration: 2, repeat: Infinity }}
                          />
                        )}
                      </div>
                      
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-3">
                          <span className={`text-sm font-medium px-3 py-1 rounded-full transition-colors duration-300 ${
                            isActive 
                              ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300' 
                              : 'bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400'
                          }`}>
                            Step {index + 1}
                          </span>
                        </div>
                        
                        <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
                          {step.title}
                        </h3>
                        
                        <p className="text-gray-600 dark:text-gray-400 leading-relaxed mb-4">
                          {step.description}
                        </p>

                        {/* Progress bar for active step */}
                        {isActive && (
                          <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            className="space-y-4"
                          >
                            <Progress value={progress} className="h-1" />
                            <p className="text-sm text-gray-500 dark:text-gray-400">
                              {step.details}
                            </p>
                            <div className="flex flex-wrap gap-2">
                              {step.items.map((item, itemIndex) => (
                                <span 
                                  key={itemIndex}
                                  className="text-xs px-3 py-1 rounded-full bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 border border-blue-200/50 dark:border-blue-800/30"
                                >
                                  {item}
                                </span>
                              ))}
                            </div>
                          </motion.div>
                        )}
                      </div>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>

          {/* Right Side - Interactive Illustration */}
          <div className="lg:col-span-7">
            <motion.div
              initial={{ opacity: 0, x: 40 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="relative"
            >
              <div className="relative bg-gradient-to-br from-white/80 to-gray-50/80 dark:from-gray-800/50 dark:to-gray-900/50 backdrop-blur-sm rounded-3xl border border-gray-200/50 dark:border-gray-700/30 p-8 shadow-2xl shadow-gray-900/5">
                
                {/* Floating decorative elements */}
                <div className="absolute -top-4 -right-4 w-24 h-24 bg-gradient-to-br from-blue-400/20 to-indigo-500/10 rounded-full blur-xl animate-pulse" />
                <div className="absolute -bottom-6 -left-6 w-32 h-32 bg-gradient-to-br from-indigo-400/15 to-blue-500/10 rounded-full blur-xl animate-pulse" style={{ animationDelay: '1s' }} />

                {/* Illustration Content */}
                <AnimatePresence mode="wait">
                  <motion.div
                    key={activeStep}
                    initial={{ opacity: 0, y: 30, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -30, scale: 0.95 }}
                    transition={{ duration: 0.5, ease: "easeInOut" }}
                    className="w-full h-96 flex items-center justify-center"
                  >
                    {/* Step 1: Upload Interface */}
                    {activeStep === 0 && (
                      <div className="w-full max-w-sm space-y-6">
                        <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl p-6 shadow-lg">
                          <div className="flex items-center gap-4 mb-6">
                            <Avatar className="w-16 h-16 border-2 border-blue-200 dark:border-blue-800">
                              <AvatarImage src="/lovable-uploads/mom-avatar.png" alt="Profile" />
                              <AvatarFallback className="bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-400 text-lg font-semibold">
                                M
                              </AvatarFallback>
                            </Avatar>
                            <div>
                              <h4 className="font-semibold text-gray-900 dark:text-white">Maria Santos</h4>
                              <p className="text-sm text-gray-500 dark:text-gray-400">Mother</p>
                            </div>
                          </div>
                          
                          <div className="space-y-3">
                            <motion.div 
                              animate={{ scale: [1, 1.02, 1] }}
                              transition={{ duration: 2, repeat: Infinity }}
                              className="flex items-center gap-3 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-xl border border-blue-200/50 dark:border-blue-800/30"
                            >
                              <Heart className="w-5 h-5 text-blue-500" />
                              <span className="text-sm text-blue-700 dark:text-blue-300">15 memories uploaded</span>
                            </motion.div>
                            
                            <motion.div 
                              animate={{ scale: [1, 1.02, 1] }}
                              transition={{ duration: 2, repeat: Infinity, delay: 0.5 }}
                              className="flex items-center gap-3 p-3 bg-green-50 dark:bg-green-900/20 rounded-xl border border-green-200/50 dark:border-green-800/30"
                            >
                              <Mic className="w-5 h-5 text-green-500" />
                              <span className="text-sm text-green-700 dark:text-green-300">8 voice recordings</span>
                            </motion.div>
                          </div>
                        </div>
                        
                        <Button variant="outline" className="w-full border-2 border-dashed border-blue-300 dark:border-blue-700 hover:bg-blue-50 dark:hover:bg-blue-900/20">
                          <Upload className="w-4 h-4 mr-2" />
                          Add New Memory
                        </Button>
                      </div>
                    )}

                    {/* Step 2: AI Processing */}
                    {activeStep === 1 && (
                      <div className="w-full max-w-sm space-y-6">
                        <div className="bg-gradient-to-br from-indigo-50 to-blue-50 dark:from-indigo-900/30 dark:to-blue-900/20 border border-indigo-200 dark:border-indigo-800/30 rounded-2xl p-6">
                          <div className="text-center mb-6">
                            <motion.div
                              animate={{ rotate: 360 }}
                              transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                              className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-indigo-500 to-blue-600 rounded-full flex items-center justify-center"
                            >
                              <Brain className="w-8 h-8 text-white" />
                            </motion.div>
                            <h4 className="font-semibold text-gray-900 dark:text-white mb-2">AI Processing</h4>
                            <p className="text-sm text-gray-600 dark:text-gray-400">Analyzing voice patterns and personality</p>
                          </div>
                          
                          <div className="space-y-4">
                            <div className="space-y-2">
                              <div className="flex justify-between text-xs">
                                <span className="text-gray-600 dark:text-gray-400">Voice Analysis</span>
                                <span className="text-green-600 dark:text-green-400">Complete</span>
                              </div>
                              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                                <motion.div 
                                  className="bg-green-500 h-2 rounded-full"
                                  initial={{ width: 0 }}
                                  animate={{ width: "100%" }}
                                  transition={{ duration: 2, delay: 0.5 }}
                                />
                              </div>
                            </div>
                            
                            <div className="space-y-2">
                              <div className="flex justify-between text-xs">
                                <span className="text-gray-600 dark:text-gray-400">Speech Patterns</span>
                                <motion.span 
                                  animate={{ opacity: [1, 0.5, 1] }}
                                  transition={{ duration: 1.5, repeat: Infinity }}
                                  className="text-blue-600 dark:text-blue-400"
                                >
                                  Processing...
                                </motion.span>
                              </div>
                              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                                <motion.div 
                                  className="bg-blue-500 h-2 rounded-full"
                                  initial={{ width: 0 }}
                                  animate={{ width: "75%" }}
                                  transition={{ duration: 2, delay: 1 }}
                                />
                              </div>
                            </div>
                            
                            <div className="space-y-2">
                              <div className="flex justify-between text-xs">
                                <span className="text-gray-600 dark:text-gray-400">Personality Mapping</span>
                                <span className="text-gray-400 dark:text-gray-500">Pending</span>
                              </div>
                              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                                <div className="bg-gray-300 dark:bg-gray-600 h-2 rounded-full w-1/4" />
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Step 3: Chat Interface */}
                    {activeStep === 2 && (
                      <div className="w-full max-w-sm">
                        <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl p-4 shadow-lg">
                          <div className="flex items-center gap-3 p-3 border-b border-gray-100 dark:border-gray-700 mb-4">
                            <Avatar className="w-10 h-10">
                              <AvatarImage src="/lovable-uploads/mom-avatar.png" alt="Maria" />
                              <AvatarFallback className="bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-400">
                                M
                              </AvatarFallback>
                            </Avatar>
                            <div>
                              <h4 className="font-medium text-gray-900 dark:text-white text-sm">Maria Santos</h4>
                              <div className="flex items-center gap-1">
                                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                                <span className="text-xs text-gray-500 dark:text-gray-400">Online</span>
                              </div>
                            </div>
                          </div>
                          
                          <div className="space-y-3 mb-4 max-h-32 overflow-hidden">
                            <MessageBubble
                              content="Hello my dear! How was your day?"
                              isUser={false}
                              personName="Maria"
                              className="text-sm"
                            />
                            <MessageBubble
                              content="Hi Mom! It was wonderful, thank you for asking."
                              isUser={true}
                              className="text-sm"
                            />
                            <motion.div
                              initial={{ opacity: 0 }}
                              animate={{ opacity: 1 }}
                              transition={{ delay: 2 }}
                            >
                              <TypingIndicator
                                personName="Maria"
                                className="text-sm"
                              />
                            </motion.div>
                          </div>
                          
                          <div className="flex gap-2">
                            <div className="flex-1 bg-gray-50 dark:bg-gray-700 rounded-full px-4 py-2 text-sm text-gray-500 dark:text-gray-400">
                              Type your message...
                            </div>
                            <Button size="sm" className="px-3 bg-blue-500 hover:bg-blue-600">
                              <Volume2 className="w-4 h-4" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    )}
                  </motion.div>
                </AnimatePresence>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
};