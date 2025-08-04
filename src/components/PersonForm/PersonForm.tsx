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

  const totalSteps = 15; // Aumentamos para 15 passos (incluindo foto)

  const handleNext = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
    }
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

    const personData = {
      name: formData.name,
      relationship: formData.relationship,
      howTheyCalledYou: formData.howTheyCalledYou,
      birthYear: formData.birthYear ? parseInt(formData.birthYear) : undefined,
      avatar: formData.avatar,
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
      voiceSettings: {
        hasRecording: !!formData.voiceRecording,
        voiceId: formData.voiceRecording ? 'custom' : undefined
      },
      lastConversation: person?.lastConversation
    };

    onSave(personData);
  };

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <FormStep
            title="Vamos começar! Qual o nome desta pessoa especial? ✨"
            subtitle="Como você gostaria de se referir a ela durante nossas conversas?"
            onNext={handleNext}
            onBack={handleBack}
            canNext={canProceed(currentStep)}
          >
            <Input
              placeholder="Digite o nome..."
              value={formData.name}
              onChange={(e) => updateFormData({ name: e.target.value })}
              className="text-lg h-14"
            />
          </FormStep>
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
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) {
                      const url = URL.createObjectURL(file);
                      updateFormData({ avatar: url });
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

      case 5:
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

      case 6:
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

      case 7:
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

      case 8:
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

      case 9:
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

      case 10:
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

      case 11:
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

      case 12:
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

      case 13:
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

      case 14:
        return (
          <FormStep
            title="Que tal capturar a voz ${pronouns.possessive}? 🎙️"
            subtitle={`Esta parte é opcional, mas pode deixar tudo ainda mais autêntico! Grave um áudio da voz ${pronouns.possessive} se tiver`}
            onNext={handleNext}
            onBack={handleBack}
            canNext={canProceed(currentStep)}
          >
            <VoiceRecordingStep
              onVoiceRecorded={(blob, duration) => {
                updateFormData({ voiceRecording: blob, voiceDuration: duration });
              }}
              onSkip={handleNext}
            />
          </FormStep>
        );

      case 15:
        return (
          <FormStep
            title="Para finalizar: as frases marcantes! 💫"
            subtitle={`Quais eram aquelas expressões ou frases que só ${pronouns.subject} falava? Essas que ficaram gravadas na sua memória?`}
            onNext={isFormValid ? handleSave : undefined}
            onBack={handleBack}
            canNext={canProceed(currentStep)}
            isLast={true}
            nextText={person ? "✨ Atualizar Pessoa" : "🎉 Criar Pessoa"}
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
    <div className="min-h-screen bg-gradient-warm p-4">
      <div className="max-w-4xl mx-auto py-8">
        <div className="mb-8">
          <ProgressBar 
            currentStep={currentStep} 
            totalSteps={totalSteps}
            className="mb-6"
          />
        </div>
        {renderStep()}
      </div>
    </div>
  );
};