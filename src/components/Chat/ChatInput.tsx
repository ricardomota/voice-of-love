import React, { memo, KeyboardEvent } from 'react';
import { Button } from '@/components/ui/button';
import { InputWithVoice } from '@/components/ui/input-with-voice';
import { Send } from 'lucide-react';

interface ChatInputProps {
  value: string;
  onChange: (value: string) => void;
  onSend: (message: string) => void;
  onVoiceTranscription?: (transcript: string) => void;
  placeholder: string;
  disabled?: boolean;
}

const ChatInputComponent: React.FC<ChatInputProps> = ({
  value,
  onChange,
  onSend,
  onVoiceTranscription,
  placeholder,
  disabled = false
}) => {
  const handleKeyPress = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      onSend(value);
    }
  };

  const handleVoiceTranscription = (transcript: string) => {
    if (onVoiceTranscription) {
      onVoiceTranscription(transcript);
    } else {
      onChange(transcript);
      onSend(transcript);
    }
  };

  return (
    <div className="p-4 border-t bg-background/95 backdrop-blur">
      <div className="flex items-center space-x-2">
        <div className="flex-1 relative">
          <InputWithVoice
            value={value}
            onChange={(e) => onChange(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder={placeholder}
            disabled={disabled}
            onVoiceTranscription={handleVoiceTranscription}
          />
        </div>
        
        <Button 
          size="icon"
          onClick={() => onSend(value)}
          disabled={!value.trim() || disabled}
        >
          <Send className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};

export const ChatInput = memo(ChatInputComponent);