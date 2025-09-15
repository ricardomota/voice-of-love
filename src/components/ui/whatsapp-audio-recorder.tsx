import React, { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Mic, Square, Play, Pause, Trash2, Send, Volume2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';

interface WhatsAppAudioRecorderProps {
  onAudioSave: (audioBlob: Blob, duration: number) => void;
  className?: string;
  disabled?: boolean;
}

type RecordingState = 'idle' | 'recording' | 'stopped' | 'playing';

export const WhatsAppAudioRecorder: React.FC<WhatsAppAudioRecorderProps> = ({
  onAudioSave,
  className,
  disabled = false
}) => {
  const [recordingState, setRecordingState] = useState<RecordingState>('idle');
  const [duration, setDuration] = useState(0);
  const [playbackTime, setPlaybackTime] = useState(0);
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const playbackIntervalRef = useRef<NodeJS.Timeout | null>(null);
  
  const { toast } = useToast();

  useEffect(() => {
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
      if (playbackIntervalRef.current) clearInterval(playbackIntervalRef.current);
      if (audioUrl) URL.revokeObjectURL(audioUrl);
    };
  }, [audioUrl]);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true,
          sampleRate: 44100
        } 
      });

      const mediaRecorder = new MediaRecorder(stream, {
        mimeType: 'audio/webm;codecs=opus'
      });
      
      mediaRecorderRef.current = mediaRecorder;
      chunksRef.current = [];

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          chunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = () => {
        const blob = new Blob(chunksRef.current, { type: 'audio/webm;codecs=opus' });
        setAudioBlob(blob);
        
        if (audioUrl) {
          URL.revokeObjectURL(audioUrl);
        }
        
        const url = URL.createObjectURL(blob);
        setAudioUrl(url);
        
        // Stop all tracks to free up the microphone
        stream.getTracks().forEach(track => track.stop());
      };

      mediaRecorder.start();
      setRecordingState('recording');
      setDuration(0);

      // Start duration timer
      intervalRef.current = setInterval(() => {
        setDuration(prev => prev + 0.1);
      }, 100);

    } catch (error) {
      console.error('Error starting recording:', error);
      toast({
        title: "Erro no microfone",
        description: "Não foi possível acessar o microfone. Verifique as permissões.",
        variant: "destructive"
      });
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && recordingState === 'recording') {
      mediaRecorderRef.current.stop();
      setRecordingState('stopped');
      
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    }
  };

  const playAudio = () => {
    if (!audioUrl) return;

    if (!audioRef.current) {
      audioRef.current = new Audio(audioUrl);
      audioRef.current.onended = () => {
        setRecordingState('stopped');
        setPlaybackTime(0);
        if (playbackIntervalRef.current) {
          clearInterval(playbackIntervalRef.current);
          playbackIntervalRef.current = null;
        }
      };
    }

    if (recordingState === 'playing') {
      audioRef.current.pause();
      setRecordingState('stopped');
      if (playbackIntervalRef.current) {
        clearInterval(playbackIntervalRef.current);
        playbackIntervalRef.current = null;
      }
    } else {
      audioRef.current.play();
      setRecordingState('playing');
      
      // Start playback timer
      playbackIntervalRef.current = setInterval(() => {
        if (audioRef.current) {
          setPlaybackTime(audioRef.current.currentTime);
        }
      }, 100);
    }
  };

  const deleteRecording = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current = null;
    }
    
    if (audioUrl) {
      URL.revokeObjectURL(audioUrl);
      setAudioUrl(null);
    }
    
    setAudioBlob(null);
    setRecordingState('idle');
    setDuration(0);
    setPlaybackTime(0);
    
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    
    if (playbackIntervalRef.current) {
      clearInterval(playbackIntervalRef.current);
      playbackIntervalRef.current = null;
    }
  };

  const sendRecording = () => {
    if (audioBlob && duration > 0.5) { // Minimum 0.5 seconds
      onAudioSave(audioBlob, duration);
      deleteRecording();
    } else {
      toast({
        title: "Gravação muito curta",
        description: "Grave pelo menos 0.5 segundos de áudio.",
        variant: "destructive"
      });
    }
  };

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  const getWaveformBars = () => {
    const bars = [];
    const barCount = 40;
    
    for (let i = 0; i < barCount; i++) {
      const height = recordingState === 'recording' 
        ? Math.random() * 100 + 20 
        : recordingState === 'playing'
        ? (i / barCount) * 100 + Math.sin(playbackTime * 2 + i) * 20
        : 30;
      
      bars.push(
        <div
          key={i}
          className={cn(
            "bg-current transition-all duration-75",
            recordingState === 'recording' && "animate-pulse"
          )}
          style={{
            width: '2px',
            height: `${Math.min(height, 100)}%`,
            opacity: recordingState === 'playing' && i > (playbackTime / duration) * barCount ? 0.3 : 1
          }}
        />
      );
    }
    
    return bars;
  };

  if (recordingState === 'idle') {
    return (
      <div className={cn("flex items-center gap-2", className)}>
        <Button
          onClick={startRecording}
          disabled={disabled}
          size="sm"
          className="bg-green-500 hover:bg-green-600 text-white rounded-full h-10 w-10 p-0"
        >
          <Mic className="w-5 h-5" />
        </Button>
        <span className="text-sm text-muted-foreground">Gravar áudio</span>
      </div>
    );
  }

  if (recordingState === 'recording') {
    return (
      <div className={cn("flex items-center gap-3 bg-red-50 dark:bg-red-950/20 p-3 rounded-2xl border border-red-200 dark:border-red-800", className)}>
        <Button
          onClick={stopRecording}
          size="sm"
          className="bg-red-500 hover:bg-red-600 text-white rounded-full h-10 w-10 p-0"
        >
          <Square className="w-4 h-4" />
        </Button>
        
        <div className="flex-1 flex items-center gap-3">
          <div className="flex items-center gap-1 h-8 text-red-500">
            {getWaveformBars()}
          </div>
          
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
            <span className="text-sm font-mono text-red-700 dark:text-red-300">
              {formatTime(duration)}
            </span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={cn("flex items-center gap-3 bg-blue-50 dark:bg-blue-950/20 p-3 rounded-2xl border border-blue-200 dark:border-blue-800", className)}>
      <Button
        onClick={playAudio}
        size="sm"
        variant="ghost"
        className="text-blue-600 hover:bg-blue-100 dark:hover:bg-blue-900 rounded-full h-10 w-10 p-0"
      >
        {recordingState === 'playing' ? (
          <Pause className="w-5 h-5" />
        ) : (
          <Play className="w-5 h-5" />
        )}
      </Button>
      
      <div className="flex-1 flex items-center gap-3">
        <div className="flex items-center gap-1 h-6 text-blue-500">
          {getWaveformBars()}
        </div>
        
        <div className="flex items-center gap-2">
          <Volume2 className="w-4 h-4 text-blue-500" />
          <span className="text-sm font-mono text-blue-700 dark:text-blue-300">
            {formatTime(recordingState === 'playing' ? playbackTime : duration)}
          </span>
        </div>
      </div>
      
      <div className="flex items-center gap-1">
        <Button
          onClick={deleteRecording}
          size="sm"
          variant="ghost"
          className="text-red-500 hover:bg-red-100 dark:hover:bg-red-900 rounded-full h-8 w-8 p-0"
        >
          <Trash2 className="w-4 h-4" />
        </Button>
        
        <Button
          onClick={sendRecording}
          size="sm"
          className="bg-green-500 hover:bg-green-600 text-white rounded-full h-8 w-8 p-0"
        >
          <Send className="w-4 h-4" />
        </Button>
      </div>
    </div>
  );
};