-- Create tables for the Eterna app

-- Create people table
CREATE TABLE public.people (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  relationship TEXT NOT NULL,
  birth_year INTEGER,
  avatar TEXT,
  personality TEXT[] DEFAULT '{}',
  common_phrases TEXT[] DEFAULT '{}',
  voice_settings JSONB DEFAULT '{"hasRecording": false}',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  last_conversation TIMESTAMP WITH TIME ZONE
);

-- Create memories table
CREATE TABLE public.memories (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  person_id UUID NOT NULL REFERENCES public.people(id) ON DELETE CASCADE,
  text TEXT NOT NULL,
  media_url TEXT,
  media_type TEXT CHECK (media_type IN ('image', 'video', 'audio')),
  file_name TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create conversations table
CREATE TABLE public.conversations (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  person_id UUID NOT NULL REFERENCES public.people(id) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create messages table
CREATE TABLE public.messages (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  conversation_id UUID NOT NULL REFERENCES public.conversations(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  is_user BOOLEAN NOT NULL DEFAULT false,
  has_audio BOOLEAN DEFAULT false,
  audio_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.people ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.memories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.conversations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for people table
CREATE POLICY "Users can view their own people" 
ON public.people 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own people" 
ON public.people 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own people" 
ON public.people 
FOR UPDATE 
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own people" 
ON public.people 
FOR DELETE 
USING (auth.uid() = user_id);

-- Create RLS policies for memories table
CREATE POLICY "Users can view memories of their people" 
ON public.memories 
FOR SELECT 
USING (EXISTS (
  SELECT 1 FROM public.people 
  WHERE people.id = memories.person_id 
  AND people.user_id = auth.uid()
));

CREATE POLICY "Users can create memories for their people" 
ON public.memories 
FOR INSERT 
WITH CHECK (EXISTS (
  SELECT 1 FROM public.people 
  WHERE people.id = memories.person_id 
  AND people.user_id = auth.uid()
));

CREATE POLICY "Users can update memories of their people" 
ON public.memories 
FOR UPDATE 
USING (EXISTS (
  SELECT 1 FROM public.people 
  WHERE people.id = memories.person_id 
  AND people.user_id = auth.uid()
));

CREATE POLICY "Users can delete memories of their people" 
ON public.memories 
FOR DELETE 
USING (EXISTS (
  SELECT 1 FROM public.people 
  WHERE people.id = memories.person_id 
  AND people.user_id = auth.uid()
));

-- Create RLS policies for conversations table
CREATE POLICY "Users can view their own conversations" 
ON public.conversations 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own conversations" 
ON public.conversations 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own conversations" 
ON public.conversations 
FOR UPDATE 
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own conversations" 
ON public.conversations 
FOR DELETE 
USING (auth.uid() = user_id);

-- Create RLS policies for messages table
CREATE POLICY "Users can view messages from their conversations" 
ON public.messages 
FOR SELECT 
USING (EXISTS (
  SELECT 1 FROM public.conversations 
  WHERE conversations.id = messages.conversation_id 
  AND conversations.user_id = auth.uid()
));

CREATE POLICY "Users can create messages in their conversations" 
ON public.messages 
FOR INSERT 
WITH CHECK (EXISTS (
  SELECT 1 FROM public.conversations 
  WHERE conversations.id = messages.conversation_id 
  AND conversations.user_id = auth.uid()
));

CREATE POLICY "Users can update messages in their conversations" 
ON public.messages 
FOR UPDATE 
USING (EXISTS (
  SELECT 1 FROM public.conversations 
  WHERE conversations.id = messages.conversation_id 
  AND conversations.user_id = auth.uid()
));

CREATE POLICY "Users can delete messages in their conversations" 
ON public.messages 
FOR DELETE 
USING (EXISTS (
  SELECT 1 FROM public.conversations 
  WHERE conversations.id = messages.conversation_id 
  AND conversations.user_id = auth.uid()
));

-- Create function to update timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers for automatic timestamp updates
CREATE TRIGGER update_people_updated_at
BEFORE UPDATE ON public.people
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_conversations_updated_at
BEFORE UPDATE ON public.conversations
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Create storage bucket for media files
INSERT INTO storage.buckets (id, name, public) VALUES ('media', 'media', true);

-- Create storage policies for media uploads
CREATE POLICY "Users can view all media files" 
ON storage.objects 
FOR SELECT 
USING (bucket_id = 'media');

CREATE POLICY "Users can upload their own media files" 
ON storage.objects 
FOR INSERT 
WITH CHECK (bucket_id = 'media' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can update their own media files" 
ON storage.objects 
FOR UPDATE 
USING (bucket_id = 'media' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can delete their own media files" 
ON storage.objects 
FOR DELETE 
USING (bucket_id = 'media' AND auth.uid()::text = (storage.foldername(name))[1]);