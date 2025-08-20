import React from 'react';
import { Card } from '@/components/ui/card';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { DemoState, OutputType, Timbre, Age } from '../types';
import { useLanguage } from '@/contexts/LanguageContext';

interface Props {
  state: DemoState;
  setState: (s: Partial<DemoState>) => void;
}

const timbres: Timbre[] = ['Feminine','Masculine','Neutral'];
const ages: Age[] = ['Young','Adult','Senior'];

const getContent = (language: string) => {
  const content = {
    en: {
      title: "Preview format",
      textOnly: "Text only (instant)",
      voiceSample: "Short voice sample (~5s)",
      aiDisclaimer: "AI voice, not a real person.",
      timbre: "Timbre",
      age: "Age",
      timbres: {
        'Feminine': 'Feminine',
        'Masculine': 'Masculine', 
        'Neutral': 'Neutral'
      },
      ages: {
        'Young': 'Young',
        'Adult': 'Adult',
        'Senior': 'Senior'
      }
    },
    'pt-BR': {
      title: "Formato de visualização",
      textOnly: "Apenas texto (instantâneo)",
      voiceSample: "Amostra de voz curta (~5s)",
      aiDisclaimer: "Voz de IA, não uma pessoa real.",
      timbre: "Timbre",
      age: "Idade",
      timbres: {
        'Feminine': 'Feminino',
        'Masculine': 'Masculino',
        'Neutral': 'Neutro'
      },
      ages: {
        'Young': 'Jovem',
        'Adult': 'Adulto',
        'Senior': 'Idoso'
      }
    },
    es: {
      title: "Formato de vista previa",
      textOnly: "Solo texto (instantáneo)",
      voiceSample: "Muestra de voz corta (~5s)",
      aiDisclaimer: "Voz de IA, no una persona real.",
      timbre: "Timbre",
      age: "Edad",
      timbres: {
        'Feminine': 'Femenino',
        'Masculine': 'Masculino',
        'Neutral': 'Neutro'
      },
      ages: {
        'Young': 'Joven',
        'Adult': 'Adulto',
        'Senior': 'Mayor'
      }
    }
  };
  return content[language as keyof typeof content] || content.en;
};

export const StepOutput: React.FC<Props> = ({ state, setState }) => {
  const { currentLanguage } = useLanguage();
  const content = getContent(currentLanguage);
  const isVoice = state.output.type === 'voice';

  return (
    <div className="space-y-6">
      <div className="text-center space-y-2">
        <h3 className="text-2xl md:text-3xl font-serif">{content.title}</h3>
      </div>

      <Card className="p-4">
        <RadioGroup
          value={state.output.type}
          onValueChange={(v) => setState({ output: { type: v as OutputType, voice: v === 'voice' ? (state.output.voice || { timbre: 'Feminine', age: 'Adult' }) : undefined } })}
          className="grid grid-cols-1 sm:grid-cols-2 gap-3"
          aria-label={content.title}
        >
          <div className="flex items-center space-x-2 p-3 rounded-lg border">
            <RadioGroupItem value="text" id="out-text" />
            <Label htmlFor="out-text" className="cursor-pointer">{content.textOnly}</Label>
          </div>
          <div className="flex items-center space-x-2 p-3 rounded-lg border">
            <RadioGroupItem value="voice" id="out-voice" />
            <Label htmlFor="out-voice" className="cursor-pointer">{content.voiceSample}</Label>
          </div>
        </RadioGroup>
        <p className="text-xs text-muted-foreground mt-2">{content.aiDisclaimer}</p>
      </Card>

      {isVoice && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Card className="p-4">
            <div className="text-sm font-medium mb-2">{content.timbre}</div>
            <div className="flex gap-2 flex-wrap">
              {timbres.map((t) => (
                <button
                  key={t}
                  className={`px-3 py-2 rounded-full border text-sm ${state.output.voice?.timbre === t ? 'bg-primary text-primary-foreground' : 'hover:bg-muted'}`}
                  onClick={() => setState({ output: { ...state.output, voice: { ...(state.output.voice || { age: 'Adult', timbre: t }), timbre: t } } })}
                >
                  {content.timbres[t]}
                </button>
              ))}
            </div>
          </Card>
          <Card className="p-4">
            <div className="text-sm font-medium mb-2">{content.age}</div>
            <div className="flex gap-2 flex-wrap">
              {ages.map((a) => (
                <button
                  key={a}
                  className={`px-3 py-2 rounded-full border text-sm ${state.output.voice?.age === a ? 'bg-primary text-primary-foreground' : 'hover:bg-muted'}`}
                  onClick={() => setState({ output: { ...state.output, voice: { ...(state.output.voice || { timbre: 'Feminine', age: a }), age: a } } })}
                >
                  {content.ages[a]}
                </button>
              ))}
            </div>
          </Card>
        </div>
      )}
    </div>
  );
};
