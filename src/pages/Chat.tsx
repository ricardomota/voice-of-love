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
import { conversationService } from '@/services/conversationService';
import { adaptiveLearningService } from '@/services/adaptiveLearningService';
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
  const [currentConversationId, setCurrentConversationId] = useState<string | null>(null);
  const [isLearning, setIsLearning] = useState(false);
  const [updatedPerson, setUpdatedPerson] = useState<Person>(person);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    // Initialize conversation and with a greeting message
    const initializeChat = async () => {
      try {
        const conversation = await conversationService.createConversation(person.id);
        setCurrentConversationId(conversation.id);
        
        const initialMessage: Message = {
          id: '0',
          content: getInitialMessage(),
          isUser: false,
          timestamp: new Date(),
        };
        setMessages([initialMessage]);
        
        // Save initial AI message
        await conversationService.addMessage(conversation.id, initialMessage.content, false);
      } catch (error) {
        console.error('Error initializing chat:', error);
        // Fallback sem conversa persistente
        const initialMessage: Message = {
          id: '0',
          content: getInitialMessage(),
          isUser: false,
          timestamp: new Date(),
        };
        setMessages([initialMessage]);
      }
    };
    
    initializeChat();
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

  const getVerbosityInstruction = (verbosity?: string) => {
    switch (verbosity) {
      case 'concisa':
        return 'MANTENHA RESPOSTAS MUITO CURTAS (máximo 2-3 frases). Seja direto e objetivo.';
      case 'equilibrada':
        return 'Mantenha respostas moderadas (3-5 frases). Equilibre informação e naturalidade.';
      case 'detalhada':
        return 'Você pode dar respostas mais elaboradas quando apropriado, mas ainda mantenha-as naturais.';
      default:
        return 'Mantenha respostas naturais e moderadas (2-4 frases).';
    }
  };

  const getTalkingStyleInstruction = (talkingStyle?: string) => {
    switch (talkingStyle) {
      case 'formal':
        return 'Use linguagem mais formal e respeitosa, evite gírias.';
      case 'informal':
        return 'Use linguagem descontraída, gírias ocasionais e seja mais espontâneo.';
      case 'carinhoso':
        return 'Seja carinhoso, use termos de afeto e demonstre cuidado emocional.';
      case 'direto':
        return 'Seja direto ao ponto, sem rodeios, mas mantenha cordialidade.';
      case 'sábio':
        return 'Demonstre sabedoria, dê conselhos ponderados e fale com experiência.';
      default:
        return 'Mantenha um estilo de conversa natural e autêntico.';
    }
  };

  const generatePersonalizedPrompt = () => {
    // Usar pessoa atualizada se disponível
    const currentPerson = updatedPerson;
    const memoriesText = currentPerson.memories.length > 0 
      ? currentPerson.memories.map((m, index) => `${index + 1}. ${m.text}`).join('\n')
      : 'Ainda não há memórias compartilhadas entre nós.';
      
    const personalityText = currentPerson.personality.length > 0 
      ? currentPerson.personality.join(', ') 
      : 'personalidade única';
      
     const phrasesText = currentPerson.commonPhrases.length > 0
      ? currentPerson.commonPhrases.join('; ') 
      : '';
      
    const valuesText = currentPerson.values && currentPerson.values.length > 0 
      ? currentPerson.values.join(', ') 
      : '';
      
    const topicsText = currentPerson.topics && currentPerson.topics.length > 0 
      ? currentPerson.topics.join(', ') 
      : '';

    const howTheyCalledYou = currentPerson.howTheyCalledYou || 'você';

    return `INSTRUÇÕES CRÍTICAS: Você é ${currentPerson.name}, ${currentPerson.relationship}. Responda SEMPRE como esta pessoa específica, mantendo sua personalidade e usando as memórias compartilhadas.

PERFIL DA PESSOA:
- Nome: ${currentPerson.name}
- Relacionamento: ${currentPerson.relationship}
- Como você chama o usuário: ${howTheyCalledYou}
- Personalidade: ${personalityText}
- Frases características: ${phrasesText}
- Estilo de conversa: ${currentPerson.talkingStyle || 'natural'}
- Tipo de humor: ${currentPerson.humorStyle || 'suave'}
- Tom emocional: ${currentPerson.emotionalTone || 'amigável'}
- Verbosidade: ${currentPerson.verbosity || 'equilibrada'}
- Valores importantes: ${valuesText}
- Assuntos favoritos: ${topicsText}

MEMÓRIAS COMPARTILHADAS (USE ESTAS INFORMAÇÕES ATIVAMENTE):
${memoriesText}

INSTRUÇÕES DE RESPOSTA (SIGA RIGOROSAMENTE):
1. ${getVerbosityInstruction(currentPerson.verbosity)}
2. ${getTalkingStyleInstruction(currentPerson.talkingStyle)}
3. SEMPRE se refira ao usuário como "${howTheyCalledYou}" - essa é a forma carinhosa que você usava
4. Use as frases características "${phrasesText}" ocasionalmente de forma natural
5. Demonstre que você lembra das experiências vividas juntos
6. Seja específico e pessoal baseado nas memórias
7. Mantenha o tom emocional "${currentPerson.emotionalTone || 'amigável'}"
8. IMPORTANTE: Seus valores são ${valuesText} - mantenha-se fiel a eles sempre

Agora responda como ${currentPerson.name}:`;
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
      
      // Salvar mensagens na conversa persistente
      if (currentConversationId) {
        await conversationService.addMessage(currentConversationId, userMessage.content, true);
        await conversationService.addMessage(currentConversationId, aiMessage.content, false);
      }
      
      // Atualizar última conversa
      await peopleService.updatePersonLastConversation(person.id);

      // Analisar conversa e aplicar aprendizado a cada 3 mensagens
      if ((messageCount + 1) % 3 === 0) {
        await analyzeAndLearn([...messages, userMessage, aiMessage]);
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

  const analyzeAndLearn = async (conversationMessages: Message[]) => {
    try {
      // Só analisa se houver pelo menos 4 mensagens (2 de cada)
      if (conversationMessages.length < 4) return;

      setIsLearning(true);
      toast({
        title: "🧠 Analisando conversa e aprendendo...",
        description: "Melhorando a personalidade baseado na conversa.",
      });

      const analysis = await conversationAnalyzer.analyzeConversation(updatedPerson, conversationMessages);
      setCurrentAnalysis(analysis);

      // Salvar análise
      const { data: user } = await supabase.auth.getUser();
      if (user.user) {
        await conversationAnalyzer.saveAnalysis(person.id, user.user.id, analysis);
        await conversationAnalyzer.saveDynamicMemories(person.id, analysis.suggestedMemories);
        
        // Obter total de conversas para determinar se deve aplicar aprendizado
        const conversations = await conversationService.getPersonConversations(person.id);
        
        // Aplicar aprendizado adaptativo
        const learnedPerson = await adaptiveLearningService.applyLearning(
          updatedPerson, 
          analysis, 
          conversations.length
        );
        
        if (learnedPerson) {
          // Atualizar pessoa no banco
          const updated = await peopleService.updatePerson(person.id, learnedPerson);
          setUpdatedPerson(updated);
          
          toast({
            title: "✨ Aprendizado Aplicado!",
            description: "A personalidade evoluiu baseada nas conversas.",
          });
        }
      }

      // Feedback sobre qualidade da conversa
      const quality = analysis.conversationQuality.engagement;
      if (quality > 0.8) {
        toast({
          title: "💖 Conexão Incrível!",
          description: "A intimidade e autenticidade estão excepcionais hoje.",
        });
      } else if (quality < 0.4) {
        toast({
          title: "💡 Dica de Conversa",
          description: "Tente perguntas mais pessoais ou compartilhe uma memória.",
        });
      }

    } catch (error) {
      console.error('Error in adaptive learning:', error);
      toast({
        title: "Erro no aprendizado",
        description: "Não foi possível aplicar o aprendizado, mas a conversa continua.",
        variant: "destructive",
      });
    } finally {
      setIsLearning(false);
    }
  };

  const generateAIResponse = async (prompt: string, userMessage: string) => {
    try {
      // Buscar memórias dinâmicas recentes
      const dynamicMemories = await conversationAnalyzer.getDynamicMemories(updatedPerson.id);
      const memoryContext = dynamicMemories.length > 0 
        ? `\n\nMEMÓRIAS RECENTES IMPORTANTES:\n${dynamicMemories.map(m => `- ${m.memory_text}`).join('\n')}`
        : '';

      const enhancedPrompt = prompt + memoryContext;

      const { data, error } = await supabase.functions.invoke('openai-chat', {
        body: {
          messages: [{ role: 'user', content: userMessage }],
          systemPrompt: enhancedPrompt,
          temperature: updatedPerson.temperature
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
            onClick={() => analyzeAndLearn(messages)}
            disabled={messages.length < 4 || isLearning}
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
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message) => (
          <MessageBubble
            key={message.id}
            content={message.content}
            isUser={message.isUser}
            personName={person.name}
            personAvatar={person.avatar}
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