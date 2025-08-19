import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { PlayFilled, Close } from '@carbon/icons-react';
import { motion } from 'framer-motion';

interface DemoModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const DemoModal: React.FC<DemoModalProps> = ({ isOpen, onClose }) => {
  const [isPlaying, setIsPlaying] = useState(false);

  const handlePlayDemo = () => {
    setIsPlaying(true);
    // Redirect to actual demo page after a brief animation
    setTimeout(() => {
      window.location.href = '/demo';
    }, 1000);
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

          <DialogHeader className="space-y-6 text-center">
            <DialogTitle className="text-3xl md:text-4xl font-serif text-primary-foreground text-center">
              Experience Eterna Demo
            </DialogTitle>
            <p className="text-lg text-primary-foreground/90 max-w-2xl mx-auto text-center">
              See how Eterna preserves memories and creates meaningful connections with AI that captures the essence of your loved ones.
            </p>
          </DialogHeader>

          {/* Demo Preview Area */}
          <div className="mt-8 space-y-8">
            {/* Video/Preview Container */}
            <div className="relative rounded-2xl overflow-hidden aspect-video bg-gradient-to-br from-primary-foreground/10 to-transparent backdrop-blur-sm border border-primary-foreground/20">
              {!isPlaying ? (
                <motion.div 
                  className="absolute inset-0 flex items-center justify-center"
                  initial={{ opacity: 1 }}
                  animate={{ opacity: isPlaying ? 0 : 1 }}
                >
                  <Button
                    onClick={handlePlayDemo}
                    size="xl"
                    className="h-20 w-20 rounded-full bg-secondary hover:bg-secondary/90 text-secondary-foreground shadow-2xl"
                  >
                    <PlayFilled size={32} />
                  </Button>
                </motion.div>
              ) : (
                <motion.div 
                  className="absolute inset-0 flex items-center justify-center bg-primary/20"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                >
                  <div className="text-center text-primary-foreground">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-secondary mx-auto mb-4"></div>
                    <p className="text-lg text-center">Loading demo...</p>
                  </div>
                </motion.div>
              )}
              
              {/* Background pattern */}
              <div className="absolute inset-0 opacity-20">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_1px_1px,rgba(255,255,255,0.15)_1px,transparent_0)] [background-size:30px_30px]" />
              </div>
            </div>

            {/* Demo Features */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center space-y-3">
                <div className="w-12 h-12 bg-secondary/20 rounded-xl flex items-center justify-center mx-auto">
                  <PlayFilled size={24} className="text-secondary" />
                </div>
                <h3 className="font-semibold text-primary-foreground">Interactive Conversations</h3>
                <p className="text-sm text-primary-foreground/80">Experience natural dialogue with AI personas</p>
              </div>
              <div className="text-center space-y-3">
                <div className="w-12 h-12 bg-secondary/20 rounded-xl flex items-center justify-center mx-auto">
                  <PlayFilled size={24} className="text-secondary" />
                </div>
                <h3 className="font-semibold text-primary-foreground">Memory Preservation</h3>
                <p className="text-sm text-primary-foreground/80">See how stories and wisdom are captured</p>
              </div>
              <div className="text-center space-y-3">
                <div className="w-12 h-12 bg-secondary/20 rounded-xl flex items-center justify-center mx-auto">
                  <PlayFilled size={24} className="text-secondary" />
                </div>
                <h3 className="font-semibold text-primary-foreground">Privacy First</h3>
                <p className="text-sm text-primary-foreground/80">Your data remains secure and private</p>
              </div>
            </div>

            {/* CTA */}
            <div className="text-center pt-4">
              <Button
                onClick={handlePlayDemo}
                size="xl"
                variant="secondary"
                className="min-w-[200px] h-14 text-lg font-semibold"
                disabled={isPlaying}
              >
                {isPlaying ? 'Loading...' : 'Start Demo'}
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};