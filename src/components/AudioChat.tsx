import React, { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Person } from '@/types/person';
import { Mic, MicOff, Volume2, VolumeX, Phone, PhoneOff } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface AudioChatProps {
  person: Person;
  trigger?: React.ReactNode;
}

class AudioRecorder {
  private stream: MediaStream | null = null;
  private audioContext: AudioContext | null = null;
  private processor: ScriptProcessorNode | null = null;
  private source: MediaStreamAudioSourceNode | null = null;

  constructor(private onAudioData: (audioData: Float32Array) => void) {}

  async start() {
    try {
      this.stream = await navigator.mediaDevices.getUserMedia({
        audio: {
          sampleRate: 24000,
          channelCount: 1,
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true
        }
      });
      
      this.audioContext = new AudioContext({
        sampleRate: 24000,
      });
      
      this.source = this.audioContext.createMediaStreamSource(this.stream);
      this.processor = this.audioContext.createScriptProcessor(4096, 1, 1);
      
      this.processor.onaudioprocess = (e) => {
        const inputData = e.inputBuffer.getChannelData(0);
        this.onAudioData(new Float32Array(inputData));
      };
      
      this.source.connect(this.processor);
      this.processor.connect(this.audioContext.destination);
    } catch (error) {
      console.error('Error accessing microphone:', error);
      throw error;
    }
  }

  stop() {
    if (this.source) {
      this.source.disconnect();
      this.source = null;
    }
    if (this.processor) {
      this.processor.disconnect();
      this.processor = null;
    }
    if (this.stream) {
      this.stream.getTracks().forEach(track => track.stop());
      this.stream = null;
    }
    if (this.audioContext) {
      this.audioContext.close();
      this.audioContext = null;
    }
  }
}

const encodeAudioForAPI = (float32Array: Float32Array): string => {
  const int16Array = new Int16Array(float32Array.length);
  for (let i = 0; i < float32Array.length; i++) {
    const s = Math.max(-1, Math.min(1, float32Array[i]));
    int16Array[i] = s < 0 ? s * 0x8000 : s * 0x7FFF;
  }
  
  const uint8Array = new Uint8Array(int16Array.buffer);
  let binary = '';
  const chunkSize = 0x8000;
  
  for (let i = 0; i < uint8Array.length; i += chunkSize) {
    const chunk = uint8Array.subarray(i, Math.min(i + chunkSize, uint8Array.length));
    binary += String.fromCharCode.apply(null, Array.from(chunk));
  }
  
  return btoa(binary);
};

const createWavFromPCM = (pcmData: Uint8Array): Uint8Array => {
  const int16Data = new Int16Array(pcmData.length / 2);
  for (let i = 0; i < pcmData.length; i += 2) {
    int16Data[i / 2] = (pcmData[i + 1] << 8) | pcmData[i];
  }
  
  const wavHeader = new ArrayBuffer(44);
  const view = new DataView(wavHeader);
  
  const writeString = (view: DataView, offset: number, string: string) => {
    for (let i = 0; i < string.length; i++) {
      view.setUint8(offset + i, string.charCodeAt(i));
    }
  };

  const sampleRate = 24000;
  const numChannels = 1;
  const bitsPerSample = 16;
  const blockAlign = (numChannels * bitsPerSample) / 8;
  const byteRate = sampleRate * blockAlign;

  writeString(view, 0, 'RIFF');
  view.setUint32(4, 36 + int16Data.byteLength, true);
  writeString(view, 8, 'WAVE');
  writeString(view, 12, 'fmt ');
  view.setUint32(16, 16, true);
  view.setUint16(20, 1, true);
  view.setUint16(22, numChannels, true);
  view.setUint32(24, sampleRate, true);
  view.setUint32(28, byteRate, true);
  view.setUint16(32, blockAlign, true);
  view.setUint16(34, bitsPerSample, true);
  writeString(view, 36, 'data');
  view.setUint32(40, int16Data.byteLength, true);

  const wavArray = new Uint8Array(wavHeader.byteLength + int16Data.byteLength);
  wavArray.set(new Uint8Array(wavHeader), 0);
  wavArray.set(new Uint8Array(int16Data.buffer), wavHeader.byteLength);
  
  return wavArray;
};

class AudioQueue {
  private queue: Uint8Array[] = [];
  private isPlaying = false;
  private audioContext: AudioContext;

  constructor(audioContext: AudioContext) {
    this.audioContext = audioContext;
  }

  async addToQueue(audioData: Uint8Array) {
    this.queue.push(audioData);
    if (!this.isPlaying) {
      await this.playNext();
    }
  }

