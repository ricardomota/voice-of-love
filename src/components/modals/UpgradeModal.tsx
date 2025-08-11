import React from 'react';
import { X, Sparkles, MessageSquare, Mic, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { useLanguage } from '@/hooks/useLanguage';

interface UpgradeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onUpgrade: () => void;
  type?: 'messages' | 'tts' | 'general';
}

const getContent = (language: string, type: string) => {
  const content = {
    en: {
      title: "You've reached your limit.",
      body: "You've used all your messages or voice minutes for the month. Upgrade now to continue preserving and enjoying memories.",
      ctaPrimary: "Upgrade Now",
      ctaSecondary: "Maybe Later",
      features: {
        messages: "300 messages/month",
        voice: "15 minutes voice/month", 
        memories: "Unlimited memories",
        clone: "Personal voice clone"
      }
    },
    'pt-BR': {
      title: "Você atingiu seu limite.",
      body: "Você usou todas as suas mensagens ou minutos de voz do mês. Faça upgrade agora para continuar preservando e aproveitando memórias.",
      ctaPrimary: "Fazer Upgrade",
      ctaSecondary: "Talvez Depois",
      features: {
        messages: "300 mensagens/mês",
        voice: "15 minutos de voz/mês",
        memories: "Memórias ilimitadas", 
        clone: "Clone de voz personalizado"
      }
    },
    es: {
      title: "Has alcanzado tu límite.",
      body: "Has usado todos tus mensajes o minutos de voz del mes. Actualiza ahora para seguir preservando y disfrutando recuerdos.",
      ctaPrimary: "Actualizar Ahora",
      ctaSecondary: "Tal Vez Después",
      features: {
        messages: "300 mensajes/mes",
        voice: "15 minutos de voz/mes",
        memories: "Memorias ilimitadas",
        clone: "Clon de voz personal"
      }
    }
  };

  return content[language as keyof typeof content] || content.en;
};

export const UpgradeModal: React.FC<UpgradeModalProps> = ({
  isOpen,
  onClose,
  onUpgrade,
  type = 'general'
}) => {
  const { currentLanguage } = useLanguage();
  const content = getContent(currentLanguage, type);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md glass-card border-border/20">
        <DialogHeader className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="feature-icon w-12 h-12 bg-gradient-to-br from-purple-100 to-purple-50">
              <Sparkles className="w-6 h-6 text-primary" />
            </div>
            <button 
              onClick={onClose}
              className="hover-lift w-8 h-8 rounded-lg flex items-center justify-center hover:bg-gray-100"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
          
          <div className="text-center">
            <DialogTitle className="text-xl font-zilla font-medium italic mb-2">
              {content.title}
            </DialogTitle>
            <DialogDescription className="text-muted-foreground font-work">
              {content.body}
            </DialogDescription>
          </div>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="text-sm font-semibold text-center mb-4 alzheimer-badge mx-auto">
            Upgrade to Paid Plan - R$29/month
          </div>
          
          <div className="grid grid-cols-2 gap-3">
            <div className="flex items-center gap-2 text-sm glass-card p-3 hover-lift">
              <MessageSquare className="w-4 h-4 text-primary" />
              {content.features.messages}
            </div>
            <div className="flex items-center gap-2 text-sm glass-card p-3 hover-lift">
              <Mic className="w-4 h-4 text-primary" />
              {content.features.voice}
            </div>
            <div className="flex items-center gap-2 text-sm glass-card p-3 hover-lift">
              <Clock className="w-4 h-4 text-primary" />
              {content.features.memories}
            </div>
            <div className="flex items-center gap-2 text-sm glass-card p-3 hover-lift">
              <Sparkles className="w-4 h-4 text-primary" />
              {content.features.clone}
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-4">
          <button 
            onClick={onUpgrade}
            className="btn-primary btn-large hover-lift hover-glow w-full px-8 py-4 rounded-xl font-semibold text-lg"
          >
            {content.ctaPrimary}
          </button>
          <button 
            onClick={onClose}
            className="btn-secondary hover-lift w-full px-6 py-3 rounded-xl font-semibold"
          >
            {content.ctaSecondary}
          </button>
        </div>
      </DialogContent>
    </Dialog>
  );
};