import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ArrowLeft, Upload, Plus, X, FileText, Image, Video, Music } from "lucide-react";
import { Person, Memory } from "@/types/person";
import { supabase } from "@/integrations/supabase/client";

interface CreatePersonProps {
  onSave: (person: Omit<Person, 'id' | 'createdAt' | 'updatedAt'>) => void;
  onBack: () => void;
}

export const CreatePerson = ({ onSave, onBack }: CreatePersonProps) => {
  const [formData, setFormData] = useState({
    name: "",
    relationship: "",
    birthYear: "",
    avatar: "",
    memories: [{ id: "", text: "", mediaUrl: "", mediaType: undefined, fileName: "" }] as Memory[],
    personality: [""],
    commonPhrases: [""]
  });
  const [uploading, setUploading] = useState<Record<string, boolean>>({});

  const relationships = [
    "Mãe", "Pai", "Avó", "Avô", "Irmã", "Irmão", 
    "Filha", "Filho", "Esposa", "Marido", "Amiga", "Amigo", "Tia", "Tio"
  ];

  const addField = (field: 'memories' | 'personality' | 'commonPhrases') => {
    if (field === 'memories') {
      setFormData(prev => ({
        ...prev,
        memories: [...prev.memories, { id: `memory-${Date.now()}`, text: "", mediaUrl: "", mediaType: undefined, fileName: "" }]
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [field]: [...prev[field], ""]
      }));
    }
  };

  const removeField = (field: 'memories' | 'personality' | 'commonPhrases', index: number) => {
    setFormData(prev => ({
      ...prev,
      [field]: prev[field].filter((_, i) => i !== index)
    }));
  };

  const updateField = (field: 'memories' | 'personality' | 'commonPhrases', index: number, value: string) => {
    if (field === 'memories') {
      setFormData(prev => ({
        ...prev,
        memories: prev.memories.map((item, i) => i === index ? { ...item, text: value } : item)
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [field]: prev[field].map((item, i) => i === index ? value : item)
      }));
    }
  };

  const uploadFile = async (file: File, memoryIndex: number) => {
    const fileId = `memory-${memoryIndex}-${Date.now()}`;
    setUploading(prev => ({ ...prev, [fileId]: true }));

    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`;
      const filePath = `memories/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('eterna-files')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('eterna-files')
        .getPublicUrl(filePath);

      const mediaType = file.type.startsWith('image/') ? 'image' :
                       file.type.startsWith('video/') ? 'video' :
                       file.type.startsWith('audio/') ? 'audio' : undefined;

      setFormData(prev => ({
        ...prev,
        memories: prev.memories.map((memory, i) => 
          i === memoryIndex 
            ? { ...memory, mediaUrl: publicUrl, mediaType, fileName: file.name }
            : memory
        )
      }));
    } catch (error) {
      console.error('Erro no upload:', error);
      alert('Erro ao fazer upload do arquivo');
    } finally {
      setUploading(prev => ({ ...prev, [fileId]: false }));
    }
  };

  const getMediaIcon = (mediaType?: string) => {
    switch (mediaType) {
      case 'image': return <Image className="w-4 h-4" />;
      case 'video': return <Video className="w-4 h-4" />;
      case 'audio': return <Music className="w-4 h-4" />;
      default: return <FileText className="w-4 h-4" />;
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const person = {
      name: formData.name,
      relationship: formData.relationship,
      birthYear: formData.birthYear ? parseInt(formData.birthYear) : undefined,
      avatar: formData.avatar || undefined,
      memories: formData.memories.filter(m => m.text.trim() || m.mediaUrl),
      personality: formData.personality.filter(p => p.trim()),
      commonPhrases: formData.commonPhrases.filter(p => p.trim()),
      voiceSettings: {
        hasRecording: false
      }
    };

    onSave(person);
  };

  const isValid = formData.name && formData.relationship && 
                 formData.memories.some(m => m.text.trim() || m.mediaUrl) && 
                 formData.personality.some(p => p.trim());

  return (
    <div className="min-h-screen bg-gradient-warm p-4">
      <div className="max-w-2xl mx-auto">
        <div className="flex items-center gap-3 mb-6">
          <Button variant="ghost" onClick={onBack} className="p-2">
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <h1 className="text-2xl font-bold text-foreground">Criar Pessoa Eterna</h1>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Informações Básicas */}
          <Card className="shadow-medium border-border/50">
            <CardHeader>
              <CardTitle className="text-lg">Informações Básicas</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-start gap-4">
                <div className="flex flex-col items-center gap-2">
                  <Avatar className="w-20 h-20 shadow-soft">
                    <AvatarImage src={formData.avatar} alt={formData.name} />
                    <AvatarFallback className="bg-memory text-memory-foreground text-lg">
                      {formData.name.charAt(0) || "?"}
                    </AvatarFallback>
                  </Avatar>
                  <Button variant="outline" size="sm" className="text-xs">
                    <Upload className="w-3 h-3 mr-1" />
                    Foto
                  </Button>
                </div>

                <div className="flex-1 space-y-4">
                  <div>
                    <Label htmlFor="name">Nome *</Label>
                    <Input
                      id="name"
                      value={formData.name}
                      onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                      placeholder="Ex: Maria Silva"
                      required
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="relationship">Relação *</Label>
                      <Select 
                        value={formData.relationship} 
                        onValueChange={(value) => setFormData(prev => ({ ...prev, relationship: value }))}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione" />
                        </SelectTrigger>
                        <SelectContent>
                          {relationships.map(rel => (
                            <SelectItem key={rel} value={rel}>{rel}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <Label htmlFor="birthYear">Ano de Nascimento</Label>
                      <Input
                        id="birthYear"
                        type="number"
                        value={formData.birthYear}
                        onChange={(e) => setFormData(prev => ({ ...prev, birthYear: e.target.value }))}
                        placeholder="1950"
                        min="1900"
                        max={new Date().getFullYear()}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Memórias */}
          <Card className="shadow-medium border-border/50">
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle className="text-lg">Memórias Favoritas *</CardTitle>
                <Button 
                  type="button" 
                  variant="outline" 
                  size="sm"
                  onClick={() => addField('memories')}
                >
                  <Plus className="w-4 h-4 mr-1" />
                  Adicionar
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {formData.memories.map((memory, index) => (
                <div key={memory.id || index} className="space-y-3 p-4 border border-border/50 rounded-lg bg-background/50">
                  <div className="flex gap-2">
                    <Textarea
                      value={memory.text}
                      onChange={(e) => updateField('memories', index, e.target.value)}
                      placeholder="Ex: Sempre fazia bolo de chocolate nos domingos..."
                      className="min-h-[80px]"
                    />
                    {formData.memories.length > 1 && (
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => removeField('memories', index)}
                        className="mt-1"
                      >
                        <X className="w-4 h-4" />
                      </Button>
                    )}
                  </div>
                  
                  {/* Upload de arquivos */}
                  <div className="flex flex-col gap-2">
                    <Label className="text-sm text-muted-foreground">Adicionar mídia (foto, vídeo ou áudio)</Label>
                    <div className="flex gap-2">
                      <input
                        type="file"
                        accept="image/*,video/*,audio/*"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) uploadFile(file, index);
                        }}
                        className="hidden"
                        id={`file-upload-${index}`}
                      />
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => document.getElementById(`file-upload-${index}`)?.click()}
                        disabled={uploading[`memory-${index}-${Date.now()}`]}
                      >
                        <Upload className="w-4 h-4 mr-1" />
                        {uploading[`memory-${index}-${Date.now()}`] ? 'Enviando...' : 'Adicionar arquivo'}
                      </Button>
                    </div>
                    
                    {/* Preview do arquivo */}
                    {memory.mediaUrl && (
                      <div className="flex items-center gap-2 p-2 bg-muted/50 rounded border">
                        {getMediaIcon(memory.mediaType)}
                        <span className="text-sm truncate flex-1">{memory.fileName}</span>
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => setFormData(prev => ({
                            ...prev,
                            memories: prev.memories.map((m, i) => 
                              i === index ? { ...m, mediaUrl: "", mediaType: undefined, fileName: "" } : m
                            )
                          }))}
                        >
                          <X className="w-3 h-3" />
                        </Button>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Traços de Personalidade */}
          <Card className="shadow-medium border-border/50">
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle className="text-lg">Traços de Personalidade *</CardTitle>
                <Button 
                  type="button" 
                  variant="outline" 
                  size="sm"
                  onClick={() => addField('personality')}
                >
                  <Plus className="w-4 h-4 mr-1" />
                  Adicionar
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              {formData.personality.map((trait, index) => (
                <div key={index} className="flex gap-2">
                  <Input
                    value={trait}
                    onChange={(e) => updateField('personality', index, e.target.value)}
                    placeholder="Ex: Carinhosa, sempre dava conselhos sábios"
                  />
                  {formData.personality.length > 1 && (
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => removeField('personality', index)}
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  )}
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Frases Comuns */}
          <Card className="shadow-medium border-border/50">
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle className="text-lg">Frases Marcantes</CardTitle>
                <Button 
                  type="button" 
                  variant="outline" 
                  size="sm"
                  onClick={() => addField('commonPhrases')}
                >
                  <Plus className="w-4 h-4 mr-1" />
                  Adicionar
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              {formData.commonPhrases.map((phrase, index) => (
                <div key={index} className="flex gap-2">
                  <Input
                    value={phrase}
                    onChange={(e) => updateField('commonPhrases', index, e.target.value)}
                    placeholder="Ex: 'Meu bem, tudo vai dar certo'"
                  />
                  {formData.commonPhrases.length > 1 && (
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => removeField('commonPhrases', index)}
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  )}
                </div>
              ))}
            </CardContent>
          </Card>

          <div className="flex gap-3 pt-4">
            <Button 
              type="button" 
              variant="outline" 
              onClick={onBack}
              className="flex-1"
            >
              Cancelar
            </Button>
            <Button 
              type="submit" 
              disabled={!isValid}
              className="flex-1 bg-primary hover:bg-primary/90"
            >
              Criar Pessoa Eterna
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};