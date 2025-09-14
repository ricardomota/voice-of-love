// Step 4: Onboarding as a Ritual - guided 60-second story capture
import React, { useState, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Mic, Square, Play, Pause, ArrowRight, ArrowLeft, Save, Wand2, Heart, Upload, Image as ImageIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/useAuth';
import { storageIntegrations, previewIntegrations, memoryIntegrations, analyticsIntegrations, featureFlagsIntegrations } from '@/lib/integrations';

interface OnboardingRitualProps {
  onComplete?: (memoryId: string) => void;
  onSkip?: () => void;
}

type RitualStep = 'prompt' | 'record' | 'preview' | 'save';

const defaultPrompts = [
  "Tell me about the day you met them...",
  "What's your favorite memory together?",
  "Describe a moment that made you laugh...",
  "Share something they taught you...",
  "What would you want them to know?"
];

export const OnboardingRitual: React.FC<OnboardingRitualProps> = ({ onComplete, onSkip }) => {
  const { user } = useAuth();
  const { toast } = useToast();
  
  // State management
  const [currentStep, setCurrentStep] = useState<RitualStep>('prompt');
  const [selectedPrompt, setSelectedPrompt] = useState(defaultPrompts[0]);
  const [customPrompt, setCustomPrompt] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [recordedBlob, setRecordedBlob] = useState<Blob | null>(null);
  const [uploadedImage, setUploadedImage] = useState<File | null>(null);
  const [memoryCard, setMemoryCard] = useState<{url?: string; transcript?: string} | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [recordingMode, setRecordingMode] = useState<'audio' | 'image'>('audio');

  // Refs
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const recordingIntervalRef = useRef<NodeJS.Timeout | null>(null);

  // Load feature flags for ritual copy
  React.useEffect(() => {
    loadFeatureFlags();
    // Track ritual start
    analyticsIntegrations.trackEvent('ritual_started');
  }, []);

  const loadFeatureFlags = async () => {
    try {
      const { flags } = await featureFlagsIntegrations.getFlags(user?.id);
      // Use flags to customize copy if needed
      console.log('Ritual flags:', flags);
    } catch (error) {
      console.error('Error loading feature flags:', error);
    }
  };

  // Recording functions
  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      
      const chunks: BlobPart[] = [];
      mediaRecorder.ondataavailable = (event) => {
        chunks.push(event.data);
      };
      
      mediaRecorder.onstop = () => {
        const blob = new Blob(chunks, { type: 'audio/wav' });
        setRecordedBlob(blob);
        stream.getTracks().forEach(track => track.stop());
        // Auto-advance to preview
        setTimeout(() => setCurrentStep('preview'), 500);
      };
      
      mediaRecorder.start();
      setIsRecording(true);
      setRecordingTime(0);
      
      recordingIntervalRef.current = setInterval(() => {
        setRecordingTime(prev => {
          if (prev >= 60) { // Auto-stop at 60 seconds
            stopRecording();
            return prev;
          }
          return prev + 1;
        });
      }, 1000);
      
      // Track recording start
      await analyticsIntegrations.trackEvent('ritual_recorded', { mode: 'audio' });
      
    } catch (error) {
      toast({
        title: 'Recording failed',
        description: 'Could not access microphone. Please check permissions.',
        variant: 'destructive'
      });
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      if (recordingIntervalRef.current) {
        clearInterval(recordingIntervalRef.current);
      }
    }
  };

  // Image upload
  const handleImageUpload = useCallback(async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file
    if (!file.type.startsWith('image/')) {
      toast({ title: 'Invalid file', description: 'Please upload an image file.', variant: 'destructive' });
      return;
    }

    if (file.size > 5 * 1024 * 1024) { // 5MB limit
      toast({ title: 'File too large', description: 'Image must be smaller than 5MB.', variant: 'destructive' });
      return;
    }

    setUploadedImage(file);
    setCurrentStep('preview');
    
    // Track image upload
    await analyticsIntegrations.trackEvent('ritual_recorded', { mode: 'image' });
  }, [toast]);

  // Generate memory card preview
  const generatePreview = useCallback(async () => {
    if (!recordedBlob && !uploadedImage) return;

    setIsGenerating(true);
    
    try {
      const finalPrompt = customPrompt.trim() || selectedPrompt;
      let result;

      if (recordedBlob) {
        // Upload audio first
        const audioFile = new File([recordedBlob], 'ritual-recording.wav', { type: 'audio/wav' });
        const uploadResult = await storageIntegrations.uploadAudio(audioFile);
        
        if (uploadResult.error) throw new Error(uploadResult.error);
        
        // Generate audio preview with transcript
        result = await previewIntegrations.generateAudioPreview(uploadResult.url!, 'natural', 70);
      } else if (uploadedImage) {
        // Upload image first
        const uploadResult = await storageIntegrations.uploadImage(uploadedImage);
        
        if (uploadResult.error) throw new Error(uploadResult.error);
        
        // Generate image preview
        result = await previewIntegrations.generateImagePreview(uploadResult.url!, 'natural', 70);
      }

      if (result?.error) throw new Error(result.error);

      setMemoryCard({
        url: result?.previewUrl,
        transcript: result?.transcript
      });

      // Track successful preview generation
      await analyticsIntegrations.trackEvent('ritual_preview_rendered', {
        mode: recordedBlob ? 'audio' : 'image'
      });

    } catch (error) {
      console.error('Error generating preview:', error);
      toast({
        title: 'Preview failed',
        description: 'Could not generate memory card. Please try again.',
        variant: 'destructive'
      });
    } finally {
      setIsGenerating(false);
    }
  }, [recordedBlob, uploadedImage, selectedPrompt, customPrompt, toast]);

  // Auto-generate preview when step changes to preview
  React.useEffect(() => {
    if (currentStep === 'preview' && !memoryCard && !isGenerating) {
      generatePreview();
    }
  }, [currentStep, memoryCard, isGenerating, generatePreview]);

  // Save memory card
  const saveMemoryCard = useCallback(async () => {
    if (!memoryCard?.url || !user) {
      if (!user) {
        toast({
          title: 'Sign in required',
          description: 'Please sign in to save your memory card.',
          variant: 'default'
        });
        // Here you would typically open auth modal
        // Use navigation instead of window.location
        window.location.hash = 'auth';
        setTimeout(() => {
          const element = document.querySelector('[href="/auth"]');
          if (element) {
            (element as HTMLElement).click();
          }
        }, 100);
        return;
      }
      return;
    }

    setIsSaving(true);

    try {
      const finalPrompt = customPrompt.trim() || selectedPrompt;
      
      const result = await memoryIntegrations.saveMemory({
        person_id: '', // This could be linked to a person if selected
        title: `Memory: ${finalPrompt.slice(0, 50)}${finalPrompt.length > 50 ? '...' : ''}`,
        kind: recordedBlob ? 'audio' : 'image',
        preview_url: memoryCard.url,
        media_url: memoryCard.url,
        transcript: memoryCard.transcript,
        mood_tags: ['ritual', 'onboarding'],
        is_private: true
      });

      if (result.error) throw new Error(result.error);

      // Track successful save
      await analyticsIntegrations.trackEvent('ritual_saved', {
        memory_id: result.memory?.id
      });

      toast({
        title: 'Memory saved!',
        description: 'Your memory card has been saved to your Memory Wallet.',
        variant: 'default'
      });

      onComplete?.(result.memory?.id || '');

    } catch (error) {
      console.error('Error saving memory:', error);
      toast({
        title: 'Save failed',
        description: 'Could not save memory card. Please try again.',
        variant: 'destructive'
      });
    } finally {
      setIsSaving(false);
    }
  }, [memoryCard, user, customPrompt, selectedPrompt, recordedBlob, onComplete, toast]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const stepVariants = {
    enter: { opacity: 0, x: 50 },
    center: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: -50 }
  };

  return (
    <div className="max-w-2xl mx-auto p-6">
      {/* Progress Indicator */}
      <div className="mb-8">
        <div className="flex justify-center mb-4">
          {['prompt', 'record', 'preview', 'save'].map((step, index) => (
            <div key={step} className="flex items-center">
              <div className={`
                w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium
                ${currentStep === step 
                  ? 'bg-primary text-primary-foreground' 
                  : index < ['prompt', 'record', 'preview', 'save'].indexOf(currentStep)
                    ? 'bg-green-500 text-white'
                    : 'bg-muted text-muted-foreground'
                }
              `}>
                {index + 1}
              </div>
              {index < 3 && (
                <div className={`w-12 h-0.5 mx-2 ${
                  index < ['prompt', 'record', 'preview', 'save'].indexOf(currentStep) 
                    ? 'bg-green-500' 
                    : 'bg-muted'
                }`} />
              )}
            </div>
          ))}
        </div>
        <p className="text-center text-sm text-muted-foreground">
          Create your first Memory Card
        </p>
      </div>

      <AnimatePresence mode="wait">
        {/* Step 1: Prompt Selection */}
        {currentStep === 'prompt' && (
          <motion.div
            key="prompt"
            variants={stepVariants}
            initial="enter"
            animate="center"
            exit="exit"
            data-testid="ritual-start"
          >
            <Card>
              <CardHeader className="text-center">
                <CardTitle className="flex items-center justify-center gap-2">
                  <Heart className="h-5 w-5 text-rose-500" />
                  Choose Your Memory Prompt
                </CardTitle>
                <p className="text-muted-foreground">
                  Select a prompt to guide your 60-second story, or write your own.
                </p>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Preset Prompts */}
                <div className="space-y-3">
                  <label className="text-sm font-medium">Popular prompts:</label>
                  <div className="grid gap-2">
                    {defaultPrompts.map((prompt, index) => (
                      <Button
                        key={index}
                        variant={selectedPrompt === prompt ? "default" : "outline"}
                        className="text-left justify-start h-auto p-4"
                        onClick={() => {
                          setSelectedPrompt(prompt);
                          setCustomPrompt('');
                        }}
                      >
                        {prompt}
                      </Button>
                    ))}
                  </div>
                </div>

                <Separator />

                {/* Custom Prompt */}
                <div className="space-y-3">
                  <label className="text-sm font-medium">Or write your own:</label>
                  <Textarea
                    placeholder="What story would you like to capture?"
                    value={customPrompt}
                    onChange={(e) => {
                      setCustomPrompt(e.target.value);
                      if (e.target.value.trim()) {
                        setSelectedPrompt('');
                      }
                    }}
                    className="min-h-[100px]"
                  />
                </div>

                <Button
                  onClick={() => setCurrentStep('record')}
                  disabled={!selectedPrompt && !customPrompt.trim()}
                  className="w-full"
                  size="lg"
                >
                  Continue
                  <ArrowRight className="h-4 w-4 ml-2" />
                </Button>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {/* Step 2: Recording */}
        {currentStep === 'record' && (
          <motion.div
            key="record"
            variants={stepVariants}
            initial="enter"
            animate="center"
            exit="exit"
            data-testid="ritual-record"
          >
            <Card>
              <CardHeader className="text-center">
                <CardTitle>Capture Your Memory</CardTitle>
                <p className="text-muted-foreground">
                  {customPrompt.trim() || selectedPrompt}
                </p>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Recording Mode Selector */}
                <div className="flex justify-center">
                  <div className="flex bg-muted rounded-lg p-1">
                    <Button
                      variant={recordingMode === 'audio' ? 'default' : 'ghost'}
                      size="sm"
                      onClick={() => setRecordingMode('audio')}
                      className="px-4"
                    >
                      <Mic className="h-4 w-4 mr-2" />
                      Record Audio
                    </Button>
                    <Button
                      variant={recordingMode === 'image' ? 'default' : 'ghost'}
                      size="sm"
                      onClick={() => setRecordingMode('image')}
                      className="px-4"
                    >
                      <ImageIcon className="h-4 w-4 mr-2" />
                      Upload Image
                    </Button>
                  </div>
                </div>

                {recordingMode === 'audio' ? (
                  /* Audio Recording */
                  <div className="text-center py-8">
                    {!recordedBlob ? (
                      <div className="space-y-6">
                        <div className="text-muted-foreground">
                          <p className="text-sm mb-2">Record up to 60 seconds</p>
                          {isRecording && (
                            <div className="flex items-center justify-center gap-2 text-red-600">
                              <div className="w-2 h-2 bg-red-600 rounded-full animate-pulse" />
                              <span className="font-mono">{formatTime(recordingTime)}</span>
                            </div>
                          )}
                        </div>
                        
                        <Button
                          onClick={isRecording ? stopRecording : startRecording}
                          variant={isRecording ? "destructive" : "default"}
                          size="lg"
                          className="w-32 h-32 rounded-full"
                        >
                          {isRecording ? (
                            <Square className="h-8 w-8" />
                          ) : (
                            <Mic className="h-8 w-8" />
                          )}
                        </Button>
                        
                        <p className="text-sm text-muted-foreground">
                          {isRecording ? 'Tap to stop recording' : 'Tap to start recording'}
                        </p>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        <div className="flex items-center justify-center gap-2 text-green-600">
                          <Heart className="h-4 w-4" />
                          <span className="text-sm">Recording completed ({formatTime(recordingTime)})</span>
                        </div>
                        
                        <audio controls src={URL.createObjectURL(recordedBlob)} className="mx-auto" />
                        
                        <div className="flex gap-3 justify-center">
                          <Button
                            variant="outline"
                            onClick={() => {
                              setRecordedBlob(null);
                              setRecordingTime(0);
                            }}
                          >
                            Re-record
                          </Button>
                          
                          <Button onClick={() => setCurrentStep('preview')}>
                            Continue
                            <ArrowRight className="h-4 w-4 ml-2" />
                          </Button>
                        </div>
                      </div>
                    )}
                  </div>
                ) : (
                  /* Image Upload */
                  <div className="text-center py-8">
                    {!uploadedImage ? (
                      <div className="border-2 border-dashed border-border rounded-lg p-8">
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleImageUpload}
                          className="hidden"
                          id="ritual-image-upload"
                        />
                        <label htmlFor="ritual-image-upload" className="cursor-pointer">
                          <Upload className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                          <p className="text-lg font-medium mb-2">Upload an image</p>
                          <p className="text-sm text-muted-foreground">
                            Choose a photo that captures this memory
                          </p>
                        </label>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        <img
                          src={URL.createObjectURL(uploadedImage)}
                          alt="Uploaded memory"
                          className="max-w-full h-48 object-cover rounded-lg mx-auto border"
                        />
                        <p className="text-sm text-green-600">Image uploaded successfully</p>
                        
                        <div className="flex gap-3 justify-center">
                          <Button
                            variant="outline"
                            onClick={() => setUploadedImage(null)}
                          >
                            Choose Different
                          </Button>
                          
                          <Button onClick={() => setCurrentStep('preview')}>
                            Continue
                            <ArrowRight className="h-4 w-4 ml-2" />
                          </Button>
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {/* Back Button */}
                <div className="flex justify-center">
                  <Button
                    variant="ghost"
                    onClick={() => setCurrentStep('prompt')}
                  >
                    <ArrowLeft className="h-4 w-4 mr-2" />
                    Back to Prompt
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {/* Step 3: Preview */}
        {currentStep === 'preview' && (
          <motion.div
            key="preview"
            variants={stepVariants}
            initial="enter"
            animate="center"
            exit="exit"
            data-testid="ritual-preview"
          >
            <Card>
              <CardHeader className="text-center">
                <CardTitle className="flex items-center justify-center gap-2">
                  <Wand2 className="h-5 w-5" />
                  Your Memory Card
                </CardTitle>
                <p className="text-muted-foreground">
                  We've created a beautiful memory card from your story.
                </p>
              </CardHeader>
              <CardContent className="space-y-6">
                {isGenerating ? (
                  <div className="text-center py-12">
                    <Wand2 className="h-12 w-12 mx-auto mb-4 animate-spin text-primary" />
                    <p className="text-lg font-medium mb-2">Creating your memory card...</p>
                    <p className="text-sm text-muted-foreground">This may take a moment</p>
                  </div>
                ) : memoryCard?.url ? (
                  <div className="space-y-4">
                    {/* Memory Card Preview */}
                    <div className="border rounded-lg overflow-hidden bg-gradient-to-br from-background to-muted">
                      {recordedBlob ? (
                        <div className="p-6 space-y-4">
                          <div className="flex items-center gap-2 mb-4">
                            <Heart className="h-5 w-5 text-rose-500" />
                            <Badge variant="outline">Audio Memory</Badge>
                          </div>
                          
                          <audio controls src={memoryCard.url} className="w-full" />
                          
                          {memoryCard.transcript && (
                            <div className="p-4 bg-muted rounded-lg">
                              <p className="text-sm font-medium mb-2">Transcript:</p>
                              <p className="text-sm italic">"{memoryCard.transcript}"</p>
                            </div>
                          )}
                        </div>
                      ) : (
                        <div className="relative">
                          <img
                            src={memoryCard.url}
                            alt="Memory card"
                            className="w-full h-64 object-cover"
                          />
                          <div className="absolute bottom-4 left-4">
                            <Badge variant="secondary" className="bg-white/90">
                              Memory Card
                            </Badge>
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Actions */}
                    <div className="flex gap-3 justify-center">
                      <Button
                        variant="outline"
                        onClick={() => setCurrentStep('record')}
                      >
                        <ArrowLeft className="h-4 w-4 mr-2" />
                        Re-record
                      </Button>
                      
                      <Button
                        onClick={() => setCurrentStep('save')}
                        size="lg"
                      >
                        Save Memory Card
                        <ArrowRight className="h-4 w-4 ml-2" />
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <p className="text-muted-foreground">Failed to generate preview. Please try again.</p>
                    <Button
                      variant="outline"
                      onClick={() => setCurrentStep('record')}
                      className="mt-4"
                    >
                      <ArrowLeft className="h-4 w-4 mr-2" />
                      Back to Recording
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </motion.div>
        )}

        {/* Step 4: Save */}
        {currentStep === 'save' && (
          <motion.div
            key="save"
            variants={stepVariants}
            initial="enter"
            animate="center"
            exit="exit"
            data-testid="ritual-save"
          >
            <Card>
              <CardHeader className="text-center">
                <CardTitle className="flex items-center justify-center gap-2">
                  <Save className="h-5 w-5" />
                  Save to Memory Wallet
                </CardTitle>
                <p className="text-muted-foreground">
                  Your memory card will be saved privately to your personal collection.
                </p>
              </CardHeader>
              <CardContent className="space-y-6">
                {!user ? (
                  <div className="text-center py-8">
                    <p className="text-lg mb-4">Sign in to save your memory card</p>
                    <Button
                      onClick={() => window.location.href = '/auth?redirect=/ritual'}
                      size="lg"
                    >
                      Create Account
                    </Button>
                    
                    <p className="text-sm text-muted-foreground mt-4">
                      Already have an account? <Button variant="link" onClick={() => window.location.href = '/auth'}>Sign in</Button>
                    </p>
                  </div>
                ) : (
                  <div className="space-y-6">
                    {/* Privacy Notice */}
                    <div className="p-4 bg-muted rounded-lg">
                      <h4 className="font-medium mb-2">Privacy Receipt</h4>
                      <ul className="text-sm text-muted-foreground space-y-1">
                        <li>• Your memory is stored privately by default</li>
                        <li>• Only you can access this memory</li>
                        <li>• You can export or delete it anytime</li>
                        <li>• No AI training on your personal content</li>
                      </ul>
                    </div>

                    {/* Save Button */}
                    <Button
                      onClick={saveMemoryCard}
                      disabled={isSaving}
                      className="w-full"
                      size="lg"
                    >
                      {isSaving ? (
                        <>
                          <Wand2 className="h-4 w-4 mr-2 animate-spin" />
                          Saving to Memory Wallet...
                        </>
                      ) : (
                        <>
                          <Save className="h-4 w-4 mr-2" />
                          Save Memory Card
                        </>
                      )}
                    </Button>

                    {/* Skip Option */}
                    <div className="text-center">
                      <Button
                        variant="ghost"
                        onClick={onSkip}
                        className="text-muted-foreground"
                      >
                        Skip for now
                      </Button>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};