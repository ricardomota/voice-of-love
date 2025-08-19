// Step 11: Mobile CTA Bar - persistent compact bottom CTA on scroll
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Plus, User } from 'lucide-react';

interface MobileCTABarProps {
  isLoggedIn: boolean;
  onTryFree: () => void;
  onSignIn: () => void;
  className?: string;
}

export const MobileCTABar: React.FC<MobileCTABarProps> = ({
  isLoggedIn,
  onTryFree,
  onSignIn,
  className = ''
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const [lastScrollY, setLastScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      
      // Show CTA bar after scrolling 200px down
      if (currentScrollY > 200) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
      
      setLastScrollY(currentScrollY);
    };

    // Throttle scroll events
    let timeoutId: NodeJS.Timeout;
    const throttledScroll = () => {
      if (timeoutId) clearTimeout(timeoutId);
      timeoutId = setTimeout(handleScroll, 10);
    };

    window.addEventListener('scroll', throttledScroll);
    return () => {
      window.removeEventListener('scroll', throttledScroll);
      if (timeoutId) clearTimeout(timeoutId);
    };
  }, [lastScrollY]);

  if (!isVisible) return null;

  return (
    <div 
      data-testid="mobile-cta-bar"
      className={`
        fixed bottom-0 left-0 right-0 z-50 
        bg-white/95 backdrop-blur-md border-t border-border/10 
        px-4 py-3 shadow-lg
        block md:hidden
        transition-transform duration-300 ease-in-out
        ${isVisible ? 'translate-y-0' : 'translate-y-full'}
        ${className}
      `}
    >
      <div className="flex items-center justify-between gap-3 max-w-sm mx-auto">
        {isLoggedIn ? (
          <>
            <Button 
              size="sm" 
              className="flex-1 h-10"
              onClick={onTryFree}
            >
              <Plus className="h-4 w-4 mr-2" />
              Create Memory
            </Button>
            <Button 
              variant="outline" 
              size="sm" 
              className="px-4 h-10"
              onClick={() => window.location.href = '/dashboard'}
            >
              Dashboard
            </Button>
          </>
        ) : (
          <>
            <Button 
              size="sm" 
              className="flex-1 h-10"
              onClick={onTryFree}
            >
              Try Eterna free
            </Button>
            <Button 
              variant="outline" 
              size="sm" 
              className="px-4 h-10"
              onClick={onSignIn}
            >
              <User className="h-4 w-4 mr-2" />
              Sign in
            </Button>
          </>
        )}
      </div>
    </div>
  );
};