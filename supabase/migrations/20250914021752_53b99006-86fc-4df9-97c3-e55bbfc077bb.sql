-- Create Eterna database schema for conversational clones

-- Users table (extends auth.users)
CREATE TABLE IF NOT EXISTS public.eterna_users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  locale TEXT NOT NULL DEFAULT 'en',
  consent_flags JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  UNIQUE(user_id)
);

-- Loved ones (people being cloned)
CREATE TABLE IF NOT EXISTS public.loved_ones (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  display_name TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'active',
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Uploads (WhatsApp exports, media files)
CREATE TABLE IF NOT EXISTS public.uploads (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  loved_one_id UUID REFERENCES public.loved_ones(id) ON DELETE CASCADE,
  type TEXT NOT NULL CHECK (type IN ('chat', 'audio', 'video')),
  file_path TEXT NOT NULL,
  file_name TEXT NOT NULL,
  file_size INTEGER,
  status TEXT NOT NULL DEFAULT 'uploaded' CHECK (status IN ('uploaded', 'transcribing', 'scrubbing', 'chunking', 'indexed', 'failed')),
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Transcripts from audio/video processing
CREATE TABLE IF NOT EXISTS public.transcripts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  upload_id UUID REFERENCES public.uploads(id) ON DELETE CASCADE,
  language TEXT NOT NULL DEFAULT 'en',
  diarization_json JSONB,
  raw_text TEXT NOT NULL,
  confidence_score NUMERIC(3,2),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- PII redaction records
CREATE TABLE IF NOT EXISTS public.redactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  transcript_id UUID REFERENCES public.transcripts(id) ON DELETE CASCADE,
  pii_map_json JSONB NOT NULL DEFAULT '{}',
  redacted_text TEXT NOT NULL,
  redaction_count INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Text chunks for RAG (with embeddings)
CREATE TABLE IF NOT EXISTS public.chunks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  loved_one_id UUID REFERENCES public.loved_ones(id) ON DELETE CASCADE,
  source_id UUID REFERENCES public.uploads(id) ON DELETE CASCADE,
  start_ms INTEGER,
  end_ms INTEGER,
  tags TEXT[],
  chunk_text TEXT NOT NULL,
  embedding vector(1536),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Chat sessions
CREATE TABLE IF NOT EXISTS public.chat_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  loved_one_id UUID REFERENCES public.loved_ones(id) ON DELETE CASCADE,
  title TEXT,
  rag_enabled BOOLEAN DEFAULT true,
  language TEXT DEFAULT 'en',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Chat messages
CREATE TABLE IF NOT EXISTS public.chat_messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id UUID REFERENCES public.chat_sessions(id) ON DELETE CASCADE,
  role TEXT NOT NULL CHECK (role IN ('user', 'assistant', 'system')),
  content TEXT NOT NULL,
  safety_flags JSONB DEFAULT '{}',
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Evaluation runs for quality assessment
CREATE TABLE IF NOT EXISTS public.eval_runs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  loved_one_id UUID REFERENCES public.loved_ones(id) ON DELETE CASCADE,
  suite TEXT NOT NULL,
  scores_json JSONB NOT NULL,
  overall_score NUMERIC(3,2),
  recommendations TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Audit logs for privacy compliance
CREATE TABLE IF NOT EXISTS public.audit_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  action TEXT NOT NULL,
  resource_type TEXT,
  resource_id UUID,
  metadata JSONB DEFAULT '{}',
  ip_address INET,
  user_agent TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable pgvector extension for embeddings
CREATE EXTENSION IF NOT EXISTS vector;

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_loved_ones_user_id ON public.loved_ones(user_id);
CREATE INDEX IF NOT EXISTS idx_uploads_user_loved_one ON public.uploads(user_id, loved_one_id);
CREATE INDEX IF NOT EXISTS idx_chunks_loved_one ON public.chunks(loved_one_id);
CREATE INDEX IF NOT EXISTS idx_chunks_embedding ON public.chunks USING ivfflat (embedding vector_cosine_ops) WITH (lists = 100);
CREATE INDEX IF NOT EXISTS idx_chat_sessions_user_loved_one ON public.chat_sessions(user_id, loved_one_id);
CREATE INDEX IF NOT EXISTS idx_chat_messages_session ON public.chat_messages(session_id);
CREATE INDEX IF NOT EXISTS idx_audit_logs_user_action ON public.audit_logs(user_id, action);

-- Row Level Security Policies
ALTER TABLE public.eterna_users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.loved_ones ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.uploads ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.transcripts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.redactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.chunks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.chat_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.chat_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.eval_runs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.audit_logs ENABLE ROW LEVEL SECURITY;

-- Eterna Users policies
CREATE POLICY "Users can manage their own profile" ON public.eterna_users
  FOR ALL USING (auth.uid() = user_id);

-- Loved Ones policies  
CREATE POLICY "Users can manage their own loved ones" ON public.loved_ones
  FOR ALL USING (auth.uid() = user_id);

-- Uploads policies
CREATE POLICY "Users can manage their own uploads" ON public.uploads
  FOR ALL USING (auth.uid() = user_id);

-- Transcripts policies (through upload ownership)
CREATE POLICY "Users can view transcripts of their uploads" ON public.transcripts
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM public.uploads WHERE uploads.id = transcripts.upload_id AND uploads.user_id = auth.uid())
  );

