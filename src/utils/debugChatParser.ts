// Temporary debug utility for testing WhatsApp chat parsing
import { whatsappChatParser } from '@/services/whatsappChatParser';

export const debugChatParser = (content: string) => {
  console.log('🔧 Debug: Testing chat parser with sample content');
  
  // Test with first few lines
  const sampleLines = content.split('\n').slice(0, 10);
  console.log('📝 Sample lines:', sampleLines);
  
  const result = whatsappChatParser.parseWhatsAppChat(content);
  console.log('🎯 Parser result:', {
    totalMessages: result.totalMessages,
    participants: result.participants,
    sampleMessages: result.messages.slice(0, 5)
  });
  
  return result;
};