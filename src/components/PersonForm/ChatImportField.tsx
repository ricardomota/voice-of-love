import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { FileUploadField } from './FileUploadField';
import { chatMemoryService } from '@/services/chatMemoryService';
import { validateFile } from '@/utils/fileValidation';
import { useToast } from '@/hooks/use-toast';
import { MessageSquare, Upload, CheckCircle, AlertCircle } from 'lucide-react';

interface ChatImportFieldProps {
  onMemoriesExtracted: (memories: string[]) => void;
  onAnalysisGenerated?: (analysis: { phrases: string[], personality: string[], values: string[], topics: string[] }) => void;
}

export const ChatImportField: React.FC<ChatImportFieldProps> = ({
  onMemoriesExtracted,
  onAnalysisGenerated
}) => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [processedCount, setProcessedCount] = useState<number>(0);
  const { toast } = useToast();

  const handleFileUpload = async (file: File) => {
    try {
      validateFile(file, {
        maxSize: 10 * 1024 * 1024, // 10MB
        allowedTypes: ['text/plain'],
        isImage: false
      });

      setIsProcessing(true);

      const chatData = await chatMemoryService.processChatFile(file);
      
      if (onAnalysisGenerated) {
        onAnalysisGenerated(chatData.insights);
      }

      onMemoriesExtracted(chatData.memories);
      setProcessedCount(chatData.memories.length);

      toast({
        title: "✅ Chat importado!",
        description: `${chatData.memories.length} memórias extraídas com sucesso.`,
      });

    } catch (error) {
      console.error('Erro ao processar chat:', error);
      toast({
        title: "Erro ao processar chat",
        description: error instanceof Error ? error.message : 'Formato inválido ou erro no arquivo',
        variant: "destructive"
      });
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="border-2 border-dashed border-border/50 rounded-lg p-6 text-center hover:border-border transition-colors">
        <div className="flex flex-col items-center gap-3">
          <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
            <Upload className="w-6 h-6 text-primary" />
          </div>
          
          <div>
            <h3 className="font-medium text-lg mb-1">Importar Chat</h3>
            <p className="text-sm text-muted-foreground mb-3">
              Arraste seu arquivo .txt ou clique para selecionar
            </p>
          </div>

          <FileUploadField
            onUpload={handleFileUpload}
            isUploading={isProcessing}
            accept=".txt"
            mediaType="text"
          />

          {isProcessing && (
            <div className="flex items-center gap-2 text-blue-600">
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
              <span className="text-sm">Processando chat...</span>
            </div>
          )}

          {processedCount > 0 && !isProcessing && (
            <div className="flex items-center gap-2 text-green-600 bg-green-50 dark:bg-green-950/20 px-3 py-2 rounded-lg">
              <CheckCircle className="w-4 h-4" />
              <span className="text-sm font-medium">
                {processedCount} memórias extraídas!
              </span>
            </div>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
        <div className="bg-muted/30 rounded-lg p-3">
          <div className="font-medium text-green-600 mb-1">💬 WhatsApp</div>
          <div className="text-muted-foreground">
            Menu → Mais → Exportar conversa → Sem mídia
          </div>
        </div>
        <div className="bg-muted/30 rounded-lg p-3">
          <div className="font-medium text-blue-600 mb-1">📱 Telegram</div>
          <div className="text-muted-foreground">
            Configurações → Exportar dados
          </div>
        </div>
      </div>

      <div className="bg-blue-50 dark:bg-blue-950/20 rounded-lg p-3 text-xs">
        <div className="flex items-start gap-2">
          <AlertCircle className="w-4 h-4 mt-0.5 flex-shrink-0 text-blue-600" />
          <div>
            <div className="font-medium text-blue-900 dark:text-blue-100">
              Processamento Local & Privado
            </div>
            <div className="text-blue-700 dark:text-blue-300">
              Seu chat é analisado no navegador, apenas as memórias são salvas.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};