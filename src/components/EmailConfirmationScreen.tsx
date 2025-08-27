import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Mail, CheckCircle, Clock, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useAuth } from '@/hooks/useAuth';
import { useLanguage } from '@/hooks/useLanguage';
import { useToast } from '@/hooks/use-toast';

interface EmailConfirmationScreenProps {
  email: string;
  selectedPlan?: string;
  onConfirmed: () => void;
}

const getContent = (language: string) => {
  const content = {
    en: {
      confirmYourEmail: 'Confirm your email',
      accountCreated: 'Your account has been created — please confirm your email to continue.',
      checkInbox: 'Check your inbox',
      sentConfirmation: `We've sent a confirmation link to your email.`,
      clickLink: 'Click the link in the email to verify your account.',
      noEmail: "Didn't receive the email?",
      checkSpam: 'Check your spam folder or',
      resendEmail: 'Resend confirmation email',
      resending: 'Resending...',
      emailResent: 'Confirmation email sent!',
      errorResending: 'Error sending email. Please try again.',
      backToLogin: 'Back to Login',
      selectedPlan: 'Selected Plan',
      afterConfirmation: 'After confirming your email, you can log in and complete your subscription.',
      confirmationInstructions: 'Please check your email and click the confirmation link to activate your account.'
    },
    'pt-BR': {
      confirmYourEmail: 'Confirme seu email',
      accountCreated: 'Sua conta foi criada — por favor confirme seu email para continuar.',
      checkInbox: 'Verifique sua caixa de entrada',
      sentConfirmation: 'Enviamos um link de confirmação para seu email.',
      clickLink: 'Clique no link do email para verificar sua conta.',
      noEmail: 'Não recebeu o email?',
      checkSpam: 'Verifique sua pasta de spam ou',
      resendEmail: 'Reenviar email de confirmação',
      resending: 'Reenviando...',
      emailResent: 'Email de confirmação enviado!',
      errorResending: 'Erro ao enviar email. Tente novamente.',
      backToLogin: 'Voltar ao Login',
      selectedPlan: 'Plano Selecionado',
      afterConfirmation: 'Após confirmar seu email, você pode fazer login e completar sua assinatura.',
      confirmationInstructions: 'Por favor verifique seu email e clique no link de confirmação para ativar sua conta.'
    },
    es: {
      confirmYourEmail: 'Confirma tu email',
      accountCreated: 'Tu cuenta ha sido creada — por favor confirma tu email para continuar.',
      checkInbox: 'Revisa tu bandeja de entrada',
      sentConfirmation: 'Hemos enviado un enlace de confirmación a tu email.',
      clickLink: 'Haz clic en el enlace del email para verificar tu cuenta.',
      noEmail: '¿No recibiste el email?',
      checkSpam: 'Revisa tu carpeta de spam o',
      resendEmail: 'Reenviar email de confirmación',
      resending: 'Reenviando...',
      emailResent: '¡Email de confirmación enviado!',
      errorResending: 'Error al enviar email. Inténtalo de nuevo.',
      backToLogin: 'Volver al Login',
      selectedPlan: 'Plan Seleccionado',
      afterConfirmation: 'Después de confirmar tu email, puedes iniciar sesión y completar tu suscripción.',
      confirmationInstructions: 'Por favor revisa tu email y haz clic en el enlace de confirmación para activar tu cuenta.'
    }
  };

  return content[language as keyof typeof content] || content.en;
};

export const EmailConfirmationScreen: React.FC<EmailConfirmationScreenProps> = ({
  email,
  selectedPlan,
  onConfirmed
}) => {
  const { currentLanguage } = useLanguage();
  const content = getContent(currentLanguage);
  const { signUp } = useAuth();
  const { toast } = useToast();
  const [isResending, setIsResending] = useState(false);

  const handleResendEmail = async () => {
    setIsResending(true);
    try {
      // We need to trigger a new signup to resend confirmation email
      const result = await signUp(email, 'temp_password', currentLanguage);
      if (!result.error) {
        toast({
          title: content.emailResent,
          description: content.sentConfirmation,
          variant: 'default'
        });
      } else {
        throw new Error(result.error.message);
      }
    } catch (error) {
      console.error('Error resending email:', error);
      toast({
        title: content.errorResending,
        description: content.errorResending,
        variant: 'destructive'
      });
    } finally {
      setIsResending(false);
    }
  };

  const planNames = {
    essential: {
      en: 'Essential Plan',
      'pt-BR': 'Plano Essencial',
      es: 'Plan Esencial'
    },
    complete: {
      en: 'Complete Plan',
      'pt-BR': 'Plano Completo',
      es: 'Plan Completo'
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Card className="shadow-lg border-0 bg-card/50 backdrop-blur-sm">
            <CardHeader className="text-center pb-4">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-br from-primary to-primary/70 text-primary-foreground flex items-center justify-center">
                <Mail className="w-8 h-8" />
              </div>
              <CardTitle className="text-xl">
                {content.confirmYourEmail}
              </CardTitle>
            </CardHeader>
            
            <CardContent className="space-y-6">
              {/* Success message */}
              <Alert className="border-green-200 bg-green-50/50">
                <CheckCircle className="h-4 w-4 text-green-600" />
                <AlertDescription className="text-green-800">
                  {content.accountCreated}
                </AlertDescription>
              </Alert>

              {/* Selected plan info */}
              {selectedPlan && (
                <div className="bg-muted/50 rounded-lg p-4">
                  <h4 className="font-medium text-sm text-muted-foreground mb-1">
                    {content.selectedPlan}
                  </h4>
                  <p className="font-semibold">
                    {planNames[selectedPlan as keyof typeof planNames]?.[currentLanguage as keyof typeof planNames.essential] || selectedPlan}
                  </p>
                  <p className="text-sm text-muted-foreground mt-2">
                    {content.afterConfirmation}
                  </p>
                </div>
              )}

              {/* Instructions */}
              <div className="space-y-4">
                <div>
                  <h3 className="font-medium mb-2 flex items-center gap-2">
                    <Clock className="w-4 h-4" />
                    {content.checkInbox}
                  </h3>
                  <p className="text-sm text-muted-foreground mb-2">
                    {content.sentConfirmation}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {content.clickLink}
                  </p>
                </div>

                <div className="text-center">
                  <p className="text-sm text-muted-foreground mb-1">
                    <strong>{email}</strong>
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {content.confirmationInstructions}
                  </p>
                </div>
              </div>

              {/* Resend email */}
              <div className="space-y-3">
                <p className="text-sm text-muted-foreground text-center">
                  {content.noEmail} {content.checkSpam}
                </p>
                
                <Button
                  variant="outline"
                  onClick={handleResendEmail}
                  disabled={isResending}
                  className="w-full"
                >
                  {isResending ? (
                    <div className="flex items-center gap-2">
                      <RefreshCw className="w-4 h-4 animate-spin" />
                      {content.resending}
                    </div>
                  ) : (
                    <>
                      <RefreshCw className="w-4 h-4 mr-2" />
                      {content.resendEmail}
                    </>
                  )}
                </Button>
              </div>

              {/* Back to login */}
              <Button
                variant="ghost"
                onClick={onConfirmed}
                className="w-full"
              >
                {content.backToLogin}
              </Button>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
};