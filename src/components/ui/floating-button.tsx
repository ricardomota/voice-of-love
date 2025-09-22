import React from 'react';
import { motion } from 'framer-motion';
import { Button, ButtonProps } from './button';
import { cn } from '@/lib/utils';

interface FloatingButtonProps extends ButtonProps {
  isFloating?: boolean;
}

export const FloatingButton: React.FC<FloatingButtonProps> = ({
  className,
  isFloating = true,
  children,
  ...props
}) => {
  return (
    <motion.div
      whileHover={isFloating ? { y: -2, scale: 1.02 } : { scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
    >
      <Button
        className={cn(
          'shadow-lg hover:shadow-xl transition-all duration-300',
          isFloating && 'shadow-primary/20 hover:shadow-primary/30',
          className
        )}
        {...props}
      >
        {children}
      </Button>
    </motion.div>
  );
};