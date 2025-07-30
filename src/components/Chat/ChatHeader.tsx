import React, { memo } from 'react';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Brain, Sparkles } from 'lucide-react';
import { Person } from '@/types/person';
import { ConversationAnalysis } from '@/services/conversationAnalyzer';

interface ChatHeaderProps {
  person: Person;
  onBack: () => void;
  onShowInsights?: () => void;
  onAnalyzeAndLearn?: () => void;
  hasAnalysis?: boolean;
  isLearning?: boolean;
  canAnalyze?: boolean;
}

const ChatHeaderComponent: React.FC<ChatHeaderProps> = ({
  person,
  onBack,
  onShowInsights,
  onAnalyzeAndLearn,
  hasAnalysis = false,
  isLearning = false,
  canAnalyze = false
}) => {
  return (
    <div className="flex items-center justify-between p-4 border-b bg-background/95 backdrop-blur">
      <div className="flex items-center space-x-3">
        <Button variant="ghost" size="icon" onClick={onBack}>
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <div className="flex items-center space-x-3">
          {person.avatar && (
            <img 
              src={person.avatar} 
              alt={person.name}
              className="w-10 h-10 rounded-full object-cover"
            />
          )}
          <div>
            <h2 className="font-semibold">{person.name}</h2>
            <p className="text-sm text-muted-foreground">{person.relationship}</p>
          </div>
        </div>
      </div>
      
      <div className="flex items-center space-x-2">
        {hasAnalysis && onShowInsights && (
          <Button
            variant="outline"
            size="sm"
            onClick={onShowInsights}
            className="flex items-center gap-2"
          >
            <Brain className="h-4 w-4" />
            Insights
          </Button>
        )}
        
        {onAnalyzeAndLearn && (
          <Button
            variant="outline"
            size="sm"
            onClick={onAnalyzeAndLearn}
            disabled={!canAnalyze || isLearning}
            className="flex items-center gap-2"
          >
            {isLearning ? (
              <>
                <div className="w-4 h-4 border-2 border-current border-t-transparent animate-spin rounded-full" />
                Aprendendo
              </>
            ) : (
              <>
                <Sparkles className="h-4 w-4" />
                Analisar & Aprender
              </>
            )}
          </Button>
        )}
      </div>
    </div>
  );
};

export const ChatHeader = memo(ChatHeaderComponent);