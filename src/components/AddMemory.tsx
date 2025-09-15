import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TextareaWithVoice } from "@/components/ui/textarea-with-voice";
import { QuickMemoryAdder } from "@/components/QuickMemoryAdder";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Lock, Unlock } from "lucide-react";
import { ArrowBack, CloudUpload, Close, Description, Add, Delete, Edit } from "@mui/icons-material";
import { Person, Memory } from "@/types/person";
import { useToast } from "@/hooks/use-toast";
import { memoriesService } from "@/services/memoriesService";
import { supabase } from "@/integrations/supabase/client";
import { getMediaType } from "@/utils/fileValidation";

interface MemoryItem {
  id: string;
  text: string;
  file: File | null;
}

interface AddMemoryProps {
  person: Person;
  onSave: (memories: Omit<Memory, 'id'>[]) => Promise<void>;
  onBack: () => void;
}

export const AddMemory = ({ person, onSave, onBack }: AddMemoryProps) => {
  const [memories, setMemories] = useState<MemoryItem[]>(() => {
    // Load existing memories and add one empty memory for new input
    const existingMemories = person.memories.map(memory => ({
      id: memory.id,
      text: memory.text,
      file: null // Existing memories don't have files in the form
    }));
    
    return [
      ...existingMemories,
      { id: `memory-${Date.now()}`, text: "", file: null }
    ];
  });
  const [uploading, setUploading] = useState(false);
  const [deletedMemoryIds, setDeletedMemoryIds] = useState<string[]>([]);
  const [editingMemoryIds, setEditingMemoryIds] = useState<Set<string>>(new Set());
  const { toast } = useToast();

  const addMemory = () => {
    setMemories(prev => [
      ...prev,
      { id: `memory-${Date.now()}`, text: "", file: null }
    ]);
  };

  const removeMemory = (id: string) => {
    const existingMemoryIds = new Set(person.memories.map(m => m.id));
    
    if (existingMemoryIds.has(id)) {
      // For existing memories, just mark as deleted
      setDeletedMemoryIds(prev => [...prev, id]);
      setMemories(prev => prev.filter(memory => memory.id !== id));
    } else if (memories.length > 1) {
      // For new memories, just remove from array
      setMemories(prev => prev.filter(memory => memory.id !== id));
    }
  };

  const updateMemoryText = (id: string, text: string) => {
    // Now allow editing both existing and new memories
    setMemories(prev => prev.map(memory => 
      memory.id === id ? { ...memory, text } : memory
    ));
  };

  const updateMemoryFile = (id: string, file: File | null) => {
    setMemories(prev => prev.map(memory => 
      memory.id === id ? { ...memory, file } : memory
    ));
  };

  const toggleEditMode = (id: string) => {
    setEditingMemoryIds(prev => {
      const newSet = new Set(prev);
      if (newSet.has(id)) {
        newSet.delete(id);
      } else {
        newSet.add(id);
      }
      return newSet;
    });
  };

  const handleFileSelect = (id: string, event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // Check file size (max 10MB)
      if (file.size > 10 * 1024 * 1024) {
        toast({
          title: "Arquivo muito grande",
          description: "O arquivo deve ter no máximo 10MB",
          variant: "destructive"
        });
        return;
      }

      // Check file type
      const allowedTypes = [
        'image/jpeg', 'image/png', 'image/gif', 'image/webp',
        'video/mp4', 'video/webm',
        'audio/mp3', 'audio/wav', 'audio/ogg'
      ];

      if (!allowedTypes.includes(file.type)) {
        toast({
          title: "Tipo de arquivo não suportado",
          description: "Selecione uma imagem, vídeo ou áudio",
          variant: "destructive"
        });
        return;
      }

      updateMemoryFile(id, file);
    }
  };

  const getMediaType = (file: File): 'image' | 'video' | 'audio' => {
    if (file.type.startsWith('image/')) return 'image';
    if (file.type.startsWith('video/')) return 'video';
    if (file.type.startsWith('audio/')) return 'audio';
    return 'image'; // fallback
  };

  const handleSave = async () => {
    const existingMemoryIds = new Set(person.memories.map(m => m.id));
    
    // Separate new memories from edited existing ones
    const newMemories = memories.filter(memory => 
      !existingMemoryIds.has(memory.id) && (memory.text.trim() || memory.file)
    );
    
    const editedMemories = memories.filter(memory => 
      existingMemoryIds.has(memory.id) && memory.text.trim()
    );

    if (newMemories.length === 0 && editedMemories.length === 0 && deletedMemoryIds.length === 0) {
      toast({
        title: "Nenhuma alteração",
        description: "Faça pelo menos uma alteração para salvar",
        variant: "destructive"
      });
      return;
    }

    setUploading(true);
    try {
      // Process deletions first
      for (const deletedId of deletedMemoryIds) {
        await memoriesService.deleteMemory(deletedId);
      }

      // Process edits
      for (const editedMemory of editedMemories) {
        await memoriesService.updateMemory(editedMemory.id, {
          text: editedMemory.text.trim(),
          // Note: We're not handling file updates for existing memories yet
        });
      }

      // Process new memories with proper file handling
      for (const memory of newMemories) {
        let mediaUrl = '';
        let mediaType: Memory['mediaType'] = undefined;
        let fileName = '';

        if (memory.file) {
          // Upload file to storage
          const { data: { user } } = await supabase.auth.getUser();
          if (user) {
            try {
              const { peopleService } = await import("@/services/peopleService");
              mediaUrl = await peopleService.uploadMedia(memory.file, user.id);
              mediaType = getMediaType(memory.file) as Memory['mediaType'];
              fileName = memory.file.name;
            } catch (uploadError) {
              console.error('Error uploading file:', uploadError);
              // Continue without file if upload fails
            }
          }
        }

        await memoriesService.createMemory(person.id, {
          text: memory.text.trim(),
          mediaUrl: mediaUrl || undefined,
          mediaType,
          fileName: fileName || undefined
        });
      }

      const totalChanges = deletedMemoryIds.length + editedMemories.length + newMemories.length;
      
      toast({
        title: "Memórias atualizadas!",
        description: `${totalChanges} alterações salvas para ${person.name}`,
      });

      // Reload the person data to reflect changes
      setTimeout(() => {
        onBack();
      }, 1000);
      
    } catch (error) {
      console.error('Error saving memories:', error);
      toast({
        title: "Erro",
        description: "Não foi possível salvar as alterações",
        variant: "destructive"
      });
    } finally {
      setUploading(false);
    }
  };

  const removeFile = (id: string) => {
    updateMemoryFile(id, null);
  };

  const renderFilePreview = (memory: MemoryItem) => {
    if (!memory.file) return null;

    const fileUrl = URL.createObjectURL(memory.file);

    if (memory.file.type.startsWith('image/')) {
      return (
        <div className="relative">
          <img 
            src={fileUrl} 
            alt="Preview" 
            className="w-full h-48 object-cover rounded-xl"
          />
          <Button
            variant="ghost"
            size="icon"
            onClick={() => removeFile(memory.id)}
            className="absolute top-2 right-2 bg-black/50 hover:bg-black/70 text-white rounded-full"
          >
            <Close className="w-4 h-4" />
          </Button>
        </div>
      );
    }

    if (memory.file.type.startsWith('video/')) {
      return (
        <div className="relative">
          <video 
            src={fileUrl} 
            controls 
            className="w-full h-48 rounded-xl"
          />
          <Button
            variant="ghost"
            size="icon"
            onClick={() => removeFile(memory.id)}
            className="absolute top-2 right-2 bg-black/50 hover:bg-black/70 text-white rounded-full"
          >
            <Close className="w-4 h-4" />
          </Button>
        </div>
      );
    }

    if (memory.file.type.startsWith('audio/')) {
      return (
        <div className="bg-accent/10 p-4 rounded-xl">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center">
              <Description className="w-5 h-5 mr-2 text-accent" />
              <span className="text-sm font-medium">{memory.file.name}</span>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => removeFile(memory.id)}
              className="hover:bg-destructive/20 text-destructive rounded-full"
            >
              <Close className="w-4 h-4" />
            </Button>
          </div>
          <audio 
            src={fileUrl} 
            controls 
            className="w-full"
          />
        </div>
      );
    }

    return null;
  };

  return (
    <div className="min-h-screen relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-white via-white to-gray-50/30"></div>
      
      <div className="relative max-w-4xl mx-auto p-8">
        {/* Header */}
        <div className="glass-surface rounded-3xl p-8 mb-8 backdrop-blur-xl">
          <div className="flex items-center justify-between">
            <div>
              <Button
                variant="ghost"
                onClick={onBack}
                className="mb-4 hover:bg-white/20 rounded-2xl"
              >
                <ArrowBack className="w-5 h-5 mr-2" />
                Voltar
              </Button>
               <h1 className="font-serif text-[clamp(1.25rem,3vw,2rem)] text-foreground mb-2 leading-tight">
                 Gerenciar Memórias
               </h1>
               <p className="text-muted-foreground text-lg">
                 Para {person.name} • Edite, adicione ou remova memórias
               </p>
            </div>
          </div>
        </div>

        {/* Quick Add Section */}
        <QuickMemoryAdder
          onSave={async (memory) => {
            await memoriesService.createMemory(person.id, memory);
            // Refresh the page to show the new memory
            setTimeout(() => {
              window.location.reload();
            }, 1000);
          }}
          className="mb-6"
        />

        {/* Add Memory Form */}
        <div className="space-y-6">
          {memories.map((memory, index) => {
            const existingMemoryIds = new Set(person.memories.map(m => m.id));
            const isExistingMemory = existingMemoryIds.has(memory.id);
            
             return (
               <Card key={memory.id} className={`relative ${isExistingMemory ? 'bg-blue/5 border-blue/20' : ''}`}>
                  {/* Lock Overlay for Existing Memories */}
                  {isExistingMemory && !editingMemoryIds.has(memory.id) && (
                    <div className="absolute inset-0 bg-white/30 backdrop-blur-[0.5px] rounded-lg z-10 flex items-center justify-center">
                     <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-border/50">
                       <div className="flex flex-col items-center gap-4">
                         <div className="p-3 bg-amber-100 rounded-full">
                           <Lock className="w-6 h-6 text-amber-600" />
                         </div>
                         <div className="text-center">
                           <h3 className="font-medium text-foreground mb-2">Memória Protegida</h3>
                           <p className="text-sm text-muted-foreground mb-4">Esta é uma memória existente</p>
                           <div className="flex gap-2">
                             <Button
                               variant="outline"
                               size="sm"
                               onClick={() => toggleEditMode(memory.id)}
                               className="flex items-center gap-2"
                             >
                               <Edit className="w-4 h-4" />
                               Editar
                             </Button>
                             <AlertDialog>
                               <AlertDialogTrigger asChild>
                                 <Button
                                   variant="outline"
                                   size="sm"
                                   className="flex items-center gap-2 text-destructive hover:text-destructive"
                                 >
                                   <Delete className="w-4 h-4" />
                                   Remover
                                 </Button>
                               </AlertDialogTrigger>
                               <AlertDialogContent>
                                 <AlertDialogHeader>
                                   <AlertDialogTitle>Confirmar exclusão</AlertDialogTitle>
                                   <AlertDialogDescription>
                                     Tem certeza que deseja excluir esta memória existente? Esta ação não pode ser desfeita.
                                   </AlertDialogDescription>
                                 </AlertDialogHeader>
                                 <AlertDialogFooter>
                                   <AlertDialogCancel>Cancelar</AlertDialogCancel>
                                   <AlertDialogAction 
                                     onClick={() => removeMemory(memory.id)}
                                     className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                                   >
                                     Excluir
                                   </AlertDialogAction>
                                 </AlertDialogFooter>
                               </AlertDialogContent>
                             </AlertDialog>
                           </div>
                         </div>
                       </div>
                     </div>
                   </div>
                 )}

                 <CardHeader className="pb-4">
                   <div className="flex items-center justify-between">
                     <div className="flex items-center gap-2">
                       <CardTitle className="text-lg">
                         Memória {index + 1}
                       </CardTitle>
                       {isExistingMemory && (
                         <span className="text-xs bg-blue/10 text-blue-600 px-2 py-1 rounded-full">
                           Existente
                         </span>
                       )}
                       {isExistingMemory && editingMemoryIds.has(memory.id) && (
                         <Button
                           variant="ghost"
                           size="sm"
                           onClick={() => toggleEditMode(memory.id)}
                           className="flex items-center gap-1 text-amber-600 hover:bg-amber-50"
                         >
                           <Unlock className="w-4 h-4" />
                           Desbloqueado
                         </Button>
                       )}
                     </div>
                     {memories.length > 1 && !isExistingMemory && (
                       <Button
                         variant="ghost"
                         size="icon"
                         onClick={() => removeMemory(memory.id)}
                         className="hover:bg-destructive/20 text-destructive rounded-full"
                       >
                         <Delete className="w-4 h-4" />
                       </Button>
                     )}
                   </div>
                 </CardHeader>
                <CardContent className="space-y-4">
                  {/* Text Area */}
                  <div>
                    <label className="text-sm font-medium text-foreground mb-2 block">
                      Descrição da Memória
                    </label>
                     <TextareaWithVoice
                       value={memory.text}
                       onChange={(e) => updateMemoryText(memory.id, e.target.value)}
                       placeholder={isExistingMemory ? "Edite esta memória existente" : "Conte uma memória especial, um momento marcante, uma história..."}
                       className="min-h-24 resize-none"
                       readOnly={isExistingMemory && !editingMemoryIds.has(memory.id)}
                     />
                  </div>

                  {/* File Upload - only for new memories or editing existing ones */}
                  {(!isExistingMemory || editingMemoryIds.has(memory.id)) && (
                    <div>
                      <label className="text-sm font-medium text-foreground mb-2 block">
                        Arquivo (Opcional)
                      </label>
                      
                      {!memory.file ? (
                        <div className="border-2 border-dashed border-border rounded-xl p-6 text-center hover:border-accent/50 transition-colors">
                          <CloudUpload className="w-8 h-8 text-muted-foreground mx-auto mb-2" />
                          <p className="text-sm text-muted-foreground mb-3">
                            Adicione uma foto, vídeo ou áudio
                          </p>
                          <input
                            type="file"
                            accept="image/*,video/*,audio/*"
                            onChange={(e) => handleFileSelect(memory.id, e)}
                            className="hidden"
                            id={`file-upload-${memory.id}`}
                          />
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => document.getElementById(`file-upload-${memory.id}`)?.click()}
                          >
                            <CloudUpload className="w-4 h-4 mr-2" />
                            Selecionar
                          </Button>
                          <p className="text-xs text-muted-foreground mt-2">
                            Máximo 10MB
                          </p>
                        </div>
                      ) : (
                        renderFilePreview(memory)
                      )}
                    </div>
                  )}
                </CardContent>
              </Card>
            );
          })}

          {/* Add Memory Button */}
          <Card className="border-dashed border-2 hover:border-accent/50 transition-colors">
            <CardContent className="p-8 text-center">
              <Button
                variant="ghost"
                onClick={addMemory}
                className="w-full h-auto py-6 flex flex-col items-center gap-2 hover:bg-accent/10"
              >
                <Add className="w-8 h-8 text-accent" />
                <span className="text-accent font-medium">Adicionar Outra Memória</span>
                <span className="text-xs text-muted-foreground">
                  Adicione quantas memórias quiser de uma vez
                </span>
              </Button>
            </CardContent>
          </Card>

          {/* Actions */}
          <Card>
            <CardContent className="p-6">
              <div className="flex justify-between items-center">
                 <div className="text-sm text-muted-foreground">
                   {(() => {
                     const existingMemoryIds = new Set(person.memories.map(m => m.id));
                     const newValidMemories = memories.filter(m => 
                       !existingMemoryIds.has(m.id) && (m.text.trim() || m.file)
                     ).length;
                     const editedMemories = memories.filter(m => 
                       existingMemoryIds.has(m.id) && m.text.trim()
                     ).length;
                     const totalChanges = newValidMemories + editedMemories + deletedMemoryIds.length;
                     
                     if (totalChanges === 0) {
                       return `${person.memories.length - deletedMemoryIds.length} memórias • Nenhuma alteração pendente`;
                     }
                     
                     const parts = [];
                     if (newValidMemories > 0) parts.push(`${newValidMemories} novas`);
                     if (editedMemories > 0) parts.push(`${editedMemories} editadas`);
                     if (deletedMemoryIds.length > 0) parts.push(`${deletedMemoryIds.length} removidas`);
                     
                     return `${totalChanges} alterações: ${parts.join(', ')}`;
                   })()}
                 </div>
                 <div className="flex space-x-4">
                   <Button 
                     variant="outline" 
                     onClick={onBack}
                     disabled={uploading}
                   >
                     Cancelar
                   </Button>
                   <Button 
                     onClick={handleSave}
                     disabled={uploading || (() => {
                       const existingMemoryIds = new Set(person.memories.map(m => m.id));
                       const newValidMemories = memories.filter(m => !existingMemoryIds.has(m.id) && (m.text.trim() || m.file)).length;
                       const editedMemories = memories.filter(m => existingMemoryIds.has(m.id) && m.text.trim()).length;
                       return newValidMemories + editedMemories + deletedMemoryIds.length === 0;
                     })()}
                     className="min-w-32"
                   >
                     {uploading ? "Salvando..." : (() => {
                       const existingMemoryIds = new Set(person.memories.map(m => m.id));
                       const newValidMemories = memories.filter(m => !existingMemoryIds.has(m.id) && (m.text.trim() || m.file)).length;
                       const editedMemories = memories.filter(m => existingMemoryIds.has(m.id) && m.text.trim()).length;
                       const totalChanges = newValidMemories + editedMemories + deletedMemoryIds.length;
                       return totalChanges > 0 ? `Salvar ${totalChanges} Alterações` : "Nenhuma Alteração";
                     })()}
                   </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};