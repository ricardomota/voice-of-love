import { useState, useEffect } from "react";
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
  person?: Person;
  onSave: (person: Omit<Person, 'id' | 'createdAt' | 'updatedAt'>) => void;
  onBack: () => void;
}

export const CreatePerson = ({ person, onSave, onBack }: CreatePersonProps) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState({
    name: "",
    relationship: "",
    birthYear: "",
    avatar: "",
    memories: [{ id: "memory-1", text: "", mediaUrl: "", mediaType: undefined, fileName: "" }] as Memory[],
    personality: [""],
    commonPhrases: [""],
    temperature: 0.7,
    talkingStyle: "",
    humorStyle: "",
    emotionalTone: "",
    verbosity: "",
    values: [""],
    topics: [""]
  });
  const [uploading, setUploading] = useState<Record<string, boolean>>({});

  // Initialize form data when editing existing person
  useEffect(() => {
    if (person) {
      setFormData({
        name: person.name,
        relationship: person.relationship,
        birthYear: person.birthYear?.toString() || "",
        avatar: person.avatar || "",
        memories: person.memories.length > 0 ? person.memories : [{ id: "memory-1", text: "", mediaUrl: "", mediaType: undefined, fileName: "" }],
        personality: person.personality.length > 0 ? person.personality : [""],
        commonPhrases: person.commonPhrases.length > 0 ? person.commonPhrases : [""],
        temperature: person.temperature || 0.7,
        talkingStyle: person.talkingStyle || "",
        humorStyle: person.humorStyle || "",
        emotionalTone: person.emotionalTone || "",
        verbosity: person.verbosity || "",
        values: person.values && person.values.length > 0 ? person.values : [""],
        topics: person.topics && person.topics.length > 0 ? person.topics : [""]
      });
    }
  }, [person]);

  const relationships = [
    "Mãe", "Pai", "Avó", "Avô", "Irmã", "Irmão", 
    "Filha", "Filho", "Esposa", "Marido", "Amiga", "Amigo", "Tia", "Tio"
  ];

  const getRelationshipPhrase = (relationship: string, name: string = "") => {
    const phrases = {
      "Mãe": [
        "Que amor especial você tem com sua mãe! 💕",
        "O vínculo entre mãe e filho é único e eterno. ✨",
        "Sua mãe sempre será parte de quem você é. 🌟",
        "Que sorte ter uma mãe tão especial! 💖"
      ],
      "Pai": [
        "Que bela relação você tem com seu pai! 👨‍👧‍👦",
        "O amor de pai é uma força que nos guia sempre. 💙",
        "Seu pai é seu herói, não é? 🦸‍♂️",
        "Que orgulho ele deve ter de você! ⭐"
      ],
      "Avó": [
        "Vovós são anjos na Terra, não é mesmo? 👵💕",
        "Que tesouro é ter uma avó assim! 🌺",
        "O carinho de vó é o mais puro que existe. ✨",
        "Suas histórias devem ser incríveis! 📚"
      ],
      "Avô": [
        "Vovôs são sábios cheios de amor! 👴💙",
        "Que sorte ter um avô tão especial! 🌟",
        "Os conselhos dele são preciosos, né? 💎",
        "Que homem incrível deve ser! ⭐"
      ],
      "Irmã": [
        "Irmãs são amigas para a vida toda! 👭💕",
        "Que cumplicidade linda vocês têm! ✨",
        "Irmãs entendem a gente como ninguém. 💖",
        "Vocês devem ter muitas memórias juntas! 🌈"
      ],
      "Irmão": [
        "Irmãos são companheiros de todas as aventuras! 👬",
        "Que parceria especial vocês formam! 💙",
        "Irmão é amigo que a vida nos dá. ⭐",
        "Vocês devem se divertir muito juntos! 🎉"
      ],
      "Filha": [
        "Que orgulho você deve ter dessa filha! 👩‍👧💕",
        "O amor por uma filha é infinito. ✨",
        "Ela deve ser sua alegria maior! 🌟",
        "Que benção ter uma filha assim! 💖"
      ],
      "Filho": [
        "Que orgulho você deve ter desse filho! 👨‍👦💙",
        "O amor por um filho não tem limites. ⭐",
        "Ele deve ser sua maior conquista! 🏆",
        "Que alegria ter um filho assim! 🌟"
      ],
      "Esposa": [
        "Que amor lindo vocês compartilham! 💑💕",
        "Sua companheira de todas as horas. ✨",
        "Vocês formam uma dupla perfeita! 💖",
        "Que sorte encontrar um amor assim! 🌹"
      ],
      "Marido": [
        "Que parceria linda vocês têm! 💑💙",
        "Seu companheiro de todas as aventuras. ⭐",
        "Vocês são almas gêmeas! 💖",
        "Que benção ter um amor assim! 🌟"
      ],
      "Amiga": [
        "Amigas verdadeiras são tesouros raros! 👭✨",
        "Que amizade especial vocês têm! 💕",
        "Amigas como ela são para sempre! 🌟",
        "Vocês devem ter mil histórias juntas! 💖"
      ],
      "Amigo": [
        "Amigos de verdade são família que escolhemos! 👬💙",
        "Que amizade incrível vocês cultivam! ⭐",
        "Amigos assim são preciosos! 💎",
        "Vocês devem ter muitas aventuras! 🎉"
      ],
      "Tia": [
        "Tias são mães do coração! 👩‍👧💕",
        "Que tia especial você tem! ✨",
        "O carinho de tia é único! 🌺",
        "Ela deve ser muito querida! 💖"
      ],
      "Tio": [
        "Tios são pais emprestados! 👨‍👦💙",
        "Que tio incrível você tem! ⭐",
        "Tios fazem a família mais divertida! 🎉",
        "Ele deve ser muito especial! 🌟"
      ]
    };

    const relationshipPhrases = phrases[relationship as keyof typeof phrases] || [
      "Que vínculo especial vocês têm! ✨",
      "Pessoas assim marcam nossa vida para sempre! 💖"
    ];

    // Gera um índice baseado no nome e horário para ter variação mas consistência
    const seed = (name + relationship + Math.floor(Date.now() / (1000 * 60 * 10))).length; // Muda a cada 10 minutos
    const index = seed % relationshipPhrases.length;
    
    return relationshipPhrases[index];
  };

  const addField = (field: 'memories' | 'personality' | 'commonPhrases' | 'values' | 'topics') => {
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

  const removeField = (field: 'memories' | 'personality' | 'commonPhrases' | 'values' | 'topics', index: number) => {
    setFormData(prev => ({
      ...prev,
      [field]: prev[field].filter((_, i) => i !== index)
    }));
  };

  const updateField = (field: 'memories' | 'personality' | 'commonPhrases' | 'values' | 'topics', index: number, value: string) => {
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
      
      // Validar tamanho do arquivo (50MB max)
      if (file.size > 50 * 1024 * 1024) {
        throw new Error('Arquivo muito grande. Tamanho máximo: 50MB');
      }
      
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
      const errorMessage = error instanceof Error ? error.message : 'Erro ao fazer upload do arquivo';
      alert(errorMessage);
    } finally {
      setUploading(prev => ({ ...prev, [fileId]: false }));
    }
  };

  const uploadAvatar = async (file: File) => {
    setUploading(prev => ({ ...prev, avatar: true }));

    try {
      if (!user) throw new Error('User not authenticated');
      
      // Validar tipo de arquivo
      if (!file.type.startsWith('image/')) {
        throw new Error('Por favor, selecione apenas arquivos de imagem');
      }

      // Validar tamanho do arquivo (50MB max)
      if (file.size > 50 * 1024 * 1024) {
        throw new Error('Arquivo muito grande. Tamanho máximo: 50MB');
      }
      
      const avatarUrl = await peopleService.uploadMedia(file, user.id);
      
      setFormData(prev => ({
        ...prev,
        avatar: avatarUrl
      }));
    } catch (error) {
      console.error('Erro no upload do avatar:', error);
      const errorMessage = error instanceof Error ? error.message : 'Erro ao fazer upload da foto';
      alert(errorMessage);
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
      temperature: formData.temperature,
      talkingStyle: formData.talkingStyle || undefined,
      humorStyle: formData.humorStyle || undefined,
      emotionalTone: formData.emotionalTone || undefined,
      verbosity: formData.verbosity || undefined,
      values: formData.values.filter(v => v.trim()) || undefined,
      topics: formData.topics.filter(t => t.trim()) || undefined,
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
      case 5: return Boolean(formData.talkingStyle.trim());
      case 6: return Boolean(formData.humorStyle.trim());
      case 7: return Boolean(formData.emotionalTone.trim());
      case 8: return Boolean(formData.verbosity.trim());
      case 9: return formData.values.some(v => v.trim());
      case 10: return formData.topics.some(t => t.trim());
      case 11: return true; // Temperature always has a value
      default: return true;
    }
  };

  const steps = [
    // Step 0: Introdução
    <StoryStep
      key="intro"
      title={person ? "Vamos editar essa Pessoa Eterna" : "Vamos criar uma Pessoa Eterna"}
      subtitle={person ? "Atualize as informações desta pessoa especial para manter suas memórias sempre vivas." : "Este é um momento especial. Vamos preservar a essência de alguém querido para que ela viva para sempre em suas memórias e conversas."}
      onNext={() => setCurrentStep(1)}
      onBack={onBack}
      nextText={person ? "Editar informações" : "Começar jornada"}
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
          <Avatar className="w-32 h-32 shadow-elegant border-2 border-white/80 backdrop-blur-sm">
            <AvatarImage src={formData.avatar} alt={formData.name} />
            <AvatarFallback className="bg-gradient-to-br from-accent/20 to-accent/10 text-accent-foreground text-2xl backdrop-blur-sm border border-white/40">
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
              {getRelationshipPhrase(formData.relationship, formData.name)}
            </p>
          </div>
        )}
      </div>
    </StoryStep>,

    // Step 3: Memórias
    <StoryStep
      key="memories"
      title="Compartilhe as memórias mais preciosas"
      subtitle={`Conte-me sobre os momentos especiais que você viveu com ${formData.name}. Adicione quantas memórias, fotos, vídeos e áudios quiser - quanto mais conteúdo, melhor conseguiremos entender e recriar a personalidade única dessa pessoa especial.`}
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
                  <div className="flex items-center justify-between">
                    <p className="text-sm text-muted-foreground">Adicionar arquivos (opcional)</p>
                  </div>
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
        
        <div className="text-center pt-4 border-t border-border/30 space-y-3">
          <div className="bg-gradient-to-r from-primary/5 to-secondary/5 rounded-lg p-4">
            <p className="text-sm font-medium text-foreground mb-2">
              💡 Dica: Quanto mais você compartilhar, melhor será a experiência!
            </p>
            <p className="text-xs text-muted-foreground">
              Aceito fotos, vídeos, áudios e arquivos até 50MB cada. 
              Usamos modelos LLM da OpenAI para interpretar e dar vida às suas memórias.
            </p>
          </div>
          <div className="flex items-center justify-center gap-2 text-xs text-muted-foreground">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" className="opacity-60">
              <path d="M22.2819 9.8211a5.9847 5.9847 0 0 0-.5157-4.9108 6.0462 6.0462 0 0 0-6.5098-2.9A6.0651 6.0651 0 0 0 4.9807 4.1818a5.9847 5.9847 0 0 0-3.9977 2.9 6.0462 6.0462 0 0 0 .7427 7.0966 5.98 5.98 0 0 0 .511 4.9107 6.051 6.051 0 0 0 6.5146 2.9001A5.9847 5.9847 0 0 0 13.2599 24a6.0557 6.0557 0 0 0 5.7718-4.2058 5.9894 5.9894 0 0 0 3.9977-2.9001 6.0557 6.0557 0 0 0-.7475-7.0729zm-9.022 12.6081a4.4755 4.4755 0 0 1-2.8764-1.0408l.1419-.0804 4.7783-2.7582a.7948.7948 0 0 0 .3927-.6813v-6.7369l2.02 1.1686a.071.071 0 0 1 .038.052v5.5826a4.504 4.504 0 0 1-4.4945 4.4944zm-9.6607-4.1254a4.4708 4.4708 0 0 1-.5346-3.0137l.142.0852 4.783 2.7582a.7712.7712 0 0 0 .7806 0l5.8428-3.3685v2.3324a.0804.0804 0 0 1-.0332.0615L9.74 19.9502a4.4992 4.4992 0 0 1-6.1408-1.6464zM2.3408 7.8956a4.485 4.485 0 0 1 2.3655-1.9728V11.6a.7664.7664 0 0 0 .3879.6765l5.8144 3.3543-2.0201 1.1685a.0757.0757 0 0 1-.071 0l-4.8303-2.7865A4.504 4.504 0 0 1 2.3408 7.872zm16.5963 3.8558L13.1038 8.364 15.1192 7.2a.0757.0757 0 0 1 .071 0l4.8303 2.7913a4.4944 4.4944 0 0 1-.6765 8.1042v-5.6772a.79.79 0 0 0-.407-.667zm2.0107-3.0231l-.142-.0852-4.7735-2.7818a.7759.7759 0 0 0-.7854 0L9.409 9.2297V6.8974a.0662.0662 0 0 1 .0284-.0615l4.8303-2.7866a4.4992 4.4992 0 0 1 6.6802 4.66zM8.3065 12.863l-2.02-1.1638a.0804.0804 0 0 1-.038-.0567V6.0742a4.4992 4.4992 0 0 1 7.3757-3.4537l-.142.0805L8.704 5.459a.7948.7948 0 0 0-.3927.6813zm1.0976-2.3654l2.602-1.4998 2.6069 1.4998v2.9994l-2.5974 1.4997-2.6067-1.4997Z"/>
            </svg>
            Powered by OpenAI
          </div>
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

    // Step 5: Como ela falava?
    <StoryStep
      key="talking-style"
      title="Como ela costumava falar?"
      subtitle="Cada pessoa tem seu jeito único de se expressar. Qual era o dela?"
      onNext={() => setCurrentStep(6)}
      onBack={() => setCurrentStep(4)}
      canNext={canProceed(5)}
    >
      <div className="space-y-4">
        <div className="grid gap-4">
          <div 
            className={`p-6 border-2 rounded-xl cursor-pointer transition-all ${
              formData.talkingStyle === 'formal' 
                ? 'border-primary bg-primary/5' 
                : 'border-border hover:border-primary/50'
            }`}
            onClick={() => setFormData(prev => ({ ...prev, talkingStyle: 'formal' }))}
          >
            <div className="flex items-center gap-3 mb-2">
              <div className="text-2xl">👔</div>
              <h3 className="font-semibold">Formal e educada</h3>
            </div>
            <p className="text-muted-foreground text-sm">
              Sempre muito educada, falava "por favor", "obrigada" e tratava todos com respeito.
            </p>
          </div>

          <div 
            className={`p-6 border-2 rounded-xl cursor-pointer transition-all ${
              formData.talkingStyle === 'casual' 
                ? 'border-primary bg-primary/5' 
                : 'border-border hover:border-primary/50'
            }`}
            onClick={() => setFormData(prev => ({ ...prev, talkingStyle: 'casual' }))}
          >
            <div className="flex items-center gap-3 mb-2">
              <div className="text-2xl">😊</div>
              <h3 className="font-semibold">Descontraída e natural</h3>
            </div>
            <p className="text-muted-foreground text-sm">
              Falava de forma simples e natural, como uma conversa entre amigos.
            </p>
          </div>

          <div 
            className={`p-6 border-2 rounded-xl cursor-pointer transition-all ${
              formData.talkingStyle === 'carinhosa' 
                ? 'border-primary bg-primary/5' 
                : 'border-border hover:border-primary/50'
            }`}
            onClick={() => setFormData(prev => ({ ...prev, talkingStyle: 'carinhosa' }))}
          >
            <div className="flex items-center gap-3 mb-2">
              <div className="text-2xl">🤗</div>
              <h3 className="font-semibold">Carinhosa e afetuosa</h3>
            </div>
            <p className="text-muted-foreground text-sm">
              Sempre usava palavras carinhosas como "querido", "amor", "meu anjo".
            </p>
          </div>

          <div 
            className={`p-6 border-2 rounded-xl cursor-pointer transition-all ${
              formData.talkingStyle === 'sabia' 
                ? 'border-primary bg-primary/5' 
                : 'border-border hover:border-primary/50'
            }`}
            onClick={() => setFormData(prev => ({ ...prev, talkingStyle: 'sabia' }))}
          >
            <div className="flex items-center gap-3 mb-2">
              <div className="text-2xl">🦉</div>
              <h3 className="font-semibold">Sábia e reflexiva</h3>
            </div>
            <p className="text-muted-foreground text-sm">
              Falava com sabedoria, sempre dava conselhos e fazia as pessoas pensarem.
            </p>
          </div>
        </div>
      </div>
    </StoryStep>,

    // Step 6: Tipo de humor
    <StoryStep
      key="humor-style"
      title="Que tipo de humor ela tinha?"
      subtitle="O humor é parte importante da personalidade. Como ela costumava brincar?"
      onNext={() => setCurrentStep(7)}
      onBack={() => setCurrentStep(5)}
      canNext={canProceed(6)}
    >
      <div className="space-y-4">
        <div className="grid gap-4">
          <div 
            className={`p-6 border-2 rounded-xl cursor-pointer transition-all ${
              formData.humorStyle === 'divertida' 
                ? 'border-primary bg-primary/5' 
                : 'border-border hover:border-primary/50'
            }`}
            onClick={() => setFormData(prev => ({ ...prev, humorStyle: 'divertida' }))}
          >
            <div className="flex items-center gap-3 mb-2">
              <div className="text-2xl">😄</div>
              <h3 className="font-semibold">Divertida e brincalhona</h3>
            </div>
            <p className="text-muted-foreground text-sm">
              Adorava fazer piadas, contar histórias engraçadas e estava sempre sorrindo.
            </p>
          </div>

          <div 
            className={`p-6 border-2 rounded-xl cursor-pointer transition-all ${
              formData.humorStyle === 'sarcastica' 
                ? 'border-primary bg-primary/5' 
                : 'border-border hover:border-primary/50'
            }`}
            onClick={() => setFormData(prev => ({ ...prev, humorStyle: 'sarcastica' }))}
          >
            <div className="flex items-center gap-3 mb-2">
              <div className="text-2xl">😏</div>
              <h3 className="font-semibold">Sarcástica e espirituosa</h3>
            </div>
            <p className="text-muted-foreground text-sm">
              Tinha um humor mais ácido, fazia comentários inteligentes e irônicos.
            </p>
          </div>

          <div 
            className={`p-6 border-2 rounded-xl cursor-pointer transition-all ${
              formData.humorStyle === 'suave' 
                ? 'border-primary bg-primary/5' 
                : 'border-border hover:border-primary/50'
            }`}
            onClick={() => setFormData(prev => ({ ...prev, humorStyle: 'suave' }))}
          >
            <div className="flex items-center gap-3 mb-2">
              <div className="text-2xl">😌</div>
              <h3 className="font-semibold">Humor suave e gentil</h3>
            </div>
            <p className="text-muted-foreground text-sm">
              Tinha um humor mais sutil, gostava de situações engraçadas do dia a dia.
            </p>
          </div>

          <div 
            className={`p-6 border-2 rounded-xl cursor-pointer transition-all ${
              formData.humorStyle === 'seria' 
                ? 'border-primary bg-primary/5' 
                : 'border-border hover:border-primary/50'
            }`}
            onClick={() => setFormData(prev => ({ ...prev, humorStyle: 'seria' }))}
          >
            <div className="flex items-center gap-3 mb-2">
              <div className="text-2xl">🤔</div>
              <h3 className="font-semibold">Mais séria, pouco humor</h3>
            </div>
            <p className="text-muted-foreground text-sm">
              Era uma pessoa mais séria, focada em conversas profundas e significativas.
            </p>
          </div>
        </div>
      </div>
    </StoryStep>,

    // Step 7: Tom emocional
    <StoryStep
      key="emotional-tone"
      title="Qual era o clima emocional dela?"
      subtitle="Como ela transmitia sentimentos? Qual energia ela passava?"
      onNext={() => setCurrentStep(8)}
      onBack={() => setCurrentStep(6)}
      canNext={canProceed(7)}
    >
      <div className="space-y-4">
        <div className="grid gap-4">
          <div 
            className={`p-6 border-2 rounded-xl cursor-pointer transition-all ${
              formData.emotionalTone === 'alegre' 
                ? 'border-primary bg-primary/5' 
                : 'border-border hover:border-primary/50'
            }`}
            onClick={() => setFormData(prev => ({ ...prev, emotionalTone: 'alegre' }))}
          >
            <div className="flex items-center gap-3 mb-2">
              <div className="text-2xl">☀️</div>
              <h3 className="font-semibold">Sempre alegre e positiva</h3>
            </div>
            <p className="text-muted-foreground text-sm">
              Irradiava alegria, estava sempre de bom humor e animava quem estava ao redor.
            </p>
          </div>

          <div 
            className={`p-6 border-2 rounded-xl cursor-pointer transition-all ${
              formData.emotionalTone === 'calma' 
                ? 'border-primary bg-primary/5' 
                : 'border-border hover:border-primary/50'
            }`}
            onClick={() => setFormData(prev => ({ ...prev, emotionalTone: 'calma' }))}
          >
            <div className="flex items-center gap-3 mb-2">
              <div className="text-2xl">🕊️</div>
              <h3 className="font-semibold">Calma e tranquila</h3>
            </div>
            <p className="text-muted-foreground text-sm">
              Transmitia paz e serenidade, tinha uma presença que acalmava os outros.
            </p>
          </div>

          <div 
            className={`p-6 border-2 rounded-xl cursor-pointer transition-all ${
              formData.emotionalTone === 'intensa' 
                ? 'border-primary bg-primary/5' 
                : 'border-border hover:border-primary/50'
            }`}
            onClick={() => setFormData(prev => ({ ...prev, emotionalTone: 'intensa' }))}
          >
            <div className="flex items-center gap-3 mb-2">
              <div className="text-2xl">🔥</div>
              <h3 className="font-semibold">Intensa e apaixonada</h3>
            </div>
            <p className="text-muted-foreground text-sm">
              Vivia tudo intensamente, era apaixonada pelas coisas que acreditava.
            </p>
          </div>

          <div 
            className={`p-6 border-2 rounded-xl cursor-pointer transition-all ${
              formData.emotionalTone === 'equilibrada' 
                ? 'border-primary bg-primary/5' 
                : 'border-border hover:border-primary/50'
            }`}
            onClick={() => setFormData(prev => ({ ...prev, emotionalTone: 'equilibrada' }))}
          >
            <div className="flex items-center gap-3 mb-2">
              <div className="text-2xl">⚖️</div>
              <h3 className="font-semibold">Equilibrada e ponderada</h3>
            </div>
            <p className="text-muted-foreground text-sm">
              Sabia dosar as emoções, era estável e passava segurança emocional.
            </p>
          </div>
        </div>
      </div>
    </StoryStep>,

    // Step 8: Nível de conversa
    <StoryStep
      key="verbosity"
      title="Como ela gostava de conversar?"
      subtitle="Algumas pessoas falam muito, outras são mais diretas. Como ela era?"
      onNext={() => setCurrentStep(9)}
      onBack={() => setCurrentStep(7)}
      canNext={canProceed(8)}
    >
      <div className="space-y-4">
        <div className="grid gap-4">
          <div 
            className={`p-6 border-2 rounded-xl cursor-pointer transition-all ${
              formData.verbosity === 'concisa' 
                ? 'border-primary bg-primary/5' 
                : 'border-border hover:border-primary/50'
            }`}
            onClick={() => setFormData(prev => ({ ...prev, verbosity: 'concisa' }))}
          >
            <div className="flex items-center gap-3 mb-2">
              <div className="text-2xl">🎯</div>
              <h3 className="font-semibold">Direta e objetiva</h3>
            </div>
            <p className="text-muted-foreground text-sm">
              Falava pouco mas sempre certeiro, ia direto ao ponto sem rodeios.
            </p>
          </div>

          <div 
            className={`p-6 border-2 rounded-xl cursor-pointer transition-all ${
              formData.verbosity === 'equilibrada' 
                ? 'border-primary bg-primary/5' 
                : 'border-border hover:border-primary/50'
            }`}
            onClick={() => setFormData(prev => ({ ...prev, verbosity: 'equilibrada' }))}
          >
            <div className="flex items-center gap-3 mb-2">
              <div className="text-2xl">💬</div>
              <h3 className="font-semibold">Conversas na medida certa</h3>
            </div>
            <p className="text-muted-foreground text-sm">
              Sabia dosar: às vezes falava mais, às vezes menos, dependendo da situação.
            </p>
          </div>

          <div 
            className={`p-6 border-2 rounded-xl cursor-pointer transition-all ${
              formData.verbosity === 'detalhista' 
                ? 'border-primary bg-primary/5' 
                : 'border-border hover:border-primary/50'
            }`}
            onClick={() => setFormData(prev => ({ ...prev, verbosity: 'detalhista' }))}
          >
            <div className="flex items-center gap-3 mb-2">
              <div className="text-2xl">📚</div>
              <h3 className="font-semibold">Adorava contar detalhes</h3>
            </div>
            <p className="text-muted-foreground text-sm">
              Gostava de explicar tudo direitinho, contava histórias com muitos detalhes.
            </p>
          </div>

          <div 
            className={`p-6 border-2 rounded-xl cursor-pointer transition-all ${
              formData.verbosity === 'contadora' 
                ? 'border-primary bg-primary/5' 
                : 'border-border hover:border-primary/50'
            }`}
            onClick={() => setFormData(prev => ({ ...prev, verbosity: 'contadora' }))}
          >
            <div className="flex items-center gap-3 mb-2">
              <div className="text-2xl">🗣️</div>
              <h3 className="font-semibold">Grande contadora de histórias</h3>
            </div>
            <p className="text-muted-foreground text-sm">
              Adorava uma boa conversa longa, podia passar horas contando histórias e memórias.
            </p>
          </div>
        </div>
      </div>
    </StoryStep>,

    // Step 9: Valores importantes
    <StoryStep
      key="values"
      title="O que era mais importante para ela?"
      subtitle="Quais valores e princípios ela sempre defendia ou mencionava?"
      onNext={() => setCurrentStep(10)}
      onBack={() => setCurrentStep(8)}
      canNext={canProceed(9)}
    >
      <div className="space-y-4">
        {formData.values.map((value, index) => (
          <div key={index} className="flex gap-3">
            <div className="w-6 h-6 rounded-full bg-accent flex items-center justify-center text-accent-foreground text-sm font-medium mt-2">
              {index + 1}
            </div>
            <div className="flex-1">
              <Input
                value={value}
                onChange={(e) => updateField('values', index, e.target.value)}
                placeholder="Ex: Família sempre em primeiro lugar, Sempre ajudar o próximo, Ser honesto em todas as situações..."
                className="text-base py-3"
              />
            </div>
            {formData.values.length > 1 && (
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => removeField('values', index)}
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
          onClick={() => addField('values')}
          className="w-full border-dashed"
        >
          <Plus className="w-4 h-4 mr-2" />
          Adicionar outro valor
        </Button>

        <div className="bg-gradient-to-r from-accent/5 to-secondary/5 rounded-lg p-4 mt-6">
          <p className="text-sm font-medium text-foreground mb-2">
            💡 Exemplos de valores importantes:
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-xs text-muted-foreground">
            <div>• Família sempre em primeiro lugar</div>
            <div>• Tratar todos com respeito</div>
            <div>• Ser grato pelas pequenas coisas</div>
            <div>• Nunca desistir dos sonhos</div>
            <div>• Ajudar quem precisa</div>
            <div>• Ser honesto sempre</div>
          </div>
        </div>
      </div>
    </StoryStep>,

    // Step 10: Assuntos favoritos
    <StoryStep
      key="topics"
      title="Sobre o que ela mais gostava de conversar?"
      subtitle="Quais assuntos a animavam? Do que ela falava com mais paixão?"
      onNext={() => setCurrentStep(11)}
      onBack={() => setCurrentStep(9)}
      canNext={canProceed(10)}
    >
      <div className="space-y-4">
        {formData.topics.map((topic, index) => (
          <div key={index} className="flex gap-3">
            <div className="w-6 h-6 rounded-full bg-secondary flex items-center justify-center text-secondary-foreground text-sm font-medium mt-2">
              {index + 1}
            </div>
            <div className="flex-1">
              <Input
                value={topic}
                onChange={(e) => updateField('topics', index, e.target.value)}
                placeholder="Ex: Cozinhar e receitas de família, Plantas e jardinagem, Histórias da juventude..."
                className="text-base py-3"
              />
            </div>
            {formData.topics.length > 1 && (
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => removeField('topics', index)}
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
          onClick={() => addField('topics')}
          className="w-full border-dashed"
        >
          <Plus className="w-4 h-4 mr-2" />
          Adicionar outro assunto
        </Button>

        <div className="bg-gradient-to-r from-secondary/5 to-primary/5 rounded-lg p-4 mt-6">
          <p className="text-sm font-medium text-foreground mb-2">
            💭 Exemplos de assuntos favoritos:
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-xs text-muted-foreground">
            <div>• Receitas e culinária</div>
            <div>• Histórias da família</div>
            <div>• Plantas e jardinagem</div>
            <div>• Música e artistas antigos</div>
            <div>• Livros e leitura</div>
            <div>• Viagens e lugares</div>
            <div>• Religião e espiritualidade</div>
            <div>• Conselhos sobre a vida</div>
          </div>
        </div>
      </div>
    </StoryStep>,

    // Step 11: Estilo de Conversa (Temperatura)
    <StoryStep
      key="conversation-style"
      title="Como ela conversava com você?"
      subtitle="Escolha o estilo que melhor representa a personalidade dela."
      onNext={() => setCurrentStep(12)}
      onBack={() => setCurrentStep(10)}
      canNext={canProceed(11)}
    >
      <div className="space-y-4">
        <div className="grid gap-4">
          {/* Opção Consistente */}
          <div 
            className={`p-6 border-2 rounded-xl cursor-pointer transition-all ${
              formData.temperature <= 0.3 
                ? 'border-primary bg-primary/5' 
                : 'border-border hover:border-primary/50'
            }`}
            onClick={() => setFormData(prev => ({ ...prev, temperature: 0.2 }))}
          >
            <div className="flex items-center gap-3 mb-2">
              <div className="text-2xl">🎯</div>
              <h3 className="font-semibold">Sempre igual</h3>
            </div>
            <p className="text-muted-foreground text-sm">
              Ela sempre respondia da mesma forma, tinha um jeito muito consistente de falar.
            </p>
          </div>

          {/* Opção Equilibrada */}
          <div 
            className={`p-6 border-2 rounded-xl cursor-pointer transition-all ${
              formData.temperature > 0.3 && formData.temperature <= 0.7
                ? 'border-primary bg-primary/5' 
                : 'border-border hover:border-primary/50'
            }`}
            onClick={() => setFormData(prev => ({ ...prev, temperature: 0.7 }))}
          >
            <div className="flex items-center gap-3 mb-2">
              <div className="text-2xl">💝</div>
              <h3 className="font-semibold">Natural e carinhosa</h3>
              <span className="text-xs bg-primary text-primary-foreground px-2 py-1 rounded">Recomendado</span>
            </div>
            <p className="text-muted-foreground text-sm">
              Era uma pessoa natural, às vezes variava a forma de falar dependendo do momento.
            </p>
          </div>

          {/* Opção Criativa */}
          <div 
            className={`p-6 border-2 rounded-xl cursor-pointer transition-all ${
              formData.temperature > 0.7
                ? 'border-primary bg-primary/5' 
                : 'border-border hover:border-primary/50'
            }`}
            onClick={() => setFormData(prev => ({ ...prev, temperature: 0.9 }))}
          >
            <div className="flex items-center gap-3 mb-2">
              <div className="text-2xl">✨</div>
              <h3 className="font-semibold">Espontânea e criativa</h3>
            </div>
            <p className="text-muted-foreground text-sm">
              Sempre me surpreendia! Era muito espontânea e criativa nas respostas.
            </p>
          </div>
        </div>
        
        <div className="text-center pt-4">
          <p className="text-muted-foreground text-sm">
            Você pode alterar isso depois se quiser ajustar como ela responde.
          </p>
        </div>
      </div>
    </StoryStep>,

    // Step 12: Frases marcantes
    <StoryStep
      key="phrases"
      title="Quais frases ela sempre dizia?"
      subtitle="Essas expressões únicas vão tornar as conversas ainda mais autênticas e tocantes."
      onNext={handleSubmit}
      onBack={() => setCurrentStep(11)}
      nextText={person ? "Atualizar Pessoa Eterna" : "Criar Pessoa Eterna"}
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