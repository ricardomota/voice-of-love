import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertTriangle } from 'lucide-react';

export const OpenAIConfigPrompt = () => {
  return (
    <Alert className="mb-4">
      <AlertTriangle className="h-4 w-4" />
      <AlertDescription>
        Para usar o speech-to-text, configure sua chave da API OpenAI no Supabase Edge Function Secrets com o nome "OPENAI_API_KEY".
      </AlertDescription>
    </Alert>
  );
};