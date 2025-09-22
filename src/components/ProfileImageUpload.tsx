import React, { useRef, useState, useEffect } from 'react';
import { Upload as UploadIcon, Close, UserAvatar } from '@carbon/icons-react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { useProfile } from '@/hooks/useProfile';
import { cn } from '@/lib/utils';

interface ProfileImageUploadProps {
  currentImage?: string | null;
  onImageChange?: (imageUrl: string | null) => void;
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

export const ProfileImageUpload: React.FC<ProfileImageUploadProps> = ({
  currentImage,
  onImageChange,
  className,
  size = 'md'
}) => {
  const { uploadAvatar, deleteAvatar, loading } = useProfile();
  const [previewImage, setPreviewImage] = useState<string | null>(currentImage || null);
  useEffect(() => {
    setPreviewImage(currentImage || null);
  }, [currentImage]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const sizeClasses = {
    sm: 'w-16 h-16',
    md: 'w-24 h-24', 
    lg: 'w-32 h-32'
  };

  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      alert('Por favor, selecione apenas arquivos de imagem.');
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      alert('A imagem deve ter no máximo 5MB.');
      return;
    }

    // Create preview
    const reader = new FileReader();
    reader.onload = () => {
      setPreviewImage(reader.result as string);
    };
    reader.readAsDataURL(file);

    // Upload to Supabase
    const uploadedUrl = await uploadAvatar(file);
    if (uploadedUrl) {
      setPreviewImage(uploadedUrl);
      onImageChange?.(uploadedUrl);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const handleRemoveImage = async () => {
    const success = await deleteAvatar();
    if (success) {
      setPreviewImage(null);
      onImageChange?.(null);
    }
  };

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className={cn("flex flex-col items-center gap-4", className)}>
      <div className="relative">
        <Avatar className={cn(sizeClasses[size], "border-2 border-border")}>
          <AvatarImage src={previewImage || undefined} />
          <AvatarFallback className="bg-muted">
            <UserAvatar size={24} className="text-muted-foreground" />
          </AvatarFallback>
        </Avatar>

        {previewImage && (
          <Button
            type="button"
            variant="destructive"
            size="sm"
            className="absolute -top-2 -right-2 h-6 w-6 rounded-full p-0"
            onClick={handleRemoveImage}
            disabled={loading}
          >
            <Close size={12} />
          </Button>
        )}
      </div>

      <div className="flex gap-2">
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={handleUploadClick}
          disabled={loading}
          className="text-xs"
        >
          <UploadIcon size={16} className="mr-2" />
          {previewImage ? 'Alterar' : 'Adicionar'}
        </Button>
      </div>

      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileSelect}
        className="hidden"
      />

      <p className="text-xs text-muted-foreground text-center">
        JPG, PNG ou GIF (máx. 5MB)
      </p>
    </div>
  );
};