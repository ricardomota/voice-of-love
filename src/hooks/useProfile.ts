import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';
import { useToast } from './use-toast';

export interface UserProfile {
  id: string;
  user_id: string;
  display_name: string | null;
  avatar_url: string | null;
  bio: string | null;
  created_at: string;
  updated_at: string;
}

export function useProfile() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(false);

  // Fetch user profile
  const fetchProfile = async () => {
    if (!user?.id) return;
    
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('user_id', user.id)
        .maybeSingle(); // Use maybeSingle instead of single to handle 0 rows

      if (error) {
        throw error;
      }

      // If no profile exists, create one
      if (!data) {
        console.log('No profile found, creating one for user:', user.id);
        const { data: newProfile, error: createError } = await supabase
          .from('profiles')
          .insert({
            user_id: user.id,
            display_name: user.email?.split('@')[0] || null
          })
          .select()
          .single();

        if (createError) {
          console.error('Error creating profile:', createError);
          // Set empty profile if creation fails
          setProfile(null);
        } else {
          setProfile(newProfile);
        }
      } else {
        setProfile(data);
      }
    } catch (error) {
      console.error('Error fetching profile:', error);
      // Don't show toast for missing profile, just log it
      setProfile(null);
    } finally {
      setLoading(false);
    }
  };

  // Update profile
  const updateProfile = async (updates: Partial<UserProfile>) => {
    if (!user?.id) return false;

    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('profiles')
        .upsert({
          user_id: user.id,
          ...updates,
          updated_at: new Date().toISOString()
        })
        .select()
        .single();

      if (error) throw error;

      setProfile(data);
      toast({
        title: "Perfil atualizado",
        description: "Suas informações foram salvas com sucesso."
      });
      return true;
    } catch (error) {
      console.error('Error updating profile:', error);
      toast({
        title: "Erro ao atualizar perfil",
        description: "Não foi possível salvar as alterações.",
        variant: "destructive"
      });
      return false;
    } finally {
      setLoading(false);
    }
  };

  // Upload avatar
  const uploadAvatar = async (file: File) => {
    if (!user?.id) return null;

    try {
      setLoading(true);
      const fileExt = file.name.split('.').pop();
      const fileName = `avatars/${user.id}/${Date.now()}.${fileExt}`;

      // Upload file to storage
      const { error: uploadError } = await supabase.storage
        .from('media')
        .upload(fileName, file, { upsert: true });

      if (uploadError) throw uploadError;

      // Get public URL
      const { data: urlData } = supabase.storage
        .from('media')
        .getPublicUrl(fileName);

      const avatarUrl = urlData.publicUrl;

      // Update profile with new avatar URL
      await updateProfile({ avatar_url: avatarUrl });

      return avatarUrl;
    } catch (error) {
      console.error('Error uploading avatar:', error);
      toast({
        title: "Erro ao fazer upload",
        description: "Não foi possível enviar a imagem.",
        variant: "destructive"
      });
      return null;
    } finally {
      setLoading(false);
    }
  };

  // Delete avatar
  const deleteAvatar = async () => {
    if (!user?.id || !profile?.avatar_url) return false;

    try {
      setLoading(true);
      
      // Extract file path from URL
      const url = new URL(profile.avatar_url);
      const filePath = url.pathname.split('/storage/v1/object/public/media/')[1];
      
      if (filePath) {
        // Delete file from storage
        const { error: deleteError } = await supabase.storage
          .from('media')
          .remove([filePath]);

        if (deleteError) throw deleteError;
      }

      // Update profile to remove avatar URL
      await updateProfile({ avatar_url: null });
      return true;
    } catch (error) {
      console.error('Error deleting avatar:', error);
      toast({
        title: "Erro ao deletar imagem",
        description: "Não foi possível remover a imagem do perfil.",
        variant: "destructive"
      });
      return false;
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user?.id) {
      fetchProfile();
    }
  }, [user?.id]);

  return {
    profile,
    loading,
    updateProfile,
    uploadAvatar,
    deleteAvatar,
    refetch: fetchProfile
  };
}