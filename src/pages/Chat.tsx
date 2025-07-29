import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { MessageBubble } from "@/components/ui/message-bubble";
import { TypingIndicator } from "@/components/ui/typing-indicator";
import { SuggestedMessages } from "@/components/SuggestedMessages";
import { ArrowLeft, Send, Mic, MicOff } from "lucide-react";
import { Person, Message } from "@/types/person";

interface ChatProps {
  person: Person;
  onBack: () => void;
}

export const Chat = ({ person, onBack }: ChatProps) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  // Load initial message
  useEffect(() => {
    const initialMessage: Message = {
      id: "1",
      content: getInitialMessage(),
      isUser: false,
      timestamp: new Date(),
      hasAudio: true
    };
    setMessages([initialMessage]);
  }, [person]);

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
      
    return `INSTRUÇÕES IMPORTANTES: Você é ${person.name}, ${person.relationship}. Responda SEMPRE como esta pessoa específica, mantendo sua personalidade e usando as memórias compartilhadas. SEJA CONCISO E NATURAL.

PERFIL DA PESSOA:
- Nome: ${person.name}
- Relacionamento: ${person.relationship}
- Personalidade: ${personalityText}
- Frases características: ${phrasesText}

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

Agora responda como ${person.name}:`;
  };

  const handleSendMessage = async (content: string) => {
    if (!content.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      content: content.trim(),
      isUser: true,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setNewMessage("");
    setIsTyping(true);

    try {
      const aiResponseContent = await generateAIResponse(content);
      const aiResponse: Message = {
        id: (Date.now() + 1).toString(),
        content: aiResponseContent,
        isUser: false,
        timestamp: new Date(),
        hasAudio: true
      };

      setMessages(prev => [...prev, aiResponse]);
    } catch (error) {
      console.error('Error getting AI response:', error);
      const errorResponse: Message = {
        id: (Date.now() + 1).toString(),
        content: `Desculpe, tive um problema para responder. Como ${person.name}, gostaria de conversar mais com você!`,
        isUser: false,
        timestamp: new Date(),
        hasAudio: false
      };
      setMessages(prev => [...prev, errorResponse]);
    } finally {
      setIsTyping(false);
    }
  };

  const generateAIResponse = async (prompt: string): Promise<string> => {
    try {
      const systemPrompt = generatePersonalizedPrompt();
      
      const response = await fetch('https://awodornqrhssfbkgjgfx.supabase.co/functions/v1/openai-chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          messages: [
            { role: 'user', content: prompt }
          ],
          systemPrompt: systemPrompt,
          temperature: person.temperature || 0.7
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to get AI response');
      }

      const data = await response.json();
      return data.response;
    } catch (error) {
      console.error('Error generating AI response:', error);
      // Fallback to a simple response
      return `Desculpe, tive um problema para responder. Como ${person.name}, gostaria de conversar mais com você!`;
    }
  };

  const handleVoiceRecording = () => {
    setIsRecording(!isRecording);
    // Implement voice recording logic here
    if (!isRecording) {
      // Start recording
      setTimeout(() => {
        setIsRecording(false);
        handleSendMessage("Mensagem de áudio transcrita aqui");
      }, 3000);
    }
  };

  return (
    <div className="flex flex-col h-screen bg-gradient-warm">
      {/* Header */}
      <Card className="flex-shrink-0 border-b border-border/50 rounded-none shadow-soft">
        <div className="flex items-center gap-3 p-4">
          <Button variant="ghost" onClick={onBack} className="p-2">
            <ArrowLeft className="w-5 h-5" />
          </Button>
          
          <Avatar className="w-10 h-10 shadow-soft">
            <AvatarImage src={person.avatar} alt={person.name} />
            <AvatarFallback className="bg-memory text-memory-foreground">
              {person.name.charAt(0)}
            </AvatarFallback>
          </Avatar>
          
          <div>
            <h1 className="font-semibold text-foreground">{person.name}</h1>
            <p className="text-sm text-muted-foreground">{person.relationship}</p>
          </div>
        </div>
      </Card>

      {/* Messages */}
      <div className="flex-1 overflow-hidden flex flex-col">
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.map((message) => (
            <MessageBubble
              key={message.id}
              content={message.content}
              isUser={message.isUser}
              personName={person.name}
              personAvatar={person.avatar}
              hasAudio={message.hasAudio}
            />
          ))}
          
          {isTyping && (
            <TypingIndicator
              personName={person.name}
              personAvatar={person.avatar}
            />
          )}
          
          <div ref={messagesEndRef} />
        </div>

        {/* Suggested Messages */}
        {messages.length <= 1 && (
          <div className="p-4 pt-0">
            <SuggestedMessages
              onSelectMessage={handleSendMessage}
              personName={person.name}
            />
          </div>
        )}

        {/* Input */}
        <Card className="flex-shrink-0 border-t border-border/50 rounded-none shadow-soft">
          <div className="p-4">
            <div className="flex gap-2">
              <div className="flex-1 flex gap-2">
                <Input
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  placeholder={`Escreva para ${person.name}...`}
                  onKeyPress={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault();
                      handleSendMessage(newMessage);
                    }
                  }}
                  className="border-border/50"
                />
                
                <Button
                  variant="outline"
                  size="icon"
                  onClick={handleVoiceRecording}
                  className={isRecording ? "bg-destructive text-destructive-foreground" : ""}
                >
                  {isRecording ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
                </Button>
              </div>
              
              <Button
                onClick={() => handleSendMessage(newMessage)}
                disabled={!newMessage.trim() || isTyping}
                className="bg-primary hover:bg-primary/90"
              >
                <Send className="w-4 h-4" />
              </Button>
            </div>
            
            {isRecording && (
              <div className="mt-2 text-center">
                <span className="text-sm text-destructive font-medium animate-pulse">
                  Gravando... Toque novamente para parar
                </span>
              </div>
            )}
          </div>
        </Card>
      </div>
    </div>
  );
};