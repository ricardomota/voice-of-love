import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';
import { CheckCircle, ArrowLeft } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

interface SimpleWaitlistFormProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SimpleWaitlistForm: React.FC<SimpleWaitlistFormProps> = ({ isOpen, onClose }) => {
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    if (!email || !email.includes('@')) {
      toast.error('Please enter a valid email address');
      return;
    }

    setIsSubmitting(true);
    console.log('Submitting email:', email);

    try {
      // Use direct database insert with status 'pending' (working solution)
      const { data: insertData, error: insertError } = await supabase
        .from('waitlist')
        .insert({
          email: email.trim().toLowerCase(),
          full_name: 'Anonymous User',
          user_id: null,
          status: 'pending', // This status works!
          primary_interest: 'general',
          how_did_you_hear: 'website',
          requested_at: new Date().toISOString()
        });

      console.log('Database insert result:', insertData, 'Error:', insertError);
      
      if (!insertError) {
        console.log('Database insert successful');
        setIsSubmitted(true);
        toast.success('Successfully added to waitlist!');
      } else {
        // Handle duplicate constraint
        if (insertError.code === '23505') {
          toast.error('Email already registered');
          return;
        }
        
        // Try other working status values as fallback
        const workingStatuses = ['active', 'waiting', 'confirmed', 'new'];
        let success = false;
        
        for (const status of workingStatuses) {
          const { error: retryError } = await supabase
            .from('waitlist')
            .insert({
              email: email.trim().toLowerCase(),
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
        setIsSubmitted(true);
        toast.success('Successfully added to waitlist!');
      }
    } catch (error) {
      console.error('Network error:', error);
      toast.error('Network error. Please check your connection.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <Card className="w-full max-w-md">
        <CardHeader>
          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              className="p-1 h-auto"
            >
              <ArrowLeft className="w-4 h-4" />
            </Button>
            <CardTitle>
              {isSubmitted ? "🎉 You're on the list!" : "✨ Join the waitlist"}
            </CardTitle>
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
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="your@email.com"
                  required
                  disabled={isSubmitting}
                />
              </div>
              <Button 
                type="submit" 
                className="w-full"
                disabled={isSubmitting || !email.trim()}
              >
                {isSubmitting ? 'Joining...' : 'Join waitlist'}
              </Button>
            </form>
          )}
        </CardContent>
      </Card>
    </div>
  );
};