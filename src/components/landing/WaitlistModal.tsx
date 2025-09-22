import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { useToast } from '@/hooks/use-toast';
import { Loader2, Mail } from 'lucide-react';
import { useLanguage } from '@/hooks/useLanguage';

interface WaitlistModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const getContent = (language: string) => {
  const content = {
    'pt-BR': {
      title: "Lista de Espera para Voz Personalizada",
      description: "Enviaremos um aviso assim que houver um slot disponível para criar sua voz com gravações reais.",
      nameLabel: "Nome completo",
      emailLabel: "Email",
      namePlaceholder: "Digite seu nome completo",
      emailPlaceholder: "Digite seu email",
      consentText: "Concordo em ser contatado por email sobre a disponibilidade.",
      submitButton: "Quero ser avisado",
      submittingButton: "Adicionando...",
      successTitle: "Pronto!",
      successMessage: "Você está na fila. Vamos avisar assim que houver vaga.",
      successButton: "Fechar",
      errorTitle: "Erro",
      errorMessage: "Ocorreu um erro ao adicionar você à lista. Tente novamente."
    },
    en: {
      title: "Custom Voice Waitlist",
      description: "We'll send you a notification as soon as a slot is available to create your voice with real recordings.",
      nameLabel: "Full name",
      emailLabel: "Email",
      namePlaceholder: "Enter your full name",
      emailPlaceholder: "Enter your email",
      consentText: "I agree to be contacted by email about availability.",
      submitButton: "Notify me",
      submittingButton: "Adding...",
      successTitle: "Done!",
      successMessage: "You're in the queue. We'll notify you as soon as there's an available slot.",
      successButton: "Close",
      errorTitle: "Error",
      errorMessage: "An error occurred while adding you to the list. Please try again."
    }
  };
  return content[language as keyof typeof content] || content.en;
};

export const WaitlistModal: React.FC<WaitlistModalProps> = ({ isOpen, onClose }) => {
  const { currentLanguage } = useLanguage();
  const content = getContent(currentLanguage);
  const { toast } = useToast();
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    consent: false
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name.trim() || !formData.email.trim() || !formData.consent) {
      toast({
        title: content.errorTitle,
        description: "Por favor, preencha todos os campos e aceite os termos.",
        variant: "destructive"
      });
      return;
    }

    setIsSubmitting(true);
    
    try {
      // Simulate API call - replace with actual implementation
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Track the waitlist submission
      if (typeof window !== 'undefined' && (window as any).gtag) {
        (window as any).gtag('event', 'waitlist_submit_success', {
          event_category: 'pricing',
          event_label: 'custom_voice_waitlist'
        });
      }
      
      setIsSuccess(true);
      
      toast({
        title: content.successTitle,
        description: content.successMessage,
      });
    } catch (error) {
      toast({
        title: content.errorTitle,
        description: content.errorMessage,
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    setFormData({ name: '', email: '', consent: false });
    setIsSuccess(false);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader className="space-y-3">
          <div className="mx-auto w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
            <Mail className="w-6 h-6 text-primary" />
          </div>
          <DialogTitle className="text-center">
            {isSuccess ? content.successTitle : content.title}
          </DialogTitle>
          <DialogDescription className="text-center">
            {isSuccess ? content.successMessage : content.description}
          </DialogDescription>
        </DialogHeader>
        
        {!isSuccess ? (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">{content.nameLabel}</Label>
              <Input
                id="name"
                type="text"
                placeholder={content.namePlaceholder}
                value={formData.name}
                onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="email">{content.emailLabel}</Label>
              <Input
                id="email"
                type="email"
                placeholder={content.emailPlaceholder}
                value={formData.email}
                onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                required
              />
            </div>
            
            <div className="flex items-center space-x-2">
              <Checkbox
                id="consent"
                checked={formData.consent}
                onCheckedChange={(checked) => 
                  setFormData(prev => ({ ...prev, consent: checked as boolean }))
                }
                required
              />
              <Label 
                htmlFor="consent" 
                className="text-sm text-muted-foreground leading-relaxed"
              >
                {content.consentText}
              </Label>
            </div>
            
            <Button 
              type="submit" 
              className="w-full" 
              disabled={isSubmitting || !formData.consent}
            >
              {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {isSubmitting ? content.submittingButton : content.submitButton}
            </Button>
          </form>
        ) : (
          <Button onClick={handleClose} className="w-full">
            {content.successButton}
          </Button>
        )}
      </DialogContent>
    </Dialog>
  );
};