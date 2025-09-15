interface ChatMessage {
  timestamp?: Date;
  sender: string;
  message: string;
}

interface ParsedChatData {
  messages: ChatMessage[];
  participants: string[];
  totalMessages: number;
  dateRange?: {
    start: Date;
    end: Date;
  };
}

class WhatsAppChatParser {
  private parseWhatsAppLine(line: string): ChatMessage | null {
    // WhatsApp format: [DD/MM/YYYY, HH:MM:SS] Sender: Message
    // or [DD/MM/YYYY HH:MM:SS] Sender: Message
    // or DD/MM/YYYY, HH:MM - Sender: Message
    // Also supports Telegram and other chat formats
    const patterns = [
      // [DD/MM/YYYY, HH:MM:SS] format (WhatsApp)
      /^\[(\d{1,2}\/\d{1,2}\/\d{4}),?\s+(\d{1,2}:\d{2}(?::\d{2})?)\]\s+([^:]+):\s*(.*)/,
      // DD/MM/YYYY, HH:MM format (WhatsApp alternative)
      /^(\d{1,2}\/\d{1,2}\/\d{4}),?\s+(\d{1,2}:\d{2}(?::\d{2})?)\s*-\s*([^:]+):\s*(.*)/,
      // Alternative format with different separators
      /^(\d{1,2}\/\d{1,2}\/\d{4})\s+(\d{1,2}:\d{2}(?::\d{2})?)\s*-\s*([^:]+):\s*(.*)/,
      // Telegram format: [DD.MM.YY HH:MM:SS] Sender:
      /^\[(\d{1,2}\.\d{1,2}\.\d{2,4})\s+(\d{1,2}:\d{2}(?::\d{2})?)\]\s+([^:]+):\s*(.*)/,
      // Simple format: Sender: Message (for generic chat exports)
      /^([^:]+):\s*(.+)/,
      // Discord format: [Today at HH:MM] or [DD/MM/YYYY HH:MM] Sender
      /^\[(?:Today at |(\d{1,2}\/\d{1,2}\/\d{4})\s+)?(\d{1,2}:\d{2}(?::\d{2})?)\]\s+([^:]+):\s*(.*)/
    ];

    for (const pattern of patterns) {
      const match = line.match(pattern);
      if (match) {
        let date, time, sender, message;
        
        if (pattern.source.includes('Today at')) {
          // Discord "Today at" format
          [, date, time, sender, message] = match;
          date = new Date().toLocaleDateString('pt-BR'); // Use today's date
        } else if (pattern.source.includes('\\.')) {
          // Telegram format with dots
          [, date, time, sender, message] = match;
          // Convert DD.MM.YY to DD/MM/YYYY
          const [day, month, year] = date.split('.');
          const fullYear = year.length === 2 ? `20${year}` : year;
          date = `${day}/${month}/${fullYear}`;
        } else if (match.length === 3) {
          // Simple format without date/time
          [, sender, message] = match;
          return {
            sender: sender.trim(),
            message: message.trim()
          };
        } else {
          [, date, time, sender, message] = match;
        }
        
        try {
          if (date && time) {
            // Parse date (DD/MM/YYYY)
            const [day, month, year] = date.split('/').map(Number);
            // Parse time (HH:MM or HH:MM:SS)
            const timeParts = time.split(':').map(Number);
            const hour = timeParts[0];
            const minute = timeParts[1];
            const second = timeParts[2] || 0;
            
            const timestamp = new Date(year, month - 1, day, hour, minute, second);
            
            return {
              timestamp,
              sender: sender.trim(),
              message: message.trim()
            };
          } else {
            return {
              sender: sender.trim(),
              message: message.trim()
            };
          }
        } catch (error) {
          console.warn('Failed to parse date/time:', date, time);
          return {
            sender: sender.trim(),
            message: message.trim()
          };
        }
      }
    }

    return null;
  }

  parseWhatsAppChat(content: string): ParsedChatData {
    const lines = content.split('\n').filter(line => line.trim());
    const messages: ChatMessage[] = [];
    const participants = new Set<string>();
    let currentMessage: ChatMessage | null = null;

    for (const line of lines) {
      const parsedMessage = this.parseWhatsAppLine(line);
      
      if (parsedMessage) {
        // If we have a previous message being built, save it
        if (currentMessage) {
          messages.push(currentMessage);
          participants.add(currentMessage.sender);
        }
        
        currentMessage = parsedMessage;
      } else if (currentMessage && line.trim()) {
        // This is a continuation of the previous message (multiline)
        currentMessage.message += '\n' + line.trim();
      }
    }

    // Don't forget the last message
    if (currentMessage) {
      messages.push(currentMessage);
      participants.add(currentMessage.sender);
    }

    const timestamps = messages
      .map(m => m.timestamp)
      .filter(t => t) as Date[];

    const dateRange = timestamps.length > 0 ? {
      start: new Date(Math.min(...timestamps.map(t => t.getTime()))),
      end: new Date(Math.max(...timestamps.map(t => t.getTime())))
    } : undefined;

    return {
      messages,
      participants: Array.from(participants),
      totalMessages: messages.length,
      dateRange
    };
  }

