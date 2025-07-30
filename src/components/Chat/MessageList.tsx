import React, { memo, useRef, useEffect } from 'react';
import { MessageBubble } from '@/components/ui/message-bubble';
import { TypingIndicator } from '@/components/ui/typing-indicator';
import { SuggestedMessages } from '@/components/SuggestedMessages';
import { Message } from '@/types/person';

interface MessageListProps {
  messages: Message[];
  isTyping: boolean;
  showSuggestions: boolean;
  personName: string;
  personAvatar?: string;
  onSelectSuggestion: (message: string) => void;
}

const MessageListComponent: React.FC<MessageListProps> = ({
  messages,
  isTyping,
  showSuggestions,
  personName,
  personAvatar,
  onSelectSuggestion
}) => {
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  return (
    <div className="flex-1 overflow-y-auto p-4 space-y-4">
      {messages.map((message) => (
        <MessageBubble
          key={message.id}
          content={message.content}
          isUser={message.isUser}
          personName={personName}
          personAvatar={personAvatar}
        />
      ))}
      
      {isTyping && <TypingIndicator />}
      
      {showSuggestions && (
        <SuggestedMessages onSelectMessage={onSelectSuggestion} />
      )}

      <div ref={messagesEndRef} />
    </div>
  );
};

export const MessageList = memo(MessageListComponent);