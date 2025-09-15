import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { FileUploadField } from './FileUploadField';
import { chatMemoryService } from '@/services/chatMemoryService';
import { useToast } from '@/hooks/use-toast';
import { Loader2, CheckCircle2 } from 'lucide-react';

interface ChatImportFieldProps {
  targetPersonName?: string;
  userName?: string;
  relationship?: string;
  onMemoriesExtracted: (memories: string[]) => void;
  onAnalysisGenerated?: (analysis: { phrases: string[], personality: string[], values: string[], topics: string[] }) => void;
  onEternaAnalysisGenerated?: (analysis: any) => void;
}

export const ChatImportField: React.FC<ChatImportFieldProps> = ({ 
  targetPersonName,
  userName,
  relationship,
  onMemoriesExtracted,
  onAnalysisGenerated,
  onEternaAnalysisGenerated
}) => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [processedCount, setProcessedCount] = useState<number | null>(null);
  const { toast } = useToast();

  const handleFileUpload = async (file: File) => {
    if (file.size > 20 * 1024 * 1024) { // 20MB limit
      toast({
        title: "Arquivo muito grande",
        description: "O arquivo deve ter menos de 20MB",
        variant: "destructive",
      });
      return;
    }

    if (!file.name.endsWith('.txt')) {
      toast({
        title: "Formato não suportado",
        description: "Por favor, envie um arquivo de texto (.txt)",
        variant: "destructive",
      });
      return;
    }

    setIsProcessing(true);
    try {
      // Process the chat file
      const result = await chatMemoryService.processChatFile(file, targetPersonName, userName, relationship);

      // Call analysis callback if provided
      if (onAnalysisGenerated) {
        onAnalysisGenerated(result.insights);
      }

      // Call ETERNA analysis callback if provided
      if (onEternaAnalysisGenerated && result.eternaAnalysis) {
        onEternaAnalysisGenerated(result.eternaAnalysis);
      }

      // Call memories callback
      onMemoriesExtracted(result.memories);
      setProcessedCount(result.memories.length);

      const eternaInfo = result.eternaAnalysis ? 
        ` | Perfil ETERNA criado (${result.eternaAnalysis.confidence_overall} confiança)` : '';
      
      toast({
        title: "✅ Chat analisado com sucesso!",
        description: `${result.memories.length} memórias extraídas${eternaInfo}`,
      });
    } catch (error) {
      console.error('Error processing chat file:', error);
      toast({
        title: "Erro ao processar chat",
        description: error instanceof Error ? error.message : "Erro desconhecido",
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <Card className="border-2 border-dashed border-muted-foreground/25 hover:border-primary/50 transition-colors">
      <div className="p-6">
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <div className="flex items-center justify-center w-8 h-8 bg-primary/10 rounded-full">
              📱
            </div>
            <div>
              <h3 className="font-semibold">Importar Histórico do WhatsApp</h3>
              <p className="text-sm text-muted-foreground">
                Extraia memórias automaticamente do chat
              </p>
            </div>
          </div>

          {isProcessing ? (
            <div className="flex items-center gap-2 p-4 bg-blue-50 dark:bg-blue-950/20 rounded-lg">
              <Loader2 className="w-4 h-4 animate-spin" />
              <span className="text-sm">Analisando chat com IA...</span>
            </div>
          ) : processedCount !== null ? (
            <div className="flex items-center gap-2 p-4 bg-green-50 dark:bg-green-950/20 rounded-lg">
              <CheckCircle2 className="w-4 h-4 text-green-600" />
              <span className="text-sm text-green-700 dark:text-green-300">
                {processedCount} memórias extraídas com sucesso!
              </span>
            </div>
          ) : (
            <FileUploadField
              onUpload={handleFileUpload}
              isUploading={isProcessing}
              accept=".txt"
            />
          )}

          <div className="space-y-3 text-sm text-muted-foreground">
            <div>
              <strong className="text-foreground">Como exportar:</strong>
            </div>
            
            <div className="space-y-2">
              <div className="flex items-start gap-2">
                <span className="text-green-600 font-semibold">WhatsApp:</span>
                <span>Chat → Opções → Mais → Exportar conversa → Sem mídia</span>
              </div>
              
              <div className="flex items-start gap-2">
                <span className="text-blue-600 font-semibold">Telegram:</span>
                <span>Chat → Menu → Exportar histórico → Como arquivo de texto</span>
              </div>
            </div>

            <div className="pt-2 border-t">
              <strong className="text-foreground">🔐 Privacidade e Segurança:</strong>
              <span className="block mt-1">
                Seus dados são processados localmente e com segurança. Informações pessoais sensíveis 
                são automaticamente filtradas durante a análise.
              </span>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
};