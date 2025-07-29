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
import { SpeechToTextButton } from "@/components/SpeechToTextButton";

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

  const uploadAvatar = async (file: File) => {
    setUploading(prev => ({ ...prev, avatar: true }));

    try {
      if (!user) throw new Error('User not authenticated');
      
      const avatarUrl = await peopleService.uploadMedia(file, user.id);
      
      setFormData(prev => ({
        ...prev,
        avatar: avatarUrl
      }));
    } catch (error) {
      console.error('Erro no upload do avatar:', error);
      alert('Erro ao fazer upload da foto');
    } finally {
      setUploading(prev => ({ ...prev, avatar: false }));
    }
  };

  const handleTranscription = (text: string, memoryIndex: number) => {
    const currentText = formData.memories[memoryIndex].text;
    const newText = currentText ? `${currentText} ${text}` : text;
    updateField('memories', memoryIndex, newText);
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
          <div className="text-3xl">
            💖
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
          <input
            type="file"
            accept="image/*"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) uploadAvatar(file);
            }}
            className="hidden"
            id="avatar-upload"
          />
          <Button 
            variant="outline" 
            size="sm" 
            className="text-sm"
            onClick={() => document.getElementById('avatar-upload')?.click()}
            disabled={uploading.avatar}
          >
            <Upload className="w-4 h-4 mr-2" />
            {uploading.avatar ? 'Enviando...' : 'Adicionar foto'}
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
                <div className="flex gap-2">
                  <Textarea
                    value={memory.text}
                    onChange={(e) => updateField('memories', index, e.target.value)}
                    placeholder="Ex: Ela sempre fazia bolo de chocolate nos domingos e a casa toda ficava com aquele cheiro gostoso..."
                    className="min-h-[100px] resize-none border-0 bg-transparent text-base flex-1"
                  />
                  <div className="flex flex-col justify-center">
                    <SpeechToTextButton 
                      onTranscription={(text) => handleTranscription(text, index)}
                    />
                  </div>
                </div>
                
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
        
        <div className="text-center pt-4 border-t border-border/30">
          <p className="text-xs text-muted-foreground flex items-center justify-center gap-2">
            💡 Usamos modelos LLM da OpenAI para interpretar e dar vida às suas memórias
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" className="opacity-60">
              <path d="M22.2819 9.8211a5.9847 5.9847 0 0 0-.5157-4.9108 6.0462 6.0462 0 0 0-6.5098-2.9A6.0651 6.0651 0 0 0 4.9807 4.1818a5.9847 5.9847 0 0 0-3.9977 2.9 6.0462 6.0462 0 0 0 .7427 7.0966 5.98 5.98 0 0 0 .511 4.9107 6.051 6.051 0 0 0 6.5146 2.9001A5.9847 5.9847 0 0 0 13.2599 24a6.0557 6.0557 0 0 0 5.7718-4.2058 5.9894 5.9894 0 0 0 3.9977-2.9001 6.0557 6.0557 0 0 0-.7475-7.0729zm-9.022 12.6081a4.4755 4.4755 0 0 1-2.8764-1.0408l.1419-.0804 4.7783-2.7582a.7948.7948 0 0 0 .3927-.6813v-6.7369l2.02 1.1686a.071.071 0 0 1 .038.052v5.5826a4.504 4.504 0 0 1-4.4945 4.4944zm-9.6607-4.1254a4.4708 4.4708 0 0 1-.5346-3.0137l.142.0852 4.783 2.7582a.7712.7712 0 0 0 .7806 0l5.8428-3.3685v2.3324a.0804.0804 0 0 1-.0332.0615L9.74 19.9502a4.4992 4.4992 0 0 1-6.1408-1.6464zM2.3408 7.8956a4.485 4.485 0 0 1 2.3655-1.9728V11.6a.7664.7664 0 0 0 .3879.6765l5.8144 3.3543-2.0201 1.1685a.0757.0757 0 0 1-.071 0l-4.8303-2.7865A4.504 4.504 0 0 1 2.3408 7.872zm16.5963 3.8558L13.1038 8.364 15.1192 7.2a.0757.0757 0 0 1 .071 0l4.8303 2.7913a4.4944 4.4944 0 0 1-.6765 8.1042v-5.6772a.79.79 0 0 0-.407-.667zm2.0107-3.0231l-.142-.0852-4.7735-2.7818a.7759.7759 0 0 0-.7854 0L9.409 9.2297V6.8974a.0662.0662 0 0 1 .0284-.0615l4.8303-2.7866a4.4992 4.4992 0 0 1 6.6802 4.66zM8.3065 12.863l-2.02-1.1638a.0804.0804 0 0 1-.038-.0567V6.0742a4.4992 4.4992 0 0 1 7.3757-3.4537l-.142.0805L8.704 5.459a.7948.7948 0 0 0-.3927.6813zm1.0976-2.3654l2.602-1.4998 2.6069 1.4998v2.9994l-2.5974 1.4997-2.6067-1.4997Z"/>
            </svg>
          </p>
        </div>
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