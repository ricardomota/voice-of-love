import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CheckCircle, ArrowLeft } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useDebounce } from '@/hooks/useDebounce';
import { motion } from 'framer-motion';
import { validateEmail } from '@/utils/securityUtils';

interface WaitlistFormAProps {
  isOpen: boolean;
  onClose: () => void;
  currentLanguage: string;
}

// Implementation A: Frontend Form Handler with Validation & Debouncing
export const WaitlistFormA: React.FC<WaitlistFormAProps> = ({
  isOpen,
  onClose,
  currentLanguage
}) => {
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [emailError, setEmailError] = useState('');
  const { toast } = useToast();

  // Debounce email validation
  const debouncedEmail = useDebounce(email, 300);

  React.useEffect(() => {
    if (debouncedEmail && debouncedEmail !== email) {
      validateEmailInput(debouncedEmail);
    }
  }, [debouncedEmail]);

  const validateEmailInput = (emailValue: string) => {
    const { isValid, error } = validateEmail(emailValue);
    if (!isValid && emailValue.length > 0) {
      setEmailError(error || 'Invalid email format');
    } else {
      setEmailError('');
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    if (!email.trim()) {
      setEmailError('Email is required');
      return;
    }

    const { isValid, error } = validateEmail(email.trim());
    if (!isValid) {
      setEmailError(error || 'Invalid email format');
      return;
    }

    setIsSubmitting(true);
    setEmailError('');

    try {
      const response = await fetch('/api/waitlist', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Requested-With': 'XMLHttpRequest'
        },
        body: JSON.stringify({ 
          email: email.trim().toLowerCase(),
          language: currentLanguage 
        })
      });

      const data = await response.json();

      if (!response.ok) {
        if (response.status === 409) {
          toast({
            title: "Already on waitlist",
            description: "You're already on the waitlist!",
          });
          setIsSubmitted(true);
        } else if (response.status === 400) {
          setEmailError(data.message || 'Invalid email format');
        } else {
          throw new Error(data.message || 'Network error occurred');
        }
      } else {
        setIsSubmitted(true);
        toast({
          title: "Success!",
          description: "Successfully added to waitlist!",
        });
      }
    } catch (error) {
      console.error('Waitlist signup error:', error);
      toast({
        title: "Error",
        description: "We couldn't sign you up. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    setEmail('');
    setIsSubmitted(false);
    setEmailError('');
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
                <div>
                  <Label htmlFor="email-a" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    Email Address
                  </Label>
                  <Input
                    id="email-a"
                    name="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="your@email.com"
                    required
                    autoComplete="email"
                    aria-describedby={emailError ? "email-error" : undefined}
                    className={`mt-1 ${emailError ? 'border-red-500' : ''}`}
                  />
                  {emailError && (
                    <p id="email-error" className="text-sm text-red-600 mt-1" role="alert">
                      {emailError}
                    </p>
                  )}
                </div>

                <Button 
                  type="submit" 
                  className="w-full bg-black hover:bg-gray-800 text-white dark:bg-white dark:text-black dark:hover:bg-gray-100"
                  disabled={isSubmitting || !!emailError}
                >
                  {isSubmitting ? 'Joining...' : 'Join Waitlist'}
                </Button>
              </form>
            )}
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
};