export interface Person {
  id: string;
  name: string;
  relationship: string;
  birthYear?: number;
  avatar?: string;
  memories: string[];
  personality: string[];
  commonPhrases: string[];
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