import React from 'react';
import { motion } from 'framer-motion';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Heart, Sparkles, MessageCircle, Volume2 } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

interface Props {
  isVisible: boolean;
  onInteract: () => void;
}

const getContent = (language: string) => {
  const content = {
    en: {
      surprise: "✨ Surprise me!",
      interact: "Try these interactions",
      voice: "🎵 Listen",
      like: "❤️ Love this",
      share: "📤 Share",
      more: "💭 Tell me more"
    },
    'pt-BR': {
      surprise: "✨ Me surpreenda!",
      interact: "Experimente essas interações",
      voice: "🎵 Escutar",
      like: "❤️ Adorei isso",
      share: "📤 Compartilhar",
      more: "💭 Conte mais"
    },
    es: {
      surprise: "✨ ¡Sorpréndeme!",
      interact: "Prueba estas interacciones",
      voice: "🎵 Escuchar",
      like: "❤️ Me encanta",
      share: "📤 Compartir",
      more: "💭 Cuéntame más"
    }
  };
  return content[language as keyof typeof content] || content.en;
};

export const StepMicroInteractions: React.FC<Props> = ({ isVisible, onInteract }) => {
  const { currentLanguage } = useLanguage();
  const content = getContent(currentLanguage);

  if (!isVisible) return null;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.8 }}
      transition={{ duration: 0.4, type: "spring" }}
      className="fixed bottom-20 right-4 z-50"
    >
      <Card className="p-3 bg-card/95 backdrop-blur-sm border-primary/20 shadow-lg">
        <div className="text-xs text-muted-foreground mb-2">{content.interact}</div>
        <div className="flex gap-2">
          <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
            <Button
              size="sm"
              variant="ghost"
              onClick={onInteract}
              className="h-8 w-8 p-0 hover:bg-primary/10"
            >
              <Volume2 size={14} />
            </Button>
          </motion.div>
          <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
            <Button
              size="sm"
              variant="ghost"
              onClick={onInteract}
              className="h-8 w-8 p-0 hover:bg-primary/10"
            >
              <Heart size={14} />
            </Button>
          </motion.div>
          <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
            <Button
              size="sm"
              variant="ghost"
              onClick={onInteract}
              className="h-8 w-8 p-0 hover:bg-primary/10"
            >
              <MessageCircle size={14} />
            </Button>
          </motion.div>
          <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
            <Button
              size="sm"
              variant="ghost"
              onClick={onInteract}
              className="h-8 w-8 p-0 hover:bg-primary/10"
            >
              <Sparkles size={14} />
            </Button>
          </motion.div>
        </div>
      </Card>
    </motion.div>
  );
};