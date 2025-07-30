import { supabase } from "@/integrations/supabase/client";
import { Memory } from "@/types/person";

class MemoriesService {
  private async uploadMedia(blob: Blob, personId: string, fileName?: string): Promise<string> {
    const timestamp = Date.now();
    const extension = fileName?.split('.').pop() || 'bin';
    const fileNameToUse = `memory-${personId}-${timestamp}.${extension}`;
    
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from('media')
      .upload(fileNameToUse, blob, {
        contentType: blob.type,
        upsert: false
      });

    if (uploadError) {
      console.error('Upload error:', uploadError);
      throw new Error('Erro ao fazer upload do arquivo');
    }

    const { data: { publicUrl } } = supabase.storage
      .from('media')
      .getPublicUrl(fileNameToUse);
    
    return publicUrl;
  }

  async createMemory(personId: string, memory: Omit<Memory, 'id'>): Promise<Memory> {
    let mediaUrl = memory.mediaUrl;
    
    // Handle blob URL upload
    if (mediaUrl?.startsWith('blob:')) {
      try {
        const response = await fetch(mediaUrl);
        const blob = await response.blob();
        mediaUrl = await this.uploadMedia(blob, personId, memory.fileName);
      } catch (error) {
        console.error('Error uploading file:', error);
        throw new Error('Erro ao fazer upload do arquivo');
      }
    }

    const { data, error } = await supabase
      .from('memories')
      .insert({
        person_id: personId,
        text: memory.text,
        media_url: mediaUrl,
        media_type: memory.mediaType,
        file_name: memory.fileName
      })
      .select()
      .single();

    if (error) {
      console.error('Database error:', error);
      throw new Error('Erro ao salvar memória no banco de dados');
    }

    return this.mapDatabaseMemory(data);
  }

  async getMemoriesForPerson(personId: string): Promise<Memory[]> {
    const { data, error } = await supabase
      .from('memories')
      .select('*')
      .eq('person_id', personId)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching memories:', error);
      throw new Error('Erro ao carregar memórias');
    }

    return data.map(this.mapDatabaseMemory);
  }

  async deleteMemory(memoryId: string): Promise<void> {
    const { error } = await supabase
      .from('memories')
      .delete()
      .eq('id', memoryId);

    if (error) {
      console.error('Error deleting memory:', error);
      throw new Error('Erro ao deletar memória');
    }
  }

  async updateMemory(memoryId: string, updates: Partial<Omit<Memory, 'id'>>): Promise<Memory> {
    const { data, error } = await supabase
      .from('memories')
      .update({
        text: updates.text,
        media_url: updates.mediaUrl,
        media_type: updates.mediaType,
        file_name: updates.fileName
      })
      .eq('id', memoryId)
      .select()
      .single();

    if (error) {
      console.error('Error updating memory:', error);
      throw new Error('Erro ao atualizar memória');
    }

    return this.mapDatabaseMemory(data);
  }

  private mapDatabaseMemory(data: any): Memory {
    return {
      id: data.id,
      text: data.text,
      mediaUrl: data.media_url,
      mediaType: data.media_type as 'image' | 'video' | 'audio',
      fileName: data.file_name
    };
  }
}

export const memoriesService = new MemoriesService();