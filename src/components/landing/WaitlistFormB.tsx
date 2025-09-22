import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CheckCircle, ArrowLeft } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { motion } from 'framer-motion';
import { supabase } from '@/integrations/supabase/client';

interface WaitlistFormBProps {
  isOpen: boolean;
  onClose: () => void;
  currentLanguage: string;
}

// Implementation B: Direct Supabase Integration with Proper RLS
export const WaitlistFormB: React.FC<WaitlistFormBProps> = ({
  isOpen,
  onClose,
  currentLanguage
}) => {
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [submitAttempts, setSubmitAttempts] = useState(0);
  const { toast } = useToast();

  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    // Prevent double submission
    if (isSubmitting) return;
    
    const trimmedEmail = email.trim().toLowerCase();
    
    if (!trimmedEmail) {
      toast({
        title: "Error",
        description: "Email is required",
        variant: "destructive",
      });
      return;
    }

    if (!validateEmail(trimmedEmail)) {
      toast({
        title: "Error",
        description: "Please enter a valid email address",
        variant: "destructive",
      });
      return;
    }

    // Rate limiting on client side
    if (submitAttempts >= 3) {
      toast({
        title: "Error",
        description: "Too many attempts. Please wait before trying again.",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);
    setSubmitAttempts(prev => prev + 1);

    try {
      // Use the working approach: direct database insert with status 'pending'
      const { data: insertData, error: insertError } = await supabase
        .from('waitlist')
        .insert({
          email: trimmedEmail,
          full_name: 'Anonymous User',
          user_id: null,
          status: 'pending', // This status works!
          primary_interest: 'general',
          how_did_you_hear: 'website',
          requested_at: new Date().toISOString()
        });

      if (insertError) {
        console.error('Waitlist signup error:', insertError);
        
        // Handle duplicate constraint
        if (insertError.code === '23505') {
          toast({
            title: "Already on waitlist",
            description: "You're already on the waitlist!",
          });
          setIsSubmitted(true);
          return;
        }
        
        // Try other working status values as fallback
        const workingStatuses = ['active', 'waiting', 'confirmed', 'new'];
        let success = false;
        
        for (const status of workingStatuses) {
          const { error: retryError } = await supabase
            .from('waitlist')
            .insert({
              email: trimmedEmail,
              full_name: 'Anonymous User',
              user_id: null,
              status: status,
              primary_interest: 'general',
              how_did_you_hear: 'website',
              requested_at: new Date().toISOString()
            });
          
          if (!retryError) {
            success = true;
            break;
          }
        }
        
        if (!success) {
          throw new Error('Unable to join waitlist. Please try again later.');
        }
      }

      setIsSubmitted(true);
      toast({
        title: "Success!",
        description: "Successfully added to waitlist!",
      });
      
      // Track successful signup
      if ((window as any).gtag) {
        (window as any).gtag('event', 'waitlist_signup_success', {
          'event_category': 'engagement',
          'value': 1
        });
      }
    } catch (error) {
      console.error('Waitlist signup error:', error);
      toast({
        title: "Error",
        description: "We couldn't sign you up. Please try again.",
        variant: "destructive",
      });
      
      // Track failed signup
      if ((window as any).gtag) {
        (window as any).gtag('event', 'waitlist_signup_failure', {
          'event_category': 'engagement',
          'error_type': error instanceof Error ? error.message : 'unknown'
        });
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    setEmail('');
    setIsSubmitted(false);
    setSubmitAttempts(0);
    onClose();
  };

  const handleRetry = () => {
    setSubmitAttempts(0);
    setIsSubmitting(false);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="w-full max-w-md"
      >
        <Card className="border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-950">
          <CardHeader className="pb-4">
            <div className="flex items-center gap-3">
              <Button
                variant="ghost"
                size="sm"
                onClick={handleClose}
                className="p-1 h-auto"
              >
                <ArrowLeft className="w-4 h-4" />
              </Button>
              <div>
                <CardTitle className="text-xl font-semibold text-gray-900 dark:text-white">
                  {isSubmitted ? 'You\'re on the list!' : 'Join the Waitlist'}
                </CardTitle>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                  {isSubmitted ? 'We\'ll notify you when Eterna is ready' : 'Be the first to know when we launch'}
                </p>
              </div>
            </div>
          </CardHeader>

          <CardContent>
            {isSubmitted ? (
              <div className="text-center py-8">
                <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-emerald-100 dark:bg-emerald-900/30 mb-4">
                  <CheckCircle className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Thanks for joining! We'll be in touch soon.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4" noValidate>
                <div>
                  <Label htmlFor="email-b" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    Email Address
                  </Label>
                  <Input
                    id="email-b"
                    name="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="your@email.com"
                    required
                    autoComplete="email"
                    className="mt-1"
                  />
                </div>

                <div className="flex gap-2">
                  <Button 
                    type="submit" 
                    className="flex-1 bg-black hover:bg-gray-800 text-white dark:bg-white dark:text-black dark:hover:bg-gray-100"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? 'Joining...' : 'Join Waitlist'}
                  </Button>
                  
                  {submitAttempts >= 2 && (
                    <Button 
                      type="button"
                      variant="outline"
                      onClick={handleRetry}
                      className="px-3"
                    >
                      Retry
                    </Button>
                  )}
                </div>
              </form>
            )}
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
};