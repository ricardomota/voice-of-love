// Step 5: DIY Demo Wizard - pre-signup hook
import React, { useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import { Upload, Wand2, Save, Eye, AlertCircle, CheckCircle, Volume2, Image as ImageIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Slider } from '@/components/ui/slider';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/useAuth';
import { storageIntegrations, previewIntegrations, memoryIntegrations, analyticsIntegrations } from '@/lib/integrations';

type DemoTab = 'image' | 'audio';
type StylePreset = 'natural' | 'warm' | 'crisp';

interface PreviewState {
  isGenerating: boolean;
  previewUrl?: string;
  transcript?: string;
  error?: string;
}

export const Demo: React.FC = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  
  // State management
  const [activeTab, setActiveTab] = useState<DemoTab>('image');
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [uploadedUrl, setUploadedUrl] = useState<string>('');
  const [stylePreset, setStylePreset] = useState<StylePreset>('natural');
  const [intensity, setIntensity] = useState([60]);
  const [preview, setPreview] = useState<PreviewState>({ isGenerating: false });
  const [isUploading, setIsUploading] = useState(false);

  // Track demo view on mount
  React.useEffect(() => {
    analyticsIntegrations.trackEvent('demo_viewed');
  }, []);

  // File validation
  const validateFile = (file: File): string | null => {
    if (activeTab === 'image') {
      const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
      if (!validTypes.includes(file.type)) {
        return 'Please upload a valid image file (.jpg, .jpeg, .png, .webp)';
      }
      if (file.size > 5 * 1024 * 1024) { // 5MB
        return 'Image must be smaller than 5MB';
      }
    } else {
      const validTypes = ['audio/wav', 'audio/mp3', 'audio/mpeg', 'audio/mp4', 'audio/m4a'];
      if (!validTypes.includes(file.type)) {
        return 'Please upload a valid audio file (.wav, .mp3, .m4a)';
      }
      if (file.size > 30 * 1024 * 1024) { // 30MB
        return 'Audio must be smaller than 30MB';
      }
      // Note: Duration validation would require loading the audio, skipping for now
    }
    return null;
  };

  // Handle file upload
  const handleFileUpload = useCallback(async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const error = validateFile(file);
    if (error) {
      toast({ title: 'Invalid file', description: error, variant: 'destructive' });
      return;
    }

    setIsUploading(true);
    setUploadedFile(file);
    
    // Track upload start
    await analyticsIntegrations.trackEvent('demo_upload_started', { type: activeTab });

    try {
      let result;
      if (activeTab === 'image') {
        result = await storageIntegrations.uploadImage(file);
      } else {
        result = await storageIntegrations.uploadAudio(file);
      }

      if (result.error) {
        throw new Error(result.error);
      }

      setUploadedUrl(result.url || '');
      
      // Track upload completion
      await analyticsIntegrations.trackEvent('demo_upload_completed', { type: activeTab });
      
      toast({ 
        title: 'Upload successful',
        description: 'File uploaded successfully. Ready to generate preview.'
      });

    } catch (error) {
      console.error('Upload error:', error);
      toast({
        title: 'Upload failed',
        description: error instanceof Error ? error.message : 'Failed to upload file',
        variant: 'destructive'
      });
    } finally {
      setIsUploading(false);
    }
  }, [activeTab, toast]);

  // Generate preview
  const handleGeneratePreview = useCallback(async () => {
    if (!uploadedUrl) {
      toast({ title: 'No file', description: 'Please upload a file first.', variant: 'destructive' });
      return;
    }

    setPreview({ isGenerating: true });

    // Track preview request
    await analyticsIntegrations.trackEvent('demo_preview_requested', {
      type: activeTab,
      style: stylePreset,
      intensity: intensity[0]
    });

    try {
      let result;
      if (activeTab === 'image') {
        result = await previewIntegrations.generateImagePreview(uploadedUrl, stylePreset, intensity[0]);
      } else {
        result = await previewIntegrations.generateAudioPreview(uploadedUrl, stylePreset, intensity[0]);
      }

      if (result.error) {
        throw new Error(result.error);
      }

      setPreview({
        isGenerating: false,
        previewUrl: result.previewUrl,
        transcript: result.transcript
      });

      // Track successful preview generation
      await analyticsIntegrations.trackEvent('demo_preview_rendered', { type: activeTab });

    } catch (error) {
      console.error('Preview generation error:', error);
      setPreview({
        isGenerating: false,
        error: error instanceof Error ? error.message : 'Failed to generate preview'
      });
    }
  }, [uploadedUrl, activeTab, stylePreset, intensity, toast]);

  // Save to memory wallet (requires auth)
  const handleSave = useCallback(async () => {
    if (!user) {
      // Track auth signup shown
      await analyticsIntegrations.trackEvent('auth_signup_shown');
      toast({
        title: 'Create an account to save this preview',
        description: 'Sign up to save your demo to your Memory Wallet.',
        variant: 'default'
      });
      // Here you would open the auth modal/redirect
      window.location.href = '/auth?redirect=/demo';
      return;
    }

    if (!preview.previewUrl) {
      toast({ title: 'Nothing to save', description: 'Generate a preview first.', variant: 'destructive' });
      return;
    }

    try {
      // Create a memory entry
      const result = await memoryIntegrations.saveMemory({
        person_id: '', // This would be linked to a person or left empty for general demos
        title: `Demo ${activeTab} - ${stylePreset} style`,
        kind: activeTab,
        preview_url: preview.previewUrl,
        media_url: uploadedUrl,
        transcript: preview.transcript,
        mood_tags: [stylePreset],
        is_private: true
      });

      if (result.error) {
        throw new Error(result.error);
      }

      // Track successful save
      await analyticsIntegrations.trackEvent('demo_saved_to_wallet');

      toast({
        title: 'Saved to your Memory Wallet',
        description: 'Your demo has been saved successfully.',
        variant: 'default'
      });

    } catch (error) {
      console.error('Save error:', error);
      toast({
        title: 'Save failed',
        description: error instanceof Error ? error.message : 'Failed to save demo',
        variant: 'destructive'
      });
    }
  }, [user, preview.previewUrl, activeTab, stylePreset, uploadedUrl, preview.transcript, toast]);

  return (
    <div className="min-h-screen bg-background pt-20">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <h1 className="text-3xl md:text-4xl font-bold mb-4">
            Try Eterna without an account
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Upload one image or a 30–60s audio clip and we'll generate a short demo preview.
          </p>
        </motion.div>

        {/* Main Demo Interface */}
        <Card data-testid="demo-wizard" className="w-full">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Wand2 className="h-5 w-5" />
              Demo Generator
            </CardTitle>
          </CardHeader>
          
          <CardContent className="space-y-6">
            {/* Upload Tabs */}
            <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as DemoTab)}>
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="image" className="flex items-center gap-2">
                  <ImageIcon className="h-4 w-4" />
                  Image
                </TabsTrigger>
                <TabsTrigger value="audio" className="flex items-center gap-2">
                  <Volume2 className="h-4 w-4" />
                  Audio
                </TabsTrigger>
              </TabsList>

              <TabsContent value="image" className="space-y-4">
                <div className="border-2 border-dashed border-border rounded-lg p-8 text-center">
                  <input
                    data-testid="demo-image-upload"
                    type="file"
                    accept=".jpg,.jpeg,.png,.webp"
                    onChange={handleFileUpload}
                    className="hidden"
                    id="image-upload"
                    disabled={isUploading}
                  />
                  <label htmlFor="image-upload" className="cursor-pointer">
                    <Upload className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                    <p className="text-lg font-medium mb-2">
                      {isUploading ? 'Uploading...' : 'Upload an image'}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      .jpg, .jpeg, .png, .webp • Max 5MB
                    </p>
                  </label>
                </div>
              </TabsContent>

              <TabsContent value="audio" className="space-y-4">
                <div className="border-2 border-dashed border-border rounded-lg p-8 text-center">
                  <input
                    data-testid="demo-audio-upload"
                    type="file"
                    accept=".wav,.mp3,.m4a"
                    onChange={handleFileUpload}
                    className="hidden"
                    id="audio-upload"
                    disabled={isUploading}
                  />
                  <label htmlFor="audio-upload" className="cursor-pointer">
                    <Upload className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                    <p className="text-lg font-medium mb-2">
                      {isUploading ? 'Uploading...' : 'Upload audio (30-60s)'}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      .wav, .mp3, .m4a • Max 30MB
                    </p>
                  </label>
                </div>
              </TabsContent>
            </Tabs>

            {/* File Status */}
            {uploadedFile && (
              <div className="flex items-center gap-2 p-3 bg-green-50 rounded-lg border border-green-200">
                <CheckCircle className="h-4 w-4 text-green-600" />
                <span className="text-sm text-green-800">
                  {uploadedFile.name} uploaded successfully
                </span>
              </div>
            )}

            {/* Settings Panel */}
            <Card data-testid="demo-settings">
              <CardHeader>
                <CardTitle className="text-lg">Preview Settings</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Style Preset */}
                <div className="space-y-2">
                  <label className="text-sm font-medium">Style Preset</label>
                  <Select value={stylePreset} onValueChange={(value) => setStylePreset(value as StylePreset)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="natural">Natural</SelectItem>
                      <SelectItem value="warm">Warm</SelectItem>
                      <SelectItem value="crisp">Crisp</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Intensity Slider */}
                <div className="space-y-2">
                  <label className="text-sm font-medium">
                    Intensity: {intensity[0]}%
                  </label>
                  <Slider
                    value={intensity}
                    onValueChange={setIntensity}
                    max={100}
                    min={0}
                    step={10}
                    className="w-full"
                  />
                </div>
              </CardContent>
            </Card>

            {/* Generate Preview Button */}
            <Button
              data-testid="demo-generate-preview"
              onClick={handleGeneratePreview}
              disabled={!uploadedUrl || preview.isGenerating || isUploading}
              className="w-full h-12"
              size="lg"
            >
              {preview.isGenerating ? (
                <>
                  <Wand2 className="h-4 w-4 mr-2 animate-spin" />
                  Generating Preview...
                </>
              ) : (
                <>
                  <Eye className="h-4 w-4 mr-2" />
                  Generate Preview
                </>
              )}
            </Button>

            {/* Preview Area */}
            <Card data-testid="demo-preview">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  Preview
                  <Badge variant="outline">Demo Preview</Badge>
                </CardTitle>
              </CardHeader>
              <CardContent>
                {preview.isGenerating && (
                  <div className="space-y-4">
                    <Skeleton className="h-48 w-full rounded-lg" />
                    <div className="space-y-2">
                      <Skeleton className="h-4 w-3/4" />
                      <Skeleton className="h-4 w-1/2" />
                    </div>
                  </div>
                )}

                {preview.error && (
                  <div className="flex items-center gap-2 p-4 bg-red-50 rounded-lg border border-red-200">
                    <AlertCircle className="h-4 w-4 text-red-600" />
                    <span className="text-sm text-red-800">{preview.error}</span>
                  </div>
                )}

                {preview.previewUrl && !preview.isGenerating && (
                  <div className="space-y-4">
                    {activeTab === 'image' ? (
                      <img
                        src={preview.previewUrl}
                        alt="Demo preview"
                        className="w-full h-64 object-cover rounded-lg border"
                      />
                    ) : (
                      <div className="space-y-3">
                        <audio
                          controls
                          src={preview.previewUrl}
                          className="w-full"
                        />
                        {preview.transcript && (
                          <div className="p-3 bg-muted rounded-lg">
                            <p className="text-sm font-medium mb-1">Transcript:</p>
                            <p className="text-sm text-muted-foreground italic">
                              {preview.transcript}
                            </p>
                          </div>
                        )}
                      </div>
                    )}

                    {/* Save Button */}
                    <Button
                      data-testid="demo-save"
                      onClick={handleSave}
                      variant="outline"
                      className="w-full"
                    >
                      <Save className="h-4 w-4 mr-2" />
                      {user ? 'Save to Memory Wallet' : 'Sign up to Save'}
                    </Button>
                  </div>
                )}

                {!preview.previewUrl && !preview.isGenerating && !preview.error && (
                  <div className="text-center py-8 text-muted-foreground">
                    <Wand2 className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p>Upload a file and generate a preview to see results here.</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};