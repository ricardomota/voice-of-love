import { supabase } from "@/integrations/supabase/client";
import { Message } from "@/types/person";

export interface Conversation {
  id: string;
  personId: string;
  userId: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface ConversationMessage {
  id: string;
  conversationId: string;
  content: string;
  isUser: boolean;
  hasAudio?: boolean;
  audioUrl?: string;
  createdAt: Date;
}

export const conversationService = {
  async createConversation(personId: string): Promise<Conversation> {
    const { data: user } = await supabase.auth.getUser();
    if (!user.user) throw new Error('User not authenticated');

    const { data, error } = await supabase
      .from('conversations')
      .insert({
        person_id: personId,
        user_id: user.user.id
      })
      .select()
      .single();

    if (error) throw error;

    return {
      id: data.id,
      personId: data.person_id,
      userId: data.user_id,
      createdAt: new Date(data.created_at),
      updatedAt: new Date(data.updated_at)
    };
  },

  async addMessage(
    conversationId: string, 
    content: string, 
    isUser: boolean,
    hasAudio?: boolean,
    audioUrl?: string
  ): Promise<ConversationMessage> {
    const { data, error } = await supabase
      .from('messages')
      .insert({
        conversation_id: conversationId,
        content,
        is_user: isUser,
        has_audio: hasAudio || false,
        audio_url: audioUrl
      })
      .select()
      .single();

    if (error) throw error;

    return {
      id: data.id,
      conversationId: data.conversation_id,
      content: data.content,
      isUser: data.is_user,
      hasAudio: data.has_audio,
      audioUrl: data.audio_url,
      createdAt: new Date(data.created_at)
    };
  },

  async getConversationMessages(conversationId: string): Promise<ConversationMessage[]> {
    const { data, error } = await supabase
      .from('messages')
      .select('*')
      .eq('conversation_id', conversationId)
      .order('created_at', { ascending: true });

    if (error) throw error;

    return data.map(msg => ({
      id: msg.id,
      conversationId: msg.conversation_id,
      content: msg.content,
      isUser: msg.is_user,
      hasAudio: msg.has_audio,
      audioUrl: msg.audio_url,
      createdAt: new Date(msg.created_at)
    }));
  },

  async getPersonConversations(personId: string): Promise<Conversation[]> {
    const { data, error } = await supabase
      .from('conversations')
      .select('*')
      .eq('person_id', personId)
      .order('created_at', { ascending: false });

    if (error) throw error;

    return data.map(conv => ({
      id: conv.id,
      personId: conv.person_id,
      userId: conv.user_id,
      createdAt: new Date(conv.created_at),
      updatedAt: new Date(conv.updated_at)
    }));
  },

  // Converte messages do chat para format do banco
  convertChatMessagesToDb(messages: Message[]): { content: string; isUser: boolean }[] {
    return messages.map(msg => ({
      content: msg.content,
      isUser: msg.isUser
    }));
  },

  // Converte messages do banco para format do chat
  convertDbMessagesToChat(messages: ConversationMessage[]): Message[] {
    return messages.map(msg => ({
      id: msg.id,
      content: msg.content,
      isUser: msg.isUser,
      timestamp: msg.createdAt
    }));
  }
};