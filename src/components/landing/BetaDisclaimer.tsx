import React from 'react';
import { AlertTriangle } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useLanguage } from '@/hooks/useLanguage';

export const BetaDisclaimer: React.FC = () => {
  const { currentLanguage } = useLanguage();
  
  const content = {
    en: {
      title: "Beta Development Notice",
      description: "Eterna is currently in beta development. All features are free during testing. Payments will only be activated after we complete development and exit beta."
    },
    'pt-BR': {
      title: "Aviso de Desenvolvimento Beta",
      description: "Eterna está atualmente em desenvolvimento beta. Todos os recursos são gratuitos durante os testes. Pagamentos só serão ativados após completarmos o desenvolvimento e sairmos do beta."
    }
  };

  const text = content[currentLanguage as keyof typeof content] || content.en;

  return (
    <Alert className="bg-amber-50 border-amber-200 dark:bg-amber-950/20 dark:border-amber-800 mb-8">
      <AlertTriangle className="h-4 w-4 text-amber-600 dark:text-amber-400" />
      <AlertDescription className="text-amber-800 dark:text-amber-200 font-medium text-center">
        <strong>{text.title}:</strong> {text.description}
      </AlertDescription>
    </Alert>
  );
};