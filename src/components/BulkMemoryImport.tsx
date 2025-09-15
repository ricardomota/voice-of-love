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
  const {
    toast
  } = useToast();
  const handleMemoriesExtracted = async (memories: string[]) => {
    setIsImporting(true);
    try {
      // Save all memories in batch
      await Promise.all(memories.map(memory => memoriesService.createMemory(person.id, {
        text: memory,
        mediaUrl: undefined,
        mediaType: undefined,
        fileName: undefined
      })));
      toast({
        title: "Importação concluída!",
        description: `${memories.length} memórias importadas para ${person.name}.`
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
  return <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        
      </DialogTrigger>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <MessageSquare className="w-5 h-5" />
            Importação em Massa de Conversas
          </DialogTitle>
          <DialogDescription>
            Importe arquivos de chat (WhatsApp, Telegram, Discord) para extrair automaticamente 
            centenas de memórias e melhorar o contexto da memória interativa de {person.name}.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-950/20 dark:to-purple-950/20 rounded-lg p-4">
            <div className="flex items-start gap-3">
              <Zap className="w-5 h-5 text-blue-600 mt-0.5" />
              <div>
                <h4 className="font-medium text-foreground mb-1">
                  🚀 Melhore a Memória Interativa
                </h4>
                <p className="text-sm text-muted-foreground">
                  Importar conversas torna a memória mais autêntica, capturando seu estilo único de comunicação.
                </p>
              </div>
            </div>
          </div>

          <ChatImportField targetPersonName={person.name} onMemoriesExtracted={handleMemoriesExtracted} onAnalysisGenerated={analysis => {
          console.log('Bulk import analysis:', analysis);
        }} />

          {isImporting && <div className="bg-amber-50 dark:bg-amber-950/20 rounded-lg p-4 border border-amber-200 dark:border-amber-800">
              <div className="flex items-center gap-2">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-amber-600"></div>
                <span className="text-sm font-medium text-amber-700 dark:text-amber-300">
                  Salvando memórias no banco de dados...
                </span>
              </div>
            </div>}
        </div>
      </DialogContent>
    </Dialog>;
};