import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Share2, Copy, Facebook, Twitter, MessageCircle } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { useToast } from '@/hooks/use-toast';

interface Props {
  message: string;
  isOpen: boolean;
  onClose: () => void;
}

const getContent = (language: string) => {
  const content = {
    en: {
      title: "Share this moment",
      subtitle: "Spread the magic of personalized AI memories",
      copyMessage: "Copy message",
      shareText: "I just created an amazing personalized voice message with Eterna! 🎙️✨ Try it yourself:",
      copied: "Copied!",
      whatsapp: "Share on WhatsApp",
      facebook: "Share on Facebook", 
      twitter: "Share on Twitter",
      copyLink: "Copy link",
      linkCopied: "Link copied!",
      tryEterna: "Try Eterna - AI Voice Memories",
    },
    'pt-BR': {
      title: "Compartilhe este momento",
      subtitle: "Espalhe a magia das memórias de IA personalizadas",
      copyMessage: "Copiar mensagem",
      shareText: "Acabei de criar uma mensagem de voz personalizada incrível com Eterna! 🎙️✨ Experimente você também:",
      copied: "Copiado!",
      whatsapp: "Compartilhar no WhatsApp",
      facebook: "Compartilhar no Facebook",
      twitter: "Compartilhar no Twitter", 
      copyLink: "Copiar link",
      linkCopied: "Link copiado!",
      tryEterna: "Experimente Eterna - Memórias de Voz IA",
    },
    es: {
      title: "Comparte este momento",
      subtitle: "Comparte la magia de los recuerdos de IA personalizados",
      copyMessage: "Copiar mensaje",
      shareText: "¡Acabo de crear un increíble mensaje de voz personalizado con Eterna! 🎙️✨ Pruébalo tú también:",
      copied: "¡Copiado!",
      whatsapp: "Compartir en WhatsApp",
      facebook: "Compartir en Facebook",
      twitter: "Compartir en Twitter",
      copyLink: "Copiar enlace", 
      linkCopied: "¡Enlace copiado!",
      tryEterna: "Prueba Eterna - Memorias de Voz IA",
    }
  };
  return content[language as keyof typeof content] || content.en;
};

export const SocialShare: React.FC<Props> = ({ message, isOpen, onClose }) => {
  const { currentLanguage } = useLanguage();
  const content = getContent(currentLanguage);
  const { toast } = useToast();
  const [copying, setCopying] = useState<'message' | 'link' | null>(null);

  const shareUrl = window.location.origin;
  const encodedMessage = encodeURIComponent(`"${message}"\n\n${content.shareText} ${shareUrl}`);
  const encodedUrl = encodeURIComponent(shareUrl);
  const encodedTitle = encodeURIComponent(content.tryEterna);

  const copyToClipboard = async (text: string, type: 'message' | 'link') => {
    setCopying(type);
    try {
      await navigator.clipboard.writeText(text);
      toast({
        title: type === 'message' ? content.copied : content.linkCopied,
        duration: 2000,
      });
    } catch (err) {
      // Fallback for older browsers
      const textArea = document.createElement('textarea');
      textArea.value = text;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);
      toast({
        title: type === 'message' ? content.copied : content.linkCopied,
        duration: 2000,
      });
    } finally {
      setTimeout(() => setCopying(null), 1000);
    }
  };

  const shareLinks = {
    whatsapp: `https://wa.me/?text=${encodedMessage}`,
    facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}&quote=${encodeURIComponent(message)}`,
    twitter: `https://twitter.com/intent/tweet?text=${encodeURIComponent(`"${message}"\n\n${content.shareText}`)}&url=${encodedUrl}`,
  };

  const openShare = (url: string) => {
    window.open(url, '_blank', 'width=600,height=400');
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Share2 className="w-5 h-5" />
            {content.title}
          </DialogTitle>
          <p className="text-sm text-muted-foreground">{content.subtitle}</p>
        </DialogHeader>

        <div className="space-y-4">
          <Card className="p-4 bg-muted/30">
            <p className="text-sm italic leading-relaxed">"{message}"</p>
          </Card>

          <div className="space-y-3">
            <Button
              variant="outline"
              className="w-full justify-start"
              onClick={() => copyToClipboard(message, 'message')}
              disabled={copying === 'message'}
            >
              <Copy className="w-4 h-4 mr-2" />
              {copying === 'message' ? content.copied : content.copyMessage}
            </Button>

            <div className="grid grid-cols-3 gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => openShare(shareLinks.whatsapp)}
                className="flex flex-col gap-1 h-16"
              >
                <MessageCircle className="w-4 h-4 text-green-600" />
                <span className="text-xs">{content.whatsapp.split(' ')[2]}</span>
              </Button>

              <Button
                variant="outline"
                size="sm"
                onClick={() => openShare(shareLinks.facebook)}
                className="flex flex-col gap-1 h-16"
              >
                <Facebook className="w-4 h-4 text-blue-600" />
                <span className="text-xs">{content.facebook.split(' ')[2]}</span>
              </Button>

              <Button
                variant="outline"
                size="sm"
                onClick={() => openShare(shareLinks.twitter)}
                className="flex flex-col gap-1 h-16"
              >
                <Twitter className="w-4 h-4 text-blue-400" />
                <span className="text-xs">{content.twitter.split(' ')[2]}</span>
              </Button>
            </div>

            <Button
              variant="outline"
              className="w-full justify-start"
              onClick={() => copyToClipboard(shareUrl, 'link')}
              disabled={copying === 'link'}
            >
              <Share2 className="w-4 h-4 mr-2" />
              {copying === 'link' ? content.linkCopied : content.copyLink}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};