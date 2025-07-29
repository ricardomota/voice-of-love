import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { ArrowBack, CloudUpload, Close, Description } from "@mui/icons-material";
import { Person, Memory } from "@/types/person";
import { useToast } from "@/hooks/use-toast";

interface AddMemoryProps {
  person: Person;
  onSave: (memory: Omit<Memory, 'id'>) => Promise<void>;
  onBack: () => void;
}

export const AddMemory = ({ person, onSave, onBack }: AddMemoryProps) => {
  const [memoryText, setMemoryText] = useState("");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const { toast } = useToast();

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
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

      setSelectedFile(file);
    }
  };

  const getMediaType = (file: File): 'image' | 'video' | 'audio' => {
    if (file.type.startsWith('image/')) return 'image';
    if (file.type.startsWith('video/')) return 'video';
    if (file.type.startsWith('audio/')) return 'audio';
    return 'image'; // fallback
  };

  const handleSave = async () => {
    if (!memoryText.trim() && !selectedFile) {
      toast({
        title: "Memória vazia",
        description: "Adicione um texto ou arquivo para a memória",
        variant: "destructive"
      });
      return;
    }

    setUploading(true);
    try {
      const memory: Omit<Memory, 'id'> = {
        text: memoryText.trim(),
        mediaUrl: selectedFile ? URL.createObjectURL(selectedFile) : undefined,
        mediaType: selectedFile ? getMediaType(selectedFile) : undefined,
        fileName: selectedFile?.name
      };

      await onSave(memory);
      
      toast({
        title: "Memória adicionada!",
        description: `Nova memória adicionada para ${person.name}`,
      });
      
      onBack();
    } catch (error) {
      console.error('Error saving memory:', error);
      toast({
        title: "Erro",
        description: "Não foi possível salvar a memória",
        variant: "destructive"
      });
    } finally {
      setUploading(false);
    }
  };

  const removeFile = () => {
    setSelectedFile(null);
  };

  const renderFilePreview = () => {
    if (!selectedFile) return null;

    const fileUrl = URL.createObjectURL(selectedFile);

    if (selectedFile.type.startsWith('image/')) {
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
            onClick={removeFile}
            className="absolute top-2 right-2 bg-black/50 hover:bg-black/70 text-white rounded-full"
          >
            <Close className="w-4 h-4" />
          </Button>
        </div>
      );
    }

    if (selectedFile.type.startsWith('video/')) {
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
            onClick={removeFile}
            className="absolute top-2 right-2 bg-black/50 hover:bg-black/70 text-white rounded-full"
          >
            <Close className="w-4 h-4" />
          </Button>
        </div>
      );
    }

    if (selectedFile.type.startsWith('audio/')) {
      return (
        <div className="bg-accent/10 p-4 rounded-xl">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center">
              <Description className="w-5 h-5 mr-2 text-accent" />
              <span className="text-sm font-medium">{selectedFile.name}</span>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={removeFile}
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
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Nova Memória</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Text Area */}
            <div>
              <label className="text-sm font-medium text-foreground mb-2 block">
                Descrição da Memória
              </label>
              <Textarea
                value={memoryText}
                onChange={(e) => setMemoryText(e.target.value)}
                placeholder="Conte uma memória especial, um momento marcante, uma história..."
                className="min-h-32 resize-none"
              />
            </div>

            {/* File Upload */}
            <div>
              <label className="text-sm font-medium text-foreground mb-2 block">
                Arquivo (Opcional)
              </label>
              
              {!selectedFile ? (
                <div className="border-2 border-dashed border-border rounded-xl p-8 text-center hover:border-accent/50 transition-colors">
                  <CloudUpload className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground mb-4">
                    Adicione uma foto, vídeo ou áudio para acompanhar a memória
                  </p>
                  <input
                    type="file"
                    accept="image/*,video/*,audio/*"
                    onChange={handleFileSelect}
                    className="hidden"
                    id="file-upload"
                  />
                  <Button
                    variant="outline"
                    onClick={() => document.getElementById('file-upload')?.click()}
                  >
                    <CloudUpload className="w-4 h-4 mr-2" />
                    Selecionar Arquivo
                  </Button>
                  <p className="text-xs text-muted-foreground mt-2">
                    Máximo 10MB • Formatos: JPG, PNG, GIF, MP4, WebM, MP3, WAV
                  </p>
                </div>
              ) : (
                renderFilePreview()
              )}
            </div>

            {/* Actions */}
            <div className="flex justify-end space-x-4 pt-4">
              <Button 
                variant="outline" 
                onClick={onBack}
                disabled={uploading}
              >
                Cancelar
              </Button>
              <Button 
                onClick={handleSave}
                disabled={uploading || (!memoryText.trim() && !selectedFile)}
                className="min-w-32"
              >
                {uploading ? "Salvando..." : "Salvar Memória"}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};