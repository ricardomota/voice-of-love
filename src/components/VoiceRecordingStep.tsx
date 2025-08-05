import { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Mic, MicOff, Upload, Play, Pause, RotateCcw } from 'lucide-react';
import { useSpeechToText } from '@/hooks/useSpeechToText';
import { supabase } from '@/integrations/supabase/client';

interface VoiceRecordingStepProps {
  personName: string;
  existingVoiceSettings?: { hasRecording: boolean; voiceId?: string; audioFiles?: Array<{ name: string; url: string; duration?: number; transcription?: string }> };
  onVoiceRecorded?: (audioBlob: Blob, duration: number) => void;
  onVoiceProcessed?: (voiceId: string, transcriptions: string[], audioFiles?: Array<{ name: string; url: string; duration?: number; transcription?: string }>) => void;
  onSkip: () => void;
}

export const VoiceRecordingStep = ({ personName, existingVoiceSettings, onVoiceRecorded, onVoiceProcessed, onSkip }: VoiceRecordingStepProps) => {
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
    if (isProcessing) {
      console.log('Already processing, ignoring duplicate call');
      return;
    }

    try {
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
      } else {
        setError('Nenhum áudio disponível para processar');
        return;
      }
    } catch (error) {
      console.error('Error in confirmRecording:', error);
      setError(error instanceof Error ? error.message : 'Erro ao processar áudios');
      setIsProcessing(false);
      setProcessingStep('');
    }
  };

  const processVoiceFiles = async (files: (File | Blob)[]) => {
    setIsProcessing(true);
    setError(null);
    
    try {
      console.log(`Starting to process ${files.length} audio files`);
      const transcriptions: string[] = [];
      const audioFiles: Array<{ name: string; url: string; duration?: number; transcription?: string }> = [];
      let voiceId: string | null = null;

      // Step 1: Upload and process each file
      setProcessingStep('Enviando e processando áudios...');
      
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const fileName = file instanceof File ? file.name : `audio_${i + 1}.webm`;
        setProcessingStep(`Processando ${fileName} (${i + 1} de ${files.length})...`);
        
        try {
          // Convert file to base64 for APIs
          const base64Audio = await new Promise<string>((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = () => {
              const result = reader.result as string;
              const base64 = result.split(',')[1];
              resolve(base64);
            };
            reader.onerror = reject;
            reader.readAsDataURL(file);
          });

          // Upload to Supabase storage
          const fileUrl = await uploadAudioFile(file, fileName);
          
          // Transcrever áudio
          const transcriptionResult = await supabase.functions.invoke('speech-to-text', {
            body: { audio: base64Audio }
          });

          let transcription = '';
          if (transcriptionResult.error) {
            console.error(`Transcription error for file ${i + 1}:`, transcriptionResult.error);
          } else if (transcriptionResult.data?.text) {
            transcription = transcriptionResult.data.text;
            transcriptions.push(transcription);
            console.log(`Transcription ${i + 1} completed:`, transcription.substring(0, 50) + '...');
          }

          // Add to audio files array
          audioFiles.push({
            name: fileName,
            url: fileUrl,
            duration: undefined, // Could be calculated if needed
            transcription
          });

        } catch (fileError) {
          console.error(`Error processing file ${i + 1}:`, fileError);
          // Continue with other files
        }
      }

      // Step 2: Create voice clone with the first file
      if (files.length > 0 && audioFiles.length > 0) {
        setProcessingStep('Criando clone de voz...');
        
        try {
          const primaryFile = files[0];
          const base64Audio = await new Promise<string>((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = () => {
              const result = reader.result as string;
              const base64 = result.split(',')[1];
              resolve(base64);
            };
            reader.onerror = reject;
            reader.readAsDataURL(primaryFile);
          });

          const voiceCloneResult = await supabase.functions.invoke('voice-clone', {
            body: {
              audioBlob: base64Audio,
              name: personName,
              description: `Voice clone of ${personName} - Created from uploaded audio`
            }
          });

          console.log('Voice clone result:', voiceCloneResult);

          if (voiceCloneResult.error) {
            console.error('Voice clone error:', voiceCloneResult.error);
            setProcessingStep('⚠️ Clone de voz falhou, mas áudios salvos');
          } else if (voiceCloneResult.data?.voiceId) {
            voiceId = voiceCloneResult.data.voiceId;
            console.log('Voice clone created successfully with ID:', voiceId);
            setProcessingStep('✅ Clone de voz criado com sucesso!');
          } else {
            console.warn('Voice clone result unexpected:', voiceCloneResult);
            setProcessingStep('⚠️ Clone de voz não retornou ID esperado');
          }
        } catch (voiceError) {
          console.error('Error in voice cloning:', voiceError);
          setProcessingStep('⚠️ Erro no clone de voz, mas áudios salvos');
        }
      }

      setProcessingStep('Finalizando...');
      
      console.log(`Processing completed. Voice ID: ${voiceId}, Audio files: ${audioFiles.length}, Transcriptions: ${transcriptions.length}`);
      
      // Callback with results including audio files
      if (onVoiceProcessed) {
        await onVoiceProcessed(voiceId || '', transcriptions, audioFiles);
      }

      // Final status message
      if (voiceId && transcriptions.length > 0) {
        setProcessingStep('✅ Clone de voz criado e áudios processados!');
      } else if (voiceId) {
        setProcessingStep('✅ Clone de voz criado com sucesso!');
      } else if (audioFiles.length > 0) {
        setProcessingStep('✅ Áudios processados e salvos!');
      } else {
        setProcessingStep('⚠️ Processamento concluído com avisos');
      }
      
      setTimeout(() => {
        setIsProcessing(false);
        setProcessingStep('');
        console.log('Voice processing UI cleanup completed');
        // Avançar automaticamente para a próxima etapa após processamento bem-sucedido
        if (onVoiceProcessed) {
          console.log('Advancing to next step after successful voice processing');
          onVoiceProcessed(voiceId, transcriptions, audioFiles);
        }
      }, 3000);

    } catch (error) {
      console.error('Error processing voice files:', error);
      setError(error instanceof Error ? error.message : 'Erro ao processar áudios');
      setIsProcessing(false);
      setProcessingStep('');
    }
  };

  const uploadAudioFile = async (file: File | Blob, fileName: string): Promise<string> => {
    try {
      console.log('Uploading audio file:', fileName);
      const formData = new FormData();
      formData.append('file', file, fileName);
      
      // Upload to Supabase storage
      const { data: user } = await supabase.auth.getUser();
      if (!user.user) throw new Error('User not authenticated');
      
      const filePath = `${user.user.id}/${Date.now()}_${fileName}`;
      
      const { data, error } = await supabase.storage
        .from('media')
        .upload(filePath, file);

      if (error) {
        console.error('Storage upload error:', error);
        throw error;
      }

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from('media')
        .getPublicUrl(filePath);

      console.log('Audio file uploaded successfully:', publicUrl);
      return publicUrl;
    } catch (error) {
      console.error('Error uploading audio file:', error);
      throw error;
    }
  };

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  // Verificar se já existem áudios anteriores
  const hasExistingAudios = existingVoiceSettings?.hasRecording && existingVoiceSettings?.audioFiles?.length > 0;
  const existingAudioFiles = existingVoiceSettings?.audioFiles || [];

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
          {existingVoiceSettings?.hasRecording && existingVoiceSettings?.voiceId && (
            <div className="p-3 bg-green-50 dark:bg-green-950/30 border border-green-200 dark:border-green-800 rounded-lg">
              <p className="text-sm text-green-700 dark:text-green-300">
                ✅ Clone de voz já criado com sucesso! (ID: {existingVoiceSettings.voiceId})
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Mostrar áudios anteriores se existirem */}
      {hasExistingAudios && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h4 className="font-medium text-left">Áudios já adicionados:</h4>
            <span className="text-sm text-muted-foreground">{existingAudioFiles.length} arquivo{existingAudioFiles.length > 1 ? 's' : ''}</span>
          </div>
          <div className="space-y-3 max-h-48 overflow-y-auto">
            {existingAudioFiles.map((audioFile, index) => (
              <div key={index} className="p-4 bg-muted/30 rounded-lg border">
                <div className="space-y-3">
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-3 flex-1 min-w-0">
                      <div className="w-3 h-3 bg-green-500 rounded-full flex-shrink-0"></div>
                      <span className="text-sm font-medium truncate">{audioFile.name}</span>
                      {audioFile.duration && (
                        <span className="text-xs text-muted-foreground px-2 py-1 bg-background/50 rounded">
                          {formatDuration(audioFile.duration)}
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-2">
                      {audioFile.url && (
                        <audio controls className="h-8 max-w-32">
                          <source src={audioFile.url} type="audio/mpeg" />
                        </audio>
                      )}
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-8 w-8 p-0 text-destructive hover:bg-destructive/10"
                        title="Remover áudio"
                      >
                        ✕
                      </Button>
                    </div>
                  </div>
                  {audioFile.transcription && (
                    <div className="pl-6">
                      <p className="text-xs text-muted-foreground italic bg-background/30 p-2 rounded">
                        "{audioFile.transcription}"
                      </p>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
          <div className="text-center">
            <Button variant="outline" size="sm">
              Adicionar mais áudios
            </Button>
          </div>
        </div>
      )}

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