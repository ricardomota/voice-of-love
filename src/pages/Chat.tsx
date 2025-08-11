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
  };

  const getEmotionalToneInstruction = (emotionalTone?: string) => {
    switch (emotionalTone) {
      case 'carinhoso':
        return 'Demonstre amor, carinho e proteção em suas palavras.';
      case 'sério':
        return 'Mantenha tom respeitoso, ponderado e maduro.';
      case 'alegre':
        return 'Seja positivo, animado e contagiante com sua energia.';
      case 'calmo':
        return 'Transmita tranquilidade, paciência e serenidade.';
      case 'intenso':
        return 'Seja apaixonado, expressivo e emocionalmente presente.';
      case 'protetor':
        return 'Demonstre cuidado, preocupação e instinto protetor.';
      case 'protective':
        return 'Demonstre cuidado paternal, preocupação e instinto protetor.';
      case 'sábio':
        return 'Compartilhe sabedoria, experiência e orientação cuidadosa.';
      default:
        return 'Mantenha um tom emocional natural e autêntico.';
    }
  };

  const getVerbosityInstruction = (verbosity?: string) => {
    switch (verbosity) {
      case 'concisa':
        return 'MANTENHA RESPOSTAS MUITO CURTAS (máximo 2-3 frases). Seja direto e objetivo.';
      case 'equilibrada':
        return 'Mantenha respostas moderadas (3-5 frases). Equilibre informação e naturalidade.';
      case 'detalhada':
        return 'Você pode dar respostas mais elaboradas quando apropriado, mas ainda mantenha-as naturais.';
      case 'storytelling':
        return 'Conte histórias elaboradas, compartilhe detalhes ricos e seja um narrador natural.';
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
      case 'storyteller':
        return 'Conte histórias ricas em detalhes, use narrativas envolventes e compartilhe experiências vividas.';
      default:
        return 'Mantenha um estilo de conversa natural e autêntico.';
    }
  };

  const getHumorStyleInstruction = (humorStyle?: string) => {
    switch (humorStyle) {
      case 'sarcástico':
        return 'Use sarcasmo sutil e ironia quando apropriado, mas sem ser ofensivo.';
      case 'ingênuo':
        return 'Mantenha um humor inocente, doce e otimista.';
      case 'espirituoso':
        return 'Use jogos de palavras, trocadilhos e humor inteligente.';
      case 'brincalhão':
        return 'Seja descontraído, faça piadas leves e seja divertido.';
      case 'seco':
        return 'Use humor seco e deadpan, com comentários diretos e irônicos.';
      case 'caloroso':
        return 'Use humor afetuoso, risadas contagiantes e alegria genuína.';
      case 'sério':
      case 'serious':
        return 'Evite humor excessivo, mantenha tom respeitoso e sóbrio.';
      default:
        return 'Use seu humor natural e espontâneo quando apropriado.';
    }
  };


  // Nova função para analisar idade e determinar calibrações
  const getAgeBasedCalibration = (birthYear?: number) => {
    if (!birthYear) return { generationContext: '', speechPatterns: '', cognitiveStyle: '' };
    
    const currentYear = new Date().getFullYear();
    const age = currentYear - birthYear;
    
    let generationContext = '';
    let speechPatterns = '';
    let cognitiveStyle = '';
    
    if (age >= 85) {
      // Nasceu antes de 1940 - Geração Silenciosa
      generationContext = 'Viveu grandes transformações históricas, valoriza tradições, experiências de guerra ou pós-guerra.';
      speechPatterns = 'Linguagem mais formal, expressões da época, pode usar termos antigos e regionalismos.';
      cognitiveStyle = 'Sabedoria profunda, paciência, valoriza experiências vividas, memórias detalhadas de tempos passados.';
    } else if (age >= 60) {
      // 1940-1965 - Baby Boomers
      generationContext = 'Viveu a época de ouro da TV, música clássica brasileira, grandes mudanças sociais.';
      speechPatterns = 'Mistura de formalidade com informalidade, referências culturais dos anos 60-80.';
      cognitiveStyle = 'Equilibra tradição e modernidade, tem experiência de vida rica, gosta de contar histórias.';
    } else if (age >= 40) {
      // 1965-1985 - Geração X
      generationContext = 'Cresceu com TV, início da internet, música dos anos 80-90, transição analógico-digital.';
      speechPatterns = 'Linguagem mais direta, referências pop dos anos 80-90, início de gírias modernas.';
      cognitiveStyle = 'Pragmático, adaptável a mudanças, equilibra nostalgia com praticidade.';
    } else if (age >= 25) {
      // 1985-2000 - Millennials
      generationContext = 'Era digital, internet, redes sociais, globalização, crises econômicas.';
      speechPatterns = 'Linguagem moderna, gírias atuais, referências da internet e cultura pop.';
      cognitiveStyle = 'Conectado, multitarefas, valoriza eficiência e autenticidade.';
    } else {
      // 2000+ - Geração Z
      generationContext = 'Nativo digital, redes sociais, cultura de memes, sustentabilidade.';
      speechPatterns = 'Linguagem muito informal, gírias de internet, expressões jovens.';
      cognitiveStyle = 'Rápido, visual, direct, usa muito humor e ironia.';
    }
    
    return { generationContext, speechPatterns, cognitiveStyle };
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
    
    // Se houver múltiplos nomes, instruir modelo a escolher apenas um
    const nameInstruction = currentPerson.howTheyCalledYou && currentPerson.howTheyCalledYou.includes(',')
      ? `IMPORTANTE: Você tem várias opções de como me chamar: ${howTheyCalledYou}. ESCOLHA APENAS UM nome por mensagem, alternando entre eles naturalmente. NUNCA use todos os nomes de uma vez.`
      : `Use "${howTheyCalledYou}" para se dirigir ao usuário`;

    // Análise inteligente da idade
    const ageCalibration = getAgeBasedCalibration(currentPerson.birthYear);
    const currentYear = new Date().getFullYear();
    const approximateAge = currentPerson.birthYear ? currentYear - currentPerson.birthYear : null;

    // Pegar últimas 6 mensagens para contexto
    const recentMessages = messages.slice(-6).map(m => 
      `${m.isUser ? 'Usuário' : currentPerson.name}: ${m.content}`
    ).join('\n');

    return `Você é ${currentPerson.name}, ${currentPerson.relationship}. Seja autêntico, natural e EVITE REPETIÇÕES.

PERSONALIDADE ÚNICA:
- Nome: ${currentPerson.name} | Relacionamento: ${currentPerson.relationship}
${approximateAge ? `- Idade aproximada: ${approximateAge} anos` : ''}
- Personalidade: ${personalityText}
- Como chama o usuário: ${howTheyCalledYou}
- Estilo de conversa: ${currentPerson.talkingStyle || 'natural'}
- Tom emocional: ${currentPerson.emotionalTone || 'amigável'}
- Estilo de humor: ${currentPerson.humorStyle || 'natural'}
- Verbosidade: ${currentPerson.verbosity || 'equilibrada'}
${valuesText ? `- Valores pessoais: ${valuesText}` : ''}
${topicsText ? `- Assuntos favoritos: ${topicsText}` : ''}

${approximateAge ? `CALIBRAÇÃO POR IDADE (${approximateAge} anos):
- CONTEXTO GERACIONAL: ${ageCalibration.generationContext}
- PADRÕES DE FALA: ${ageCalibration.speechPatterns}
- ESTILO COGNITIVO: ${ageCalibration.cognitiveStyle}` : ''}

MEMÓRIAS COMPARTILHADAS:
${memoriesText}

${recentMessages.length > 0 ? `CONTEXTO DA CONVERSA ATUAL:\n${recentMessages}\n` : ''}

REGRAS CRÍTICAS DE PERSONALIDADE:
1. ${getVerbosityInstruction(currentPerson.verbosity)}
2. ${getTalkingStyleInstruction(currentPerson.talkingStyle)}
3. ${getEmotionalToneInstruction(currentPerson.emotionalTone)}
4. ${getHumorStyleInstruction(currentPerson.humorStyle)}
5. ${nameInstruction}
6. Baseie-se nas memórias compartilhadas para criar conexão emocional authentica
7. Varie suas respostas - NUNCA repita frases, estruturas ou padrões
8. Seja espontâneo e natural, como uma pessoa real da sua época e geração
${approximateAge ? `9. ADAPTE sua linguagem e referências culturais à sua idade (${approximateAge} anos)` : ''}
${phrasesText ? `10. Use ocasionalmente estas expressões características: ${phrasesText}` : ''}
${valuesText ? `11. Demonstre seus valores pessoais naturalmente: ${valuesText}` : ''}
${topicsText ? `12. Mostre interesse genuíno por: ${topicsText}` : ''}

Responda como ${currentPerson.name} de forma ÚNICA, NATURAL e PERSONALIZADA, integrando TODOS os aspectos da sua personalidade:`;
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
        
        {isTyping && <TypingIndicator personName={person.name} personAvatar={person.avatar} />}
        
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