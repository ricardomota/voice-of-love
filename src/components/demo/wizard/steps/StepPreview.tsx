import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { DemoState } from '../wizard/types';
import { generatePreviewText } from '../wizard/generator';
import { Play, RefreshCcw } from 'lucide-react';

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

export const StepPreview: React.FC<Props> = ({ state, setState, onComplete }) => {
  const [sampleError, setSampleError] = useState(false);
  const { primary, followUp } = useMemo(() => generatePreviewText(state), [state]);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    setState({ preview: { primary, followUp } });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [primary, followUp]);

  const speakLocal = () => {
    const utter = new SpeechSynthesisUtterance(primary);
    // try to pick a matching voice
    const voices = window.speechSynthesis.getVoices();
    const prefGender = state.output.voice?.timbre === 'Masculine' ? 'male' : state.output.voice?.timbre === 'Feminine' ? 'female' : '';
    const prefAge = state.output.voice?.age === 'Senior' ? 'old' : state.output.voice?.age === 'Young' ? 'young' : '';
    const match = voices.find(v => v.lang.startsWith('en') && (
      (prefGender && v.name.toLowerCase().includes(prefGender)) || (prefAge && v.name.toLowerCase().includes(prefAge))
    )) || voices.find(v => v.lang.startsWith('en')) || voices[0];
    if (match) utter.voice = match;
    utter.rate = state.style.pace === 'Fast' ? 1.15 : state.style.pace === 'Slow' ? 0.9 : 1;
    speechSynthesis.cancel();
    speechSynthesis.speak(utter);
  };

  const play = () => {
    if (state.output.type === 'voice') {
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
    const { primary: p, followUp: f } = generatePreviewText(state);
    setState({ preview: { primary: p, followUp: f } });
  };

  const canContinue = Boolean(primary);

  return (
    <div className="space-y-6">
      <div className="text-center space-y-2">
        <h3 className="text-2xl md:text-3xl font-serif">Preview</h3>
        <p className="text-muted-foreground text-sm">This is a brief demo using generic data. In the app you’ll personalize with real memories.</p>
      </div>

      <Card className="p-5 space-y-4">
        <p className="text-lg leading-relaxed">{primary}</p>
        <p className="text-muted-foreground">{followUp}</p>
        {state.output.type === 'voice' && (
          <div className="pt-2">
            <Button onClick={play} className="flex items-center gap-2" aria-label="Play voice sample">
              <Play className="w-4 h-4" /> Play
            </Button>
            <audio src={getSamplePath(state.output.voice?.timbre, state.output.voice?.age)} onError={() => setSampleError(true)} hidden />
          </div>
        )}
      </Card>

      <div className="flex flex-wrap gap-3">
        <Button variant="outline" onClick={regenerate} className="flex items-center gap-2">
          <RefreshCcw className="w-4 h-4" /> Regenerate
        </Button>
      </div>

      <div className="pt-2 text-center space-y-2">
        <Button onClick={onComplete} className="min-w-[240px] h-12 text-base">Create your first Memory (Free)</Button>
        <div className="text-xs text-muted-foreground">Includes 5 minutes of voice generation.</div>
        <div className="flex justify-center gap-4 text-sm">
          <a href="/pricing#pro" className="underline">See Plans</a>
          <button className="underline" onClick={() => (document.activeElement as HTMLElement)?.blur()}>Continue exploring the site</button>
        </div>
      </div>
    </div>
  );
};
