import React, { useState, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { CheckCircle, ArrowLeft } from 'lucide-react';
import { motion } from 'framer-motion';
import { useLanguage } from '@/hooks/useLanguage';
import { supabase } from '@/integrations/supabase/client';

interface RobustWaitlistModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const RobustWaitlistModal: React.FC<RobustWaitlistModalProps> = ({ isOpen, onClose }) => {
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [submitAttempts, setSubmitAttempts] = useState(0);
  const formRef = useRef<HTMLFormElement>(null);
  const { currentLanguage } = useLanguage();

  const content = {
    en: {
      title: "Join the waitlist",
      subtitle: "Be the first to know when Eterna launches",
      emailLabel: "Email address",
      emailPlaceholder: "your@email.com",
      submit: "Join waitlist",
      submitting: "Joining...",
      success: {
        title: "You're on the list!",
        subtitle: "We'll notify you when Eterna is ready"
      },
      back: "Back"
    }
  };

  const text = content[currentLanguage as keyof typeof content] || content.en;

  // Client-side email validation
  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log('🔵 1. Form submitted with email:', email);
    console.log('🔵 MODAL DEBUG: Form submission started');
    
    if (!email) {
      console.log('🔵 MODAL DEBUG: Email is empty');
      toast.error('Email is required');
      return;
    }

    if (!validateEmail(email)) {
      console.log('🔵 MODAL DEBUG: Email validation failed');
      toast.error('Please enter a valid email address');
      return;
    }

    // Prevent rapid multiple submissions
    if (isSubmitting) {
      console.log('⚠️ Already submitting, ignoring duplicate request');
      return;
    }

    // Rate limiting - max 3 attempts per session
    if (submitAttempts >= 3) {
      toast.error('Too many attempts. Please refresh the page and try again.');
      return;
    }

    setIsSubmitting(true);
    setSubmitAttempts(prev => prev + 1);
    console.log('🔵 2. Setting isSubmitting to true, starting process...');

    try {
      // Approach A: Controlled form + JSON API
      console.log('🔵 3. Attempting JSON API approach...');
      
      const normalizedEmail = email.trim().toLowerCase();
      console.log('🔵 4. Normalized email:', normalizedEmail);

      const payload = {
        email: normalizedEmail,
        source: 'waitlist_modal',
        timestamp: new Date().toISOString(),
        userAgent: navigator.userAgent
      };
      console.log('🔵 5. Payload to send:', payload);

      // Use the working approach: direct database insert with status 'pending'
      const { data: insertData, error: insertError } = await supabase
        .from('waitlist')
        .insert({
          email: normalizedEmail,
          full_name: 'Anonymous User',
          user_id: null,
          status: 'pending', // This status works!
          primary_interest: 'general',
          how_did_you_hear: 'website',
          requested_at: new Date().toISOString()
        });

      console.log('🔵 6. Direct insert response received');
      console.log('🔵 MODAL DEBUG: Insert result:', insertData, 'Error:', insertError);
      
      if (insertError) {
        console.log('🔵 MODAL DEBUG: Error from direct insert:', insertError);
        
        // Handle duplicate constraint
        if (insertError.code === '23505') {
          console.log('🔵 7. Duplicate email detected');
          setIsSubmitted(true);
          toast.success("You're already on our waitlist!");
          return;
        }
        
        // Try other working status values as fallback
        const workingStatuses = ['active', 'waiting', 'confirmed', 'new'];
        let success = false;
        
        for (const status of workingStatuses) {
          const { error: retryError } = await supabase
            .from('waitlist')
            .insert({
              email: normalizedEmail,
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

      console.log('🔵 7. SUCCESS! Email processed successfully');
      setIsSubmitted(true);
      toast.success("Added to waitlist!");
      return;

    } catch (error) {
      console.log('⚠️ Primary API approach failed:', error);
      console.log('🔵 9. Attempting fallback approach...');

      try {
        // Approach B: Fallback to form submission
        const formData = new FormData();
        formData.append('email', email.trim().toLowerCase());
        formData.append('full_name', 'Anonymous User');
        formData.append('source', 'waitlist_modal_fallback');
        
        console.log('🔵 10. Fallback payload:', Object.fromEntries(formData));

        // Fallback: try direct database insert with different status
        const { error: fallbackError } = await supabase
          .from('waitlist')
          .insert({
            email: email.trim().toLowerCase(),
            full_name: 'Anonymous User',
            user_id: null,
            status: 'active', // Try different status
            primary_interest: 'general',
            how_did_you_hear: 'website',
            requested_at: new Date().toISOString()
          });

        if (!fallbackError) {
          console.log('🔵 11. Fallback SUCCESS!');
          setIsSubmitted(true);
          toast.success("Added to waitlist!");
          return;
        }

        throw new Error('Fallback also failed');

      } catch (fallbackError) {
        console.error('❌ Both primary and fallback approaches failed:', fallbackError);
        
        // Show user-friendly error for production
        toast.error("We couldn't sign you up right now. Please try again or check your connection.");
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
    setIsSubmitted(false);
    setSubmitAttempts(0);
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
                  {isSubmitted ? text.success.title : text.title}
                </CardTitle>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                  {isSubmitted ? text.success.subtitle : text.subtitle}
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
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                  Thanks for joining! We'll be in touch soon.
                </p>
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={handleRetry}
                  className="mr-2"
                >
                  Add Another Email
                </Button>
              </div>
            ) : (
              <form ref={formRef} onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <Label htmlFor="email" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    {text.emailLabel}
                  </Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder={text.emailPlaceholder}
                    required
                    className="mt-1"
                    autoComplete="email"
                    disabled={isSubmitting}
                  />
                </div>

                <Button 
                  type="submit" 
                  className="w-full bg-black hover:bg-gray-800 text-white dark:bg-white dark:text-black dark:hover:bg-gray-100"
                  disabled={isSubmitting || !email.trim()}
                >
                  {isSubmitting ? text.submitting : text.submit}
                </Button>

                {submitAttempts > 0 && (
                  <p className="text-xs text-gray-500 text-center">
                    Attempt {submitAttempts}/3 • Check console for details
                  </p>
                )}
              </form>
            )}
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
};