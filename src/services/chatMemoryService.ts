import { whatsappChatParser } from './whatsappChatParser';
import { memoriesService } from './memoriesService';
import { eternaPersonaService } from './eternaPersonaService';

interface ChatMemoryData {
  memories: string[];
  summary: string;
  targetPerson: string | null;
  insights: {
    phrases: string[];
    personality: string[];
    values: string[];
    topics: string[];
  };
  eternaAnalysis?: any; // ETERNA persona analysis
}

class ChatMemoryService {
  async processChatFile(file: File, targetPersonName?: string, userName?: string, relationship?: string): Promise<ChatMemoryData> {
    try {
      // Read file content
      const content = await file.text();
      console.log(`Processing chat file: ${file.name}, size: ${file.size} bytes`);
      
      // Parse chat
      const parsedData = whatsappChatParser.parseWhatsAppChat(content);
      console.log(`Parsed chat data:`, {
        totalMessages: parsedData.totalMessages,
        participants: parsedData.participants,
        dateRange: parsedData.dateRange
      });
      
      if (parsedData.totalMessages === 0) {
        throw new Error('Não foi possível identificar mensagens no formato WhatsApp no arquivo.');
      }

      // Identify target person intelligently
      const targetPerson = await this.identifyTargetPerson(parsedData, targetPersonName);
      console.log(`Target person identified: ${targetPerson}`);

      // Extract memories focused on the target person
      const memories = whatsappChatParser.extractMemoriesFromChat(parsedData, targetPerson);
      console.log(`Extracted ${memories.length} memories`);
      
      // Generate summary
      const summary = whatsappChatParser.generateChatSummary(parsedData, targetPerson);

      // Extract insights focused on the target person
      const insights = await this.extractPersonalizedInsights(parsedData, targetPerson);

      // Run ETERNA analysis if we have enough information
      let eternaAnalysis = null;
      if (targetPerson && userName && relationship) {
        try {
          eternaAnalysis = await eternaPersonaService.analyzeChat({
            userName,
            targetPersonName: targetPerson,
            relationshipToUser: relationship,
            chatHistory: content,
            optionalContext: {
              locale: "pt-BR"
            }
          });
        } catch (error) {
          console.warn('ETERNA analysis failed:', error);
        }
      }

      return {
        memories,
        summary,
        targetPerson,
        insights,
        eternaAnalysis
      };
    } catch (error) {
      console.error('Error processing chat file:', error);
      throw error;
    }
  }

  private async identifyTargetPerson(parsedData: any, targetPersonName?: string): Promise<string | null> {
    const participants = parsedData.participants;
    
    if (!targetPersonName || participants.length <= 1) {
      return null; // Não há como identificar ou só há uma pessoa
    }

    // Find best match for target person name
    const normalizedTarget = this.normalizePersonName(targetPersonName);
    
    // Try exact matches first
    for (const participant of participants) {
      const normalizedParticipant = this.normalizePersonName(participant);
      if (normalizedParticipant === normalizedTarget) {
        return participant;
      }
    }

    // Try partial matches (first name, last name, nicknames)
    const targetWords = normalizedTarget.split(' ');
    for (const participant of participants) {
      const participantWords = this.normalizePersonName(participant).split(' ');
      
      // Check if any word from target matches any word from participant
      for (const targetWord of targetWords) {
        for (const participantWord of participantWords) {
          if (targetWord.length > 2 && participantWord.includes(targetWord)) {
            return participant;
          }
          if (participantWord.length > 2 && targetWord.includes(participantWord)) {
            return participant;
          }
        }
      }
    }

    // If still no match, use the participant who is NOT the phone owner
    // Phone owner typically appears as "You", "Você", or has many system messages
    const likelyPhoneOwner = participants.find(p => 
      ['you', 'você', 'eu'].includes(this.normalizePersonName(p))
    );
    
    if (likelyPhoneOwner) {
      return participants.find(p => p !== likelyPhoneOwner) || null;
    }

    // As last resort, return the participant with fewer messages (likely the contact)
    const messageCount = participants.map(p => ({
      name: p,
      count: parsedData.messages.filter((m: any) => m.sender === p).length
    }));

    messageCount.sort((a, b) => a.count - b.count);
    return messageCount[0]?.name || null;
  }

  private normalizePersonName(name: string): string {
    return name
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '') // Remove accents
      .replace(/[^\w\s]/g, '') // Remove special characters
      .trim();
  }

  private async extractPersonalizedInsights(parsedData: any, targetPerson: string | null) {
    // Filter messages from the target person if identified
    const relevantMessages = targetPerson 
      ? parsedData.messages.filter((m: any) => m.sender === targetPerson)
      : parsedData.messages;

    const allMessages = relevantMessages.map((m: any) => m.message).join(' ');
    
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

    // Extract meaningful phrases from target person's messages
    const phrases = relevantMessages
      .filter((m: any) => m.message.trim().length > 0) // Remove limite de tamanho
      .map((m: any) => m.message);

    // Generate personality insights based on target person's communication patterns
    const personality = [];
    const messageCount = relevantMessages.length;
    
    if (messageCount > 50) personality.push('Comunicativo(a)');
    if (messageCount < 20) personality.push('Reservado(a)');
    
    // Analyze emotional indicators
    if (allMessages.includes('haha') || allMessages.includes('kkkk') || allMessages.includes('😂')) {
      personality.push('Bem-humorado(a)');
    }
    if (allMessages.includes('amor') || allMessages.includes('querido') || allMessages.includes('❤️')) {
      personality.push('Carinhoso(a)');
    }
    if (phrases.filter((p: string) => p.includes('?')).length > 3) {
      personality.push('Curioso(a)');
    }
    if (allMessages.includes('obrigad') || allMessages.includes('por favor')) {
      personality.push('Educado(a)');
    }
    
    // Analyze message patterns
    const avgMessageLength = allMessages.length / messageCount;
    if (avgMessageLength > 100) {
      personality.push('Detalhista');
    } else if (avgMessageLength < 30) {
      personality.push('Direto(a)');
    }

    return {
      phrases: phrases, // Todas as frases
      personality: personality, // Todos os traços
      values: topWords, // Todas as palavras importantes  
      topics: topWords.slice(8) // Tópicos adicionais
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