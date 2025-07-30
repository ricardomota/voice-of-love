export const validateFile = (file: File, options: {
  maxSize?: number;
  allowedTypes?: string[];
  isImage?: boolean;
}) => {
  const { maxSize = 50 * 1024 * 1024, allowedTypes, isImage } = options;

  // Check file size
  if (file.size > maxSize) {
    throw new Error(`Arquivo muito grande. Tamanho máximo: ${Math.round(maxSize / (1024 * 1024))}MB`);
  }

  // Check file type for images
  if (isImage && !file.type.startsWith('image/')) {
    throw new Error('Por favor, selecione apenas arquivos de imagem');
  }

  // Check allowed types
  if (allowedTypes && !allowedTypes.includes(file.type)) {
    throw new Error('Tipo de arquivo não permitido');
  }

  return true;
};

export const getMediaType = (file: File): 'image' | 'video' | 'audio' | undefined => {
  if (file.type.startsWith('image/')) return 'image';
  if (file.type.startsWith('video/')) return 'video';
  if (file.type.startsWith('audio/')) return 'audio';
  return undefined;
};