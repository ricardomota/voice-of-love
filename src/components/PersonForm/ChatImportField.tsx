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
  const [fileName, setFileName] = useState<string>('');
  const [isProcessed, setIsProcessed] = useState(false);
  const [summary, setSummary] = useState<string>('');
  const { toast } = useToast();

  const handleFileUpload = async (file: File) => {
    try {
      // Validate file
      validateFile(file, {
        maxSize: 10 * 1024 * 1024, // 10MB
        allowedTypes: ['text/plain'],
        isImage: false
      });

      setIsProcessing(true);
      setFileName(file.name);

      // Process chat using the service
      const chatData = await chatMemoryService.processChatFile(file);
      
      setSummary(chatData.summary);

      if (onAnalysisGenerated) {
        onAnalysisGenerated(chatData.insights);
      }

      onMemoriesExtracted(chatData.memories);
      setIsProcessed(true);

      toast({
        title: "Chat importado com sucesso!",
        description: `${chatData.memories.length} memórias extraídas do chat.`,
      });

    } catch (error) {
      console.error('Erro ao processar chat:', error);
      toast({
        title: "Erro ao processar chat",
        description: error instanceof Error ? error.message : 'Erro desconhecido',
        variant: "destructive"
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const reset = () => {
    setFileName('');
    setIsProcessed(false);
    setSummary('');
  };

  return (
    <Card className="border-2 border-dashed border-border">
      <CardHeader className="text-center">
        <CardTitle className="flex items-center justify-center gap-2 text-lg">
          <MessageSquare className="w-5 h-5" />
          Importar Conversa de Chat
        </CardTitle>
        <p className="text-sm text-muted-foreground">
          Carregue um arquivo .txt de chat exportado (WhatsApp, Telegram, Discord) para extrair memórias automaticamente
        </p>
      </CardHeader>
      <CardContent className="space-y-4">
        {!isProcessed ? (
          <FileUploadField
            onUpload={handleFileUpload}
            isUploading={isProcessing}
            accept=".txt"
            mediaType="text"
            fileName={fileName}
          >
            <div className="text-xs text-muted-foreground mt-2 space-y-1">
              <div className="font-medium">Formatos suportados:</div>
              <div>• WhatsApp: Menu → Mais → Exportar conversa (sem mídia)</div>
              <div>• Telegram: Configurações → Exportar dados do Telegram</div>
              <div>• Discord: Usar bots como DiscordChatExporter</div>
              <div>• Qualquer chat em formato .txt com "Nome: Mensagem"</div>
            </div>
          </FileUploadField>
        ) : (
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-green-600">
              <CheckCircle className="w-5 h-5" />
              <span className="font-medium">Chat processado com sucesso!</span>
            </div>
            
            {summary && (
              <div className="bg-muted/50 rounded-lg p-4">
                <h4 className="font-medium mb-2">Resumo da Importação:</h4>
                <pre className="text-sm whitespace-pre-wrap text-muted-foreground">
                  {summary}
                </pre>
              </div>
            )}

            <Button
              variant="outline"
              onClick={reset}
              className="w-full"
            >
              Importar outro chat
            </Button>
          </div>
        )}

        <div className="flex items-start gap-2 text-xs text-muted-foreground bg-blue-50 dark:bg-blue-950/20 p-3 rounded-lg">
          <AlertCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
          <div>
            <div className="font-medium">Privacidade:</div>
            <div>
              O chat é processado localmente no seu navegador. As memórias extraídas 
              são salvas de forma segura e privada na sua conta.
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};