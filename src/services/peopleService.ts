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
      howTheyCalledYou: person.how_they_called_you,
      birthYear: person.birth_year,
      birthDate: person.birth_date,
      avatar: person.avatar,
      memories: person.memories || [],
      personality: person.personality || [],
      commonPhrases: person.common_phrases || [],
      temperature: person.temperature || 0.7,
      talkingStyle: person.talking_style || undefined,
      humorStyle: person.humor_style || undefined,
      emotionalTone: person.emotional_tone || undefined,
      verbosity: person.verbosity || undefined,
      values: person.values || [],
      topics: person.topics || [],
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
        how_they_called_you: personData.howTheyCalledYou,
        birth_year: personData.birthYear,
        birth_date: personData.birthDate,
        avatar: personData.avatar,
        personality: personData.personality,
        common_phrases: personData.commonPhrases,
        temperature: personData.temperature,
        talking_style: personData.talkingStyle,
        humor_style: personData.humorStyle,
        emotional_tone: personData.emotionalTone,
        verbosity: personData.verbosity,
        values: personData.values,
        topics: personData.topics,
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
      howTheyCalledYou: person.how_they_called_you,
      birthYear: person.birth_year,
      birthDate: person.birth_date,
      avatar: person.avatar,
      memories: person.memories || [],
      personality: person.personality || [],
      commonPhrases: person.common_phrases || [],
      temperature: person.temperature || 0.7,
      talkingStyle: person.talking_style,
      humorStyle: person.humor_style,
      emotionalTone: person.emotional_tone,
      verbosity: person.verbosity,
      values: person.values || [],
      topics: person.topics || [],
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

  async updatePerson(personId: string, personData: Omit<Person, 'id' | 'createdAt' | 'updatedAt'>): Promise<Person> {
    const { data: user, error: authError } = await supabase.auth.getUser();
    if (authError || !user.user) {
      console.error('Auth error:', authError);
      throw new Error('Usuário não autenticado. Faça login novamente.');
    }

    // Update the person and return the updated data in one query
    const { data: updatedPerson, error: personError } = await supabase
      .from('people')
      .update({
        name: personData.name,
        relationship: personData.relationship,
        how_they_called_you: personData.howTheyCalledYou,
        birth_year: personData.birthYear,
        birth_date: personData.birthDate,
        avatar: personData.avatar,
        personality: personData.personality,
        common_phrases: personData.commonPhrases,
        temperature: personData.temperature,
        talking_style: personData.talkingStyle,
        humor_style: personData.humorStyle,
        emotional_tone: personData.emotionalTone,
        verbosity: personData.verbosity,
        values: personData.values,
        topics: personData.topics,
        voice_settings: personData.voiceSettings,
        last_conversation: personData.lastConversation?.toISOString(),
        updated_at: new Date().toISOString()
      })
      .eq('id', personId)
      .select(`
        *,
        memories (*)
      `)
      .single();

    if (personError) throw personError;

    // Transform the data to match our Person type
    return {
      id: updatedPerson.id,
      name: updatedPerson.name,
      relationship: updatedPerson.relationship,
      howTheyCalledYou: updatedPerson.how_they_called_you,
      birthYear: updatedPerson.birth_year,
      birthDate: updatedPerson.birth_date,
      avatar: updatedPerson.avatar,
      memories: updatedPerson.memories || [],
      personality: updatedPerson.personality || [],
      commonPhrases: updatedPerson.common_phrases || [],
      temperature: updatedPerson.temperature || 0.7,
      talkingStyle: updatedPerson.talking_style,
      humorStyle: updatedPerson.humor_style,
      emotionalTone: updatedPerson.emotional_tone,
      verbosity: updatedPerson.verbosity,
      values: updatedPerson.values || [],
      topics: updatedPerson.topics || [],
      voiceSettings: (updatedPerson.voice_settings as unknown as VoiceSettings) || { hasRecording: false },
      createdAt: new Date(updatedPerson.created_at),
      updatedAt: new Date(updatedPerson.updated_at),
      lastConversation: updatedPerson.last_conversation ? new Date(updatedPerson.last_conversation) : undefined
    };
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
  },

  async deletePerson(personId: string): Promise<void> {
    try {
      const { data: user, error: authError } = await supabase.auth.getUser();
      if (authError || !user.user) {
        console.error('Auth error:', authError);
        throw new Error('Usuário não autenticado. Faça login novamente.');
      }

      // Delete associated dynamic memories first
      const { error: dynamicMemoriesError } = await supabase
        .from('dynamic_memories')
        .delete()
        .eq('person_id', personId);

      if (dynamicMemoriesError) {
        console.error('Error deleting dynamic memories:', dynamicMemoriesError);
        // Continue even if this fails
      }

      // Delete associated conversation analytics
      const { error: analyticsError } = await supabase
        .from('conversation_analytics')
        .delete()
        .eq('person_id', personId);

      if (analyticsError) {
        console.error('Error deleting analytics:', analyticsError);
        // Continue even if this fails
      }

      // Delete associated personality evolution
      const { error: evolutionError } = await supabase
        .from('personality_evolution')
        .delete()
        .eq('person_id', personId);

      if (evolutionError) {
        console.error('Error deleting evolution:', evolutionError);
        // Continue even if this fails
      }

      // Delete associated memories
      const { error: memoriesError } = await supabase
        .from('memories')
        .delete()
        .eq('person_id', personId);

      if (memoriesError) {
        console.error('Error deleting memories:', memoriesError);
        throw new Error(`Erro ao deletar memórias: ${memoriesError.message}`);
      }

      // Finally delete the person
      const { error: personError } = await supabase
        .from('people')
        .delete()
        .eq('id', personId)
        .eq('user_id', user.user.id);

      if (personError) {
        console.error('Error deleting person:', personError);
        throw new Error(`Erro ao deletar pessoa: ${personError.message}`);
      }

      console.log('Person deleted successfully:', personId);
    } catch (error) {
      console.error('Error in deletePerson:', error);
      throw error;
    }
  }
};