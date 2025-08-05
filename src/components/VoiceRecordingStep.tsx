import { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Mic, MicOff, Upload, Play, Pause, RotateCcw } from 'lucide-react';
import { useSpeechToText } from '@/hooks/useSpeechToText';
import { supabase } from '@/integrations/supabase/client';

interface VoiceRecordingStepProps {
  personName: string;
  onVoiceRecorded?: (audioBlob: Blob, duration: number) => void;
  onVoiceProcessed?: (voiceId: string, transcriptions: string[]) => void;
  onSkip: () => void;
}

export const VoiceRecordingStep = ({ personName, onVoiceRecorded, onVoiceProcessed, onSkip }: VoiceRecordingStepProps) => {
  const [isRecording, setIsRecording] = useState(false);
  const [recordedAudio, setRecordedAudio] = useState<Blob | null>(null);
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [recordingDuration, setRecordingDuration] = useState(0);
  const [totalDuration, setTotalDuration] = useState(0);
  const [isCalculatingDuration, setIsCalculatingDuration] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [processingStep, setProcessingStep] = useState<string>('');

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const startRecording = async () => {
    try {
      setError(null);
      const stream = await navigator.mediaDevices.getUserMedia({ 
        audio: {
          sampleRate: 44100,
          channelCount: 1,
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true
        }
      });

      const mediaRecorder = new MediaRecorder(stream, {
        mimeType: 'audio/webm;codecs=opus'
      });

      audioChunksRef.current = [];
      
      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
        setRecordedAudio(audioBlob);
        
        const url = URL.createObjectURL(audioBlob);
        setAudioUrl(url);
        
        // Stop all tracks
        stream.getTracks().forEach(track => track.stop());
      };

      mediaRecorder.start();
      mediaRecorderRef.current = mediaRecorder;
      setIsRecording(true);
      
      // Start timer
      setRecordingDuration(0);
      timerRef.current = setInterval(() => {
        setRecordingDuration(prev => prev + 1);
      }, 1000);

    } catch (err) {
      setError('Erro ao acessar o microfone. Verifique as permissões.');
      console.error('Error starting recording:', err);
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
    }
  };

  const playRecording = () => {
    if (audioUrl && !isPlaying) {
      const audio = new Audio(audioUrl);
      audioRef.current = audio;
      
      audio.onended = () => {
        setIsPlaying(false);
        audioRef.current = null;
      };
      
      audio.play();
      setIsPlaying(true);
    }
  };

  const stopPlaying = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
      setIsPlaying(false);
      audioRef.current = null;
    }
  };

  const resetRecording = () => {
    setRecordedAudio(null);
    setUploadedFiles([]);
    setAudioUrl(null);
    setRecordingDuration(0);
    setTotalDuration(0);
    setIsPlaying(false);
    setError(null);
    
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current = null;
    }
  };

  const removeFile = (index: number) => {
    const newFiles = uploadedFiles.filter((_, i) => i !== index);
    setUploadedFiles(newFiles);
    
    if (newFiles.length === 0) {
      setTotalDuration(0);
      setIsCalculatingDuration(false);
    } else {
      // Recalcular duração total
      setIsCalculatingDuration(true);
      setTotalDuration(0);
      
      const calculateDuration = async () => {
        let totalDur = 0;
        
        for (const file of newFiles) {
          try {
            const url = URL.createObjectURL(file);
            const audio = new Audio(url);
            
            const duration = await new Promise<number>((resolve) => {
              const handleLoadedMetadata = () => {
                const dur = audio.duration || 0;
                URL.revokeObjectURL(url);
                audio.removeEventListener('loadedmetadata', handleLoadedMetadata);
                audio.removeEventListener('error', handleError);
                resolve(Math.floor(dur));
              };
              
              const handleError = () => {
                console.warn(`Não foi possível carregar a duração do arquivo: ${file.name}`);
                URL.revokeObjectURL(url);
                audio.removeEventListener('loadedmetadata', handleLoadedMetadata);
                audio.removeEventListener('error', handleError);
                resolve(0);
              };
              
              audio.addEventListener('loadedmetadata', handleLoadedMetadata);
              audio.addEventListener('error', handleError);
              
              // Force load metadata
              audio.load();
              
              // Timeout para evitar travamentos
              setTimeout(() => {
                URL.revokeObjectURL(url);
                audio.removeEventListener('loadedmetadata', handleLoadedMetadata);
                audio.removeEventListener('error', handleError);
                resolve(0);
              }, 10000);
            });
            
            totalDur += duration;
          } catch (error) {
            console.warn(`Erro ao processar arquivo ${file.name}:`, error);
          }
        }
        
        setTotalDuration(totalDur);
        setIsCalculatingDuration(false);
      };
      
      calculateDuration();
    }
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    if (files.length === 0) return;

    // Lista expandida de formatos aceitos
    const acceptedFormats = [
      'audio/webm', 'audio/ogg', 'audio/mpeg', 'audio/mp3', 'audio/wav', 
      'audio/mp4', 'audio/m4a', 'audio/aac', 'audio/opus', 'audio/flac',
      'audio/x-wav', 'audio/x-m4a', 'audio/x-aac'
    ];
    
    const validFiles: File[] = [];
    const invalidFiles: string[] = [];
    
    files.forEach(file => {
      const isValidAudio = acceptedFormats.some(format => 
        file.type === format || 
        file.name.toLowerCase().endsWith('.' + format.split('/')[1]) ||
        file.name.toLowerCase().endsWith('.opus') ||
        file.name.toLowerCase().endsWith('.m4a') ||
        file.name.toLowerCase().endsWith('.aac') ||
        file.name.toLowerCase().endsWith('.flac')
      );
      
      if (isValidAudio) {
        validFiles.push(file);
      } else {
        invalidFiles.push(file.name);
      }
    });
    
    if (invalidFiles.length > 0) {
      setError(`Alguns arquivos não são suportados: ${invalidFiles.join(', ')}`);
    }
    
    if (validFiles.length > 0) {
      // Combinar arquivos existentes com novos arquivos
      const allFiles = [...uploadedFiles, ...validFiles];
      setUploadedFiles(allFiles);
      setError(null);
      setIsCalculatingDuration(true);
      setTotalDuration(0);
      
      // Calculate total duration for all files
      const calculateDuration = async () => {
        let totalDur = 0;
        
        for (const file of allFiles) {
          try {
            const url = URL.createObjectURL(file);
            const audio = new Audio(url);
            
            const duration = await new Promise<number>((resolve) => {
              const handleLoadedMetadata = () => {
                const dur = audio.duration || 0;
                URL.revokeObjectURL(url);
                audio.removeEventListener('loadedmetadata', handleLoadedMetadata);
                audio.removeEventListener('error', handleError);
                resolve(Math.floor(dur));
              };
              
              const handleError = () => {
                console.warn(`Não foi possível carregar a duração do arquivo: ${file.name}`);
                URL.revokeObjectURL(url);
                audio.removeEventListener('loadedmetadata', handleLoadedMetadata);
                audio.removeEventListener('error', handleError);
                resolve(0);
              };
              
              audio.addEventListener('loadedmetadata', handleLoadedMetadata);
              audio.addEventListener('error', handleError);
              
              // Force load metadata
              audio.load();
              
              // Timeout para evitar travamentos
              setTimeout(() => {
                URL.revokeObjectURL(url);
                audio.removeEventListener('loadedmetadata', handleLoadedMetadata);
                audio.removeEventListener('error', handleError);
                resolve(0);
              }, 10000);
            });
            
            totalDur += duration;
          } catch (error) {
            console.warn(`Erro ao processar arquivo ${file.name}:`, error);
          }
        }
        
        setTotalDuration(totalDur);
        setIsCalculatingDuration(false);
      };
      
      calculateDuration();
    }

    // Reset input value to allow selecting the same files again
    event.target.value = '';
  };

  const confirmRecording = async () => {
    if (recordedAudio) {
      if (onVoiceRecorded) {
        onVoiceRecorded(recordedAudio, recordingDuration);
      }
      await processVoiceFiles([recordedAudio]);
    } else if (uploadedFiles.length > 0) {
      if (onVoiceRecorded) {
        onVoiceRecorded(uploadedFiles[0], totalDuration);
      }
      await processVoiceFiles(uploadedFiles);
    }
  };

  const processVoiceFiles = async (files: (File | Blob)[]) => {
    setIsProcessing(true);
    setError(null);
    
    try {
      const transcriptions: string[] = [];
      let voiceId: string | null = null;

      // Step 1: Transcrever todos os áudios
      setProcessingStep('Transcrevendo áudios...');
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        setProcessingStep(`Transcrevendo áudio ${i + 1} de ${files.length}...`);
        
        // Convert file to base64
        const base64Audio = await new Promise<string>((resolve) => {
          const reader = new FileReader();
          reader.onload = () => {
            const result = reader.result as string;
            const base64 = result.split(',')[1]; // Remove data:audio/... prefix
            resolve(base64);
          };
          reader.readAsDataURL(file);
        });

        // Transcrever áudio
        const transcriptionResult = await supabase.functions.invoke('speech-to-text', {
          body: { audio: base64Audio }
        });

        if (transcriptionResult.error) {
          console.error('Transcription error:', transcriptionResult.error);
        } else if (transcriptionResult.data?.text) {
          transcriptions.push(transcriptionResult.data.text);
        }
      }

      // Step 2: Criar clone de voz com o primeiro arquivo (ou o de melhor qualidade)
      if (files.length > 0) {
        setProcessingStep('Criando clone de voz...');
        
        const primaryFile = files[0]; // Use o primeiro arquivo para o clone
        const base64Audio = await new Promise<string>((resolve) => {
          const reader = new FileReader();
          reader.onload = () => {
            const result = reader.result as string;
            const base64 = result.split(',')[1];
            resolve(base64);
          };
          reader.readAsDataURL(primaryFile);
        });

        const voiceCloneResult = await supabase.functions.invoke('voice-clone', {
          body: {
            audioBlob: base64Audio,
            name: personName,
            description: `Voice clone of ${personName} - Created from uploaded audio`
          }
        });

        if (voiceCloneResult.error) {
          console.error('Voice clone error:', voiceCloneResult.error);
          const errorMessage = voiceCloneResult.error?.message || 'Erro desconhecido no clone de voz';
          throw new Error(`Erro no clone de voz: ${errorMessage}`);
        } else if (voiceCloneResult.data?.voiceId) {
          voiceId = voiceCloneResult.data.voiceId;
        } else {
          console.warn('Voice clone result:', voiceCloneResult);
          // Continue sem voice ID se não foi possível criar
        }
      }

      setProcessingStep('Finalizando...');
      
      // Callback com os resultados
      if (onVoiceProcessed && (voiceId || transcriptions.length > 0)) {
        onVoiceProcessed(voiceId || '', transcriptions);
      }

      setProcessingStep('✅ Processamento concluído!');
      
      // Aguardar um pouco para mostrar a mensagem de sucesso
      setTimeout(() => {
        setIsProcessing(false);
        setProcessingStep('');
      }, 2000);

    } catch (error) {
      console.error('Error processing voice files:', error);
      setError(error instanceof Error ? error.message : 'Erro ao processar áudios');
      setIsProcessing(false);
      setProcessingStep('');
    }
  };

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="space-y-8 text-center">
      <div className="space-y-4">
        <div className="text-6xl">🎤</div>
        <div className="space-y-2">
          <p className="text-lg text-muted-foreground leading-relaxed">
            Grave algumas palavras ou frases dessa pessoa para que possamos replicar sua voz única.
          </p>
          <p className="text-sm text-muted-foreground/80 leading-relaxed">
            Você pode usar áudios do <strong>WhatsApp</strong>, gravações de vídeos, ou qualquer arquivo de áudio.
          </p>
        </div>
      </div>

      {error && (
        <div className="p-4 bg-destructive/10 text-destructive rounded-lg border border-destructive/20">
          {error}
        </div>
      )}

      <div className="space-y-6">
        {!recordedAudio && uploadedFiles.length === 0 ? (
          <div className="space-y-4">
            <div className="flex flex-col items-center gap-4">
              <Button
                size="lg"
                variant={isRecording ? "destructive" : "default"}
                onClick={isRecording ? stopRecording : startRecording}
                className="w-24 h-24 rounded-full text-xl"
                disabled={!!error}
              >
                {isRecording ? <MicOff className="w-8 h-8" /> : <Mic className="w-8 h-8" />}
              </Button>
              
              <div className="text-center">
                <p className="text-sm font-medium">
                  {isRecording ? 'Gravando...' : 'Toque para gravar'}
                </p>
                {isRecording && (
                  <p className="text-lg font-mono text-primary mt-2">
                    {formatDuration(recordingDuration)}
                  </p>
                )}
              </div>
            </div>

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-muted-foreground/20" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-background px-2 text-muted-foreground">ou</span>
              </div>
            </div>

            <div className="flex justify-center">
              <input
                type="file"
                accept="audio/*,.opus,.m4a,.aac,.flac"
                onChange={handleFileUpload}
                className="hidden"
                id="audio-upload"
                multiple
              />
              <Button 
                variant="outline" 
                onClick={() => document.getElementById('audio-upload')?.click()}
                className="flex items-center gap-2"
              >
                <Upload className="w-4 h-4" />
                Enviar arquivo(s) de áudio
              </Button>
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            <div className="p-6 bg-accent/5 rounded-lg border border-accent/20">
              <div className="space-y-4">
                {recordedAudio ? (
                  <>
                    <div className="flex items-center justify-center gap-4">
                      <Button
                        variant="outline"
                        onClick={isPlaying ? stopPlaying : playRecording}
                        className="flex items-center gap-2"
                      >
                        {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                        {isPlaying ? 'Pausar' : 'Reproduzir'}
                      </Button>
                      
                      <Button
                        variant="ghost"
                        onClick={resetRecording}
                        className="flex items-center gap-2"
                      >
                        <RotateCcw className="w-4 h-4" />
                        Gravar novamente
                      </Button>
                    </div>
                    
                    <p className="text-sm text-muted-foreground">
                      Duração: {formatDuration(recordingDuration)}
                    </p>
                  </>
                ) : uploadedFiles.length > 0 ? (
                  <>
                    <div className="space-y-2">
                      <h4 className="font-medium">Arquivos selecionados:</h4>
                      {uploadedFiles.map((file, index) => (
                        <div key={index} className="text-sm text-muted-foreground flex items-center justify-between gap-2 p-2 bg-muted/30 rounded">
                          <div className="flex items-center gap-2">
                            <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                            <span className="flex-1 truncate">{file.name}</span>
                          </div>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => removeFile(index)}
                            className="h-6 w-6 p-0 hover:bg-destructive/20"
                          >
                            ✕
                          </Button>
                        </div>
                      ))}
                    </div>
                    
                    <div className="flex justify-center gap-2">
                      <Button
                        variant="outline"
                        onClick={() => document.getElementById('audio-upload')?.click()}
                        className="flex items-center gap-2"
                        disabled={isCalculatingDuration}
                      >
                        <Upload className="w-4 h-4" />
                        Adicionar mais áudios
                      </Button>
                      
                      <Button
                        variant="ghost"
                        onClick={resetRecording}
                        className="flex items-center gap-2"
                      >
                        <RotateCcw className="w-4 h-4" />
                        Recomeçar
                      </Button>
                    </div>
                    
                    <div className="text-sm text-muted-foreground">
                      Total: {uploadedFiles.length} arquivo{uploadedFiles.length > 1 ? 's' : ''} | {
                        isCalculatingDuration ? (
                          <span className="inline-flex items-center gap-1">
                            <div className="w-3 h-3 border border-muted-foreground/30 border-t-muted-foreground rounded-full animate-spin"></div>
                            Calculando...
                          </span>
                        ) : totalDuration > 0 ? (
                          formatDuration(totalDuration)
                        ) : (
                          "Duração não disponível"
                        )
                      }
                    </div>
                  </>
                ) : null}
              </div>
            </div>

            <Button
              onClick={confirmRecording}
              size="lg"
              className="w-full"
              disabled={isProcessing}
            >
              {isProcessing ? (
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  {processingStep || 'Processando...'}
                </div>
              ) : (
                recordedAudio ? 'Usar esta gravação' : `Usar arquivo${uploadedFiles.length > 1 ? 's' : ''}`
              )}
            </Button>

            {isProcessing && (
              <div className="p-4 bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-800 rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="w-5 h-5 border-2 border-blue-500/30 border-t-blue-500 rounded-full animate-spin"></div>
                  <div>
                    <p className="font-medium text-blue-900 dark:text-blue-100">
                      Processando áudios...
                    </p>
                    <p className="text-sm text-blue-700 dark:text-blue-300">
                      {processingStep}
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      <div className="pt-4">
        <Button 
          variant="ghost" 
          onClick={onSkip}
          className="text-muted-foreground hover:text-foreground"
        >
          Pular esta etapa (opcional)
        </Button>
      </div>
    </div>
  );
};