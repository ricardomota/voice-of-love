import { supabase } from "@/integrations/supabase/client";
import { Person, Memory } from "@/types/person";

interface VoiceSettings {
  hasRecording: boolean;
  voiceId?: string;
}

export const peopleService = {
  async getAllPeople(): Promise<Person[]> {
    const { data: people, error } = await supabase
      .from('people')
      .select(`
        *,
        memories (*)
      `)
      .order('created_at', { ascending: false });

    if (error) throw error;

    return people?.map(person => ({
      id: person.id,
      name: person.name,
      relationship: person.relationship,
      birthYear: person.birth_year,
      avatar: person.avatar,
      memories: person.memories || [],
      personality: person.personality || [],
      commonPhrases: person.common_phrases || [],
      voiceSettings: (person.voice_settings as unknown as VoiceSettings) || { hasRecording: false },
      createdAt: new Date(person.created_at),
      updatedAt: new Date(person.updated_at),
      lastConversation: person.last_conversation ? new Date(person.last_conversation) : undefined
    })) || [];
  },

  async createPerson(personData: Omit<Person, 'id' | 'createdAt' | 'updatedAt'>): Promise<Person> {
    const { data: user, error: authError } = await supabase.auth.getUser();
    if (authError || !user.user) {
      console.error('Auth error:', authError);
      throw new Error('Usuário não autenticado. Faça login novamente.');
    }

    // First create the person
    const { data: person, error: personError } = await supabase
      .from('people')
      .insert({
        user_id: user.user.id,
        name: personData.name,
        relationship: personData.relationship,
        birth_year: personData.birthYear,
        avatar: personData.avatar,
        personality: personData.personality,
        common_phrases: personData.commonPhrases,
        voice_settings: personData.voiceSettings,
        last_conversation: personData.lastConversation?.toISOString()
      })
      .select()
      .single();

    if (personError) throw personError;

    // Then create the memories
    if (personData.memories.length > 0) {
      const { error: memoriesError } = await supabase
        .from('memories')
        .insert(
          personData.memories.map(memory => ({
            person_id: person.id,
            text: memory.text,
            media_url: memory.mediaUrl,
            media_type: memory.mediaType,
            file_name: memory.fileName
          }))
        );

      if (memoriesError) throw memoriesError;
    }

    // Fetch the complete person with memories
    return this.getPersonById(person.id);
  },

  async getPersonById(id: string): Promise<Person> {
    const { data: person, error } = await supabase
      .from('people')
      .select(`
        *,
        memories (*)
      `)
      .eq('id', id)
      .single();

    if (error) throw error;

    return {
      id: person.id,
      name: person.name,
      relationship: person.relationship,
      birthYear: person.birth_year,
      avatar: person.avatar,
      memories: person.memories || [],
      personality: person.personality || [],
      commonPhrases: person.common_phrases || [],
      voiceSettings: (person.voice_settings as unknown as VoiceSettings) || { hasRecording: false },
      createdAt: new Date(person.created_at),
      updatedAt: new Date(person.updated_at),
      lastConversation: person.last_conversation ? new Date(person.last_conversation) : undefined
    };
  },

  async updatePersonLastConversation(personId: string): Promise<void> {
    const { error } = await supabase
      .from('people')
      .update({ last_conversation: new Date().toISOString() })
      .eq('id', personId);

    if (error) throw error;
  },

  async uploadMedia(file: File, userId: string): Promise<string> {
    try {
      console.log('Starting upload for file:', file.name, 'size:', file.size, 'type:', file.type);
      
      const fileExt = file.name.split('.').pop();
      const fileName = `${userId}/${Date.now()}.${fileExt}`;
      
      console.log('Upload path:', fileName);

      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('media')
        .upload(fileName, file, {
          cacheControl: '3600',
          upsert: false
        });

      if (uploadError) {
        console.error('Upload error:', uploadError);
        throw new Error(`Erro no upload: ${uploadError.message}`);
      }

      console.log('Upload successful:', uploadData);

      const { data } = supabase.storage
        .from('media')
        .getPublicUrl(fileName);

      console.log('Public URL:', data.publicUrl);
      return data.publicUrl;
    } catch (error) {
      console.error('Error in uploadMedia:', error);
      throw error;
    }
  }
};