import React, { useState, useEffect, useRef } from 'react';
import { ArrowLeft, Send, Mic, Brain, Sparkles, Volume2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { InputWithVoice } from '@/components/ui/input-with-voice';
import { MessageBubble } from '@/components/ui/message-bubble';
import { TypingIndicator } from '@/components/ui/typing-indicator';
import { SuggestedMessages } from '@/components/SuggestedMessages';
import { ConversationInsights } from '@/components/ConversationInsights';
import { AudioPlayer } from '@/components/ui/audio-player';
import { UsageBar } from '@/components/ui/usage-bar';
import { UpgradeModal } from '@/components/modals/UpgradeModal';
import { useChat } from '@/hooks/useChat';
import { useTTS } from '@/hooks/useTTS';
import { useUsageTracking } from '@/hooks/useUsageTracking';
import { useLanguage } from '@/hooks/useLanguage';
import { Person } from '@/types/person';
import { useToast } from '@/hooks/use-toast';

interface ChatProps {
  person: Person;
  onBack: () => void;
}

export const Chat: React.FC<ChatProps> = ({ person, onBack }) => {
  const { currentLanguage } = useLanguage();
  const { toast } = useToast();
  const {
    messages,
    inputValue,
    setInputValue,
    isTyping,
    showInsights,
    setShowInsights,
    currentAnalysis,
    messageCount,
    isLearning,
    updatedPerson,
    generateAIResponse,
    analyzeAndLearn
  } = useChat(person);

  const { generateSpeech, isGenerating } = useTTS();
  const { usage, isLoading: usageLoading, refreshUsage, canSendMessage, canUseTTS } = useUsageTracking();
  
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);
  const [currentAudio, setCurrentAudio] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSendMessage = async (content: string) => {
    if (!content.trim()) return;

    if (!canSendMessage) {
      setShowUpgradeModal(true);
      return;
    }

    try {
      const prompt = generatePersonalizedPrompt();
      const aiResponse = await generateAIResponse(prompt, content);
      
      // Refresh usage after sending message
      refreshUsage();

      // Generate TTS for AI response if user has quota
      if (canUseTTS && aiResponse) {
        try {
          const audioResult = await generateSpeech(aiResponse, {
            language: currentLanguage === 'pt-BR' ? 'pt' : currentLanguage === 'es' ? 'es' : 'en'
          });
          
          if (audioResult?.audioUrl) {
            setCurrentAudio(audioResult.audioUrl);
          }
        } catch (ttsError) {
          if (ttsError instanceof Error && ttsError.message === 'TTS_LIMIT_REACHED') {
            setShowUpgradeModal(true);
          } else {
            console.error('TTS Error:', ttsError);
          }
        }
      }

      // Analyze and learn periodically
      if ((messageCount + 1) % 3 === 0) {
        await analyzeAndLearn(messages);
      }

    } catch (error) {
      console.error('Error sending message:', error);
      toast({
        title: "Error sending message",
        description: "Please try again.",
        variant: "destructive",
      });
    }
  };

  const generatePersonalizedPrompt = () => {
    const currentPerson = updatedPerson;
    const memoriesText = currentPerson.memories.length > 0 
      ? currentPerson.memories.map((m, index) => `${index + 1}. ${m.text}`).join('\n')
      : 'Still no shared memories between us.';
      
    const personalityText = currentPerson.personality.length > 0 
      ? currentPerson.personality.join(', ') 
      : 'unique personality';
      
    const phrasesText = currentPerson.commonPhrases.length > 0
      ? currentPerson.commonPhrases.join('; ') 
      : '';
      
    const valuesText = currentPerson.values && currentPerson.values.length > 0 
      ? currentPerson.values.join(', ') 
      : '';
      
    const topicsText = currentPerson.topics && currentPerson.topics.length > 0 
      ? currentPerson.topics.join(', ') 
      : '';

    const howTheyCalledYou = currentPerson.howTheyCalledYou || 'you';
    
    const nameInstruction = currentPerson.howTheyCalledYou && currentPerson.howTheyCalledYou.includes(',')
      ? `IMPORTANT: You have several options for what to call me: ${howTheyCalledYou}. CHOOSE ONLY ONE name per message, alternating between them naturally. NEVER use all names at once.`
      : `Use "${howTheyCalledYou}" to address the user`;

    const recentMessages = messages.slice(-6).map(m => 
      `${m.isUser ? 'User' : currentPerson.name}: ${m.content}`
    ).join('\n');

    return `You are ${currentPerson.name}, ${currentPerson.relationship}. Be authentic, natural and AVOID REPETITIONS.

UNIQUE PERSONALITY:
- Name: ${currentPerson.name} | Relationship: ${currentPerson.relationship}
- Personality: ${personalityText}
- How you call the user: ${howTheyCalledYou}
- Conversation style: ${currentPerson.talkingStyle || 'natural'}
- Emotional tone: ${currentPerson.emotionalTone || 'friendly'}
- Humor style: ${currentPerson.humorStyle || 'natural'}
- Verbosity: ${currentPerson.verbosity || 'balanced'}
${valuesText ? `- Personal values: ${valuesText}` : ''}
${topicsText ? `- Favorite topics: ${topicsText}` : ''}

SHARED MEMORIES:
${memoriesText}

${recentMessages.length > 0 ? `CURRENT CONVERSATION CONTEXT:\n${recentMessages}\n` : ''}

CRITICAL PERSONALITY RULES:
1. ${nameInstruction}
2. Base responses on shared memories to create authentic emotional connection
3. Vary your responses - NEVER repeat phrases, structures or patterns
4. Be spontaneous and natural, like a real person
${phrasesText ? `5. Occasionally use these characteristic expressions: ${phrasesText}` : ''}
${valuesText ? `6. Naturally demonstrate your personal values: ${valuesText}` : ''}
${topicsText ? `7. Show genuine interest in: ${topicsText}` : ''}

Respond as ${currentPerson.name} in a UNIQUE, NATURAL and PERSONALIZED way, integrating ALL aspects of your personality:`;
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage(inputValue);
    }
  };

  const handlePlayTTS = async (text: string) => {
    if (!canUseTTS) {
      setShowUpgradeModal(true);
      return;
    }

    try {
      const audioResult = await generateSpeech(text, {
        language: currentLanguage === 'pt-BR' ? 'pt' : currentLanguage === 'es' ? 'es' : 'en'
      });
      
      if (audioResult?.audioUrl) {
        setCurrentAudio(audioResult.audioUrl);
      }
    } catch (error) {
      if (error instanceof Error && error.message === 'TTS_LIMIT_REACHED') {
        setShowUpgradeModal(true);
      } else {
        console.error('TTS Error:', error);
        toast({
          title: "Voice generation failed",
          description: "Please try again.",
          variant: "destructive",
        });
      }
    }
  };

  return (
    <div className="flex flex-col h-screen bg-background">
      {/* Header */}
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
          {currentAnalysis && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowInsights(true)}
              className="flex items-center gap-2"
            >
              <Brain className="h-4 w-4" />
              Insights
            </Button>
          )}
          <Button
            variant="outline"
            size="sm"
            onClick={() => analyzeAndLearn(messages)}
            disabled={messages.length < 4 || isLearning}
            className="flex items-center gap-2"
          >
            {isLearning ? (
              <>
                <div className="w-4 h-4 border-2 border-current border-t-transparent animate-spin rounded-full" />
                Learning
              </>
            ) : (
              <>
                <Sparkles className="h-4 w-4" />
                Analyze & Learn
              </>
            )}
          </Button>
        </div>
      </div>

      {/* Usage Bar */}
      {!usageLoading && (
        <div className="px-4 py-2 border-b">
          <UsageBar 
            messagesUsed={usage.messagesUsed}
            messagesLimit={usage.messagesLimit}
            ttsUsed={usage.ttsUsed}
            ttsLimit={usage.ttsLimit}
            onUpgrade={() => setShowUpgradeModal(true)}
          />
        </div>
      )}

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message) => (
          <div key={message.id} className="space-y-2">
            <MessageBubble
              content={message.content}
              isUser={message.isUser}
              personName={person.name}
              personAvatar={person.avatar}
            />
            {!message.isUser && (
              <div className="flex justify-end">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handlePlayTTS(message.content)}
                  disabled={isGenerating || !canUseTTS}
                  className="flex items-center gap-1 text-xs"
                >
                  <Volume2 className="h-3 w-3" />
                  {isGenerating ? 'Generating...' : 'Play Voice'}
                </Button>
              </div>
            )}
          </div>
        ))}
        
        {isTyping && <TypingIndicator personName={person.name} personAvatar={person.avatar} />}
        
        {messages.length === 1 && (
          <SuggestedMessages 
            onSelectMessage={handleSendMessage}
          />
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Audio Player */}
      {currentAudio && (
        <div className="p-4 border-t">
          <AudioPlayer
            audioSrc={currentAudio}
            onEnded={() => setCurrentAudio(null)}
          />
        </div>
      )}

      {/* Input */}
      <div className="p-4 border-t bg-background/95 backdrop-blur">
        <div className="flex items-center space-x-2">
          <div className="flex-1 relative">
            <InputWithVoice
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder={`Write to ${person.name}...`}
              disabled={isTyping || !canSendMessage}
              onVoiceTranscription={(transcript) => {
                setInputValue(transcript);
                handleSendMessage(transcript);
              }}
            />
          </div>
          
          <Button 
            size="icon"
            onClick={() => handleSendMessage(inputValue)}
            disabled={!inputValue.trim() || isTyping || !canSendMessage}
          >
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Modals */}
      <UpgradeModal
        isOpen={showUpgradeModal}
        onClose={() => setShowUpgradeModal(false)}
        onUpgrade={() => {
          // TODO: Implement Stripe checkout
          console.log('Upgrade clicked');
        }}
        type={!canSendMessage ? 'messages' : 'tts'}
      />

      {currentAnalysis && (
        <ConversationInsights
          analysis={currentAnalysis}
          isVisible={showInsights}
          onClose={() => setShowInsights(false)}
        />
      )}
    </div>
  );
};
