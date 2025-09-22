import { useState, useRef } from 'react';
import { supabase } from '@/integrations/supabase/client';

export interface UseSpeechToTextReturn {
  isRecording: boolean;
  isProcessing: boolean;
  startRecording: () => Promise<void>;
  stopRecording: () => Promise<string | null>;
  error: string | null;
}

export const useSpeechToText = (): UseSpeechToTextReturn => {
  const [isRecording, setIsRecording] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);

  const startRecording = async () => {
    try {
      setError(null);
      
      const stream = await navigator.mediaDevices.getUserMedia({ 
        audio: {
          sampleRate: 16000,
          channelCount: 1,
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true
        }
      });
      
      const mediaRecorder = new MediaRecorder(stream, {
        mimeType: 'audio/webm;codecs=opus'
      });
      
      chunksRef.current = [];
      
      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          chunksRef.current.push(event.data);
        }
      };
      
      mediaRecorder.start();
      mediaRecorderRef.current = mediaRecorder;
      setIsRecording(true);
      
    } catch (err) {
      setError('Erro ao acessar o microfone. Verifique as permissões.');
      console.error('Error starting recording:', err);
    }
  };

  const stopRecording = async (): Promise<string | null> => {
    return new Promise((resolve) => {
      if (!mediaRecorderRef.current || mediaRecorderRef.current.state === 'inactive') {
        resolve(null);
        return;
      }

      mediaRecorderRef.current.onstop = async () => {
        setIsRecording(false);
        setIsProcessing(true);
        
        try {
          const audioBlob = new Blob(chunksRef.current, { type: 'audio/webm' });
          
          // Convert blob to base64
          const reader = new FileReader();
          reader.onloadend = async () => {
            try {
              const base64Audio = (reader.result as string).split(',')[1];
              console.log('useSpeechToText: Sending audio to transcription service, audio length:', base64Audio.length);
              
              const { data, error } = await supabase.functions.invoke('speech-to-text', {
                body: { audio: base64Audio }
              });
              
              console.log('useSpeechToText: Transcription service response:', { data, error });
              
              if (error) {
                console.error('useSpeechToText: Transcription service error:', error);
                throw new Error(error.message || 'Erro ao processar áudio');
              }
              
              console.log('useSpeechToText: Transcription result:', data.text);
              resolve(data.text || null);
            } catch (err) {
              console.error('useSpeechToText: Error processing audio:', err);
              setError('Erro ao converter áudio em texto');
              resolve(null);
            } finally {
              setIsProcessing(false);
            }
          };
          
          reader.readAsDataURL(audioBlob);
          
        } catch (err) {
          setError('Erro ao processar gravação');
          console.error('Error processing recording:', err);
          setIsProcessing(false);
          resolve(null);
        }
        
        // Stop all tracks
        const stream = mediaRecorderRef.current?.stream;
        if (stream) {
          stream.getTracks().forEach(track => track.stop());
        }
      };

      mediaRecorderRef.current.stop();
    });
  };

  return {
    isRecording,
    isProcessing,
    startRecording,
    stopRecording,
    error
  };
};