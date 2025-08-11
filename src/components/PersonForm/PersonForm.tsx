import { useState } from 'react';
import { Person } from "@/types/person";
import { useFormData } from './useFormData';
import { useFormValidation } from '@/hooks/useFormValidation';
import { FormStep } from './FormStep';
import { ArrayField } from './ArrayField';
import { FileUploadField } from './FileUploadField';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Slider } from '@/components/ui/slider';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent } from '@/components/ui/card';
import { VoiceRecordingStep } from '@/components/VoiceRecordingStep';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { X, Upload, User } from 'lucide-react';
import { ProgressBar } from './ProgressBar';
import { supabase } from '@/integrations/supabase/client';
import { peopleService } from '@/services/peopleService';

interface PersonFormProps {
  person?: Person;
  onSave: (person: Omit<Person, 'id' | 'createdAt' | 'updatedAt'>) => void;
  onBack: () => void;
}

export const PersonForm = ({ person, onSave, onBack }: PersonFormProps) => {
  const [currentStep, setCurrentStep] = useState(1);
  const { formData, updateFormData, addField, removeField, updateField, updateMemoryMedia } = useFormData(person);
  const { canProceed, isFormValid } = useFormValidation(formData);
  const { toast } = useToast();

  // Função para determinar o gênero baseado no relacionamento
  const getGender = (relationship: string): 'male' | 'female' | 'neutral' => {
    const masculineRelationships = [
      'pai', 'papai', 'paizinho', 'padrasto', 'vovô', 'avô', 'vovozinho', 
      'irmão', 'irmãozinho', 'meio-irmão', 'marido', 'esposo', 'namorado', 
      'noivo', 'filho', 'filhinho', 'enteado', 'neto', 'netinho', 'tio', 
      'tiozinho', 'padrinho', 'primo', 'priminho', 'cunhado', 'sogro', 
      'genro', 'bisavô', 'sobrinho', 'afilhado'
    ];
    
    const femininRelationships = [
      'mãe', 'mamãe', 'mãezinha', 'madrasta', 'vovó', 'avó', 'vovozinha',
      'irmã', 'irmãzinha', 'meia-irmã', 'esposa', 'mulher', 'namorada',
      'noiva', 'filha', 'filhinha', 'enteada', 'neta', 'netinha', 'tia',
      'tiazinha', 'madrinha', 'prima', 'priminha', 'cunhada', 'sogra',
      'nora', 'bisavó', 'sobrinha', 'afilhada'
    ];

    const lowerRelationship = relationship.toLowerCase();
    
    if (masculineRelationships.some(rel => lowerRelationship.includes(rel))) {
      return 'male';
    }
    if (femininRelationships.some(rel => lowerRelationship.includes(rel))) {
      return 'female';
    }
    return 'neutral';
  };

  // Função para obter pronomes baseados no gênero
  const getPronouns = (gender: 'male' | 'female' | 'neutral') => {
    switch (gender) {
      case 'male':
        return {
          subject: 'ele',
          object: 'ele',
          possessive: 'dele',
          article: 'o'
        };
      case 'female':
        return {
          subject: 'ela',
          object: 'ela', 
          possessive: 'dela',
          article: 'a'
        };
      default:
        return {
          subject: 'essa pessoa',
          object: 'essa pessoa',
          possessive: 'dessa pessoa',
          article: 'a'
        };
    }
  };

  const currentGender = getGender(formData.relationship);
  const pronouns = getPronouns(currentGender);

  const totalSteps = 16; // Aumentamos para 16 passos (incluindo idade)

  const handleNext = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
    }
  };

  // Função para extrair frases características da transcrição
  const extractCharacteristicPhrases = (text: string): string[] => {
    const phrases: string[] = [];
    const lowerText = text.toLowerCase();
    
    // Padrões expandidos para capturar mais expressões características
    const patterns = [
      // Cumprimentos e saudações
      /\b(oi|olá|e aí|eae|fala|beleza|bom dia|boa tarde|boa noite|paz|salve)\b/gi,
      // Despedidas
      /\b(tchau|até|falou|abraço|beijo|fique bem|até mais|até logo|vai com deus)\b/gi,
      // Expressões de surpresa/emoção
      /\b(nossa|meu deus|caramba|puxa|nossa senhora|ai meu deus|santa maria|jesus)\b/gi,
      // Confirmações e concordâncias
      /\b(né|não é|sabe|entende|viu|certo|exato|isso mesmo|claro|óbvio)\b/gi,
      // Tratamentos carinhosos
      /\b(meu filho|minha filha|filho|filha|querido|querida|amor|benzinho|coração)\b/gi,
      // Expressões regionais/características
      /\b(uai|sô|oxe|trem|negócio|bagulho|parada|massa|legal|bacana)\b/gi,
      // Frases completas comuns
      /(como você está|tudo bem|que bom|que legal|imagina só|pode crer|sem dúvida)/gi,
      // Expressões de carinho/preocupação
      /(se cuida|fica bem|com cuidado|deus te abençoe|que deus te proteja)/gi
    ];
    
    patterns.forEach(pattern => {
      const matches = text.match(pattern);
      if (matches) {
        matches.forEach(match => {
          const cleanMatch = match.trim();
          if (cleanMatch.length > 2 && !phrases.includes(cleanMatch)) {
            phrases.push(cleanMatch);
          }
        });
      }
    });
    
    // Também extrair frases mais longas e características
    const sentences = text.split(/[.!?]+/).filter(s => s.trim().length > 10);
    sentences.forEach(sentence => {
      const trimmed = sentence.trim();
      // Procurar por frases que contenham palavras-chave emocionais
      if ((trimmed.includes('sempre') || trimmed.includes('lembro') || 
           trimmed.includes('amor') || trimmed.includes('saudade') ||
           trimmed.includes('orgulho') || trimmed.includes('feliz')) &&
          trimmed.length < 100) {
        phrases.push(trimmed);
      }
    });
    
    return phrases.slice(0, 8); // Máximo 8 frases
  };

  // Função para analisar estilo de fala e extrair características da personalidade
  const analyzeSpechStyle = (text: string): string => {
    const lowerText = text.toLowerCase();
    
    // Detectar formalidade
    if (lowerText.includes('senhor') || lowerText.includes('senhora') || 
        lowerText.includes('vossa') || lowerText.includes('pois não') ||
        lowerText.includes('com licença') || lowerText.includes('por favor') ||
        lowerText.includes('muito obrigado')) {
      return 'formal';
    }
    
    // Detectar informalidade jovem
    if (lowerText.includes('cara') || lowerText.includes('mano') || 
        lowerText.includes('véi') || lowerText.includes('brother') ||
        lowerText.includes('galera') || lowerText.includes('pessoal')) {
      return 'informal';
    }
    
    // Detectar carinho maternal/paternal
    if (lowerText.includes('amor') || lowerText.includes('querido') || 
        lowerText.includes('meu bem') || lowerText.includes('benzinho') ||
        lowerText.includes('coração') || lowerText.includes('meu filho') ||
        lowerText.includes('minha filha')) {
      return 'carinhoso';
    }
    
    // Detectar storytelling/narrativo
    if (lowerText.includes('era uma vez') || lowerText.includes('aconteceu') || 
        lowerText.includes('lembro que') || lowerText.includes('uma vez') ||
        lowerText.includes('você sabe que') || lowerText.includes('deixa eu te contar')) {
      return 'storyteller';
    }
    
    // Detectar estilo motivacional/conselheiro
    if (lowerText.includes('sempre digo') || lowerText.includes('acredite') ||
        lowerText.includes('nunca desista') || lowerText.includes('tenha fé') ||
        lowerText.includes('você consegue') || lowerText.includes('força')) {
      return 'motivacional';
    }
    
    // Detectar humor/brincalhão
    if (lowerText.includes('haha') || lowerText.includes('rsrs') ||
        lowerText.includes('que engraçado') || lowerText.includes('brincadeira') ||
        lowerText.includes('piada') || text.includes('😂') || text.includes('😄')) {
      return 'brincalhão';
    }
    
    return 'natural'; // Padrão
  };

  // Função para extrair traços de personalidade da transcrição
  const extractPersonalityTraits = (text: string): string[] => {
    const traits: string[] = [];
    const lowerText = text.toLowerCase();
    
    // Detectar religiosidade
    if (lowerText.includes('deus') || lowerText.includes('jesus') || 
        lowerText.includes('oração') || lowerText.includes('igreja') ||
        lowerText.includes('fé') || lowerText.includes('abençoe')) {
      traits.push('Religioso(a)');
    }
    
    // Detectar otimismo
    if (lowerText.includes('sempre bom') || lowerText.includes('tudo vai dar certo') ||
        lowerText.includes('positivo') || lowerText.includes('esperança') ||
        lowerText.includes('vai ficar bem')) {
      traits.push('Otimista');
    }
    
    // Detectar preocupação/cuidado
    if (lowerText.includes('se cuida') || lowerText.includes('cuidado') ||
        lowerText.includes('preocupo') || lowerText.includes('atenção') ||
        lowerText.includes('tem cuidado')) {
      traits.push('Cuidadoso(a)');
    }
    
    // Detectar sabedoria/experiência
    if (lowerText.includes('experiência') || lowerText.includes('aprendi') ||
        lowerText.includes('vida ensina') || lowerText.includes('com o tempo') ||
        lowerText.includes('já vi muito')) {
      traits.push('Sábio(a)');
    }
    
    // Detectar carinho familiar
    if (lowerText.includes('família') || lowerText.includes('filhos') ||
        lowerText.includes('netos') || lowerText.includes('casa') ||
        lowerText.includes('lar')) {
      traits.push('Familiar');
    }
    
    return traits;
  };

  // Função para extrair valores e temas favoritos
  const extractValuesAndTopics = (text: string): { values: string[], topics: string[] } => {
    const lowerText = text.toLowerCase();
    const values: string[] = [];
    const topics: string[] = [];
    
    // Valores detectados
    if (lowerText.includes('honestidade') || lowerText.includes('verdade') ||
        lowerText.includes('honesto') || lowerText.includes('sincero')) {
      values.push('Honestidade');
    }
    if (lowerText.includes('família') || lowerText.includes('unidos') ||
        lowerText.includes('juntos') || lowerText.includes('parentes')) {
      values.push('Família');
    }
    if (lowerText.includes('trabalho') || lowerText.includes('esforço') ||
        lowerText.includes('dedicação') || lowerText.includes('batalha')) {
      values.push('Trabalho');
    }
    if (lowerText.includes('estudar') || lowerText.includes('aprender') ||
        lowerText.includes('conhecimento') || lowerText.includes('escola')) {
      values.push('Educação');
    }
    
    // Tópicos favoritos detectados
    if (lowerText.includes('comida') || lowerText.includes('cozinha') ||
        lowerText.includes('receita') || lowerText.includes('cozinhar')) {
      topics.push('Culinária');
    }
    if (lowerText.includes('viagem') || lowerText.includes('lugar') ||
        lowerText.includes('cidade') || lowerText.includes('passear')) {
      topics.push('Viagens');
    }
    if (lowerText.includes('música') || lowerText.includes('cantar') ||
        lowerText.includes('canção') || lowerText.includes('rádio')) {
      topics.push('Música');
    }
    if (lowerText.includes('saúde') || lowerText.includes('médico') ||
        lowerText.includes('remédio') || lowerText.includes('exercício')) {
      topics.push('Saúde');
    }
    
    return { values, topics };
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    } else {
      onBack();
    }
  };

  const handleSave = () => {
    if (!isFormValid) {
      toast({
        title: "Formulário incompleto",
        description: "Por favor, preencha todos os campos obrigatórios.",
        variant: "destructive"
      });
      return;
    }

    // Validar avatar - não permitir blob URLs
    let validAvatar = formData.avatar;
    if (formData.avatar && formData.avatar.startsWith('blob:')) {
      console.warn('PersonForm: Blob URL detected, setting avatar to null');
      validAvatar = "";
      toast({
        title: "Foto não salva",
        description: "A foto não foi carregada corretamente. Tente fazer upload novamente.",
        variant: "destructive"
      });
    }

    const personData = {
      name: formData.name,
      relationship: formData.relationship,
      howTheyCalledYou: formData.howTheyCalledYou,
      birthYear: formData.birthYear ? parseInt(formData.birthYear) : undefined,
      birthDate: formData.birthDate || undefined,
      avatar: validAvatar,
      memories: formData.memories.filter(m => m.text.trim() || m.mediaUrl),
      personality: formData.personality.filter(p => p.trim()),
      commonPhrases: formData.commonPhrases.filter(p => p.trim()),
      temperature: formData.temperature,
      talkingStyle: formData.talkingStyle,
      humorStyle: formData.humorStyle,
      emotionalTone: formData.emotionalTone,
      verbosity: formData.verbosity,
      values: formData.values?.filter(v => v.trim()) || [],
      topics: formData.topics?.filter(t => t.trim()) || [],
      voiceSettings: formData.voiceSettings || { hasRecording: false },
      createdAt: new Date(),
      updatedAt: new Date(),
      lastConversation: person?.lastConversation
    };

    onSave(personData);
  };

  const handleSaveAndExit = () => {
    // Salva mesmo com dados incompletos, mas apenas se pelo menos nome e relacionamento estiverem preenchidos
    if (!formData.name.trim()) {
      toast({
        title: "Nome obrigatório",
        description: "Por favor, adicione pelo menos um nome antes de salvar.",
        variant: "destructive"
      });
      return;
    }

    if (!formData.relationship.trim()) {
      toast({
        title: "Relacionamento obrigatório", 
        description: "Por favor, descreva qual era a relação de vocês antes de salvar.",
        variant: "destructive"
      });
      return;
    }

    
    // Validar avatar - não permitir blob URLs  
    let validAvatar = formData.avatar;
    if (formData.avatar && formData.avatar.startsWith('blob:')) {
      console.warn('PersonForm: Blob URL detected in SaveAndExit, setting avatar to null');
      validAvatar = "";
    }

    const personData = {
      name: formData.name,
      relationship: formData.relationship,
      howTheyCalledYou: formData.howTheyCalledYou,
      birthYear: formData.birthYear ? parseInt(formData.birthYear) : undefined,
      birthDate: formData.birthDate || undefined,
      avatar: validAvatar,
      memories: formData.memories.filter(m => m.text.trim() || m.mediaUrl),
      personality: formData.personality.filter(p => p.trim()),
      commonPhrases: formData.commonPhrases.filter(p => p.trim()),
      temperature: formData.temperature,
      talkingStyle: formData.talkingStyle,
      humorStyle: formData.humorStyle,
      emotionalTone: formData.emotionalTone,
      verbosity: formData.verbosity,
      values: formData.values?.filter(v => v.trim()) || [],
      topics: formData.topics?.filter(t => t.trim()) || [],
      voiceSettings: formData.voiceSettings || { hasRecording: false },
      createdAt: new Date(),
      updatedAt: new Date(),
      lastConversation: person?.lastConversation
    };

    // Chama onSave que vai automaticamente para o fluxo correto (create ou update)
    onSave(personData);
    
    toast({
      title: "✨ Pessoa salva!",
      description: "Você pode continuar editando depois a qualquer momento.",
    });
  };

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="glass-card p-8 fade-in-up hover-lift">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-zilla font-medium italic text-foreground mb-4">
                Vamos começar! ✨
              </h2>
              <p className="text-lg font-work text-muted-foreground">
                Qual o nome desta pessoa especial?
              </p>
            </div>
            <Input
              placeholder="Digite o nome..."
              value={formData.name}
              onChange={(e) => updateFormData({ name: e.target.value })}
              className="text-lg h-14 rounded-xl"
            />
            <div className="flex justify-between mt-8">
              <button 
                onClick={handleBack}
                className="btn-secondary px-6 py-3 rounded-xl font-semibold hover-lift"
              >
                Voltar
              </button>
              <button 
                onClick={handleNext}
                disabled={!canProceed(currentStep)}
                className="btn-primary px-6 py-3 rounded-xl font-semibold hover-lift disabled:opacity-50"
              >
                Próximo
              </button>
            </div>
          </div>
        );

      case 2:
        return (
          <FormStep
            title="Uma foto vale mais que mil palavras! 📸"
            subtitle="Adicione uma foto para dar vida à nossa conversa (pode pular se quiser!)"
            onNext={handleNext}
            onBack={handleBack}
            canNext={canProceed(currentStep)}
          >
            <div className="space-y-6 text-center">
              <div className="mx-auto w-32 h-32 rounded-full border-2 border-dashed border-border bg-muted/20 flex items-center justify-center overflow-hidden">
                {formData.avatar ? (
                  <img 
                    src={formData.avatar} 
                    alt="Avatar" 
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <User className="w-12 h-12 text-muted-foreground" />
                )}
              </div>
              
              <div className="space-y-4 flex flex-col items-center">
                <input
                  type="file"
                  accept="image/*"
                  onChange={async (e) => {
                    const file = e.target.files?.[0];
                    if (file) {
                      try {
                        // Create temporary blob URL for immediate preview
                        const tempUrl = URL.createObjectURL(file);
                        updateFormData({ avatar: tempUrl });
                        
                        // Upload to Supabase Storage in the background
                        const { data: { user } } = await supabase.auth.getUser();
                        if (user) {
                          const permanentUrl = await peopleService.uploadMedia(file, user.id);
                          updateFormData({ avatar: permanentUrl });
                          // Clean up the temporary blob URL
                          URL.revokeObjectURL(tempUrl);
                        }
                      } catch (error) {
                        console.error('Erro ao fazer upload da foto:', error);
                        toast({
                          title: "Erro no upload",
                          description: "Não foi possível enviar a foto. Tente novamente.",
                          variant: "destructive"
                        });
                      }
                    }
                  }}
                  className="hidden"
                  id="avatar-upload"
                />
                <Button 
                  variant="outline" 
                  onClick={() => document.getElementById('avatar-upload')?.click()}
                  className="flex items-center gap-2"
                >
                  <Upload className="w-4 h-4" />
                  {formData.avatar ? 'Alterar foto' : 'Adicionar foto'}
                </Button>
                
                {formData.avatar && (
                  <Button 
                    variant="ghost" 
                    onClick={() => updateFormData({ avatar: '' })}
                    className="text-muted-foreground"
                  >
                    Remover foto
                  </Button>
                )}
              </div>
            </div>
          </FormStep>
        );

      case 3:
        return (
          <FormStep
            title="Agora me conta: qual era a conexão especial de vocês? 💝"
            subtitle="Essa parte é importante para eu entender como vocês se relacionavam"
            onNext={handleNext}
            onBack={handleBack}
            canNext={canProceed(currentStep)}
          >
            <Input
              placeholder="Ex: minha mãe, meu melhor amigo, minha avó..."
              value={formData.relationship}
              onChange={(e) => updateFormData({ relationship: e.target.value })}
              className="text-lg h-14"
            />
          </FormStep>
        );

      case 4:
        return (
          <FormStep
            title="Qual era a idade dessa pessoa especial? 🎂"
            subtitle="Você pode informar o ano de nascimento, data completa ou idade aproximada"
            onNext={handleNext}
            onBack={handleBack}
            canNext={canProceed(currentStep)}
          >
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium text-muted-foreground mb-2 block">
                  Data de nascimento (se souber a data completa)
                </label>
                <Input
                  type="date"
                  value={formData.birthDate}
                  onChange={(e) => {
                    updateFormData({ birthDate: e.target.value });
                    // Se uma data foi selecionada, extrair o ano automaticamente
                    if (e.target.value) {
                      const year = new Date(e.target.value).getFullYear().toString();
                      updateFormData({ birthYear: year });
                    }
                  }}
                  className="text-lg h-14"
                />
              </div>
              
              <div className="text-center text-muted-foreground">ou</div>
              
              <div>
                <label className="text-sm font-medium text-muted-foreground mb-2 block">
                  Ano de nascimento ou idade aproximada
                </label>
                <Input
                  placeholder="Ex: 1950, 75 anos, aproximadamente 80..."
                  value={formData.birthYear}
                  onChange={(e) => updateFormData({ birthYear: e.target.value })}
                  className="text-lg h-14"
                />
              </div>
            </div>
          </FormStep>
        );

      case 5:
        return (
          <FormStep
            title={`Que carinhoso! Como ${pronouns.subject} costumava te chamar? 🥰`}
            subtitle="Esses detalhes fazem toda diferença para criar uma conversa autêntica"
            onNext={handleNext}
            onBack={handleBack}
            canNext={canProceed(currentStep)}
          >
            <Input
              placeholder="Ex: filho, amor, querido..."
              value={formData.howTheyCalledYou}
              onChange={(e) => updateFormData({ howTheyCalledYou: e.target.value })}
              className="text-lg h-14"
            />
          </FormStep>
        );

      case 6:
        return (
          <FormStep
            title="Hora das memórias! Vamos guardar esses momentos preciosos 💭"
            subtitle="Compartilhe histórias que vocês viveram juntos - cada lembrança conta!"
            onNext={handleNext}
            onBack={handleBack}
            canNext={canProceed(currentStep)}
          >
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-medium text-foreground">Memórias</h3>
                <Button 
                  type="button" 
                  variant="outline" 
                  size="sm" 
                  onClick={() => addField('memories')}
                  className="flex items-center gap-2"
                >
                  Adicionar memória
                </Button>
              </div>

              <div className="space-y-6">
                {formData.memories.map((memory, index) => (
                  <div key={index} className="space-y-4 p-4 border border-border rounded-lg">
                    <div className="flex justify-between items-start">
                      <h4 className="text-sm font-medium">Memória {index + 1}</h4>
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
                    <Textarea
                      placeholder="Descreva uma memória especial..."
                      value={memory.text}
                      onChange={(e) => updateField('memories', index, e.target.value)}
                      className="min-h-24"
                    />
                    <FileUploadField
                      onUpload={(file) => {
                        // Simulate file upload - in real app, you'd upload to storage
                        const url = URL.createObjectURL(file);
                        const type = file.type.startsWith('image/') ? 'image' : 
                                   file.type.startsWith('video/') ? 'video' : 'audio';
                        updateMemoryMedia(index, url, type, file.name);
                      }}
                      isUploading={false}
                      mediaType={memory.mediaType}
                      fileName={memory.fileName}
                    />
                  </div>
                ))}
              </div>
            </div>
          </FormStep>
        );

      case 7:
        return (
          <FormStep
            title={`Agora vamos falar da personalidade única ${pronouns.possessive}! 🌟`}
            subtitle="O que fazia essa pessoa tão especial? Me conta os traços marcantes!"
            onNext={handleNext}
            onBack={handleBack}
            canNext={canProceed(currentStep)}
          >
            <ArrayField
              values={formData.personality}
              onAdd={() => addField('personality')}
              onRemove={(index) => removeField('personality', index)}
              onUpdate={(index, value) => updateField('personality', index, value)}
              placeholder="Ex: carinhoso(a), engraçado(a), determinado(a)..."
              label="Traços de personalidade"
              addText="Adicionar traço"
            />
          </FormStep>
        );

      case 8:
        return (
          <FormStep
            title={`Agora me conta: como era o jeitinho ${pronouns.possessive} de falar? 💬`}
            subtitle={`Cada pessoa tem seu estilo único - me ajuda a entender como ${pronouns.subject} se comunicava`}
            onNext={handleNext}
            onBack={handleBack}
            canNext={canProceed(currentStep)}
          >
            <Select value={formData.talkingStyle} onValueChange={(value) => updateFormData({ talkingStyle: value })}>
              <SelectTrigger className="text-lg h-14">
                <SelectValue placeholder="Selecione o estilo..." />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="formal">Formal e educado</SelectItem>
                <SelectItem value="casual">Casual e descontraído</SelectItem>
                <SelectItem value="carinhoso">Carinhoso e afetuoso</SelectItem>
                <SelectItem value="direto">Direto ao ponto</SelectItem>
                <SelectItem value="storyteller">Gostava de contar histórias</SelectItem>
              </SelectContent>
            </Select>
          </FormStep>
        );

      case 9:
        return (
          <FormStep
            title={`E o humor? ${pronouns.subject === 'ele' ? 'Ele' : pronouns.subject === 'ela' ? 'Ela' : 'Essa pessoa'} era do tipo brincalhão? 😄`}
            subtitle={`O humor diz muito sobre uma pessoa - como ${pronouns.subject} gostava de brincar?`}
            onNext={handleNext}
            onBack={handleBack}
            canNext={canProceed(currentStep)}
          >
            <Select value={formData.humorStyle} onValueChange={(value) => updateFormData({ humorStyle: value })}>
              <SelectTrigger className="text-lg h-14">
                <SelectValue placeholder="Selecione o tipo de humor..." />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="sarcastic">Sarcástico</SelectItem>
                <SelectItem value="gentle">Suave e gentil</SelectItem>
                <SelectItem value="playful">Brincalhão</SelectItem>
                <SelectItem value="witty">Espirituoso</SelectItem>
                <SelectItem value="serious">Mais sério, pouco humor</SelectItem>
              </SelectContent>
            </Select>
          </FormStep>
        );

      case 10:
        return (
          <FormStep
            title={`Qual era o tom emocional ${pronouns.possessive}?`}
            subtitle={`Como ${pronouns.subject} expressava suas emoções?`}
            onNext={handleNext}
            onBack={handleBack}
            canNext={canProceed(currentStep)}
          >
            <Select value={formData.emotionalTone} onValueChange={(value) => updateFormData({ emotionalTone: value })}>
              <SelectTrigger className="text-lg h-14">
                <SelectValue placeholder="Selecione o tom emocional..." />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="warm">Caloroso e acolhedor</SelectItem>
                <SelectItem value="calm">Calmo e sereno</SelectItem>
                <SelectItem value="energetic">Energético e animado</SelectItem>
                <SelectItem value="thoughtful">Reflexivo e pensativo</SelectItem>
                <SelectItem value="protective">Protetor e cuidadoso</SelectItem>
              </SelectContent>
            </Select>
          </FormStep>
        );

      case 11:
        return (
          <FormStep
            title={`Como ${pronouns.subject} respondia às perguntas?`}
            subtitle={`${pronouns.subject === 'ele' ? 'Ele' : pronouns.subject === 'ela' ? 'Ela' : 'Essa pessoa'} era mais concis${currentGender === 'male' ? 'o' : 'a'} ou detalhand${currentGender === 'male' ? 'o' : 'a'}?`}
            onNext={handleNext}
            onBack={handleBack}
            canNext={canProceed(currentStep)}
          >
            <Select value={formData.verbosity} onValueChange={(value) => updateFormData({ verbosity: value })}>
              <SelectTrigger className="text-lg h-14">
                <SelectValue placeholder="Selecione o estilo de resposta..." />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="concise">Concis{currentGender === 'male' ? 'o' : 'a'} e diret{currentGender === 'male' ? 'o' : 'a'}</SelectItem>
                <SelectItem value="detailed">Detalhand{currentGender === 'male' ? 'o' : 'a'} e explicativ{currentGender === 'male' ? 'o' : 'a'}</SelectItem>
                <SelectItem value="storytelling">Gostava de contar histórias completas</SelectItem>
                <SelectItem value="variable">Variava conforme o assunto</SelectItem>
              </SelectContent>
            </Select>
          </FormStep>
        );

      case 12:
        return (
          <FormStep
            title={`Quais valores eram importantes para ${pronouns.object}?`}
            subtitle={`O que ${pronouns.subject} mais valorizava na vida?`}
            onNext={handleNext}
            onBack={handleBack}
            canNext={canProceed(currentStep)}
          >
            <ArrayField
              values={formData.values || [""]}
              onAdd={() => addField('values')}
              onRemove={(index) => removeField('values', index)}
              onUpdate={(index, value) => updateField('values', index, value)}
              placeholder="Ex: família, honestidade, trabalho duro..."
              label="Valores importantes"
              addText="Adicionar valor"
            />
          </FormStep>
        );

      case 13:
        return (
          <FormStep
            title={`Sobre o que ${pronouns.subject} mais gostava de conversar?`}
            subtitle={`Quais eram os assuntos favoritos ${pronouns.possessive}?`}
            onNext={handleNext}
            onBack={handleBack}
            canNext={canProceed(currentStep)}
          >
            <ArrayField
              values={formData.topics || [""]}
              onAdd={() => addField('topics')}
              onRemove={(index) => removeField('topics', index)}
              onUpdate={(index, value) => updateField('topics', index, value)}
              placeholder="Ex: culinária, viagens, família..."
              label="Assuntos favoritos"
              addText="Adicionar tópico"
            />
          </FormStep>
        );

      case 14:
        return (
          <FormStep
            title="Vamos ajustar a criatividade! 🎨"
            subtitle={`Que tal definir o quão criativ${currentGender === 'male' ? 'o' : 'a'} e espontâne${currentGender === 'male' ? 'o' : 'a'} você quer que ${pronouns.subject} seja nas respostas?`}
            onNext={handleNext}
            onBack={handleBack}
            canNext={canProceed(currentStep)}
          >
            <Card>
              <CardContent className="p-6">
                <div className="space-y-6">
                  <div className="text-center">
                    <span className="text-2xl font-bold text-primary">
                      {Math.round(formData.temperature * 100)}%
                    </span>
                  </div>
                  <Slider
                    value={[formData.temperature]}
                    onValueChange={([value]) => updateFormData({ temperature: value })}
                    min={0}
                    max={1}
                    step={0.1}
                    className="w-full"
                  />
                  <div className="flex justify-between text-sm text-muted-foreground">
                    <span>Mais previsível</span>
                    <span>Mais criativa</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </FormStep>
        );

      case 15:
        return (
          <FormStep
            title={`Que tal capturar a voz ${formData.name ? `d${formData.name.toLowerCase().includes('a') ? 'a' : 'o'} ${formData.name}` : 'dessa pessoa'}? 🎙️`}
            subtitle={`Esta parte é opcional, mas pode deixar tudo ainda mais autêntico! Grave um áudio da voz ${formData.name ? `d${formData.name.toLowerCase().includes('a') ? 'a' : 'o'} ${formData.name}` : 'dessa pessoa'} se tiver`}
            onNext={handleNext}
            onBack={handleBack}
            canNext={canProceed(currentStep)}
          >
            <VoiceRecordingStep
              personName={formData.name || 'pessoa'}
              existingVoiceSettings={person?.voiceSettings}
              onVoiceRecorded={(blob, duration) => {
                updateFormData({ voiceRecording: blob, voiceDuration: duration });
              }}
              onVoiceProcessed={async (voiceId, transcriptions, audioFiles) => {
                console.log('VoiceRecordingStep: onVoiceProcessed called', { voiceId, transcriptions, audioFiles });
                
                try {
                  // Atualizar configurações de voz com os arquivos de áudio
                  if (voiceId || audioFiles?.length) {
                    console.log('VoiceRecordingStep: Updating voice settings with voiceId:', voiceId, 'and audioFiles:', audioFiles?.length);
                    const newVoiceSettings = { 
                      hasRecording: true, 
                      ...(voiceId && { voiceId }),
                      ...(audioFiles && { audioFiles })
                    };
                    updateFormData({ voiceSettings: newVoiceSettings });
                  }
                  
                  // Analisar transcrições para extrair características da fala e personalidade
                  if (transcriptions.length > 0) {
                    console.log('VoiceRecordingStep: Processing transcriptions for personality extraction:', transcriptions);
                    const combinedText = transcriptions.join(' ');
                    
                    // Adicionar frases características encontradas na transcrição
                    const newPhrases = extractCharacteristicPhrases(combinedText);
                    if (newPhrases.length > 0) {
                      console.log('VoiceRecordingStep: Found characteristic phrases:', newPhrases);
                      const currentPhrases = formData.commonPhrases.filter(p => p.trim());
                      const uniquePhrases = [...new Set([...currentPhrases, ...newPhrases])];
                      updateFormData({ commonPhrases: uniquePhrases });
                    }
                    
                    // Detectar estilo de fala baseado na transcrição
                    const detectedStyle = analyzeSpechStyle(combinedText);
                    if (detectedStyle && (!formData.talkingStyle || formData.talkingStyle === 'natural')) {
                      console.log('VoiceRecordingStep: Detected talking style:', detectedStyle);
                      updateFormData({ talkingStyle: detectedStyle });
                    }
                    
                    // Extrair traços de personalidade automaticamente
                    const newTraits = extractPersonalityTraits(combinedText);
                    if (newTraits.length > 0) {
                      console.log('VoiceRecordingStep: Detected personality traits:', newTraits);
                      const currentTraits = formData.personality.filter(p => p.trim());
                      const uniqueTraits = [...new Set([...currentTraits, ...newTraits])];
                      updateFormData({ personality: uniqueTraits });
                    }
                    
                    // Extrair valores e tópicos favoritos
                    const { values: newValues, topics: newTopics } = extractValuesAndTopics(combinedText);
                    
                    if (newValues.length > 0) {
                      console.log('VoiceRecordingStep: Detected values:', newValues);
                      const currentValues = formData.values?.filter(v => v.trim()) || [];
                      const uniqueValues = [...new Set([...currentValues, ...newValues])];
                      updateFormData({ values: uniqueValues });
                    }
                    
                    if (newTopics.length > 0) {
                      console.log('VoiceRecordingStep: Detected topics:', newTopics);
                      const currentTopics = formData.topics?.filter(t => t.trim()) || [];
                      const uniqueTopics = [...new Set([...currentTopics, ...newTopics])];
                      updateFormData({ topics: uniqueTopics });
                    }
                    
                    // Exibir toast informativo sobre o que foi detectado
                    const detectedItems = [];
                    if (newPhrases.length > 0) detectedItems.push(`${newPhrases.length} expressões características`);
                    if (newTraits.length > 0) detectedItems.push(`${newTraits.length} traços de personalidade`);
                    if (newValues.length > 0) detectedItems.push(`${newValues.length} valores`);
                    if (newTopics.length > 0) detectedItems.push(`${newTopics.length} tópicos favoritos`);
                    
                    if (detectedItems.length > 0) {
                      toast({
                        title: "🤖 IA analisou a voz!",
                        description: `Detectei automaticamente: ${detectedItems.join(', ')}. Isso vai deixar o clone muito mais realista!`,
                      });
                    }
                  }
                  
                  console.log('VoiceRecordingStep: Voice processing completed successfully');
                  
                  // Avançar automaticamente para a próxima etapa após processamento bem-sucedido
                  setTimeout(() => {
                    if (currentStep === 15) { // Garantir que ainda estamos na etapa de gravação
                      console.log('VoiceRecordingStep: Advancing to next step after voice processing');
                      handleNext();
                    }
                  }, 3500);
                  
                } catch (error) {
                  console.error('VoiceRecordingStep: Error in onVoiceProcessed:', error);
                  toast({
                    title: "Erro no processamento",
                    description: "Houve um erro ao processar os áudios, mas você pode continuar.",
                    variant: "destructive"
                  });
                }
              }}
              onSkip={handleNext}
            />
          </FormStep>
        );

      case 16:
        return (
          <FormStep
            title="Para finalizar: as frases marcantes! 💫"
            subtitle={`Quais eram aquelas expressões ou frases que só ${pronouns.subject} falava? Essas que ficaram gravadas na sua memória?`}
            onNext={isFormValid ? handleSave : undefined}
            onBack={handleBack}
            canNext={canProceed(currentStep)}
            isLast={true}
            nextText={person ? "✨ Atualizar pessoa" : "🎉 Criar pessoa"}
          >
            <ArrayField
              values={formData.commonPhrases}
              onAdd={() => addField('commonPhrases')}
              onRemove={(index) => removeField('commonPhrases', index)}
              onUpdate={(index, value) => updateField('commonPhrases', index, value)}
              placeholder="Ex: 'Meu filho querido', 'Que Deus te abençoe'..."
              label="Frases características"
              addText="Adicionar frase"
            />
          </FormStep>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen relative overflow-hidden" style={{backgroundColor: '#FDFBCB'}}>
      {/* Background elements */}
      <div className="absolute top-0 left-0 w-full h-full">
        <div className="absolute top-20 left-20 w-72 h-72 rounded-full animate-float" style={{backgroundColor: '#F8F4E6'}}></div>
        <div className="absolute top-40 right-20 w-72 h-72 rounded-full animate-float" style={{backgroundColor: '#F0EDD7', animationDelay: '2s'}}></div>
        <div className="absolute bottom-20 left-1/2 w-72 h-72 rounded-full animate-float" style={{backgroundColor: '#E8E3C8', animationDelay: '4s'}}></div>
      </div>
      
      <div className="relative z-10 max-w-4xl mx-auto p-4 py-8">
        <div className="mb-8">
          <ProgressBar 
            currentStep={currentStep} 
            totalSteps={totalSteps}
            className="mb-6"
          />
          
          {/* Botão Salvar e Sair - visível quando nome e relacionamento estão preenchidos */}
          {formData.name.trim() && formData.relationship.trim() && (
            <div className="flex justify-end mb-4">
              <Button
                variant="outline"
                onClick={handleSaveAndExit}
                className="flex items-center gap-2 border-2"
                style={{backgroundColor: '#F8F4E6', borderColor: '#E8E3C8', color: '#441632'}}
              >
                💾 Salvar e sair
              </Button>
            </div>
          )}
        </div>
        {renderStep()}
      </div>
    </div>
  );
};