import { whatsappChatParser } from './whatsappChatParser';
import { memoriesService } from './memoriesService';

interface ChatMemoryData {
  memories: string[];
  summary: string;
  insights: {
    phrases: string[];
    personality: string[];
    values: string[];
    topics: string[];
  };
}

class ChatMemoryService {
  async processChatFile(file: File): Promise<ChatMemoryData> {
    try {
      // Read file content
      const content = await file.text();
      
      // Parse chat
      const parsedData = whatsappChatParser.parseWhatsAppChat(content);
      
      if (parsedData.totalMessages === 0) {
        throw new Error('Não foi possível identificar mensagens no formato WhatsApp no arquivo.');
      }

      // Extract memories
      const memories = whatsappChatParser.extractMemoriesFromChat(parsedData);
      
      // Generate summary
      const summary = whatsappChatParser.generateChatSummary(parsedData);

      // Extract insights
      const insights = this.extractInsights(parsedData);

      return {
        memories,
        summary,
        insights
      };
    } catch (error) {
      console.error('Error processing chat file:', error);
      throw error;
    }
  }

  private extractInsights(parsedData: any) {
    const allMessages = parsedData.messages.map((m: any) => m.message).join(' ');
    
    // Simple text analysis - could be enhanced with AI
    const words = allMessages
      .toLowerCase()
      .replace(/[^\w\s]/g, ' ')
      .split(/\s+/)
      .filter(word => word.length > 3);

    const wordCount = words.reduce((acc, word) => {
      acc[word] = (acc[word] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const topWords = Object.entries(wordCount)
      .sort(([,a], [,b]) => (b as number) - (a as number))
      .slice(0, 20)
      .map(([word]) => word);

    // Extract meaningful phrases from messages
    const phrases = parsedData.messages
      .filter((m: any) => m.message.length > 20 && m.message.length < 100)
      .slice(0, 8)
      .map((m: any) => m.message);

    // Generate personality insights based on communication patterns
    const personality = [];
    if (parsedData.totalMessages > 100) personality.push('Comunicativo(a)');
    if (allMessages.includes('haha') || allMessages.includes('kkkk')) personality.push('Bem-humorado(a)');
    if (allMessages.includes('amor') || allMessages.includes('querido')) personality.push('Carinhoso(a)');
    if (phrases.some((p: string) => p.includes('?'))) personality.push('Curioso(a)');

    return {
      phrases: phrases.slice(0, 5),
      personality: personality.slice(0, 5),
      values: topWords.slice(0, 5),
      topics: topWords.slice(5, 10)
    };
  }

  async saveMemoriesToPerson(personId: string, memories: string[]): Promise<void> {
    try {
      const memoryPromises = memories.map(async (memoryText) => {
        return memoriesService.createMemory(personId, {
          text: memoryText,
          mediaUrl: '',
          mediaType: undefined,
          fileName: undefined
        });
      });

      await Promise.all(memoryPromises);
    } catch (error) {
      console.error('Error saving memories to person:', error);
      throw new Error('Erro ao salvar memórias');
    }
  }
}

export const chatMemoryService = new ChatMemoryService();