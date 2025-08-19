import React, { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Send, Volume2, Heart, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'ai';
  timestamp: Date;
}

interface DemoPersona {
  name: string;
  relationship: string;
  avatar: string;
  personality: string;
  responses: { [key: string]: string[] };
}

const demoPersona: DemoPersona = {
  name: "Avó Maria",
  relationship: "Sua avó querida",
  avatar: "/lovable-uploads/da7c745c-758a-4054-a38a-03a05da9fb7b.png",
  personality: "carinhosa e sábia",
  responses: {
    "olá": [
      "Oi meu bem! Como está meu neto querido? Que saudade de você!",
      "Olá meu amor! Que alegria te ver aqui. Como tem passado?"
    ],
    "saudade": [
      "Eu também sinto muita saudade sua, meu anjo. Lembra quando fazíamos biscoitos juntos na cozinha?",
      "Ah, que saudade boa essa! Você sempre foi meu netinho especial."
    ],
    "receita": [
      "Ah! Você quer a receita do meu famoso bolo de chocolate? Era 3 ovos, 2 xícaras de açúcar... mas o segredo era o carinho que eu colocava!",
      "Claro, meu bem! Para fazer aquele brigadeiro que você adorava: leite condensado, chocolate em pó e muito amor!"
    ],
    "história": [
      "Deixa eu te contar sobre quando você era pequeno... Você sempre corria pelo quintal atrás das galinhas! Era uma travessura só!",
      "Ah, que memória boa! Lembro quando você perdeu o primeiro dentinho e colocou debaixo do travesseiro esperando a fada..."
    ],
    "conselho": [
      "Meu neto, a vida é como fazer um bolo - às vezes não sai perfeito, mas sempre é feito com amor. Continue sendo essa pessoa boa que você é.",
      "Lembre-se sempre: as pessoas podem esquecer o que você disse, mas nunca vão esquecer como você as fez sentir."
    ],
    "default": [
      "Que bom ouvir você, meu bem! Me conta mais sobre sua vida.",
      "Você sempre foi tão especial para mim. O que mais você gostaria de saber?",
      "Ah, como é bom ter essa conversa com você! Continue, estou aqui te ouvindo."
    ]
  }
};

const suggestedMessages = [
  "Olá vovó, como está?",
  "Sinto saudade da senhora",
  "Pode me contar uma história?",
  "Qual era mesmo a receita do seu bolo?",
  "Preciso de um conselho"
];

export const DemoChat: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    // Welcome message
    const welcomeMessage: Message = {
      id: '1',
      text: "Oi meu bem! Que alegria te ver aqui! Sou sua Avó Maria. Como você tem passado?",
      sender: 'ai',
      timestamp: new Date()
    };
    setMessages([welcomeMessage]);
  }, []);

  const getAIResponse = (userMessage: string): string => {
    const message = userMessage.toLowerCase();
    
    for (const [key, responses] of Object.entries(demoPersona.responses)) {
      if (message.includes(key)) {
        return responses[Math.floor(Math.random() * responses.length)];
      }
    }
    
    return demoPersona.responses.default[Math.floor(Math.random() * demoPersona.responses.default.length)];
  };

  const sendMessage = async (text: string) => {
    if (!text.trim()) return;

    setShowSuggestions(false);
    
    // Add user message
    const userMessage: Message = {
      id: Date.now().toString(),
      text: text.trim(),
      sender: 'user',
      timestamp: new Date()
    };
    
    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsTyping(true);

    // Simulate AI thinking time
    setTimeout(() => {
      const aiResponse: Message = {
        id: (Date.now() + 1).toString(),
        text: getAIResponse(text),
        sender: 'ai',
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, aiResponse]);
      setIsTyping(false);
    }, 1500 + Math.random() * 1000);
  };

  const handleSuggestedMessage = (message: string) => {
    sendMessage(message);
  };

  const playVoice = () => {
    // Simulated voice playback
    const utterance = new SpeechSynthesisUtterance("Esta é uma simulação da voz clonada da sua avó");
    utterance.lang = 'pt-BR';
    utterance.rate = 0.8;
    speechSynthesis.speak(utterance);
  };

  return (
    <div className="flex flex-col h-[500px] bg-background/50 rounded-xl border border-primary-foreground/10">
      {/* Header */}
      <div className="flex items-center gap-3 p-4 border-b border-primary-foreground/10">
        <Avatar>
          <AvatarImage src={demoPersona.avatar} />
          <AvatarFallback className="bg-secondary text-secondary-foreground">AM</AvatarFallback>
        </Avatar>
        <div className="flex-1">
          <h3 className="font-serif text-lg text-primary-foreground">{demoPersona.name}</h3>
          <p className="text-sm text-primary-foreground/70">{demoPersona.relationship}</p>
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={playVoice}
          className="text-primary-foreground/80 hover:text-primary-foreground hover:bg-white/10"
        >
          <Volume2 size={18} />
        </Button>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        <AnimatePresence>
          {messages.map((message) => (
            <motion.div
              key={message.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div className={`max-w-[80%] ${
                message.sender === 'user' 
                  ? 'bg-secondary text-secondary-foreground' 
                  : 'bg-primary-foreground/10 text-primary-foreground'
              } rounded-2xl px-4 py-2`}>
                <p className="text-sm">{message.text}</p>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>

        {isTyping && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex justify-start"
          >
            <div className="bg-primary-foreground/10 text-primary-foreground rounded-2xl px-4 py-2">
              <div className="flex space-x-1">
                <div className="w-2 h-2 bg-primary-foreground/50 rounded-full animate-bounce"></div>
                <div className="w-2 h-2 bg-primary-foreground/50 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                <div className="w-2 h-2 bg-primary-foreground/50 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
              </div>
            </div>
          </motion.div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Suggested Messages */}
      {showSuggestions && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="px-4 pb-2"
        >
          <div className="flex flex-wrap gap-2">
            {suggestedMessages.slice(0, 3).map((suggestion, index) => (
              <Button
                key={index}
                variant="outline"
                size="sm"
                onClick={() => handleSuggestedMessage(suggestion)}
                className="text-xs bg-primary-foreground/5 border-primary-foreground/20 text-primary-foreground hover:bg-primary-foreground/10"
              >
                {suggestion}
              </Button>
            ))}
          </div>
        </motion.div>
      )}

      {/* Input */}
      <div className="p-4 border-t border-primary-foreground/10">
        <div className="flex gap-2">
          <Input
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && sendMessage(inputValue)}
            placeholder="Digite sua mensagem..."
            className="flex-1 bg-primary-foreground/5 border-primary-foreground/20 text-primary-foreground placeholder:text-primary-foreground/50"
            disabled={isTyping}
          />
          <Button
            onClick={() => sendMessage(inputValue)}
            disabled={!inputValue.trim() || isTyping}
            className="bg-secondary hover:bg-secondary/90 text-secondary-foreground"
          >
            <Send size={16} />
          </Button>
        </div>
      </div>

      {/* Demo Badge */}
      <div className="absolute top-2 right-2">
        <div className="bg-accent/20 backdrop-blur-sm border border-accent/30 rounded-full px-3 py-1 flex items-center gap-1">
          <Sparkles size={12} className="text-accent" />
          <span className="text-xs text-accent font-medium">Demo</span>
        </div>
      </div>
    </div>
  );
};