import React from 'react';
import { Card } from '@/components/ui/card';
import { DemoState, Topic } from '../wizard/types';

interface Props {
  state: DemoState;
  setState: (s: Partial<DemoState>) => void;
}

const topics: Topic[] = [
  'Birthday message',
  'Words of encouragement',
  'Sunday lunch memory',
  'Bedtime story',
  'Gentle reminder',
  'A funny story',
];

export const StepTopic: React.FC<Props> = ({ state, setState }) => {
  return (
    <div className="space-y-6">
      <div className="text-center space-y-2">
        <h3 className="text-2xl md:text-3xl font-serif">Pick a moment to preview</h3>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {topics.map((t) => {
          const active = state.topic === t;
          return (
            <Card
              key={t}
              role="button"
              tabIndex={0}
              onClick={() => setState({ topic: t })}
              onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') setState({ topic: t }); }}
              className={`p-4 md:p-5 cursor-pointer transition-all ${active ? 'ring-2 ring-primary bg-primary/10' : 'hover:bg-muted/50'}`}
            >
              <div className="font-medium">{t}</div>
              <div className="text-sm text-muted-foreground">Preview a short message about this.</div>
            </Card>
          );
        })}
      </div>
    </div>
  );
};
