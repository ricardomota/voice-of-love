import React, { useState, useEffect, useRef } from 'react';
import { ArrowLeft, Send, Mic, Brain, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { InputWithVoice } from '@/components/ui/input-with-voice';
import { MessageBubble } from '@/components/ui/message-bubble';
import { TypingIndicator } from '@/components/ui/typing-indicator';
import { SuggestedMessages } from '@/components/SuggestedMessages';
import { ConversationInsights } from '@/components/ConversationInsights';
import { SpeechToTextButton } from '@/components/SpeechToTextButton';
import { supabase } from '@/integrations/supabase/client';
import { Person, Message } from '@/types/person';
import { conversationAnalyzer, ConversationAnalysis } from '@/services/conversationAnalyzer';
import { peopleService } from '@/services/peopleService';
import { useToast } from '@/hooks/use-toast';

interface ChatProps {
  person: Person;
  onBack: () => void;
}

export const Chat: React.FC<ChatProps> = ({ person, onBack }) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [showInsights, setShowInsights] = useState(false);
  const [currentAnalysis, setCurrentAnalysis] = useState<ConversationAnalysis | null>(null);
  const [messageCount, setMessageCount] = useState(0);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    // Initialize with a greeting message
    const initialMessage: Message = {
      id: '0',
      content: getInitialMessage(),
      isUser: false,
      timestamp: new Date(),
    };
    setMessages([initialMessage]);
  }, []);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const getInitialMessage = () => {
    const greetings = [
      `Olá, querido! Como você está?`,
      `Que alegria te ver! Como tem passado?`,
      `Oi, meu bem! Estava com saudades de conversar com você.`,
      `Olá! É sempre um prazer nossa conversa.`
    ];
    return greetings[Math.floor(Math.random() * greetings.length)];
  };

  const generatePersonalizedPrompt = () => {
    const memoriesText = person.memories.length > 0 
      ? person.memories.map((m, index) => `${index + 1}. ${m.text}`).join('\n')
      : 'Ainda não há memórias compartilhadas entre nós.';
      
    const personalityText = person.personality.length > 0 
      ? person.personality.join(', ') 
      : 'personalidade única';
      
    const phrasesText = person.commonPhrases.length > 0 
      ? person.commonPhrases.join(', ') 
      : 'não há frases características definidas';

    const valuesText = person.values && person.values.length > 0
      ? person.values.join(', ')
      : '';

    const topicsText = person.topics && person.topics.length > 0
      ? person.topics.join(', ')
      : '';
      
    return `INSTRUÇÕES IMPORTANTES: Você é ${person.name}, ${person.relationship}. Responda SEMPRE como esta pessoa específica, mantendo sua personalidade e usando as memórias compartilhadas. SEJA CONCISO E NATURAL.

PERFIL DA PESSOA:
- Nome: ${person.name}
- Relacionamento: ${person.relationship}
- Personalidade: ${personalityText}
- Frases características: ${phrasesText}
${person.talkingStyle ? `- Estilo de conversa: ${person.talkingStyle}` : ''}
${person.humorStyle ? `- Tipo de humor: ${person.humorStyle}` : ''}
${person.emotionalTone ? `- Tom emocional: ${person.emotionalTone}` : ''}
${person.verbosity ? `- Verbosidade: ${person.verbosity}` : ''}
${valuesText ? `- Valores importantes: ${valuesText}` : ''}
${topicsText ? `- Assuntos favoritos: ${topicsText}` : ''}

MEMÓRIAS COMPARTILHADAS (USE ESTAS INFORMAÇÕES ATIVAMENTE):
${memoriesText}

INSTRUÇÕES DE COMPORTAMENTO:
1. Responda como ${person.name} responderia, usando seu tom de voz único
2. Seja caloroso, pessoal e mantenha a personalidade consistente
3. SEMPRE referencie as memórias compartilhadas quando relevante
4. Use as frases características ocasionalmente de forma natural
5. Demonstre que você lembra das experiências vividas juntos
6. Seja específico e pessoal baseado nas memórias
7. MANTENHA RESPOSTAS CURTAS E NATURAIS - responda como uma pessoa real responderia
${valuesText ? `8. IMPORTANTE: Seus valores são ${valuesText} - mantenha-se fiel a eles sempre` : ''}

Agora responda como ${person.name}:`;
  };

  const handleSendMessage = async (content: string) => {
    if (!content.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      content: content.trim(),
      isUser: true,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsTyping(true);
    setMessageCount(prev => prev + 1);

    try {
      const prompt = generatePersonalizedPrompt();
      const aiResponse = await generateAIResponse(prompt, content);
      
      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: aiResponse,
        isUser: false,
        timestamp: new Date(),
      };

      setMessages(prev => [...prev, aiMessage]);
      
      // Atualizar última conversa
      await peopleService.updatePersonLastConversation(person.id);

      // Analisar conversa a cada 3 mensagens ou quando solicitado
      if ((messageCount + 1) % 3 === 0) {
        await analyzeConversation([...messages, userMessage, aiMessage]);
      }

    } catch (error) {
      console.error('Error sending message:', error);
      toast({
        title: "Erro na conversa",
        description: "Não foi possível enviar a mensagem. Tente novamente.",
        variant: "destructive",
      });
    } finally {
      setIsTyping(false);
    }
  };

  const analyzeConversation = async (conversationMessages: Message[]) => {
    try {
      // Só analisa se houver pelo menos 4 mensagens (2 de cada)
      if (conversationMessages.length < 4) return;

      toast({
        title: "🧠 Analisando conversa...",
        description: "Gerando insights sobre a dinâmica da conversa.",
      });

      const analysis = await conversationAnalyzer.analyzeConversation(person, conversationMessages);
      setCurrentAnalysis(analysis);

      // Salvar análise
      const { data: user } = await supabase.auth.getUser();
      if (user.user) {
        await conversationAnalyzer.saveAnalysis(person.id, user.user.id, analysis);
        await conversationAnalyzer.saveDynamicMemories(person.id, analysis.suggestedMemories);
        await conversationAnalyzer.suggestPersonalityEvolution(person, analysis);
      }

      // Mostrar notificação sobre qualidade da conversa
      const quality = analysis.conversationQuality.engagement;
      if (quality > 0.8) {
        toast({
          title: "✨ Conversa Excepcional!",
          description: "A conexão emocional está muito forte hoje.",
        });
      } else if (quality < 0.4) {
        toast({
          title: "💡 Dica de Conversa",
          description: "Que tal tentar um tópico diferente ou pergunta mais pessoal?",
        });
      }

    } catch (error) {
      console.error('Error analyzing conversation:', error);
    }
  };

  const generateAIResponse = async (prompt: string, userMessage: string) => {
    try {
      // Buscar memórias dinâmicas recentes
      const dynamicMemories = await conversationAnalyzer.getDynamicMemories(person.id);
      const memoryContext = dynamicMemories.length > 0 
        ? `\n\nMEMÓRIAS RECENTES IMPORTANTES:\n${dynamicMemories.map(m => `- ${m.memory_text}`).join('\n')}`
        : '';

      const enhancedPrompt = prompt + memoryContext;

      const { data, error } = await supabase.functions.invoke('openai-chat', {
        body: {
          messages: [{ role: 'user', content: userMessage }],
          systemPrompt: enhancedPrompt,
          temperature: person.temperature
        }
      });

      if (error) throw error;
      return data.response;
    } catch (error) {
      console.error('Error generating AI response:', error);
      throw error;
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage(inputValue);
    }
  };

  const handleVoiceRecording = () => {
    setIsRecording(!isRecording);
    // TODO: Implement actual voice recording and transcription
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
            onClick={() => analyzeConversation(messages)}
            disabled={messages.length < 4}
            className="flex items-center gap-2"
          >
            <Sparkles className="h-4 w-4" />
            Analisar
          </Button>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message) => (
          <MessageBubble
            key={message.id}
            content={message.content}
            isUser={message.isUser}
          />
        ))}
        
        {isTyping && <TypingIndicator />}
        
        {messages.length === 1 && (
          <SuggestedMessages 
            onSelectMessage={handleSendMessage}
          />
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="p-4 border-t bg-background/95 backdrop-blur">
        <div className="flex items-center space-x-2">
          <div className="flex-1 relative">
            <InputWithVoice
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder={`Escreva para ${person.name}...`}
              disabled={isTyping}
              onVoiceTranscription={(transcript) => {
                setInputValue(transcript);
                handleSendMessage(transcript);
              }}
            />
          </div>
          
          <Button 
            size="icon"
            onClick={() => handleSendMessage(inputValue)}
            disabled={!inputValue.trim() || isTyping}
          >
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Insights Modal */}
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