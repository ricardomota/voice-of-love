import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { CheckCircle, ArrowLeft } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

interface WaitlistFormBProps {
  isOpen: boolean;
  onClose: () => void;
}

export const WaitlistFormB: React.FC<WaitlistFormBProps> = ({ isOpen, onClose }) => {
  const [formData, setFormData] = useState({
    email: '',
    fullName: '',
    primaryInterest: 'general'
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    if (!formData.email || !formData.email.includes('@')) {
      toast({
        title: "Invalid email",
        description: "Please enter a valid email address",
        variant: "destructive"
      });
      return;
    }

    setIsSubmitting(true);

    try {
      const { error } = await supabase
        .from('waitlist')
        .insert({
          email: formData.email.trim().toLowerCase(),
          full_name: formData.fullName || 'Anonymous User',
          user_id: null,
          status: 'pending',
          primary_interest: formData.primaryInterest,
          how_did_you_hear: 'website',
          requested_at: new Date().toISOString()
        });

      if (!error) {
        setIsSubmitted(true);
        toast({
          title: "🎉 Welcome to the list!",
          description: "You've been successfully added!",
        });
      } else if (error.code === '23505') {
        toast({
          title: "Email already registered",
          description: "This email is already on our waitlist.",
          variant: "destructive"
        });
      } else {
        throw error;
      }
    } catch (error: any) {
      console.error('Waitlist signup error:', error);
      toast({
        title: "Failed to join waitlist",
        description: "Please try again in a few moments.",
        variant: "destructive"
      });
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
                  type="text"
                  value={formData.fullName}
                  onChange={(e) => setFormData(prev => ({ ...prev, fullName: e.target.value }))}
                  placeholder="Full Name (optional)"
                  disabled={isSubmitting}
                />
              </div>
              <div>
                <Input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                  placeholder="your@email.com"
                  required
                  disabled={isSubmitting}
                />
              </div>
              <Button 
                type="submit" 
                className="w-full"
                disabled={isSubmitting || !formData.email.trim()}
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