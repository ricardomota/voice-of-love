import React from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { DemoState, Warmth, Formality, Energy, Pace } from '../wizard/types';
import { generatePreviewText } from '../wizard/generator';

interface Props {
  state: DemoState;
  setState: (s: Partial<DemoState>) => void;
}

const groups: { key: keyof DemoState['style']; title: string; options: string[] }[] = [
  { key: 'warmth', title: 'Warmth', options: ['Gentle','Balanced','Direct'] },
  { key: 'formality', title: 'Formality', options: ['Casual','Neutral','Polite'] },
  { key: 'energy', title: 'Energy', options: ['Calm','Balanced','Lively'] },
  { key: 'pace', title: 'Pace', options: ['Slow','Normal','Fast'] },
];

export const StepStyle: React.FC<Props> = ({ state, setState }) => {
  const { primary } = generatePreviewText(state);

  return (
    <div className="space-y-6">
      <div className="text-center space-y-2">
        <h3 className="text-2xl md:text-3xl font-serif">Choose how they sound</h3>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {groups.map((g) => (
          <Card key={g.key as string} className="p-4 space-y-3">
            <div className="text-sm font-medium">{g.title}</div>
            <div className="flex gap-2 flex-wrap">
              {g.options.map((opt) => {
                const active = state.style[g.key] === opt;
                return (
                  <Button
                    key={opt}
                    size="sm"
                    variant={active ? 'default' : 'outline'}
                    onClick={() => setState({ style: { ...state.style, [g.key]: opt as any } })}
                    aria-pressed={active}
                    className="rounded-full"
                  >
                    {opt}
                  </Button>
                );
              })}
            </div>
          </Card>
        ))}
      </div>

      <Card className="p-4">
        <div className="text-sm text-muted-foreground mb-2">Live preview</div>
        <p className="text-base md:text-lg">{primary}</p>
      </Card>
    </div>
  );
};
