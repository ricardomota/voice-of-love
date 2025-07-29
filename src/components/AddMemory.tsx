import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { ArrowBack, CloudUpload, Close, Description, Add, Delete } from "@mui/icons-material";
import { Person, Memory } from "@/types/person";
import { useToast } from "@/hooks/use-toast";

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
  const [memories, setMemories] = useState<MemoryItem[]>([
    { id: `memory-${Date.now()}`, text: "", file: null }
  ]);
  const [uploading, setUploading] = useState(false);
  const { toast } = useToast();

  const addMemory = () => {
    setMemories(prev => [
      ...prev,
      { id: `memory-${Date.now()}`, text: "", file: null }
    ]);
  };

  const removeMemory = (id: string) => {
    if (memories.length > 1) {
      setMemories(prev => prev.filter(memory => memory.id !== id));
    }
  };

  const updateMemoryText = (id: string, text: string) => {
    setMemories(prev => prev.map(memory => 
      memory.id === id ? { ...memory, text } : memory
    ));
  };

  const updateMemoryFile = (id: string, file: File | null) => {
    setMemories(prev => prev.map(memory => 
      memory.id === id ? { ...memory, file } : memory
    ));
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
    const validMemories = memories.filter(memory => 
      memory.text.trim() || memory.file
    );

    if (validMemories.length === 0) {
      toast({
        title: "Nenhuma memória válida",
        description: "Adicione pelo menos uma memória com texto ou arquivo",
        variant: "destructive"
      });
      return;
    }

    setUploading(true);
    try {
      const memoriesToSave: Omit<Memory, 'id'>[] = validMemories.map(memory => ({
        text: memory.text.trim(),
        mediaUrl: memory.file ? URL.createObjectURL(memory.file) : undefined,
        mediaType: memory.file ? getMediaType(memory.file) : undefined,
        fileName: memory.file?.name
      }));

      await onSave(memoriesToSave);
      
      toast({
        title: "Memórias adicionadas!",
        description: `${validMemories.length} memórias adicionadas para ${person.name}`,
      });
      
      onBack();
    } catch (error) {
      console.error('Error saving memories:', error);
      toast({
        title: "Erro",
        description: "Não foi possível salvar as memórias",
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
              <h1 className="text-3xl font-light text-foreground mb-2">
                Adicionar Memória
              </h1>
              <p className="text-muted-foreground text-lg">
                Para {person.name}
              </p>
            </div>
          </div>
        </div>

        {/* Add Memory Form */}
        <div className="space-y-6">
          {memories.map((memory, index) => (
            <Card key={memory.id} className="relative">
              <CardHeader className="pb-4">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg">
                    Memória {index + 1}
                  </CardTitle>
                  {memories.length > 1 && (
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
                  <Textarea
                    value={memory.text}
                    onChange={(e) => updateMemoryText(memory.id, e.target.value)}
                    placeholder="Conte uma memória especial, um momento marcante, uma história..."
                    className="min-h-24 resize-none"
                  />
                </div>

                {/* File Upload */}
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
              </CardContent>
            </Card>
          ))}

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
                  {memories.filter(m => m.text.trim() || m.file).length} de {memories.length} memórias válidas
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
                    disabled={uploading || memories.filter(m => m.text.trim() || m.file).length === 0}
                    className="min-w-32"
                  >
                    {uploading ? "Salvando..." : `Salvar ${memories.filter(m => m.text.trim() || m.file).length} Memórias`}
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