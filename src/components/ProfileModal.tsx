import React, { useState, useEffect } from 'react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { ProfileImageUpload } from './ProfileImageUpload';
import { useProfile } from '@/hooks/useProfile';
import { useLanguage } from '@/hooks/useLanguage';

interface ProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const getContent = (language: string) => {
  const content = {
    en: {
      title: "Edit Profile",
      displayName: "Display Name",
      bio: "Bio",
      save: "Save Changes",
      cancel: "Cancel",
      bioPlaceholder: "Tell us a bit about yourself..."
    },
    'pt-BR': {
      title: "Editar Perfil",
      displayName: "Nome de Exibição",
      bio: "Biografia",
      save: "Salvar Alterações",
      cancel: "Cancelar",
      bioPlaceholder: "Conte-nos um pouco sobre você..."
    },
    es: {
      title: "Editar Perfil",
      displayName: "Nombre para Mostrar",
      bio: "Biografía", 
      save: "Guardar Cambios",
      cancel: "Cancelar",
      bioPlaceholder: "Cuéntanos un poco sobre ti..."
    }
  };

  return content[language as keyof typeof content] || content.en;
};

export const ProfileModal: React.FC<ProfileModalProps> = ({
  isOpen,
  onClose
}) => {
  const { profile, updateProfile, loading } = useProfile();
  const { currentLanguage } = useLanguage();
  const content = getContent(currentLanguage);

  const [formData, setFormData] = useState({
    display_name: '',
    bio: '',
    avatar_url: null as string | null
  });

  useEffect(() => {
    if (profile && isOpen) {
      setFormData({
        display_name: profile.display_name || '',
        bio: profile.bio || '',
        avatar_url: profile.avatar_url || null
      });
    }
  }, [profile, isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const success = await updateProfile({
      display_name: formData.display_name || null,
      bio: formData.bio || null,
      avatar_url: formData.avatar_url
    });

    if (success) {
      onClose();
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold">
            {content.title}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Profile Image */}
          <div className="flex justify-center">
            <ProfileImageUpload
              currentImage={formData.avatar_url}
              onImageChange={(url) => handleInputChange('avatar_url', url || '')}
              size="lg"
            />
          </div>

          {/* Display Name */}
          <div className="space-y-2">
            <Label htmlFor="display_name">{content.displayName}</Label>
            <Input
              id="display_name"
              type="text"
              value={formData.display_name}
              onChange={(e) => handleInputChange('display_name', e.target.value)}
              placeholder={content.displayName}
              disabled={loading}
            />
          </div>

          {/* Bio */}
          <div className="space-y-2">
            <Label htmlFor="bio">{content.bio}</Label>
            <Textarea
              id="bio"
              value={formData.bio}
              onChange={(e) => handleInputChange('bio', e.target.value)}
              placeholder={content.bioPlaceholder}
              disabled={loading}
              rows={3}
            />
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={loading}
              className="flex-1"
            >
              {content.cancel}
            </Button>
            <Button
              type="submit"
              disabled={loading}
              className="flex-1"
            >
              {content.save}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};