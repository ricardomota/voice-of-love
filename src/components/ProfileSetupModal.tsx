import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { ProfileImageUpload } from './ProfileImageUpload';
import { useProfile } from '@/hooks/useProfile';
import { useLanguage } from '@/hooks/useLanguage';

interface ProfileSetupModalProps {
  isOpen: boolean;
  onComplete: () => void;
}

const getContent = (language: string) => {
  const content = {
    en: {
      title: "Complete Your Profile",
      description: "Add your profile information to get started with Eterna.",
      displayName: "Display Name",
      optional: "(Optional)",
      skip: "Skip for now",
      complete: "Complete Setup",
      displayNamePlaceholder: "How should we call you?"
    },
    'pt-BR': {
      title: "Complete Seu Perfil",
      description: "Adicione suas informações de perfil para começar com o Eterna.",
      displayName: "Nome de Exibição",
      optional: "(Opcional)",
      skip: "Pular por agora",
      complete: "Concluir Configuração",
      displayNamePlaceholder: "Como devemos te chamar?"
    },
    es: {
      title: "Completa Tu Perfil",
      description: "Agrega tu información de perfil para empezar con Eterna.",
      displayName: "Nombre para Mostrar",
      optional: "(Opcional)",
      skip: "Omitir por ahora",
      complete: "Completar Configuración",
      displayNamePlaceholder: "¿Cómo deberíamos llamarte?"
    }
  };

  return content[language as keyof typeof content] || content.en;
};

export const ProfileSetupModal: React.FC<ProfileSetupModalProps> = ({
  isOpen,
  onComplete
}) => {
  const { updateProfile, loading } = useProfile();
  const { currentLanguage } = useLanguage();
  const content = getContent(currentLanguage);

  const [formData, setFormData] = useState({
    display_name: '',
    avatar_url: null as string | null
  });

  const handleComplete = async () => {
    if (formData.display_name || formData.avatar_url) {
      await updateProfile({
        display_name: formData.display_name || null,
        avatar_url: formData.avatar_url
      });
    }
    onComplete();
  };

  const handleSkip = () => {
    onComplete();
  };

  return (
    <Dialog open={isOpen} onOpenChange={() => {}}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold text-center">
            {content.title}
          </DialogTitle>
          <DialogDescription className="text-center">
            {content.description}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Profile Image */}
          <div className="flex justify-center">
            <ProfileImageUpload
              currentImage={formData.avatar_url}
              onImageChange={(url) => setFormData(prev => ({ ...prev, avatar_url: url }))}
              size="lg"
            />
          </div>

          {/* Display Name */}
          <div className="space-y-2">
            <Label htmlFor="display_name">
              {content.displayName} <span className="text-muted-foreground text-sm">{content.optional}</span>
            </Label>
            <Input
              id="display_name"
              type="text"
              value={formData.display_name}
              onChange={(e) => setFormData(prev => ({ ...prev, display_name: e.target.value }))}
              placeholder={content.displayNamePlaceholder}
              disabled={loading}
            />
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={handleSkip}
              disabled={loading}
              className="flex-1"
            >
              {content.skip}
            </Button>
            <Button
              type="button"
              onClick={handleComplete}
              disabled={loading}
              className="flex-1"
            >
              {content.complete}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};