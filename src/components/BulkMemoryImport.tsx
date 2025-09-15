import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { ChatImportField } from '@/components/PersonForm/ChatImportField';
import { memoriesService } from '@/services/memoriesService';
import { useToast } from '@/hooks/use-toast';
import { Upload, FileText, MessageSquare, Zap } from 'lucide-react';
import { Person } from '@/types/person';

interface BulkMemoryImportProps {
  person: Person;
  onMemoriesAdded: () => void;
}

export const BulkMemoryImport: React.FC<BulkMemoryImportProps> = ({
  person,
  onMemoriesAdded
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isImporting, setIsImporting] = useState(false);
  const { toast } = useToast();

  const handleMemoriesExtracted = async (memories: string[]) => {
    setIsImporting(true);
    try {
      // Save all memories in batch
      await Promise.all(
        memories.map(memory => 
          memoriesService.createMemory(person.id, {
            text: memory,
            mediaUrl: undefined,
            mediaType: undefined,
            fileName: undefined
          })
        )
      );

      toast({
        title: "Importação concluída!",
        description: `${memories.length} memórias importadas para ${person.name}.`,
      });

      onMemoriesAdded();
      setIsOpen(false);
    } catch (error) {
      console.error('Error importing memories:', error);
      toast({
        title: "Erro na importação",
        description: "Não foi possível importar todas as memórias. Tente novamente.",
        variant: "destructive"
      });
    } finally {
      setIsImporting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="w-full">
          <Upload className="w-4 h-4 mr-2" />
          Importar Chat em Massa
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <MessageSquare className="w-5 h-5" />
            Importação em Massa de Conversas
          </DialogTitle>
          <DialogDescription>
            Importe arquivos de chat (WhatsApp, Telegram, Discord) para extrair automaticamente 
            centenas de memórias e melhorar o contexto do clone digital de {person.name}.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          <div className="bg-blue-50 dark:bg-blue-950/20 rounded-lg p-4 border border-blue-200 dark:border-blue-800">
            <div className="flex items-start gap-3">
              <Zap className="w-5 h-5 text-blue-600 mt-0.5" />
              <div>
                <h4 className="font-medium text-blue-900 dark:text-blue-100 mb-1">
                  Melhore a Qualidade do Clone
                </h4>
                <p className="text-sm text-blue-700 dark:text-blue-300">
                  Quanto mais conversas você importar, mais autêntico e personalizado 
                  ficará o clone digital. O sistema analisa automaticamente:
                </p>
                <ul className="text-xs text-blue-600 dark:text-blue-400 mt-2 space-y-1">
                  <li>• Frases características e expressões únicas</li>
                  <li>• Estilo de comunicação e personalidade</li>
                  <li>• Tópicos favoritos e valores pessoais</li>
                  <li>• Padrões de conversa e humor</li>
                </ul>
              </div>
            </div>
          </div>

          <ChatImportField
            onMemoriesExtracted={handleMemoriesExtracted}
            onAnalysisGenerated={(analysis) => {
              console.log('Bulk import analysis:', analysis);
            }}
          />

          {isImporting && (
            <div className="bg-amber-50 dark:bg-amber-950/20 rounded-lg p-4 border border-amber-200 dark:border-amber-800">
              <div className="flex items-center gap-2">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-amber-600"></div>
                <span className="text-sm font-medium text-amber-700 dark:text-amber-300">
                  Importando memórias...
                </span>
              </div>
              <p className="text-xs text-amber-600 dark:text-amber-400 mt-1">
                Processando conversas e salvando no banco de dados
              </p>
            </div>
          )}

          <div className="bg-gray-50 dark:bg-gray-900 rounded-lg p-4">
            <h4 className="font-medium text-gray-900 dark:text-gray-100 mb-2 flex items-center gap-2">
              <FileText className="w-4 h-4" />
              Formatos Suportados
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
              <div className="bg-white dark:bg-gray-800 rounded p-2">
                <div className="font-medium text-green-600">WhatsApp</div>
                <div className="text-gray-600 dark:text-gray-400">
                  Menu → Exportar conversa → Sem mídia
                </div>
              </div>
              <div className="bg-white dark:bg-gray-800 rounded p-2">
                <div className="font-medium text-blue-600">Telegram</div>
                <div className="text-gray-600 dark:text-gray-400">
                  Configurações → Exportar dados
                </div>
              </div>
              <div className="bg-white dark:bg-gray-800 rounded p-2">
                <div className="font-medium text-purple-600">Discord</div>
                <div className="text-gray-600 dark:text-gray-400">
                  Usar DiscordChatExporter
                </div>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};