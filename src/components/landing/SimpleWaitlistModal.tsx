import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { CheckCircle, ArrowLeft } from 'lucide-react';
import { motion } from 'framer-motion';
import { useLanguage } from '@/hooks/useLanguage';

interface SimpleWaitlistModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SimpleWaitlistModal: React.FC<SimpleWaitlistModalProps> = ({ isOpen, onClose }) => {
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
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
    },
    'pt-BR': {
      title: "Entrar na lista de espera",
      subtitle: "Seja o primeiro a saber quando o Eterna for lançado",
      emailLabel: "Endereço de email",
      emailPlaceholder: "seu@email.com",
      submit: "Entrar na lista",
      submitting: "Entrando...",
      success: {
        title: "Você está na lista!",
        subtitle: "Notificaremos você quando o Eterna estiver pronto"
      },
      back: "Voltar"
    }
  };

  const text = content[currentLanguage as keyof typeof content] || content.en;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email) {
      toast.error(currentLanguage === 'pt-BR' ? 'Email é obrigatório' : 'Email is required');
      return;
    }

    setIsSubmitting(true);

    try {
      const { error } = await supabase
        .from('waitlist')
        .insert({
          email,
          full_name: '',
          user_id: crypto.randomUUID()
        });

      if (error) {
        if (error.code === '23505') {
          toast.error(currentLanguage === 'pt-BR' ? 'Este email já está na lista' : 'This email is already on the list');
        } else {
          throw error;
        }
      } else {
        setIsSubmitted(true);
        toast.success(currentLanguage === 'pt-BR' ? 'Adicionado à lista!' : 'Added to waitlist!');
      }
    } catch (error) {
      console.error('Error submitting to waitlist:', error);
      toast.error(currentLanguage === 'pt-BR' ? 'Erro ao cadastrar' : 'Error signing up');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    setEmail('');
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
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {currentLanguage === 'pt-BR' 
                    ? 'Obrigado por se juntar! Entraremos em contato em breve.'
                    : 'Thanks for joining! We\'ll be in touch soon.'
                  }
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <Label htmlFor="email" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    {text.emailLabel}
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder={text.emailPlaceholder}
                    required
                    className="mt-1"
                  />
                </div>

                <Button 
                  type="submit" 
                  className="w-full bg-black hover:bg-gray-800 text-white dark:bg-white dark:text-black dark:hover:bg-gray-100"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? text.submitting : text.submit}
                </Button>
              </form>
            )}
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
};