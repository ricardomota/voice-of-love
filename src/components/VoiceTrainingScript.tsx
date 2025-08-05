import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { 
  RecordVoiceOver, 
  PlayArrow, 
  CheckCircle, 
  Info,
  Timer,
  VolumeUp
} from "@mui/icons-material";

const trainingTexts = [
  {
    category: "Saudações",
    emotion: "alegre",
    text: "Oi! Como você está? Que bom te ver hoje! Espero que esteja tendo um dia maravilhoso."
  },
  {
    category: "Conversação",
    emotion: "natural",
    text: "Hoje eu estava pensando sobre nossa última conversa. Foi muito interessante o que você disse sobre aquele assunto."
  },
  {
    category: "Pergunta",
    emotion: "curioso",
    text: "E aí, o que você acha? Qual é a sua opinião sobre isso? Gostaria muito de saber o que pensa."
  },
  {
    category: "Carinho",
    emotion: "carinhoso",
    text: "Você sabe que eu me importo muito com você, né? Sempre estarei aqui quando precisar."
  },
  {
    category: "Reflexão",
    emotion: "pensativo",
    text: "Às vezes eu fico pensando... a vida é cheia de surpresas, não é mesmo? Cada dia traz algo novo."
  },
  {
    category: "Animação",
    emotion: "entusiasmado",
    text: "Isso é fantástico! Estou muito empolgado com essa novidade! Que legal, não acredito!"
  },
  {
    category: "Consolo",
    emotion: "compreensivo",
    text: "Eu entendo como você se sente. Não se preocupe, as coisas vão melhorar. Estou aqui para te apoiar."
  }
];

interface VoiceTrainingScriptProps {
  onClose?: () => void;
}

export const VoiceTrainingScript: React.FC<VoiceTrainingScriptProps> = ({ onClose }) => {
  const [currentText, setCurrentText] = useState(0);
  const [completedTexts, setCompletedTexts] = useState<number[]>([]);

  const markAsCompleted = (index: number) => {
    if (!completedTexts.includes(index)) {
      setCompletedTexts([...completedTexts, index]);
    }
  };

  const nextText = () => {
    if (currentText < trainingTexts.length - 1) {
      setCurrentText(currentText + 1);
    }
  };

  const prevText = () => {
    if (currentText > 0) {
      setCurrentText(currentText - 1);
    }
  };

  const currentScript = trainingTexts[currentText];
  const progress = (completedTexts.length / trainingTexts.length) * 100;

  return (
    <div className="max-w-2xl mx-auto p-4 space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <RecordVoiceOver className="w-6 h-6" />
            Script de Treinamento de Voz
          </CardTitle>
          <div className="flex items-center justify-between">
            <Badge variant="outline">
              {completedTexts.length} de {trainingTexts.length} completos
            </Badge>
            <div className="text-sm text-muted-foreground">
              {Math.round(progress)}% concluído
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Instruções */}
      <Alert>
        <Info className="w-4 h-4" />
        <AlertDescription className="space-y-2">
          <strong>Instruções para gravação:</strong>
          <ul className="list-disc ml-4 space-y-1 text-sm">
            <li>Leia cada texto com a emoção indicada</li>
            <li>Fale de forma natural, como se estivesse conversando</li>
            <li>Mantenha um ritmo constante, nem muito rápido nem muito devagar</li>
            <li>Grave em ambiente silencioso, sem ruído de fundo</li>
            <li>Cada gravação deve ter entre 10-30 segundos</li>
          </ul>
        </AlertDescription>
      </Alert>

      {/* Texto atual */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg">
              Texto {currentText + 1} de {trainingTexts.length}
            </CardTitle>
            <Badge 
              variant={completedTexts.includes(currentText) ? "default" : "secondary"}
              className="flex items-center gap-1"
            >
              {completedTexts.includes(currentText) && <CheckCircle className="w-3 h-3" />}
              {currentScript.category}
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <VolumeUp className="w-4 h-4" />
              <span>Emoção: <strong>{currentScript.emotion}</strong></span>
            </div>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Timer className="w-4 h-4" />
              <span>Tempo sugerido: 10-30 segundos</span>
            </div>
          </div>

          <Separator />

          <div className="bg-muted/30 p-4 rounded-lg">
            <p className="text-lg leading-relaxed font-medium">
              "{currentScript.text}"
            </p>
          </div>

          <div className="flex gap-3">
            <Button
              onClick={() => markAsCompleted(currentText)}
              disabled={completedTexts.includes(currentText)}
              className="flex-1"
            >
              <CheckCircle className="w-4 h-4 mr-2" />
              {completedTexts.includes(currentText) ? 'Gravado!' : 'Marcar como Gravado'}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Navegação */}
      <div className="flex justify-between">
        <Button
          onClick={prevText}
          disabled={currentText === 0}
          variant="outline"
        >
          Anterior
        </Button>

        <div className="flex items-center gap-2">
          {trainingTexts.map((_, index) => (
            <div
              key={index}
              className={`w-2 h-2 rounded-full cursor-pointer transition-colors ${
                index === currentText 
                  ? 'bg-primary' 
                  : completedTexts.includes(index)
                  ? 'bg-green-500'
                  : 'bg-muted'
              }`}
              onClick={() => setCurrentText(index)}
            />
          ))}
        </div>

        <Button
          onClick={nextText}
          disabled={currentText === trainingTexts.length - 1}
          variant="outline"
        >
          Próximo
        </Button>
      </div>

      {/* Dicas finais */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Dicas para Melhor Qualidade</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3 text-sm">
            <div className="space-y-1">
              <strong>🎯 Variedade é fundamental:</strong>
              <ul className="ml-4 space-y-1 text-muted-foreground">
                <li>• Grave cada texto com a emoção indicada</li>
                <li>• Varie o tom e ritmo entre diferentes categorias</li>
                <li>• Inclua pausas naturais na fala</li>
              </ul>
            </div>
            
            <div className="space-y-1">
              <strong>🎤 Qualidade técnica:</strong>
              <ul className="ml-4 space-y-1 text-muted-foreground">
                <li>• Use um microfone próximo da boca (20-30cm)</li>
                <li>• Evite eco - grave em local com tecidos/móveis</li>
                <li>• Mantenha volume consistente</li>
              </ul>
            </div>

            <div className="space-y-1">
              <strong>✨ Expressividade:</strong>
              <ul className="ml-4 space-y-1 text-muted-foreground">
                <li>• Sorria ao gravar textos alegres</li>
                <li>• Use gestos naturais para ajudar na entonação</li>
                <li>• Imagine que está falando com alguém querido</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>

      {progress === 100 && (
        <Alert className="border-green-200 bg-green-50">
          <CheckCircle className="w-4 h-4 text-green-600" />
          <AlertDescription>
            <strong>Parabéns!</strong> Você completou todos os textos de treinamento. 
            Sua voz clonada terá uma qualidade excelente com essa variedade de emoções e contextos!
          </AlertDescription>
        </Alert>
      )}

      {onClose && (
        <div className="flex justify-center">
          <Button onClick={onClose} variant="outline">
            Fechar Script
          </Button>
        </div>
      )}
    </div>
  );
};