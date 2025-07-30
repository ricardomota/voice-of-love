import { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Mic, MicOff, Upload, Play, Pause, RotateCcw } from 'lucide-react';
import { useSpeechToText } from '@/hooks/useSpeechToText';
import { supabase } from '@/integrations/supabase/client';

interface VoiceRecordingStepProps {
  onVoiceRecorded?: (audioBlob: Blob, duration: number) => void;
  onSkip: () => void;
}

export const VoiceRecordingStep = ({ onVoiceRecorded, onSkip }: VoiceRecordingStepProps) => {
  const [isRecording, setIsRecording] = useState(false);
  const [recordedAudio, setRecordedAudio] = useState<Blob | null>(null);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [recordingDuration, setRecordingDuration] = useState(0);
  const [error, setError] = useState<string | null>(null);

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
    setAudioUrl(null);
    setRecordingDuration(0);
    setIsPlaying(false);
    setError(null);
    
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current = null;
    }
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && file.type.startsWith('audio/')) {
      setRecordedAudio(file);
      
      const url = URL.createObjectURL(file);
      setAudioUrl(url);
      setError(null);
      
      // Get duration from file (approximation)
      const audio = new Audio(url);
      audio.addEventListener('loadedmetadata', () => {
        setRecordingDuration(Math.floor(audio.duration || 0));
      });
    } else {
      setError('Por favor, selecione um arquivo de áudio válido.');
    }
  };

  const confirmRecording = () => {
    if (recordedAudio && onVoiceRecorded) {
      onVoiceRecorded(recordedAudio, recordingDuration);
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
          <p className="text-sm text-muted-foreground/80">
            Recomendamos pelo menos 30 segundos de áudio claro. Você também pode enviar um arquivo de áudio.
          </p>
        </div>
      </div>

      {error && (
        <div className="p-4 bg-destructive/10 text-destructive rounded-lg border border-destructive/20">
          {error}
        </div>
      )}

      <div className="space-y-6">
        {!recordedAudio ? (
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
                accept="audio/*"
                onChange={handleFileUpload}
                className="hidden"
                id="audio-upload"
              />
              <Button 
                variant="outline" 
                onClick={() => document.getElementById('audio-upload')?.click()}
                className="flex items-center gap-2"
              >
                <Upload className="w-4 h-4" />
                Enviar arquivo de áudio
              </Button>
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            <div className="p-6 bg-accent/5 rounded-lg border border-accent/20">
              <div className="space-y-4">
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
              </div>
            </div>

            <Button
              onClick={confirmRecording}
              size="lg"
              className="w-full"
            >
              Usar esta gravação
            </Button>
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