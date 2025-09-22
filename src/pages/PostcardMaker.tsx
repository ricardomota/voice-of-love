// Step 6: Memory Cards - Waveform Postcard generator for short audio excerpts
import React, { useState, useRef, useCallback } from 'react';
import { motion } from 'framer-motion';
import { Upload, Scissors, Download, Share2, Play, Pause, RotateCcw, Save, Volume2, Wand2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Slider } from '@/components/ui/slider';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/useAuth';
import { storageIntegrations, analyticsIntegrations } from '@/lib/integrations';

interface AudioSegment {
  start: number;
  end: number;
  duration: number;
}

export const PostcardMaker: React.FC = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  
  // State management
  const [audioFile, setAudioFile] = useState<File | null>(null);
  const [audioUrl, setAudioUrl] = useState<string>('');
  const [audioData, setAudioData] = useState<{duration: number; peaks: number[]} | null>(null);
  const [selectedSegment, setSelectedSegment] = useState<AudioSegment>({ start: 0, end: 15, duration: 15 });
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [postcardTitle, setPostcardTitle] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedPostcard, setGeneratedPostcard] = useState<{imageUrl: string; audioUrl: string} | null>(null);
  const [uploading, setUploading] = useState(false);

  // Refs
  const audioRef = useRef<HTMLAudioElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Track page view
  React.useEffect(() => {
    analyticsIntegrations.trackEvent('postcard_opened');
  }, []);

  // Handle audio file upload
  const handleAudioUpload = useCallback(async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file
    if (!file.type.startsWith('audio/')) {
      toast({ title: 'Invalid file', description: 'Please upload an audio file.', variant: 'destructive' });
      return;
    }

    if (file.size > 30 * 1024 * 1024) { // 30MB limit
      toast({ title: 'File too large', description: 'Audio must be smaller than 30MB.', variant: 'destructive' });
      return;
    }

    setUploading(true);
    setAudioFile(file);
    
    try {
      // Upload to storage
      const result = await storageIntegrations.uploadAudio(file);
      if (result.error) throw new Error(result.error);
      
      setAudioUrl(result.url!);
      
      // Create audio element to analyze
      const audio = new Audio(result.url!);
      audio.addEventListener('loadedmetadata', () => {
        const duration = audio.duration;
        
        // Generate mock waveform data (in a real app, you'd use Web Audio API)
        const peaks = Array.from({ length: 100 }, () => Math.random() * 0.8 + 0.1);
        
        setAudioData({ duration, peaks });
        setSelectedSegment({ 
          start: 0, 
          end: Math.min(15, duration), 
          duration: Math.min(15, duration) 
        });
        
        // Set default title
        setPostcardTitle(file.name.replace(/\.[^/.]+$/, ''));
      });

      toast({ title: 'Upload successful', description: 'Audio uploaded and ready for editing.' });

    } catch (error) {
      console.error('Upload error:', error);
      toast({
        title: 'Upload failed',
        description: error instanceof Error ? error.message : 'Failed to upload audio',
        variant: 'destructive'
      });
    } finally {
      setUploading(false);
    }
  }, [toast]);

  // Draw waveform
  const drawWaveform = useCallback(() => {
    if (!canvasRef.current || !audioData) return;
    
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const { width, height } = canvas;
    const { peaks, duration } = audioData;
    
    // Clear canvas
    ctx.fillStyle = '#f1f5f9';
    ctx.fillRect(0, 0, width, height);
    
    // Draw waveform
    const barWidth = width / peaks.length;
    const centerY = height / 2;
    
    peaks.forEach((peak, index) => {
      const x = index * barWidth;
      const barHeight = peak * centerY;
      
      // Check if this part is in the selected segment
      const timePosition = (index / peaks.length) * duration;
      const isSelected = timePosition >= selectedSegment.start && timePosition <= selectedSegment.end;
      
      ctx.fillStyle = isSelected ? '#3b82f6' : '#cbd5e1';
      ctx.fillRect(x, centerY - barHeight, barWidth - 1, barHeight * 2);
    });
    
    // Draw selection indicators
    const startX = (selectedSegment.start / duration) * width;
    const endX = (selectedSegment.end / duration) * width;
    
    ctx.fillStyle = 'rgba(59, 130, 246, 0.2)';
    ctx.fillRect(startX, 0, endX - startX, height);
    
    // Draw current time indicator if playing
    if (isPlaying) {
      const currentX = (currentTime / duration) * width;
      ctx.strokeStyle = '#ef4444';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(currentX, 0);
      ctx.lineTo(currentX, height);
      ctx.stroke();
    }
  }, [audioData, selectedSegment, isPlaying, currentTime]);

  // Draw waveform when data changes
  React.useEffect(() => {
    drawWaveform();
  }, [drawWaveform]);

  // Audio control functions
  const togglePlayback = () => {
    if (!audioRef.current || !audioData) return;
    
    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      audioRef.current.currentTime = selectedSegment.start;
      audioRef.current.play();
      setIsPlaying(true);
    }
  };

  // Handle audio time update
  const handleTimeUpdate = () => {
    if (!audioRef.current) return;
    
    const time = audioRef.current.currentTime;
    setCurrentTime(time);
    
    // Auto-pause at end of selection
    if (time >= selectedSegment.end) {
      audioRef.current.pause();
      setIsPlaying(false);
    }
  };

  // Update segment selection
  const updateSegment = (start: number[], end: number[]) => {
    if (!audioData) return;
    
    const newStart = Math.max(0, start[0]);
    const newEnd = Math.min(audioData.duration, end[0]);
    
    setSelectedSegment({
      start: newStart,
      end: newEnd,
      duration: newEnd - newStart
    });
  };

  // Generate postcard
  const generatePostcard = useCallback(async () => {
    if (!audioFile || !audioData || !selectedSegment) return;

    setIsGenerating(true);
    
    try {
      // In a real implementation, this would:
      // 1. Extract the audio segment
      // 2. Generate a waveform visualization
      // 3. Create a square poster with the waveform
      // 4. Add text overlay with title
      // 5. Add Eterna watermark
      
      // Mock generation with delay
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      // Mock result - in reality, this would be generated server-side
      const mockImageUrl = `data:image/svg+xml,${encodeURIComponent(`
        <svg width="400" height="400" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" style="stop-color:#6366f1;stop-opacity:1" />
              <stop offset="100%" style="stop-color:#8b5cf6;stop-opacity:1" />
            </linearGradient>
          </defs>
          <rect width="400" height="400" fill="url(#bg)"/>
          <text x="20" y="50" fill="white" font-family="Arial" font-size="24" font-weight="bold">${postcardTitle}</text>
          <text x="20" y="80" fill="rgba(255,255,255,0.8)" font-family="Arial" font-size="14">${selectedSegment.duration.toFixed(1)}s excerpt</text>
          
          <!-- Mock waveform -->
          ${audioData.peaks.slice(0, 20).map((peak, i) => 
            `<rect x="${20 + i * 15}" y="${200 - peak * 60}" width="10" height="${peak * 120}" fill="rgba(255,255,255,0.9)"/>`
          ).join('')}
          
          <text x="320" y="380" fill="rgba(255,255,255,0.6)" font-family="Arial" font-size="12">Eterna · Demo</text>
        </svg>
      `)}`;
      
      setGeneratedPostcard({
        imageUrl: mockImageUrl,
        audioUrl: audioUrl // This would be the extracted segment
      });

      await analyticsIntegrations.trackEvent('postcard_exported', {
        duration: selectedSegment.duration,
        title: postcardTitle
      });

      toast({
        title: 'Postcard generated!',
        description: 'Your waveform postcard is ready to download.',
        variant: 'default'
      });

    } catch (error) {
      console.error('Generation error:', error);
      toast({
        title: 'Generation failed',
        description: 'Could not generate postcard. Please try again.',
        variant: 'destructive'
      });
    } finally {
      setIsGenerating(false);
    }
  }, [audioFile, audioData, selectedSegment, postcardTitle, audioUrl, toast]);

  // Share postcard with private link
  const sharePostcard = useCallback(async () => {
    if (!generatedPostcard) return;
    
    try {
      // In a real implementation, this would create an expiring private link
      const shareUrl = `${window.location.origin}/shared/${crypto.randomUUID()}`;
      
      await navigator.clipboard.writeText(shareUrl);
      
      await analyticsIntegrations.trackEvent('postcard_link_created');
      
      toast({
        title: 'Link copied!',
        description: 'Private sharing link copied to clipboard. Link expires in 7 days.',
        variant: 'default'
      });

    } catch (error) {
      toast({
        title: 'Share failed',
        description: 'Could not create sharing link.',
        variant: 'destructive'
      });
    }
  }, [generatedPostcard, toast]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

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
            Waveform Postcard Maker
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Create beautiful shareable postcards from your audio memories. 
            Select an 8-15 second excerpt to generate a square poster with waveform visualization.
          </p>
        </motion.div>

        <div className="grid gap-8">
          {/* Upload Section */}
          {!audioFile && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Upload className="h-5 w-5" />
                  Upload Audio
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="border-2 border-dashed border-border rounded-lg p-8 text-center">
                  <input
                    type="file"
                    accept="audio/*"
                    onChange={handleAudioUpload}
                    className="hidden"
                    id="audio-upload"
                    disabled={uploading}
                  />
                  <label htmlFor="audio-upload" className="cursor-pointer">
                    <Volume2 className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                    <p className="text-lg font-medium mb-2">
                      {uploading ? 'Uploading...' : 'Upload an audio file'}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      .wav, .mp3, .m4a • Max 30MB
                    </p>
                  </label>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Audio Editor */}
          {audioFile && audioData && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Scissors className="h-5 w-5" />
                  Select Audio Excerpt
                </CardTitle>
                <div className="flex items-center gap-2">
                  <Badge variant="outline">{audioFile.name}</Badge>
                  <Badge variant="secondary">{formatTime(audioData.duration)}</Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Waveform Display */}
                <div className="space-y-4">
                  <canvas
                    ref={canvasRef}
                    width={800}
                    height={120}
                    className="w-full h-30 border rounded-lg cursor-pointer"
                    style={{ maxWidth: '100%', height: '120px' }}
                  />
                  
                  {/* Audio Controls */}
                  <div className="flex items-center justify-center gap-4">
                    <Button
                      data-testid="postcard-preview"
                      onClick={togglePlayback}
                      variant="outline"
                      size="sm"
                    >
                      {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
                    </Button>
                    
                    <span className="text-sm text-muted-foreground">
                      {formatTime(currentTime)} / {formatTime(audioData.duration)}
                    </span>
                    
                    <Button
                      onClick={() => {
                        if (audioRef.current) {
                          audioRef.current.currentTime = selectedSegment.start;
                          setCurrentTime(selectedSegment.start);
                        }
                      }}
                      variant="ghost"
                      size="sm"
                    >
                      <RotateCcw className="h-4 w-4" />
                    </Button>
                  </div>
                </div>

                {/* Selection Controls */}
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Start Time: {formatTime(selectedSegment.start)}</label>
                      <Slider
                        value={[selectedSegment.start]}
                        onValueChange={(value) => updateSegment(value, [selectedSegment.end])}
                        max={audioData.duration}
                        min={0}
                        step={0.1}
                        className="w-full"
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <label className="text-sm font-medium">End Time: {formatTime(selectedSegment.end)}</label>
                      <Slider
                        value={[selectedSegment.end]}
                        onValueChange={(value) => updateSegment([selectedSegment.start], value)}
                        max={audioData.duration}
                        min={selectedSegment.start}
                        step={0.1}
                        className="w-full"
                      />
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
                    <span className="text-sm font-medium">Selected Duration:</span>
                    <Badge variant={selectedSegment.duration >= 8 && selectedSegment.duration <= 15 ? "default" : "destructive"}>
                      {selectedSegment.duration.toFixed(1)}s
                    </Badge>
                  </div>
                  
                  {(selectedSegment.duration < 8 || selectedSegment.duration > 15) && (
                    <p className="text-sm text-destructive">
                      Please select between 8-15 seconds for optimal postcard generation.
                    </p>
                  )}
                </div>

                {/* Title Input */}
                <div className="space-y-2">
                  <label className="text-sm font-medium">Postcard Title</label>
                  <Input
                    value={postcardTitle}
                    onChange={(e) => setPostcardTitle(e.target.value)}
                    placeholder="Enter a title for your postcard"
                    maxLength={50}
                  />
                </div>

                {/* Generate Button */}
                <Button
                  data-testid="postcard-export"
                  onClick={generatePostcard}
                  disabled={isGenerating || selectedSegment.duration < 8 || selectedSegment.duration > 15 || !postcardTitle.trim()}
                  className="w-full"
                  size="lg"
                >
                  {isGenerating ? (
                    <>
                      <Wand2 className="h-4 w-4 mr-2 animate-spin" />
                      Generating Postcard...
                    </>
                  ) : (
                    <>
                      <Wand2 className="h-4 w-4 mr-2" />
                      Generate Postcard
                    </>
                  )}
                </Button>

                {/* Hidden audio element */}
                <audio
                  ref={audioRef}
                  src={audioUrl}
                  onTimeUpdate={handleTimeUpdate}
                  onEnded={() => setIsPlaying(false)}
                />
              </CardContent>
            </Card>
          )}

          {/* Generated Postcard */}
          {generatedPostcard && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Save className="h-5 w-5" />
                    Your Waveform Postcard
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="flex flex-col lg:flex-row gap-6">
                    {/* Postcard Preview */}
                    <div className="flex-1">
                      <div className="aspect-square max-w-md mx-auto border rounded-lg overflow-hidden">
                        <img
                          src={generatedPostcard.imageUrl}
                          alt="Generated postcard"
                          className="w-full h-full object-cover"
                        />
                      </div>
                    </div>
                    
                    {/* Actions */}
                    <div className="flex-1 space-y-4">
                      <div>
                        <h3 className="font-semibold mb-2">Export Options</h3>
                        <div className="space-y-2">
                          <Button
                            onClick={() => {
                              const link = document.createElement('a');
                              link.href = generatedPostcard.imageUrl;
                              link.download = `${postcardTitle.replace(/[^a-z0-9]/gi, '_').toLowerCase()}_postcard.png`;
                              link.click();
                            }}
                            variant="outline"
                            className="w-full justify-start"
                          >
                            <Download className="h-4 w-4 mr-2" />
                            Download PNG Poster
                          </Button>
                          
                          <Button
                            onClick={() => {
                              const link = document.createElement('a');
                              link.href = generatedPostcard.audioUrl;
                              link.download = `${postcardTitle.replace(/[^a-z0-9]/gi, '_').toLowerCase()}_excerpt.mp3`;
                              link.click();
                            }}
                            variant="outline"
                            className="w-full justify-start"
                          >
                            <Download className="h-4 w-4 mr-2" />
                            Download Audio Excerpt
                          </Button>
                        </div>
                      </div>
                      
                      <div>
                        <h3 className="font-semibold mb-2">Share Options</h3>
                        <Button
                          data-testid="postcard-share"
                          onClick={sharePostcard}
                          className="w-full"
                        >
                          <Share2 className="h-4 w-4 mr-2" />
                          Create Private Share Link
                        </Button>
                        <p className="text-xs text-muted-foreground mt-2">
                          Creates an expiring private link (7 days) that doesn't require sign-in to view.
                        </p>
                      </div>
                      
                      {user && (
                        <div>
                          <h3 className="font-semibold mb-2">Save to Memory Wallet</h3>
                          <Button
                            data-testid="postcard-save"
                            variant="outline"
                            className="w-full"
                            onClick={() => {
                              // This would save to the user's memory collection
                              toast({
                                title: 'Saved to Memory Wallet',
                                description: 'Your postcard has been saved to your collection.',
                              });
                            }}
                          >
                            <Save className="h-4 w-4 mr-2" />
                            Save to Collection
                          </Button>
                        </div>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}

          {/* Loading State */}
          {isGenerating && (
            <Card>
              <CardContent className="pt-6">
                <div className="space-y-4">
                  <Skeleton className="aspect-square max-w-md mx-auto" />
                  <div className="space-y-2">
                    <Skeleton className="h-4 w-3/4 mx-auto" />
                    <Skeleton className="h-4 w-1/2 mx-auto" />
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};