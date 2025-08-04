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
import { X } from 'lucide-react';

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

  const handleNext = () => {
    if (currentStep < 14) {
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
            title="Qual o nome desta pessoa?"
            subtitle="Como você gostaria de se referir a ela?"
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
            title="Qual era a relação de vocês?"
            subtitle="Descreva como vocês se conheciam"
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

      case 3:
        return (
          <FormStep
            title="Como ela te chamava?"
            subtitle="Esse campo é opcional, mas pode tornar a conversa mais pessoal"
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

      case 4:
        return (
          <FormStep
            title="Compartilhe algumas memórias"
            subtitle="Conte-nos sobre momentos especiais que vocês viveram juntos"
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

      case 5:
        return (
          <FormStep
            title="Como era a personalidade dela?"
            subtitle="Descreva os traços de personalidade mais marcantes"
            onNext={handleNext}
            onBack={handleBack}
            canNext={canProceed(currentStep)}
          >
            <ArrayField
              values={formData.personality}
              onAdd={() => addField('personality')}
              onRemove={(index) => removeField('personality', index)}
              onUpdate={(index, value) => updateField('personality', index, value)}
              placeholder="Ex: carinhosa, engraçada, determinada..."
              label="Traços de personalidade"
              addText="Adicionar traço"
            />
          </FormStep>
        );

      case 6:
        return (
          <FormStep
            title="Como ela costumava falar?"
            subtitle="Descreva o estilo de comunicação dela"
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

      case 7:
        return (
          <FormStep
            title="Que tipo de humor ela tinha?"
            subtitle="Como ela demonstrava seu senso de humor?"
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

      case 8:
        return (
          <FormStep
            title="Qual era o tom emocional dela?"
            subtitle="Como ela expressava suas emoções?"
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

      case 9:
        return (
          <FormStep
            title="Como ela respondia às perguntas?"
            subtitle="Ela era mais concisa ou detalhada?"
            onNext={handleNext}
            onBack={handleBack}
            canNext={canProceed(currentStep)}
          >
            <Select value={formData.verbosity} onValueChange={(value) => updateFormData({ verbosity: value })}>
              <SelectTrigger className="text-lg h-14">
                <SelectValue placeholder="Selecione o estilo de resposta..." />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="concise">Concisa e direta</SelectItem>
                <SelectItem value="detailed">Detalhada e explicativa</SelectItem>
                <SelectItem value="storytelling">Gostava de contar histórias completas</SelectItem>
                <SelectItem value="variable">Variava conforme o assunto</SelectItem>
              </SelectContent>
            </Select>
          </FormStep>
        );

      case 10:
        return (
          <FormStep
            title="Quais valores eram importantes para ela?"
            subtitle="O que ela mais valorizava na vida?"
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

      case 11:
        return (
          <FormStep
            title="Sobre o que ela mais gostava de conversar?"
            subtitle="Quais eram os assuntos favoritos dela?"
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

      case 12:
        return (
          <FormStep
            title="Criatividade das respostas"
            subtitle="Quão criativa e imprevisível você gostaria que ela fosse?"
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

      case 13:
        return (
          <FormStep
            title="Gravação de voz (opcional)"
            subtitle="Grave um áudio para que possamos capturar melhor a essência da voz dela"
            onNext={handleNext}
            onBack={handleBack}
            canNext={canProceed(currentStep)}
          >
            <VoiceRecordingStep
              onVoiceRecorded={(blob, duration) => {
                updateFormData({ voiceRecording: blob, voiceDuration: duration });
              }}
              onSkip={() => {}}
            />
          </FormStep>
        );

      case 14:
        return (
          <FormStep
            title="Frases características"
            subtitle="Quais eram as expressões ou frases que ela mais usava?"
            onNext={isFormValid ? handleSave : undefined}
            onBack={handleBack}
            canNext={canProceed(currentStep)}
            isLast={true}
            nextText={person ? "Atualizar Pessoa" : "Criar Pessoa"}
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
        {renderStep()}
      </div>
    </div>
  );
};