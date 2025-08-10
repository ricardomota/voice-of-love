import { useState, useCallback, useRef, useEffect } from 'react';
import { Message, Person } from '@/types/person';
import { conversationService } from '@/services/conversationService';
import { adaptiveLearningService } from '@/services/adaptiveLearningService';
import { conversationAnalyzer, ConversationAnalysis } from '@/services/conversationAnalyzer';
import { peopleService } from '@/services/peopleService';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export const useChat = (person: Person) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [showInsights, setShowInsights] = useState(false);
  const [currentAnalysis, setCurrentAnalysis] = useState<ConversationAnalysis | null>(null);
  const [messageCount, setMessageCount] = useState(0);
  const [currentConversationId, setCurrentConversationId] = useState<string | null>(null);
  const [isLearning, setIsLearning] = useState(false);
  const [updatedPerson, setUpdatedPerson] = useState<Person>(person);
  
  const { toast } = useToast();
  const initializationRef = useRef(false);

  const getInitialMessage = useCallback(() => {
    let userName = 'querido';
    if (person.howTheyCalledYou) {
      // Dividir os nomes por vírgula e escolher um aleatoriamente
      const names = person.howTheyCalledYou.split(',').map(name => name.trim()).filter(name => name);
      if (names.length > 0) {
        userName = names[Math.floor(Math.random() * names.length)];
      }
    }
    
    const greetings = [
      `Olá, ${userName}! Como você está?`,
      `Que alegria te ver, ${userName}! Como tem passado?`,
      `Oi, ${userName}! Estava com saudades de conversar com você.`,
      `Olá, ${userName}! É sempre um prazer nossa conversa.`
    ];
    return greetings[Math.floor(Math.random() * greetings.length)];
  }, [person.howTheyCalledYou]);

  // Initialize chat
  useEffect(() => {
    if (initializationRef.current) return;
    
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
        
        await conversationService.addMessage(conversation.id, initialMessage.content, false);
      } catch (error) {
        console.error('Error initializing chat:', error);
        const initialMessage: Message = {
          id: '0',
          content: getInitialMessage(),
          isUser: false,
          timestamp: new Date(),
        };
        setMessages([initialMessage]);
      }
    };
    
    initializationRef.current = true;
    initializeChat();
  }, [person.id, getInitialMessage]);

  const generateAIResponse = useCallback(async (prompt: string, userMessage: string) => {
    try {
      const dynamicMemories = await conversationAnalyzer.getDynamicMemories(updatedPerson.id);
      const memoryContext = dynamicMemories.length > 0 
        ? `\n\nMEMÓRIAS RECENTES IMPORTANTES:\n${dynamicMemories.map(m => `- ${m.memory_text}`).join('\n')}`
        : '';

      const enhancedPrompt = prompt + memoryContext;

      const { data, error } = await supabase.functions.invoke('llm-router', {
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
  }, [updatedPerson]);

  const analyzeAndLearn = useCallback(async (conversationMessages: Message[]) => {
    if (conversationMessages.length < 4) return;

    try {
      setIsLearning(true);
      toast({
        title: "🧠 Analisando conversa e aprendendo...",
        description: "Melhorando a personalidade baseado na conversa.",
      });

      const analysis = await conversationAnalyzer.analyzeConversation(updatedPerson, conversationMessages);
      setCurrentAnalysis(analysis);

      const { data: user } = await supabase.auth.getUser();
      if (user.user) {
        await conversationAnalyzer.saveAnalysis(person.id, user.user.id, analysis);
        await conversationAnalyzer.saveDynamicMemories(person.id, analysis.suggestedMemories);
        
        const conversations = await conversationService.getPersonConversations(person.id);
        
        const learnedPerson = await adaptiveLearningService.applyLearning(
          updatedPerson, 
          analysis, 
          conversations.length
        );
        
        if (learnedPerson) {
          const updated = await peopleService.updatePerson(person.id, learnedPerson);
          setUpdatedPerson(updated);
          
          toast({
            title: "✨ Aprendizado Aplicado!",
            description: "A personalidade evoluiu baseada nas conversas.",
          });
        }
      }

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
  }, [updatedPerson, person.id, toast]);

  return {
    messages,
    setMessages,
    inputValue,
    setInputValue,
    isTyping,
    setIsTyping,
    showInsights,
    setShowInsights,
    currentAnalysis,
    messageCount,
    setMessageCount,
    currentConversationId,
    isLearning,
    updatedPerson,
    generateAIResponse,
    analyzeAndLearn
  };
};