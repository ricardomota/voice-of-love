import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { DemoState } from '../types';
import { generatePreviewText } from '../generator';
import { useLanguage } from '@/contexts/LanguageContext';
import { Play, RefreshCcw, Share2 } from 'lucide-react';
import { SocialShare } from '../../SocialShare';

interface Props {
  state: DemoState;
  setState: (s: Partial<DemoState>) => void;
  onComplete: () => void;
}

function getSamplePath(timbre?: string, age?: string) {
  if (!timbre || !age) return '';
  const t = timbre.toLowerCase();
  const a = age.toLowerCase();
  return `/demo-voices/${t}-${a}.mp3`;
}

const getContent = (language: string) => {
  const content = {
    en: {
      title: "Preview",
      subtitle: "This is a brief demo using generic data. In the app you'll personalize with real memories.",
      playButton: "Play",
      regenerateButton: "Regenerate",
      shareButton: "Share",
      ctaButton: "Create your first Memory (Free)",
      ctaSubtext: "Includes 5 minutes of voice generation.",
      seePlans: "See Plans",
      continueExploring: "Continue exploring the site"
    },
    'pt-BR': {
      title: "Visualizar",
      subtitle: "Esta é uma breve demonstração usando dados genéricos. No app você personalizará com memórias reais.",
      playButton: "Reproduzir",
      regenerateButton: "Regenerar",
      shareButton: "Compartilhar",
      ctaButton: "Crie sua primeira Memória (Grátis)",
      ctaSubtext: "Inclui 5 minutos de geração de voz.",
      seePlans: "Ver Planos",
      continueExploring: "Continue explorando o site"
    },
    es: {
      title: "Vista previa",
      subtitle: "Esta es una breve demostración usando datos genéricos. En la app personalizarás con recuerdos reales.",
      playButton: "Reproducir",
      regenerateButton: "Regenerar",
      shareButton: "Compartir",
      ctaButton: "Crea tu primer Recuerdo (Gratis)",
      ctaSubtext: "Incluye 5 minutos de generación de voz.",
      seePlans: "Ver Planes",
      continueExploring: "Continúa explorando el sitio"
    }
  };
  return content[language as keyof typeof content] || content.en;
};

export const StepPreview: React.FC<Props> = ({ state, setState, onComplete }) => {
  const [sampleError, setSampleError] = useState(false);
  const [showShare, setShowShare] = useState(false);
  const { currentLanguage } = useLanguage();
  const content = getContent(currentLanguage);
  const { primary, followUp, voiceLanguage } = useMemo(() => generatePreviewText(state, currentLanguage), [state, currentLanguage]);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    setState({ preview: { primary, followUp } });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [primary, followUp]);

  const speakLocal = () => {
    const utter = new SpeechSynthesisUtterance(primary);
    // Ensure utterance language matches selection
    try {
      utter.lang = voiceLanguage;
    } catch {}
    // try to pick a matching voice for the locale
    const voices = window.speechSynthesis.getVoices();
    const prefGender = state.output.voice?.timbre === 'Masculine' ? 'male' : state.output.voice?.timbre === 'Feminine' ? 'female' : '';
    const prefAge = state.output.voice?.age === 'Senior' ? 'old' : state.output.voice?.age === 'Young' ? 'young' : '';
    const langPrefix = (voiceLanguage || 'en-US').toLowerCase().split('-')[0];
    const locale = (voiceLanguage || 'en-US').toLowerCase();
    const match =
      voices.find(v => v.lang?.toLowerCase() === locale && ((prefGender && v.name.toLowerCase().includes(prefGender)) || (prefAge && v.name.toLowerCase().includes(prefAge)))) ||
      voices.find(v => v.lang?.toLowerCase() === locale) ||
      voices.find(v => v.lang?.toLowerCase().startsWith(langPrefix)) ||
      voices[0];
    if (match) utter.voice = match;
    utter.rate = state.style.pace === 'Fast' ? 1.15 : state.style.pace === 'Slow' ? 0.9 : 1;
    speechSynthesis.cancel();
    speechSynthesis.speak(utter);
  };

  const play = () => {
    if (state.output.type === 'voice') {
      // For non-English locales, use local TTS to respect language
      if (voiceLanguage !== 'en-US') {
        speakLocal();
        return;
      }
      const src = getSamplePath(state.output.voice?.timbre, state.output.voice?.age);
      if (!src || sampleError) {
        speakLocal();
        return;
      }
      if (!audioRef.current) audioRef.current = new Audio(src);
      audioRef.current.currentTime = 0;
      audioRef.current.play().catch(() => speakLocal());
    }
  };

  const regenerate = () => {
    const { primary: p, followUp: f } = generatePreviewText(state, currentLanguage);
    setState({ preview: { primary: p, followUp: f } });
  };

  const canContinue = Boolean(primary);

  return (
    <div className="space-y-6">
      <div className="text-center space-y-2">
        <h3 className="text-2xl md:text-3xl font-serif">{content.title}</h3>
        <p className="text-muted-foreground text-sm">{content.subtitle}</p>
      </div>

      <Card className="p-5 space-y-4">
        <p className="text-lg leading-relaxed">{primary}</p>
        <p className="text-muted-foreground">{followUp}</p>
        {state.output.type === 'voice' && (
          <div className="pt-2">
            <Button onClick={play} className="flex items-center gap-2" aria-label={content.playButton}>
              <Play className="w-4 h-4" /> {content.playButton}
            </Button>
            <audio src={getSamplePath(state.output.voice?.timbre, state.output.voice?.age)} onError={() => setSampleError(true)} hidden />
          </div>
        )}
      </Card>

      <div className="flex flex-wrap gap-3">
        <Button variant="outline" onClick={regenerate} className="flex items-center gap-2">
          <RefreshCcw className="w-4 h-4" /> {content.regenerateButton}
        </Button>
        <Button variant="outline" onClick={() => setShowShare(true)} className="flex items-center gap-2">
          <Share2 className="w-4 h-4" /> {content.shareButton}
        </Button>
      </div>

      <div className="pt-2 text-center space-y-2">
        <Button onClick={onComplete} className="min-w-[240px] h-12 text-base">{content.ctaButton}</Button>
        <div className="text-xs text-muted-foreground">{content.ctaSubtext}</div>
        <div className="flex justify-center gap-4 text-sm">
          <a href="/pricing#pro" className="underline">{content.seePlans}</a>
          <button className="underline" onClick={() => (document.activeElement as HTMLElement)?.blur()}>{content.continueExploring}</button>
        </div>
      </div>

      <SocialShare 
        message={primary}
        isOpen={showShare}
        onClose={() => setShowShare(false)}
      />
    </div>
  );
};
