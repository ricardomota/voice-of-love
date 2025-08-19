import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Close, ArrowRight } from '@carbon/icons-react';
import { motion } from 'framer-motion';
import { DemoChat } from '@/components/demo/DemoChat';

interface DemoModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const DemoModal: React.FC<DemoModalProps> = ({ isOpen, onClose }) => {
  const [showDemo, setShowDemo] = useState(false);

  const handleStartDemo = () => {
    setShowDemo(true);
  };

  const handleTryFull = () => {
    window.location.href = '/auth';
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl w-full max-h-[90vh] p-0 bg-gradient-to-br from-primary via-primary/95 to-accent border-primary-foreground/20 [&>button]:hidden">
        <div className="relative p-8">
          {/* Close button */}
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            className="absolute top-4 right-4 text-primary-foreground/80 hover:text-primary-foreground hover:bg-white/10 z-10"
          >
            <Close size={20} />
          </Button>

          <DialogHeader className="space-y-6 text-center mb-8">
            <DialogTitle className="text-3xl md:text-4xl font-serif text-primary-foreground text-center">
              Experience Eterna Demo
            </DialogTitle>
            <p className="text-lg text-primary-foreground/90 max-w-2xl mx-auto text-center">
              Experience what it feels like to have a conversation with an AI version of a loved one.
            </p>
          </DialogHeader>

          {/* Demo Area */}
          <div className="space-y-6">
            {!showDemo ? (
              <motion.div 
                className="space-y-8"
                initial={{ opacity: 1 }}
                animate={{ opacity: showDemo ? 0 : 1 }}
              >
                {/* Preview Card */}
                <div className="relative rounded-2xl overflow-hidden bg-gradient-to-br from-primary-foreground/10 to-transparent backdrop-blur-sm border border-primary-foreground/20 p-8 text-center">
                  <div className="space-y-4">
                    <div className="w-20 h-20 bg-secondary/20 rounded-full flex items-center justify-center mx-auto mb-4">
                      <div className="w-12 h-12 bg-secondary/40 rounded-full flex items-center justify-center">
                        <span className="text-2xl">👵</span>
                      </div>
                    </div>
                    <h3 className="text-2xl font-serif text-primary-foreground">Meet Avó Maria</h3>
                    <p className="text-primary-foreground/80 max-w-md mx-auto">
                      Chat with an AI version of a loving grandmother who remembers your favorite recipes, 
                      shares family stories, and offers wise advice.
                    </p>
                  </div>
                  
                  {/* Background pattern */}
                  <div className="absolute inset-0 opacity-20">
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_1px_1px,rgba(255,255,255,0.15)_1px,transparent_0)] [background-size:30px_30px]" />
                  </div>
                </div>

                {/* Features Preview */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {[
                    {
                      icon: "💬",
                      title: "Natural Conversations",
                      description: "Chat naturally with AI that captures personality and memories"
                    },
                    {
                      icon: "🎵",
                      title: "Voice Memories",
                      description: "Hear responses in their familiar voice (simulated in demo)"
                    },
                    {
                      icon: "❤️",
                      title: "Emotional Connection",
                      description: "Experience the warmth and wisdom of your loved ones"
                    }
                  ].map((feature, index) => (
                    <div key={index} className="text-center space-y-3">
                      <div className="w-12 h-12 bg-secondary/20 rounded-xl flex items-center justify-center mx-auto">
                        <span className="text-2xl">{feature.icon}</span>
                      </div>
                      <h4 className="font-semibold text-primary-foreground">{feature.title}</h4>
                      <p className="text-sm text-primary-foreground/80">{feature.description}</p>
                    </div>
                  ))}
                </div>

                {/* CTA */}
                <div className="text-center pt-4">
                  <Button
                    onClick={handleStartDemo}
                    size="xl"
                    variant="secondary"
                    className="min-w-[200px] h-14 text-lg font-semibold"
                  >
                    Start Demo Chat
                  </Button>
                </div>
              </motion.div>
            ) : (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="space-y-6"
              >
                {/* Interactive Demo */}
                <DemoChat />
                
                {/* Post-Demo CTA */}
                <div className="text-center space-y-4 pt-4">
                  <p className="text-primary-foreground/90">
                    Ready to create AI versions of your own loved ones?
                  </p>
                  <div className="flex gap-4 justify-center">
                    <Button
                      onClick={() => setShowDemo(false)}
                      variant="outline"
                      className="border-primary-foreground/30 text-primary-foreground hover:bg-primary-foreground/10"
                    >
                      Try Again
                    </Button>
                    <Button
                      onClick={handleTryFull}
                      variant="secondary"
                      className="min-w-[160px] flex items-center gap-2"
                    >
                      Try Eterna Free
                      <ArrowRight size={16} />
                    </Button>
                  </div>
                </div>
              </motion.div>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};