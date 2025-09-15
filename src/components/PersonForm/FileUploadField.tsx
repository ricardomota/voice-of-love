import React from 'react';
import { Button } from '@/components/ui/button';
import { Upload, FileText, Image, Video, Music } from 'lucide-react';

interface FileUploadFieldProps {
  onUpload: (file: File) => void;
  isUploading: boolean;
  accept?: string;
  mediaType?: string;
  fileName?: string;
  children?: React.ReactNode;
}

export const FileUploadField: React.FC<FileUploadFieldProps> = ({
  onUpload,
  isUploading,
  accept = "*/*",
  mediaType,
  fileName,
  children
}) => {
  const inputId = `file-upload-${Math.random().toString(36).substr(2, 9)}`;

  const getMediaIcon = () => {
    switch (mediaType) {
      case 'image': return <Image className="w-4 h-4" />;
      case 'video': return <Video className="w-4 h-4" />;
      case 'audio': return <Music className="w-4 h-4" />;
      case 'text': return <FileText className="w-4 h-4" />;
      default: return <FileText className="w-4 h-4" />;
    }
  };

  return (
    <div className="space-y-2">
      <input
        type="file"
        accept={accept}
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) onUpload(file);
        }}
        className="hidden"
        id={inputId}
      />
      
      <Button 
        variant="outline" 
        size="sm" 
        className="w-full"
        onClick={() => document.getElementById(inputId)?.click()}
        disabled={isUploading}
      >
        <Upload className="w-4 h-4 mr-2" />
        {isUploading ? 'Enviando...' : 'Adicionar arquivo'}
      </Button>

      {fileName && (
        <div className="flex items-center gap-2 text-sm text-muted-foreground bg-muted/50 rounded-md p-2">
          {getMediaIcon()}
          <span className="truncate">{fileName}</span>
        </div>
      )}

      {children}
    </div>
  );
};