  private async playNext() {
    if (this.queue.length === 0) {
      this.isPlaying = false;
      return;
    }

    this.isPlaying = true;
    const audioData = this.queue.shift()!;

    try {
      const wavData = createWavFromPCM(audioData);
      const audioBuffer = await this.audioContext.decodeAudioData(wavData.buffer);
      
      const source = this.audioContext.createBufferSource();
      source.buffer = audioBuffer;
      source.connect(this.audioContext.destination);
      
      source.onended = () => this.playNext();
      source.start(0);
    } catch (error) {
      console.error('Error playing audio:', error);
      this.playNext();
    }
  }
}

export const AudioChat: React.FC<AudioChatProps> = ({ person, trigger }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isConnected, setIsConnected] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [currentTranscript, setCurrentTranscript] = useState('');
  const [messages, setMessages] = useState<Array<{id: string, text: string, isUser: boolean}>>([]);
  
  const wsRef = useRef<WebSocket | null>(null);
  const audioRecorderRef = useRef<AudioRecorder | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const audioQueueRef = useRef<AudioQueue | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    return () => {
      disconnect();
    };
  }, []);

  const connect = async () => {
    try {
      console.log('Connecting to audio chat...');
      
      // Initialize audio context
      audioContextRef.current = new AudioContext({ sampleRate: 24000 });
      audioQueueRef.current = new AudioQueue(audioContextRef.current);
      
      // Get auth token for WebSocket connection
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        throw new Error('Usuário não autenticado');
      }
      
      // Connect to WebSocket  
      const wsUrl = `wss://awodornqrhssfbkgjgfx.functions.supabase.co/functions/v1/realtime-chat?token=${session.access_token}`;
      console.log('Connecting to WebSocket URL:', wsUrl);
      
      wsRef.current = new WebSocket(wsUrl);

      wsRef.current.onopen = () => {
        console.log('WebSocket connected successfully');
        setIsConnected(true);
        toast({
          title: "Conectado",
          description: `Agora você pode conversar com ${person.name}`,
        });
      };

      wsRef.current.onmessage = async (event) => {
        try {
          const data = JSON.parse(event.data);
          console.log('Received message type:', data.type);

          if (data.type === 'response.audio.delta') {
            console.log('Received audio delta');
            const binaryString = atob(data.delta);
            const bytes = new Uint8Array(binaryString.length);
            for (let i = 0; i < binaryString.length; i++) {
              bytes[i] = binaryString.charCodeAt(i);
            }
            await audioQueueRef.current?.addToQueue(bytes);
            setIsSpeaking(true);
          } else if (data.type === 'response.audio.done') {
            console.log('Audio response done');
            setIsSpeaking(false);
          } else if (data.type === 'response.audio_transcript.delta') {
            console.log('Transcript delta:', data.delta);
            setCurrentTranscript(prev => prev + data.delta);
          } else if (data.type === 'response.audio_transcript.done') {
            console.log('Transcript done:', data.transcript);
            if (data.transcript) {
              setMessages(prev => [...prev, {
                id: Date.now().toString(),
                text: data.transcript,
                isUser: false
              }]);
            }
            setCurrentTranscript('');
          } else if (data.type === 'conversation.item.input_audio_transcription.completed') {
            console.log('User transcript:', data.transcript);
            setMessages(prev => [...prev, {
              id: Date.now().toString(),
              text: data.transcript,
              isUser: true
            }]);
          }
        } catch (error) {
          console.error('Error processing message:', error);
        }
      };

      wsRef.current.onerror = (error) => {
        console.error('WebSocket error details:', error);
        console.error('WebSocket readyState:', wsRef.current?.readyState);
        console.error('WebSocket URL:', wsRef.current?.url);
        
        let errorMessage = "Falha na conexão com o servidor";
        
        // Provide more specific error messages
        if (wsRef.current?.readyState === WebSocket.CONNECTING) {
          errorMessage = "Não foi possível conectar ao servidor. Verifique sua conexão com a internet.";
        } else if (wsRef.current?.readyState === WebSocket.CLOSED) {
          errorMessage = "Conexão perdida com o servidor.";
        }
        
        toast({
          title: "Erro de conexão",
          description: errorMessage,
          variant: "destructive"
        });
        
        setIsConnected(false);
        setIsSpeaking(false);
        setIsListening(false);
      };

      wsRef.current.onclose = () => {
        console.log('WebSocket disconnected');
        setIsConnected(false);
        setIsSpeaking(false);
        setIsListening(false);
      };

      // Setup audio recorder
      audioRecorderRef.current = new AudioRecorder((audioData) => {
        if (wsRef.current?.readyState === WebSocket.OPEN) {
          const encodedAudio = encodeAudioForAPI(audioData);
          wsRef.current.send(JSON.stringify({
            type: 'input_audio_buffer.append',
            audio: encodedAudio
          }));
        }
      });

      await audioRecorderRef.current.start();
      setIsListening(true);

    } catch (error) {
      console.error('Error connecting to audio chat:', error);
      
      let errorMessage = "Não foi possível conectar ao chat de áudio";
      
      if (error instanceof Error) {
        if (error.message.includes('autenticado')) {
          errorMessage = "Você precisa estar logado para usar o chat de áudio";
        } else if (error.message.includes('microphone') || error.message.includes('getUserMedia')) {
          errorMessage = "Não foi possível acessar o microfone. Verifique as permissões do navegador.";
        } else {
          errorMessage = `Erro: ${error.message}`;
        }
      }
      
      toast({
        title: "Erro",
        description: errorMessage,
        variant: "destructive"
      });
      
      // Cleanup on error
      disconnect();
    }
  };

  const disconnect = () => {
    console.log('Disconnecting...');
    
    if (audioRecorderRef.current) {
      audioRecorderRef.current.stop();
      audioRecorderRef.current = null;
    }
    
    if (wsRef.current) {
      wsRef.current.close();
      wsRef.current = null;
    }
    
    if (audioContextRef.current) {
      audioContextRef.current.close();
      audioContextRef.current = null;
    }
    
    audioQueueRef.current = null;
    setIsConnected(false);
    setIsSpeaking(false);
    setIsListening(false);
    setCurrentTranscript('');
  };

  const defaultTrigger = (
    <Button variant="outline" className="w-full h-10 sm:h-12" size="lg">
      <Phone className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
      <span className="text-xs sm:text-sm">Conversar por Áudio</span>
    </Button>
  );

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        {trigger || defaultTrigger}
      </DialogTrigger>
      
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-3">
            <div className="w-8 h-8 bg-gradient-to-br from-blue-400 to-purple-400 rounded-lg flex items-center justify-center">
              <Phone className="w-4 h-4 text-primary-foreground" />
            </div>
            Conversa com {person.name}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Status da conexão */}
          <div className="text-center">
            {!isConnected ? (
              <div className="space-y-4">
                <div className="w-20 h-20 mx-auto bg-gradient-to-br from-blue-100 to-purple-100 rounded-full flex items-center justify-center">
                  <Phone className="w-8 h-8 text-blue-600" />
                </div>
                <p className="text-muted-foreground">
                  Toque para começar a conversar com {person.name}
                </p>
                <Button onClick={connect} size="lg" className="w-full">
                  <Phone className="w-4 h-4 mr-2" />
                  Conectar
                </Button>
              </div>
            ) : (
              <div className="space-y-4">
                {/* Indicadores visuais */}
                <div className="flex justify-center gap-4">
                  <div className={`w-16 h-16 rounded-full flex items-center justify-center transition-all ${
                    isListening ? 'bg-green-100 animate-pulse' : 'bg-gray-100'
                  }`}>
                    <Mic className={`w-6 h-6 ${isListening ? 'text-green-600' : 'text-gray-400'}`} />
                  </div>
                  <div className={`w-16 h-16 rounded-full flex items-center justify-center transition-all ${
                    isSpeaking ? 'bg-blue-100 animate-pulse' : 'bg-gray-100'
                  }`}>
                    <Volume2 className={`w-6 h-6 ${isSpeaking ? 'text-blue-600' : 'text-gray-400'}`} />
                  </div>
                </div>

                {/* Transcrição em tempo real */}
                {currentTranscript && (
                  <div className="p-3 bg-blue-50 rounded-lg">
                    <p className="text-sm text-blue-700 italic">
                      "{currentTranscript}"
                    </p>
                  </div>
                )}

                {/* Mensagens da conversa */}
                <div className="max-h-40 overflow-y-auto space-y-2">
                  {messages.map((message) => (
                    <div
                      key={message.id}
                      className={`p-2 rounded-lg text-sm ${
                        message.isUser
                          ? 'bg-blue-100 text-blue-800 ml-4'
                          : 'bg-gray-100 text-gray-800 mr-4'
                      }`}
                    >
                      <strong>{message.isUser ? 'Você' : person.name}:</strong> {message.text}
                    </div>
                  ))}
                </div>

                <Button 
                  onClick={disconnect} 
                  variant="destructive" 
                  size="lg" 
                  className="w-full"
                >
                  <PhoneOff className="w-4 h-4 mr-2" />
                  Desconectar
                </Button>
              </div>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};