CREATE POLICY "Service can manage transcripts" ON public.transcripts
  FOR ALL USING (auth.role() = 'service_role');

-- Redactions policies (through transcript ownership)
CREATE POLICY "Users can view redactions of their transcripts" ON public.redactions
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.transcripts 
      JOIN public.uploads ON uploads.id = transcripts.upload_id 
      WHERE transcripts.id = redactions.transcript_id AND uploads.user_id = auth.uid()
    )
  );

CREATE POLICY "Service can manage redactions" ON public.redactions
  FOR ALL USING (auth.role() = 'service_role');

-- Chunks policies (through loved one ownership)
CREATE POLICY "Users can view chunks of their loved ones" ON public.chunks
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM public.loved_ones WHERE loved_ones.id = chunks.loved_one_id AND loved_ones.user_id = auth.uid())
  );

CREATE POLICY "Service can manage chunks" ON public.chunks
  FOR ALL USING (auth.role() = 'service_role');

-- Chat Sessions policies
CREATE POLICY "Users can manage their own chat sessions" ON public.chat_sessions
  FOR ALL USING (auth.uid() = user_id);

-- Chat Messages policies (through session ownership)
CREATE POLICY "Users can view messages from their sessions" ON public.chat_messages
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM public.chat_sessions WHERE chat_sessions.id = chat_messages.session_id AND chat_sessions.user_id = auth.uid())
  );

CREATE POLICY "Users can create messages in their sessions" ON public.chat_messages
  FOR INSERT WITH CHECK (
    EXISTS (SELECT 1 FROM public.chat_sessions WHERE chat_sessions.id = chat_messages.session_id AND chat_sessions.user_id = auth.uid())
  );

CREATE POLICY "Service can manage messages" ON public.chat_messages
  FOR ALL USING (auth.role() = 'service_role');

-- Eval Runs policies (through loved one ownership)
CREATE POLICY "Users can view eval runs of their loved ones" ON public.eval_runs
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM public.loved_ones WHERE loved_ones.id = eval_runs.loved_one_id AND loved_ones.user_id = auth.uid())
  );

CREATE POLICY "Service can manage eval runs" ON public.eval_runs
  FOR ALL USING (auth.role() = 'service_role');

-- Audit Logs policies
CREATE POLICY "Users can view their own audit logs" ON public.audit_logs
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Service can manage audit logs" ON public.audit_logs
  FOR ALL USING (auth.role() = 'service_role');

-- Functions for automatic timestamps
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Triggers for automatic timestamps
CREATE TRIGGER update_eterna_users_updated_at BEFORE UPDATE ON public.eterna_users FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_loved_ones_updated_at BEFORE UPDATE ON public.loved_ones FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_uploads_updated_at BEFORE UPDATE ON public.uploads FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_chat_sessions_updated_at BEFORE UPDATE ON public.chat_sessions FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();