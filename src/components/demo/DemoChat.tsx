import React, { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Send, Volume2, Heart, Sparkles, Brain, Mic } from 'lucide-react';
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
      "Oi meu bem! Como está meu netinho querido? Que saudade de você! Estava aqui lembrando daquela vez que fazíamos pão juntos...",
      "Olá meu amor! Que alegria te ver aqui. Sabia que outro dia sonhei com você? Estava me ajudando no jardim como sempre fazia."
    ],
    "saudade": [
      "Eu também sinto muita saudade sua, meu anjo. Lembra quando você vinha correndo me abraçar depois da escola? Ainda sinto o cheiro do seu cabelo...",
      "Ah, que saudade boa essa! Você sempre foi meu netinho especial. Lembra quando você me ensinava a usar o celular e eu ficava perdida?"
    ],
    "receita": [
      "Ah! Você quer a receita do meu famoso bolo de chocolate? Era assim: 3 ovos, 2 xícaras de açúcar, 1 xícara de farinha... mas o segredo mesmo era o carinho que eu colocava em cada movimento!",
      "Claro, meu bem! Para fazer aquele brigadeiro que você adorava: 1 lata de leite condensado, 3 colheres de chocolate em pó, 1 colher de manteiga e muito amor! Você sempre lambia a panela toda!"
    ],
    "história": [
      "Deixa eu te contar sobre quando você era pequeno... Você tinha uns 5 anos e sempre corria pelo quintal atrás das galinhas! Uma vez você trouxe um pintinho pra dentro de casa escondido no bolso. Sua mãe ficou uma fera!",
      "Ah, que memória boa! Lembro quando você perdeu o primeiro dentinho brincando na minha casa. Ficou chorando, mas eu disse que a fada do dente ia dar um presente especial. No dia seguinte, 'magicamente' apareceu uma moeda debaixo do seu travesseiro!"
    ],
    "conselho": [
      "Meu neto, a vida é como fazer um bolo - às vezes não sai perfeito na primeira tentativa, mas sempre é feito com amor. Continue sendo essa pessoa boa que você é, com esse coração generoso.",
      "Lembre-se sempre do que eu te dizia: as pessoas podem esquecer o que você disse ou fez, mas nunca vão esquecer como você as fez sentir. Seja sempre gentil, meu bem."
    ],
    "trabalho": [
      "Ah, trabalho... Na minha época era diferente, mas sei que você é dedicado como sempre foi. Lembra quando você 'trabalhava' comigo no jardim? Pagava você com biscoitos!",
      "Trabalhe com paixão, meu anjo, mas não esqueça de descansar. Como eu sempre dizia: 'Quem não descansa não aguenta a caminhada'."
    ],
    "família": [
      "A família é tudo, meu bem. Mesmo longe, mesmo com diferenças, o amor sempre une. Você sempre foi o orgulho da família, sabia disso?",
      "Cuide bem da sua família, como eu cuidei da minha. E lembra: casa não é lugar, é onde estão as pessoas que amamos."
    ],
    "default": [
      "Que bom ouvir você, meu bem! Me conta mais sobre sua vida. Como estão os seus estudos?",
      "Você sempre foi tão especial para mim. Desde pequeno tinha esse jeitinho carinhoso... O que mais você gostaria de conversar?",
      "Ah, como é bom ter essa conversa com você! Parece que estou te vendo aqui na minha cozinha de novo. Continue, estou aqui te ouvindo com todo carinho."
    ]
  }
};

const suggestedMessages = [
  "Olá vovó, como está?",
  "Sinto saudade da senhora",
  "Pode me contar uma história da minha infância?",
  "Qual era mesmo a receita do seu bolo de chocolate?",
  "Preciso de um conselho sobre trabalho",
  "Como está a família?",
  "Me conta uma memória especial nossa"
];

