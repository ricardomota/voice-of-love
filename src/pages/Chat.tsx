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
    return `Você é ${person.name}, ${person.relationship}. 

Características importantes:
- Personalidade: ${person.personality.join(', ')}
- Frases que você costuma usar: ${person.commonPhrases.join(', ')}
- Memórias importantes: ${person.memories.join('. ')}

Responda como esta pessoa responderia, usando o tom de voz e expressões típicas dela. Seja caloroso, pessoal e mantenha a personalidade consistente. Use as frases características ocasionalmente.`;
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

    // Simulate AI response delay
    setTimeout(() => {
      const aiResponse: Message = {
        id: (Date.now() + 1).toString(),
        content: generateAIResponse(content),
        isUser: false,
        timestamp: new Date(),
        hasAudio: true
      };

      setMessages(prev => [...prev, aiResponse]);
      setIsTyping(false);
    }, 1500 + Math.random() * 1000);
  };

  const generateAIResponse = (userMessage: string) => {
    // This would be replaced with actual AI API call
    const responses = [
      `Ah, que bom ouvir isso de você! ${person.commonPhrases[0] || 'Sempre fico feliz em conversar contigo.'}`,
      `Lembro quando... ${person.memories[0]?.substring(0, 100)}... Que tempos bons aqueles!`,
      `Meu querido, você sabe que sempre pode contar comigo. ${person.commonPhrases[1] || 'Tudo vai dar certo!'}`,
      `Isso me faz lembrar de uma coisa que sempre dizia: ${person.commonPhrases[0] || 'A vida é preciosa, aproveite cada momento.'}`,
    ];
    
    return responses[Math.floor(Math.random() * responses.length)];
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