import React, { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { AuthGate } from '@/components/AuthGate';
import { ConsentModal, ConsentFlags } from '@/components/eterna/ConsentModal';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  Heart, 
  Upload, 
  MessageCircle, 
  Settings, 
  Plus, 
  FileText, 
  Mic, 
  Video,
  Clock,
  CheckCircle,
  AlertCircle,
  Loader2
} from 'lucide-react';
import { toast } from '@/hooks/use-toast';

interface LovedOne {
  id: string;
  display_name: string;
  status: string;
  metadata: any;
  created_at: string;
  updated_at: string;
}

interface Upload {
  id: string;
  type: 'chat' | 'audio' | 'video';
  file_name: string;
  status: string;
  created_at: string;
  file_path: string;
  file_size: number;
  loved_one_id: string;
  metadata: any;
  updated_at: string;
  user_id: string;
}

export default function Eterna() {
  const { user } = useAuth();
  const [showConsent, setShowConsent] = useState(false);
  const [hasConsented, setHasConsented] = useState(false);
  const [lovedOnes, setLovedOnes] = useState<LovedOne[]>([]);
  const [selectedLovedOne, setSelectedLovedOne] = useState<LovedOne | null>(null);
  const [uploads, setUploads] = useState<Upload[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      checkConsentStatus();
      loadLovedOnes();
    }
  }, [user]);

  const checkConsentStatus = async () => {
    try {
      const { data, error } = await supabase
        .from('eterna_users')
        .select('consent_flags')
        .eq('user_id', user?.id)
        .maybeSingle();

      if (error && error.code !== 'PGRST116') {
        console.error('Error checking consent:', error);
        return;
      }

      if (data && data.consent_flags) {
        const flags = data.consent_flags as unknown as ConsentFlags;
        const allConsented = Object.values(flags).every(Boolean);
        setHasConsented(allConsented);
        if (!allConsented) {
          setShowConsent(true);
        }
      } else {
        setShowConsent(true);
      }
    } catch (error) {
      console.error('Error checking consent:', error);
      setShowConsent(true);
    } finally {
      setLoading(false);
    }
  };

  const loadLovedOnes = async () => {
    try {
      const { data, error } = await supabase
        .from('loved_ones')
        .select('*')
        .eq('user_id', user?.id)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error loading loved ones:', error);
        toast({
          title: "Error",
          description: "Failed to load your loved ones",
          variant: "destructive"
        });
        return;
      }

      setLovedOnes(data || []);
      if (data && data.length > 0) {
        setSelectedLovedOne(data[0]);
        loadUploads(data[0].id);
      }
    } catch (error) {
      console.error('Error loading loved ones:', error);
    }
  };

  const loadUploads = async (lovedOneId: string) => {
    try {
      const { data, error } = await supabase
        .from('uploads')
        .select('*')
        .eq('loved_one_id', lovedOneId)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error loading uploads:', error);
        return;
      }

      setUploads((data || []) as Upload[]);
    } catch (error) {
      console.error('Error loading uploads:', error);
    }
  };

  const handleConsent = async (consents: ConsentFlags) => {
    try {
      const { error } = await supabase
        .from('eterna_users')
        .upsert({
          user_id: user?.id,
          email: user?.email || '',
          consent_flags: consents as any,
          locale: 'en'
        });

      if (error) {
        console.error('Error saving consent:', error);
        toast({
          title: "Error",
          description: "Failed to save consent preferences",
          variant: "destructive"
        });
        return;
      }

      setHasConsented(true);
      setShowConsent(false);
      
      toast({
        title: "Welcome to Eterna",
        description: "Your consent has been recorded. You can now create your first interactive memory.",
      });
    } catch (error) {
      console.error('Error handling consent:', error);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'uploaded':
        return <Clock className="w-4 h-4 text-yellow-500" />;
      case 'transcribing':
      case 'scrubbing':
      case 'chunking':
        return <Loader2 className="w-4 h-4 text-blue-500 animate-spin" />;
      case 'indexed':
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'failed':
        return <AlertCircle className="w-4 h-4 text-red-500" />;
      default:
        return <Clock className="w-4 h-4 text-gray-500" />;
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'chat':
        return <FileText className="w-4 h-4" />;
      case 'audio':
        return <Mic className="w-4 h-4" />;
      case 'video':
        return <Video className="w-4 h-4" />;
      default:
        return <FileText className="w-4 h-4" />;
    }
  };

  if (loading) {
    return (
      <AuthGate>
        <div className="min-h-screen bg-background flex items-center justify-center">
          <Loader2 className="w-8 h-8 animate-spin" />
        </div>
      </AuthGate>
    );
  }

  return (
    <AuthGate>
      <div className="min-h-screen bg-background">
        {/* Header */}
        <header className="border-b bg-card">
          <div className="container max-w-6xl mx-auto px-4 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Heart className="w-8 h-8 text-primary" />
                <div>
                  <h1 className="text-2xl font-bold">Eterna</h1>
                  <p className="text-sm text-muted-foreground">Preserving Conversations with Love</p>
                </div>
              </div>
              <Button variant="outline" size="sm">
                <Settings className="w-4 h-4 mr-2" />
                Settings
              </Button>
            </div>
          </div>
        </header>

        <div className="container max-w-6xl mx-auto px-4 py-8">
          {lovedOnes.length === 0 ? (
            /* Welcome State */
            <div className="max-w-2xl mx-auto text-center space-y-6">
              <div className="space-y-2">
                <h2 className="text-3xl font-bold">Welcome to Eterna</h2>
                <p className="text-lg text-muted-foreground">
                  Create your first interactive memory to begin preserving precious memories.
                </p>
              </div>

              <Card className="text-left">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Heart className="w-5 h-5 text-primary" />
                    Getting Started
                  </CardTitle>
                  <CardDescription>
                    Follow these steps to create your first therapeutic interactive memory
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-start gap-3">
                    <div className="w-6 h-6 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-medium">1</div>
                    <div>
                      <h4 className="font-medium">Create a Loved One Profile</h4>
                      <p className="text-sm text-muted-foreground">Start by creating a profile for the person you want to memorialize</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-6 h-6 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-medium">2</div>
                    <div>
                      <h4 className="font-medium">Upload Conversations & Media</h4>
                      <p className="text-sm text-muted-foreground">Upload WhatsApp exports, voice notes, and family videos</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-6 h-6 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-medium">3</div>
                    <div>
                      <h4 className="font-medium">Begin Conversations</h4>
                      <p className="text-sm text-muted-foreground">Start chatting with the AI representation for comfort and reminiscence</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Button size="lg" className="w-full max-w-sm">
                <Plus className="w-5 h-5 mr-2" />
                Create First Profile
              </Button>
            </div>
          ) : (
            /* Main Dashboard */
            <div className="grid lg:grid-cols-3 gap-6">
              {/* Loved Ones Sidebar */}
              <div className="lg:col-span-1 space-y-4">
                <div className="flex items-center justify-between">
                  <h2 className="text-lg font-semibold">Your Loved Ones</h2>
                  <Button size="sm" variant="outline">
                    <Plus className="w-4 h-4" />
                  </Button>
                </div>

                <div className="space-y-2">
                  {lovedOnes.map((lovedOne) => (
                    <Card 
                      key={lovedOne.id}
                      className={`cursor-pointer transition-colors ${
                        selectedLovedOne?.id === lovedOne.id ? 'ring-2 ring-primary' : ''
                      }`}
                      onClick={() => {
                        setSelectedLovedOne(lovedOne);
                        loadUploads(lovedOne.id);
                      }}
                    >
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                          <div>
                            <h3 className="font-medium">{lovedOne.display_name}</h3>
                            <p className="text-sm text-muted-foreground">
                              Created {new Date(lovedOne.created_at).toLocaleDateString()}
                            </p>
                          </div>
                          <Badge variant={lovedOne.status === 'active' ? 'default' : 'secondary'}>
                            {lovedOne.status}
                          </Badge>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>

              {/* Main Content */}
              <div className="lg:col-span-2 space-y-6">
                {selectedLovedOne && (
                  <>
                    {/* Profile Header */}
                    <Card>
                      <CardHeader>
                        <div className="flex items-center justify-between">
                          <div>
                            <CardTitle className="flex items-center gap-2">
                              <Heart className="w-5 h-5 text-primary" />
                              {selectedLovedOne.display_name}
                            </CardTitle>
                            <CardDescription>
                              Interactive memory profile and data management
                            </CardDescription>
                          </div>
                          <div className="flex gap-2">
                            <Button variant="outline" size="sm">
                              <Upload className="w-4 h-4 mr-2" />
                              Upload Data
                            </Button>
                            <Button size="sm">
                              <MessageCircle className="w-4 h-4 mr-2" />
                              Start Chat
                            </Button>
                          </div>
                        </div>
                      </CardHeader>
                    </Card>

                    {/* Data Status */}
                    {uploads.length > 0 ? (
                      <Card>
                        <CardHeader>
                          <CardTitle>Uploaded Data</CardTitle>
                          <CardDescription>
                            Manage your uploaded conversations and media files
                          </CardDescription>
                        </CardHeader>
                        <CardContent>
                          <div className="space-y-3">
                            {uploads.map((upload) => (
                              <div key={upload.id} className="flex items-center justify-between p-3 border rounded-lg">
                                <div className="flex items-center gap-3">
                                  {getTypeIcon(upload.type)}
                                  <div>
                                    <p className="font-medium">{upload.file_name}</p>
                                    <p className="text-sm text-muted-foreground">
                                      {upload.type} • {new Date(upload.created_at).toLocaleDateString()}
                                    </p>
                                  </div>
                                </div>
                                <div className="flex items-center gap-2">
                                  {getStatusIcon(upload.status)}
                                  <Badge variant={upload.status === 'indexed' ? 'default' : 'secondary'}>
                                    {upload.status}
                                  </Badge>
                                </div>
                              </div>
                            ))}
                          </div>
                        </CardContent>
                      </Card>
                    ) : (
                      <Alert>
                        <Upload className="w-4 h-4" />
                        <AlertDescription>
                          No data uploaded yet. Upload WhatsApp conversations, voice notes, or family videos to begin creating the interactive memory.
                        </AlertDescription>
                      </Alert>
                    )}
                  </>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Consent Modal */}
        <ConsentModal
          open={showConsent}
          onConsent={handleConsent}
          onCancel={() => {
            setShowConsent(false);
            // Redirect to main app or show message about needing consent
          }}
        />
      </div>
    </AuthGate>
  );
}