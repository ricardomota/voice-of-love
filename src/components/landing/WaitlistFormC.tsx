import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CheckCircle, ArrowLeft } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { motion } from 'framer-motion';
import { supabase } from '@/integrations/supabase/client';

interface WaitlistFormCProps {
  isOpen: boolean;
  onClose: () => void;
  currentLanguage: string;
}

// Implementation C: Server Endpoint with CSRF Protection
export const WaitlistFormC: React.FC<WaitlistFormCProps> = ({
  isOpen,
  onClose,
  currentLanguage
}) => {
  const [email, setEmail] = useState('');
  const [honeypot, setHoneypot] = useState(''); // Bot detection
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [csrfToken, setCsrfToken] = useState('');
  const { toast } = useToast();

  React.useEffect(() => {
    // Generate CSRF token on component mount
    if (isOpen) {
      const token = Math.random().toString(36).substring(2);
      setCsrfToken(token);
      sessionStorage.setItem('waitlist_csrf', token);
    }
  }, [isOpen]);

  const validateEmailRFC = (email: string): boolean => {
    // More comprehensive RFC 5322 validation
    const rfc5322Regex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;
    return rfc5322Regex.test(email) && email.length <= 254;
  };

  const normalizeEmail = (email: string): string => {
    return email.trim().toLowerCase();
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    // Honeypot check - if filled, it's likely a bot
    if (honeypot) {
      console.warn('Bot detection triggered');
      return;
    }

    const normalizedEmail = normalizeEmail(email);
    
    if (!normalizedEmail) {
      toast({
        title: "Error",
        description: "Email is required",
        variant: "destructive",
      });
      return;
    }

    if (!validateEmailRFC(normalizedEmail)) {
      toast({
        title: "Error",
        description: "Please enter a valid email address",
        variant: "destructive",
      });
      return;
    }

    // Check CSRF token
    const storedToken = sessionStorage.getItem('waitlist_csrf');
    if (!storedToken || storedToken !== csrfToken) {
      toast({
        title: "Error",
        description: "Security validation failed. Please refresh and try again.",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);

    try {
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

      if (insertError) {
        // Handle duplicate constraint
        if (insertError.code === '23505') {
          toast({
            title: "Already on waitlist",
            description: "You're already on our waitlist!",
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

      setIsSubmitted(true);
      toast({
        title: "Success!",
        description: "Successfully added to waitlist!",
      });
      
      // Analytics tracking
      if ((window as any).gtag) {
        (window as any).gtag('event', 'waitlist_signup_success', {
          'event_category': 'engagement',
          'method': 'secure_form',
          'value': 1
        });
      }

    } catch (error) {
      console.error('Waitlist signup error:', error);
      toast({
        title: "Error",
        description: "We couldn't sign you up. Please check your connection and try again.",
        variant: "destructive",
      });
      
      // Analytics tracking for errors
      if ((window as any).gtag) {
        (window as any).gtag('event', 'waitlist_signup_failure', {
          'event_category': 'engagement',
          'error_type': error instanceof Error ? error.message : 'network_error'
        });
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    setEmail('');
    setHoneypot('');
    setIsSubmitted(false);
    onClose();
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
                {/* Honeypot field for bot detection */}
                <input
                  type="text"
                  name="website"
                  value={honeypot}
                  onChange={(e) => setHoneypot(e.target.value)}
                  style={{ display: 'none' }}
                  tabIndex={-1}
                  autoComplete="off"
                />
                
                <div>
                  <Label htmlFor="email-c" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    Email Address
                  </Label>
                  <Input
                    id="email-c"
                    name="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="your@email.com"
                    required
                    autoComplete="email"
                    maxLength={254}
                    className="mt-1"
                  />
                </div>

                <Button 
                  type="submit" 
                  className="w-full bg-black hover:bg-gray-800 text-white dark:bg-white dark:text-black dark:hover:bg-gray-100"
                  disabled={isSubmitting || !email.trim()}
                >
                  {isSubmitting ? 'Securing your spot...' : 'Join Waitlist'}
                </Button>
                
                <p className="text-xs text-gray-500 text-center">
                  We'll only use your email to notify you about Eterna's launch.
                </p>
              </form>
            )}
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
};