// Step 7: Consent Ledger modal/page for collecting and displaying consent
import React, { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { Shield, Mic, FileText, PenTool, Upload, Play, Pause, Square, Check, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { useToast } from '@/hooks/use-toast';
import { ConsentBadge } from './ConsentBadge';
import { consentIntegrations, storageIntegrations, analyticsIntegrations } from '@/lib/integrations';
import { Consent } from '@/lib/integrations';

interface ConsentLedgerProps {
  personId: string;
  personName: string;
  trigger?: React.ReactNode;
  onConsentSaved?: () => void;
}

type ConsentType = 'audio' | 'written' | 'signature';

export const ConsentLedger: React.FC<ConsentLedgerProps> = ({
  personId,
  personName,
  trigger,
  onConsentSaved
}) => {
  const { toast } = useToast();
  const [open, setOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<ConsentType>('audio');
  const [loading, setLoading] = useState(false);
  
  // Audio recording state
  const [isRecording, setIsRecording] = useState(false);
  const [recordedBlob, setRecordedBlob] = useState<Blob | null>(null);
  const [recordingTime, setRecordingTime] = useState(0);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const recordingIntervalRef = useRef<NodeJS.Timeout | null>(null);
  
  // Written consent state
  const [writtenConsent, setWrittenConsent] = useState('');
  const [consentorName, setConsentorName] = useState('');
  
  // Existing consents
  const [existingConsents, setExistingConsents] = useState<Consent[]>([]);
  const [consentStatus, setConsentStatus] = useState<'none' | 'on_file' | 'expired'>('none');

  // Load existing consents when opened
  React.useEffect(() => {
    if (open) {
      loadExistingConsents();
      analyticsIntegrations.trackEvent('consent_opened', { person_id: personId });
    }
  }, [open, personId]);

  const loadExistingConsents = async () => {
    try {
      const result = await consentIntegrations.getConsentStatus(personId);
      if (!result.error) {
        setExistingConsents(result.consents);
        setConsentStatus(result.status);
      }
    } catch (error) {
      console.error('Error loading consents:', error);
    }
  };

  // Audio recording functions
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
      };
      
      mediaRecorder.start();
      setIsRecording(true);
      setRecordingTime(0);
      
      recordingIntervalRef.current = setInterval(() => {
        setRecordingTime(prev => {
          if (prev >= 10) { // Auto-stop at 10 seconds
            stopRecording();
            return prev;
          }
          return prev + 1;
        });
      }, 1000);
      
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

  const saveConsent = async () => {
    setLoading(true);
    
    try {
      let consentData: any = {};
      
      if (activeTab === 'audio' && recordedBlob) {
        // Upload audio file
        const audioFile = new File([recordedBlob], 'consent-recording.wav', { type: 'audio/wav' });
        const uploadResult = await storageIntegrations.uploadAudio(audioFile);
        
        if (uploadResult.error) {
          throw new Error(uploadResult.error);
        }
        
        consentData = { 
          audio_url: uploadResult.url,
          duration: recordingTime 
        };
        
      } else if (activeTab === 'written') {
        if (!writtenConsent.trim() || !consentorName.trim()) {
          throw new Error('Please fill in both the consent text and your name');
        }
        
        consentData = {
          consent_text: writtenConsent.trim(),
          consentor_name: consentorName.trim()
        };
        
      } else if (activeTab === 'signature') {
        // Signature would be implemented with a canvas component
        consentData = { signature_data: 'placeholder' };
      }

      const result = await consentIntegrations.saveConsent({
        person_id: personId,
        recorder: activeTab === 'written' ? consentorName : 'Self',
        type: activeTab,
        consent_data: consentData
      });

      if (result.error) {
        throw new Error(result.error);
      }

      await analyticsIntegrations.trackEvent('consent_saved', { 
        person_id: personId,
        type: activeTab 
      });

      toast({
        title: 'Consent saved',
        description: 'Voice consent has been recorded and saved successfully.',
        variant: 'default'
      });

      // Refresh consent list
      await loadExistingConsents();
      onConsentSaved?.();
      
      // Reset form
      setRecordedBlob(null);
      setWrittenConsent('');
      setConsentorName('');
      setRecordingTime(0);

    } catch (error) {
      console.error('Error saving consent:', error);
      toast({
        title: 'Failed to save consent',
        description: error instanceof Error ? error.message : 'Please try again',
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild data-testid="consent-open">
        {trigger || (
          <Button variant="outline" size="sm">
            <Shield className="h-4 w-4 mr-2" />
            Manage Consent
          </Button>
        )}
      </DialogTrigger>
      
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto" data-testid="consent-ledger">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5" />
            Consent Ledger for {personName}
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6">
          {/* Current Status */}
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-semibold mb-2">Current Consent Status</h3>
                  <ConsentBadge status={consentStatus} />
                </div>
                {existingConsents.length > 0 && (
                  <Badge variant="outline">
                    {existingConsents.length} consent{existingConsents.length !== 1 ? 's' : ''} on file
                  </Badge>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Helper Text */}
          <div className="p-4 bg-muted rounded-lg">
            <p className="text-sm text-muted-foreground">
              We only generate voices with clear permission. Add a quick voice or written consent to protect your loved one's wishes.
            </p>
          </div>

          {/* Add New Consent */}
          <Card>
            <CardHeader>
              <CardTitle>Add New Consent</CardTitle>
            </CardHeader>
            <CardContent>
              <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as ConsentType)}>
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="audio" className="flex items-center gap-2">
                    <Mic className="h-4 w-4" />
                    Audio
                  </TabsTrigger>
                  <TabsTrigger value="written" className="flex items-center gap-2">
                    <FileText className="h-4 w-4" />
                    Written
                  </TabsTrigger>
                  <TabsTrigger value="signature" className="flex items-center gap-2">
                    <PenTool className="h-4 w-4" />
                    Signature
                  </TabsTrigger>
                </TabsList>

                {/* Audio Consent */}
                <TabsContent value="audio" className="space-y-4">
                  <div className="text-center py-6">
                    {!recordedBlob ? (
                      <div className="space-y-4">
                        <div className="text-muted-foreground mb-4">
                          <p className="text-sm">Record a 10-second audio consent</p>
                          <p className="text-xs mt-1">
                            Say: "I, [name], give permission to use my voice for generating audio memories."
                          </p>
                        </div>
                        
                        <Button
                          onClick={isRecording ? stopRecording : startRecording}
                          variant={isRecording ? "destructive" : "default"}
                          size="lg"
                          className="px-8"
                        >
                          {isRecording ? (
                            <>
                              <Square className="h-4 w-4 mr-2" />
                              Stop ({10 - recordingTime}s)
                            </>
                          ) : (
                            <>
                              <Mic className="h-4 w-4 mr-2" />
                              Start Recording
                            </>
                          )}
                        </Button>
                        
                        {isRecording && (
                          <div className="flex items-center justify-center gap-2 text-red-600">
                            <div className="w-2 h-2 bg-red-600 rounded-full animate-pulse" />
                            <span className="text-sm">Recording... {recordingTime}s</span>
                          </div>
                        )}
                      </div>
                    ) : (
                      <div className="space-y-4">
                        <div className="flex items-center justify-center gap-2 text-green-600">
                          <Check className="h-4 w-4" />
                          <span className="text-sm">Recording completed ({recordingTime}s)</span>
                        </div>
                        
                        <audio controls src={URL.createObjectURL(recordedBlob)} className="mx-auto" />
                        
                        <div className="flex gap-2 justify-center">
                          <Button
                            variant="outline"
                            onClick={() => {
                              setRecordedBlob(null);
                              setRecordingTime(0);
                            }}
                          >
                            <X className="h-4 w-4 mr-2" />
                            Re-record
                          </Button>
                          
                          <Button
                            onClick={saveConsent}
                            disabled={loading}
                            data-testid="consent-save"
                          >
                            {loading ? 'Saving...' : 'Save Consent'}
                          </Button>
                        </div>
                      </div>
                    )}
                  </div>
                </TabsContent>

                {/* Written Consent */}
                <TabsContent value="written" className="space-y-4">
                  <div className="space-y-4">
                    <div>
                      <label className="text-sm font-medium mb-2 block">Your Name</label>
                      <Input
                        value={consentorName}
                        onChange={(e) => setConsentorName(e.target.value)}
                        placeholder="Enter your full name"
                      />
                    </div>
                    
                    <div>
                      <label className="text-sm font-medium mb-2 block">Consent Statement</label>
                      <Textarea
                        value={writtenConsent}
                        onChange={(e) => setWrittenConsent(e.target.value)}
                        placeholder="I give permission to use my voice and likeness for generating audio memories and related content."
                        rows={4}
                        className="resize-none"
                      />
                    </div>
                    
                    <Button
                      onClick={saveConsent}
                      disabled={loading || !writtenConsent.trim() || !consentorName.trim()}
                      className="w-full"
                      data-testid="consent-save"
                    >
                      {loading ? 'Saving...' : 'Save Written Consent'}
                    </Button>
                  </div>
                </TabsContent>

                {/* Signature Consent */}
                <TabsContent value="signature" className="space-y-4">
                  <div className="text-center py-8 text-muted-foreground">
                    <PenTool className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p>Digital signature functionality coming soon.</p>
                    <p className="text-sm mt-2">Please use audio or written consent for now.</p>
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>

          {/* Existing Consents */}
          {existingConsents.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Consent History</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {existingConsents.map((consent, index) => (
                    <div key={consent.id} className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex items-center gap-3">
                        {consent.type === 'audio' && <Mic className="h-4 w-4 text-blue-600" />}
                        {consent.type === 'written' && <FileText className="h-4 w-4 text-green-600" />}
                        {consent.type === 'signature' && <PenTool className="h-4 w-4 text-purple-600" />}
                        
                        <div>
                          <p className="font-medium capitalize">{consent.type} Consent</p>
                          <p className="text-sm text-muted-foreground">
                            by {consent.recorder} • {formatDate(consent.timestamp)}
                          </p>
                        </div>
                      </div>
                      
                      <Badge variant="outline" className="text-green-600 border-green-200">
                        Active
                      </Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};
