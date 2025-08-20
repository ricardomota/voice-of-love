import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { DemoState, Relationship } from '../types';

interface Props {
  state: DemoState;
  setState: (s: Partial<DemoState>) => void;
}

const relationships: Relationship[] = ['Mom','Dad','Grandma','Grandpa','Partner','Friend','Other'];

export const StepRelationship: React.FC<Props> = ({ state, setState }) => {
  return (
    <div className="space-y-6">
      <div className="text-center space-y-2">
        <h3 className="text-2xl md:text-3xl font-serif">Who should Eterna speak as?</h3>
        <p className="text-muted-foreground">This helps us set tone and word choices.</p>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {relationships.map((rel) => (
          <Button
            key={rel}
            variant={state.relationship === rel ? 'default' : 'outline'}
            className="h-12"
            onClick={() => setState({ relationship: rel })}
            aria-pressed={state.relationship === rel}
          >
            {rel}
          </Button>
        ))}
      </div>

      <Card className="p-4 md:p-5">
        <label htmlFor="demo-name" className="block text-sm font-medium mb-2">What should they call you? (optional)</label>
        <Input
          id="demo-name"
          placeholder="e.g., my dear, sweetheart, John, honey..."
          value={state.name || ''}
          onChange={(e) => setState({ name: e.target.value })}
          aria-label="What they should call you"
        />
        <p className="text-xs text-muted-foreground mt-2">How this person addressed you - a nickname, term of endearment, or your name</p>
      </Card>
    </div>
  );
};
