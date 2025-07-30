export interface Memory {
  id: string;
  text: string;
  mediaUrl?: string;
  mediaType?: 'image' | 'video' | 'audio';
  fileName?: string;
}

export interface Person {
  id: string;
  name: string;
  relationship: string;
  howTheyCalledYou?: string;
  birthYear?: number;
  avatar?: string;
  memories: Memory[];
  personality: string[];
  commonPhrases: string[];
  temperature: number;
  // Novos campos para calibração da personalidade
  talkingStyle?: string; // Como ela falava (formal, casual, etc)
  humorStyle?: string; // Tipo de humor (sarcástico, ingênuo, etc)
  emotionalTone?: string; // Tom emocional (carinhoso, sério, etc)
  verbosity?: string; // Nível de detalhamento nas respostas
  values?: string[]; // Valores importantes para ela
  topics?: string[]; // Assuntos que ela mais gostava de falar
  voiceSettings?: {
    hasRecording: boolean;
    voiceId?: string;
  };
  createdAt: Date;
  updatedAt: Date;
  lastConversation?: Date;
}

export interface Message {
  id: string;
  content: string;
  isUser: boolean;
  timestamp: Date;
  hasAudio?: boolean;
  audioUrl?: string;
}

export interface Conversation {
  id: string;
  personId: string;
  messages: Message[];
  createdAt: Date;
  updatedAt: Date;
}