  extractMemoriesFromChat(parsedData: ParsedChatData, targetPersonName?: string): string[] {
    const memories: string[] = [];
    const { messages } = parsedData;

    // Filter messages from target person if specified
    const targetMessages = targetPersonName 
      ? messages.filter(msg => msg.sender === targetPersonName)
      : messages;

    // Group messages by date or conversation threads
    const conversationGroups: ChatMessage[][] = [];
    let currentGroup: ChatMessage[] = [];
    let lastTimestamp: Date | undefined;

    for (const message of targetMessages) {
      // Start a new group if there's a significant time gap (more than 2 hours)
      if (lastTimestamp && message.timestamp) {
        const timeDiff = message.timestamp.getTime() - lastTimestamp.getTime();
        if (timeDiff > 2 * 60 * 60 * 1000) { // 2 hours
          if (currentGroup.length > 0) {
            conversationGroups.push([...currentGroup]);
            currentGroup = [];
          }
        }
      }

      currentGroup.push(message);
      lastTimestamp = message.timestamp;
    }

    if (currentGroup.length > 0) {
      conversationGroups.push(currentGroup);
    }

    // Extract meaningful conversations as memories (focusing on target person)
    for (const group of conversationGroups) {
      if (group.length >= 2) { // At least 2 messages from target person
        const dateStr = group[0].timestamp 
          ? group[0].timestamp.toLocaleDateString('pt-BR')
          : 'Data desconhecida';

        // For target person memories, show their messages in context
        const contextualConversation = this.buildContextualMemory(group, messages, targetPersonName);
        
        if (contextualConversation) {
          memories.push(`Conversa de ${dateStr}:\n${contextualConversation}`);
        }
      }
    }

    // Also extract individual meaningful messages from target person
    const meaningfulMessages = targetMessages.filter(msg => 
      msg.message.length > 30 && 
      msg.message.length < 200 &&
      !msg.message.includes('<Media omitted>') &&
      !msg.message.includes('arquivo de mídia omitido') &&
      !msg.message.toLowerCase().includes('mensagem apagada')
    );

    for (const message of meaningfulMessages.slice(0, 15)) { // Limit to 15 individual messages
      const dateStr = message.timestamp 
        ? message.timestamp.toLocaleDateString('pt-BR')
        : 'Data desconhecida';
      
      memories.push(`${dateStr} - ${message.sender}: ${message.message}`);
    }

    return memories.slice(0, 25); // Limit total memories to 25
  }

  private buildContextualMemory(targetGroup: ChatMessage[], allMessages: ChatMessage[], targetPersonName?: string): string | null {
    if (!targetPersonName) {
      return targetGroup.map(msg => `${msg.sender}: ${msg.message}`).join('\n');
    }

    // Find the broader context around these messages
    const firstMessage = targetGroup[0];
    const lastMessage = targetGroup[targetGroup.length - 1];
    
    const contextMessages = allMessages.filter(msg => {
      if (!msg.timestamp || !firstMessage.timestamp || !lastMessage.timestamp) return false;
      return msg.timestamp >= firstMessage.timestamp && msg.timestamp <= lastMessage.timestamp;
    });

    // Build conversation showing both sides but highlighting target person
    const conversation = contextMessages
      .map(msg => {
        const isTarget = msg.sender === targetPersonName;
        const prefix = isTarget ? '✓' : ' ';
        return `${prefix} ${msg.sender}: ${msg.message}`;
      })
      .join('\n');

    return conversation;
  }

  generateChatSummary(parsedData: ParsedChatData, targetPersonName?: string): string {
    const { messages, participants, totalMessages, dateRange } = parsedData;
    
    const summary = [];
    summary.push(`📱 Análise do Chat:`);
    summary.push(`• Total de mensagens: ${totalMessages}`);
    summary.push(`• Participantes: ${participants.join(', ')}`);
    
    if (targetPersonName) {
      const targetMessages = messages.filter(m => m.sender === targetPersonName);
      summary.push(`• Mensagens de ${targetPersonName}: ${targetMessages.length} (${Math.round(targetMessages.length/totalMessages*100)}%)`);
    }
    
    if (dateRange) {
      summary.push(`• Período: ${dateRange.start.toLocaleDateString('pt-BR')} a ${dateRange.end.toLocaleDateString('pt-BR')}`);
    }

    // Analyze message frequency by participant
    const messagesByParticipant = participants.map(participant => {
      const count = messages.filter(m => m.sender === participant).length;
      const percentage = Math.round(count/totalMessages*100);
      return `${participant}: ${count} (${percentage}%)`;
    });

    summary.push(`• Distribuição: ${messagesByParticipant.join(', ')}`);

    return summary.join('\n');
  }
}

export const whatsappChatParser = new WhatsAppChatParser();