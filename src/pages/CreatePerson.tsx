import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ArrowLeft, Upload, Plus, X, FileText, Image, Video, Music, Heart, Sparkles } from "lucide-react";
import { Person, Memory } from "@/types/person";
import { useAuth } from "@/hooks/useAuth";
import { peopleService } from "@/services/peopleService";
import { StoryStep } from "@/components/StoryStep";

interface CreatePersonProps {
  onSave: (person: Omit<Person, 'id' | 'createdAt' | 'updatedAt'>) => void;
  onBack: () => void;
}

export const CreatePerson = ({ onSave, onBack }: CreatePersonProps) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState({
    name: "",
    relationship: "",
    birthYear: "",
    avatar: "",
    memories: [{ id: "memory-1", text: "", mediaUrl: "", mediaType: undefined, fileName: "" }] as Memory[],
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

  const { user } = useAuth();

  const uploadFile = async (file: File, memoryIndex: number) => {
    const fileId = `memory-${memoryIndex}-${Date.now()}`;
    setUploading(prev => ({ ...prev, [fileId]: true }));

    try {
      if (!user) throw new Error('User not authenticated');
      
      const mediaUrl = await peopleService.uploadMedia(file, user.id);
      
      const mediaType = file.type.startsWith('image/') ? 'image' :
                       file.type.startsWith('video/') ? 'video' :
                       file.type.startsWith('audio/') ? 'audio' : undefined;

      setFormData(prev => ({
        ...prev,
        memories: prev.memories.map((memory, i) => 
          i === memoryIndex 
            ? { ...memory, mediaUrl, mediaType, fileName: file.name }
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

  const handleSubmit = () => {
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

  const canProceed = (step: number): boolean => {
    switch (step) {
      case 1: return Boolean(formData.name.trim());
      case 2: return Boolean(formData.relationship.trim());
      case 3: return formData.memories.some(m => m.text.trim() || m.mediaUrl);
      case 4: return formData.personality.some(p => p.trim());
      default: return true;
    }
  };

  const steps = [
    // Step 0: Introdução
    <StoryStep
      key="intro"
      title="Vamos criar uma Pessoa Eterna"
      subtitle="Este é um momento especial. Vamos preservar a essência de alguém querido para que ela viva para sempre em suas memórias e conversas."
      onNext={() => setCurrentStep(1)}
      onBack={onBack}
      nextText="Começar jornada"
      backText="Voltar"
    >
      <div className="text-center space-y-6 py-8">
        <div className="flex justify-center">
          <div className="relative">
            <Heart className="w-24 h-24 text-memory animate-pulse" />
            <Sparkles className="w-8 h-8 text-memory-light absolute -top-2 -right-2" />
          </div>
        </div>
        <div className="prose prose-lg max-w-none text-center">
          <p className="text-muted-foreground leading-relaxed">
            Através das suas memórias, traços de personalidade e frases marcantes, 
            vamos criar uma versão digital que capture a verdadeira essência dessa pessoa especial.
          </p>
          <p className="text-sm text-muted-foreground/80 mt-4">
            Cada palavra importa. Cada lembrança é preciosa.
          </p>
        </div>
      </div>
    </StoryStep>,

    // Step 1: Nome e informações básicas
    <StoryStep
      key="basic-info"
      title="Conte-me sobre essa pessoa especial"
      subtitle="Vamos começar com o básico. Como ela se chama?"
      onNext={() => setCurrentStep(2)}
      onBack={() => setCurrentStep(0)}
      canNext={canProceed(1)}
    >
      <div className="space-y-8">
        <div className="flex flex-col items-center gap-6">
          <Avatar className="w-32 h-32 shadow-elegant">
            <AvatarImage src={formData.avatar} alt={formData.name} />
            <AvatarFallback className="bg-memory text-memory-foreground text-2xl">
              {formData.name.charAt(0) || "?"}
            </AvatarFallback>
          </Avatar>
          <Button variant="outline" size="sm" className="text-sm">
            <Upload className="w-4 h-4 mr-2" />
            Adicionar foto
          </Button>
        </div>
        
        <div className="space-y-6">
          <div>
            <label className="text-lg font-medium text-foreground block mb-3">
              Qual é o nome dela?
            </label>
            <Input
              value={formData.name}
              onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
              placeholder="Digite o nome completo..."
              className="text-lg py-3 text-center"
            />
          </div>

          <div>
            <label className="text-lg font-medium text-foreground block mb-3">
              Em que ano ela nasceu? (opcional)
            </label>
            <Input
              type="number"
              value={formData.birthYear}
              onChange={(e) => setFormData(prev => ({ ...prev, birthYear: e.target.value }))}
              placeholder="Ex: 1950"
              min="1900"
              max={new Date().getFullYear()}
              className="text-lg py-3 text-center"
            />
          </div>
        </div>
      </div>
    </StoryStep>,

    // Step 2: Relacionamento
    <StoryStep
      key="relationship"
      title={`Qual é a sua relação com ${formData.name || 'essa pessoa'}?`}
      subtitle="Essa informação ajuda a IA a entender o tipo de conversa e carinho que vocês compartilhavam."
      onNext={() => setCurrentStep(3)}
      onBack={() => setCurrentStep(1)}
      canNext={canProceed(2)}
    >
      <div className="space-y-6">
        <Select 
          value={formData.relationship} 
          onValueChange={(value) => setFormData(prev => ({ ...prev, relationship: value }))}
        >
          <SelectTrigger className="text-lg py-6 text-center">
            <SelectValue placeholder="Selecione a relação..." />
          </SelectTrigger>
          <SelectContent>
            {relationships.map(rel => (
              <SelectItem key={rel} value={rel} className="text-lg py-3">
                {rel}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        
        {formData.relationship && (
          <div className="text-center animate-fade-in">
            <p className="text-muted-foreground">
              Que belo vínculo você tinha com {formData.relationship === "Mãe" || formData.relationship === "Pai" ? "seu" : "sua"} {formData.relationship.toLowerCase()}.
            </p>
          </div>
        )}
      </div>
    </StoryStep>,

    // Step 3: Memórias
    <StoryStep
      key="memories"
      title="Compartilhe as memórias mais preciosas"
      subtitle={`Conte-me sobre os momentos especiais que você viveu com ${formData.name}. Essas lembranças darão vida às conversas.`}
      onNext={() => setCurrentStep(4)}
      onBack={() => setCurrentStep(2)}
      canNext={canProceed(3)}
    >
      <div className="space-y-6">
        {formData.memories.map((memory, index) => (
          <div key={memory.id || index} className="space-y-4 p-6 border border-border/50 rounded-xl bg-gradient-to-r from-background to-muted/20">
            <div className="flex items-start gap-3">
              <div className="w-6 h-6 rounded-full bg-memory flex items-center justify-center text-memory-foreground text-sm font-medium mt-1">
                {index + 1}
              </div>
              <div className="flex-1 space-y-3">
                <Textarea
                  value={memory.text}
                  onChange={(e) => updateField('memories', index, e.target.value)}
                  placeholder="Ex: Ela sempre fazia bolo de chocolate nos domingos e a casa toda ficava com aquele cheiro gostoso..."
                  className="min-h-[100px] resize-none border-0 bg-transparent text-base"
                />
                
                <div className="space-y-2">
                  <p className="text-sm text-muted-foreground">Adicionar foto, vídeo ou áudio (opcional)</p>
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
              
              {formData.memories.length > 1 && (
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => removeField('memories', index)}
                >
                  <X className="w-4 h-4" />
                </Button>
              )}
            </div>
          </div>
        ))}
        
        <Button 
          type="button" 
          variant="outline" 
          onClick={() => addField('memories')}
          className="w-full border-dashed"
        >
          <Plus className="w-4 h-4 mr-2" />
          Adicionar outra memória
        </Button>
      </div>
    </StoryStep>,

    // Step 4: Personalidade
    <StoryStep
      key="personality"
      title="Como era a personalidade dela?"
      subtitle="Descreva os traços que faziam essa pessoa única. Era carinhosa? Sábia? Engraçada?"
      onNext={() => setCurrentStep(5)}
      onBack={() => setCurrentStep(3)}
      canNext={canProceed(4)}
    >
      <div className="space-y-4">
        {formData.personality.map((trait, index) => (
          <div key={index} className="flex gap-3">
            <div className="w-6 h-6 rounded-full bg-primary flex items-center justify-center text-primary-foreground text-sm font-medium mt-2">
              {index + 1}
            </div>
            <div className="flex-1">
              <Textarea
                value={trait}
                onChange={(e) => updateField('personality', index, e.target.value)}
                placeholder="Ex: Era muito carinhosa e sempre tinha uma palavra de conforto para todos..."
                className="min-h-[80px] resize-none"
              />
            </div>
            {formData.personality.length > 1 && (
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => removeField('personality', index)}
                className="mt-2"
              >
                <X className="w-4 h-4" />
              </Button>
            )}
          </div>
        ))}
        
        <Button 
          type="button" 
          variant="outline" 
          onClick={() => addField('personality')}
          className="w-full border-dashed"
        >
          <Plus className="w-4 h-4 mr-2" />
          Adicionar outro traço
        </Button>
      </div>
    </StoryStep>,

    // Step 5: Frases marcantes
    <StoryStep
      key="phrases"
      title="Quais frases ela sempre dizia?"
      subtitle="Essas expressões únicas vão tornar as conversas ainda mais autênticas e tocantes."
      onNext={handleSubmit}
      onBack={() => setCurrentStep(4)}
      nextText="Criar Pessoa Eterna"
    >
      <div className="space-y-4">
        {formData.commonPhrases.map((phrase, index) => (
          <div key={index} className="flex gap-3">
            <div className="w-6 h-6 rounded-full bg-secondary flex items-center justify-center text-secondary-foreground text-sm font-medium mt-2">
              {index + 1}
            </div>
            <div className="flex-1">
              <Input
                value={phrase}
                onChange={(e) => updateField('commonPhrases', index, e.target.value)}
                placeholder="Ex: 'Meu bem, tudo vai dar certo'"
                className="text-base py-3"
              />
            </div>
            {formData.commonPhrases.length > 1 && (
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => removeField('commonPhrases', index)}
                className="mt-1"
              >
                <X className="w-4 h-4" />
              </Button>
            )}
          </div>
        ))}
        
        <Button 
          type="button" 
          variant="outline" 
          onClick={() => addField('commonPhrases')}
          className="w-full border-dashed"
        >
          <Plus className="w-4 h-4 mr-2" />
          Adicionar outra frase
        </Button>
        
        <div className="text-center pt-6">
          <p className="text-muted-foreground text-sm">
            Estamos quase terminando. Sua pessoa eterna está sendo preparada com muito carinho.
          </p>
        </div>
      </div>
    </StoryStep>
  ];

  return (
    <div className="min-h-screen bg-gradient-warm p-4">
      <div className="max-w-4xl mx-auto py-8">
        <div className="flex items-center gap-3 mb-8">
          <Button variant="ghost" onClick={onBack} className="p-2">
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div className="flex-1">
            <div className="flex items-center gap-2">
              <div className="text-sm text-muted-foreground">
                Passo {currentStep + 1} de {steps.length}
              </div>
              <div className="flex-1 bg-muted rounded-full h-2">
                <div 
                  className="bg-primary h-2 rounded-full transition-all duration-300"
                  style={{ width: `${((currentStep + 1) / steps.length) * 100}%` }}
                />
              </div>
            </div>
          </div>
        </div>

        {steps[currentStep]}
      </div>
    </div>
  );
};