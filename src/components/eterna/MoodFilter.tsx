// Step 9: Emotionally-Intelligent Retrieval - Mood-based filtering
import React from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Heart, Lightbulb, MessageCircle, BookOpen, RotateCcw } from 'lucide-react';

export type MoodType = 'comfort' | 'joy' | 'advice' | 'storytime';

interface MoodFilterProps {
  selectedMood?: MoodType;
  onMoodChange: (mood?: MoodType) => void;
  memoryCounts?: Record<MoodType, number>;
  className?: string;
}

export const MoodFilter: React.FC<MoodFilterProps> = ({
  selectedMood,
  onMoodChange,
  memoryCounts = { comfort: 0, joy: 0, advice: 0, storytime: 0 },
  className = ''
}) => {
  const moods: { type: MoodType; label: string; icon: React.ComponentType<any>; color: string }[] = [
    {
      type: 'comfort',
      label: 'Comfort',
      icon: Heart,
      color: 'bg-rose-100 text-rose-700 hover:bg-rose-200'
    },
    {
      type: 'joy',
      label: 'Joy',
      icon: Lightbulb,
      color: 'bg-yellow-100 text-yellow-700 hover:bg-yellow-200'
    },
    {
      type: 'advice',
      label: 'Advice',
      icon: MessageCircle,
      color: 'bg-blue-100 text-blue-700 hover:bg-blue-200'
    },
    {
      type: 'storytime',
      label: 'Storytime',
      icon: BookOpen,
      color: 'bg-purple-100 text-purple-700 hover:bg-purple-200'
    }
  ];

  return (
    <div className={`flex flex-wrap items-center gap-2 ${className}`}>
      <span className="text-sm font-medium text-muted-foreground mr-2">Filter by mood:</span>
      
      {/* Clear filter button */}
      {selectedMood && (
        <Button
          variant="outline"
          size="sm"
          onClick={() => onMoodChange(undefined)}
          className="h-8 px-3"
        >
          <RotateCcw className="h-3 w-3 mr-1" />
          All
        </Button>
      )}
      
      {/* Mood filter buttons */}
      {moods.map(({ type, label, icon: Icon, color }) => {
        const isSelected = selectedMood === type;
        const count = memoryCounts[type] || 0;
        
        return (
          <Button
            key={type}
            data-testid="filter-mood"
            variant={isSelected ? "default" : "outline"}
            size="sm"
            onClick={() => onMoodChange(isSelected ? undefined : type)}
            className={`h-8 px-3 ${!isSelected ? color : ''} flex items-center gap-2`}
          >
            <Icon className="h-3 w-3" />
            <span>{label}</span>
            {count > 0 && (
              <Badge 
                variant="secondary" 
                className="ml-1 px-1.5 py-0 text-xs h-4 min-w-[16px] flex items-center justify-center"
              >
                {count}
              </Badge>
            )}
          </Button>
        );
      })}
    </div>
  );
};

// Empty state component for when no memories match the mood filter
interface MoodEmptyStateProps {
  mood: MoodType;
  onRecordNew?: () => void;
}

export const MoodEmptyState: React.FC<MoodEmptyStateProps> = ({ mood, onRecordNew }) => {
  const moodLabels = {
    comfort: 'comfort',
    joy: 'joy', 
    advice: 'advice',
    storytime: 'storytime'
  };

  const suggestions = {
    comfort: 'Try recording a warm memory or sharing a moment of peace.',
    joy: 'Capture a moment of laughter or celebration!',
    advice: 'Share some wisdom or life lessons you\'ve learned.',
    storytime: 'Tell a favorite story or share an adventure.'
  };

  return (
    <div className="text-center py-12 px-4">
      <div className="mb-4 opacity-60">
        <Heart className="h-12 w-12 mx-auto text-muted-foreground" />
      </div>
      
      <h3 className="text-lg font-semibold mb-2">
        No '{moodLabels[mood]}' memories yet
      </h3>
      
      <p className="text-muted-foreground mb-6 max-w-md mx-auto">
        {suggestions[mood]}
      </p>
      
      <div className="flex flex-col sm:flex-row gap-3 justify-center items-center">
        <Button onClick={onRecordNew} className="px-6">
          Record a new memory
        </Button>
        
        <Button 
          variant="outline" 
          onClick={() => window.history.back()}
        >
          Try 'joy' or another mood
        </Button>
      </div>
    </div>
  );
};