export const DemoChat: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(true);
  const [isLearning, setIsLearning] = useState(false);
  const [conversationCount, setConversationCount] = useState(0);
  const [hasVoiceEnabled, setHasVoiceEnabled] = useState(false);
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
    
    // Check for keywords in order of specificity
    const keywords = ['receita', 'história', 'conselho', 'trabalho', 'família', 'saudade', 'olá', 'oi'];
    
    for (const key of keywords) {
      if (message.includes(key)) {
        const responses = demoPersona.responses[key];
        if (responses) {
          return responses[Math.floor(Math.random() * responses.length)];
        }
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
      setConversationCount(prev => prev + 1);
      
      // Simulate learning after every 3 messages
      if ((conversationCount + 1) % 3 === 0) {
        simulateLearning();
      }
    }, 1200 + Math.random() * 800);
  };

  const handleSuggestedMessage = (message: string) => {
    sendMessage(message);
  };

  const simulateLearning = () => {
    setIsLearning(true);
    setTimeout(() => {
      setIsLearning(false);
    }, 2000);
  };

  const playVoice = () => {
    if (!hasVoiceEnabled) {
      setHasVoiceEnabled(true);
    }
    // Simulated voice playback
    const utterance = new SpeechSynthesisUtterance("Esta é uma simulação da voz clonada da sua avó Maria");
    utterance.lang = 'pt-BR';
    utterance.rate = 0.8;
    utterance.pitch = 1.1;
    speechSynthesis.speak(utterance);
  };

  const playMessageVoice = (text: string) => {
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'pt-BR';
    utterance.rate = 0.8;
    utterance.pitch = 1.1;
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
          {hasVoiceEnabled && (
            <div className="flex items-center gap-1 mt-1">
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
              <span className="text-xs text-primary-foreground/60">Voz ativada</span>
            </div>
          )}
        </div>
        <div className="flex items-center gap-2">
          {isLearning && (
            <div className="flex items-center gap-2 bg-accent/20 px-3 py-1 rounded-full">
              <Brain className="w-4 h-4 text-accent animate-pulse" />
              <span className="text-xs text-accent">Aprendendo...</span>
            </div>
          )}
          <Button
            variant="ghost"
            size="sm"
            onClick={playVoice}
            className="text-primary-foreground/80 hover:text-primary-foreground hover:bg-white/10 relative"
          >
            <Volume2 size={18} />
            {!hasVoiceEnabled && (
              <div className="absolute -top-1 -right-1 w-3 h-3 bg-accent rounded-full animate-bounce"></div>
            )}
          </Button>
        </div>
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
              } rounded-2xl px-4 py-2 relative group`}>
                <p className="text-sm">{message.text}</p>
                {message.sender === 'ai' && hasVoiceEnabled && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => playMessageVoice(message.text)}
                    className="opacity-0 group-hover:opacity-100 absolute -bottom-8 right-0 h-6 px-2 text-xs text-primary-foreground/60 hover:text-primary-foreground"
                  >
                    <Mic className="w-3 h-3 mr-1" />
                    Ouvir
                  </Button>
                )}
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
          <div className="space-y-2">
            <p className="text-xs text-primary-foreground/60 text-center">Experimente algumas dessas conversas:</p>
            <div className="flex flex-wrap gap-2 justify-center">
              {suggestedMessages.slice(0, 4).map((suggestion, index) => (
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

      {/* Demo Features */}
      <div className="absolute top-2 left-2 right-2 flex justify-between items-start">
        <div className="bg-accent/20 backdrop-blur-sm border border-accent/30 rounded-full px-3 py-1 flex items-center gap-1">
          <Sparkles size={12} className="text-accent" />
          <span className="text-xs text-accent font-medium">Demo Interativo</span>
        </div>
        
        <div className="flex gap-2">
          {conversationCount >= 3 && (
            <div className="bg-green-500/20 backdrop-blur-sm border border-green-500/30 rounded-full px-2 py-1 flex items-center gap-1">
              <Brain size={10} className="text-green-400" />
              <span className="text-xs text-green-400 font-medium">AI Aprendendo</span>
            </div>
          )}
          {hasVoiceEnabled && (
            <div className="bg-blue-500/20 backdrop-blur-sm border border-blue-500/30 rounded-full px-2 py-1 flex items-center gap-1">
              <Volume2 size={10} className="text-blue-400" />
              <span className="text-xs text-blue-400 font-medium">Voz Ativa</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};