import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Mail, Phone, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { OTPInput } from '@/components/ui/otp-input';
import { authService } from '@/services/authService';
import { useToast } from '@/hooks/use-toast';

interface OTPVerificationProps {
  type: 'email' | 'phone';
  identifier: string; // email address or phone number
  onVerified: () => void;
  onBack: () => void;
  onResend?: () => void;
}

export const OTPVerification: React.FC<OTPVerificationProps> = ({
  type,
  identifier,
  onVerified,
  onBack,
  onResend
}) => {
  const [otp, setOtp] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [canResend, setCanResend] = useState(false);
  const [countdown, setCountdown] = useState(60);
  const { toast } = useToast();

  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    } else {
      setCanResend(true);
    }
  }, [countdown]);

  const handleVerify = async () => {
    if (otp.length !== 6) return;
    
    setLoading(true);
    setError('');
    
    try {
      const result = await authService.verifyOtp(identifier, otp, type === 'email' ? 'email' : 'sms');
      
      if (result.error) {
        setError('Código inválido. Tente novamente.');
      } else {
        toast({
          title: 'Verificação concluída!',
          description: 'Sua conta foi verificada com sucesso.',
        });
        onVerified();
      }
    } catch (error) {
      console.error('OTP verification error:', error);
      setError('Erro ao verificar código. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    if (!canResend) return;
    
    setLoading(true);
    setError('');
    
    try {
      let result;
      if (type === 'email') {
        result = await authService.sendEmailOtp(identifier);
      } else {
        result = await authService.sendPhoneOtp(identifier);
      }
      
      if (result.error) {
        setError('Erro ao reenviar código. Tente novamente.');
      } else {
        toast({
          title: 'Código reenviado!',
          description: `Um novo código foi enviado para ${identifier}`,
        });
        setCountdown(60);
        setCanResend(false);
        setOtp('');
        if (onResend) onResend();
      }
    } catch (error) {
      console.error('Resend OTP error:', error);
      setError('Erro ao reenviar código. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (otp.length === 6) {
      handleVerify();
    }
  }, [otp]);

  return (
    <div className="min-h-screen bg-background flex flex-col justify-center items-center p-4">
      <div className="w-full max-w-md">
        <motion.div 
          initial={{ opacity: 0, y: 20 }} 
          animate={{ opacity: 1, y: 0 }} 
          transition={{ duration: 0.5 }}
          className="text-center"
        >
          {/* Back button */}
          <div className="flex justify-start mb-8">
            <Button variant="ghost" onClick={onBack} className="flex items-center gap-2">
              <ArrowLeft className="h-4 w-4" />
              Voltar
            </Button>
          </div>

          {/* Icon */}
          <div className="flex justify-center mb-6">
            <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center">
              {type === 'email' ? (
                <Mail className="h-8 w-8 text-primary" />
              ) : (
                <Phone className="h-8 w-8 text-primary" />
              )}
            </div>
          </div>

          {/* Title and Description */}
          <h1 className="text-2xl font-semibold text-foreground mb-2">
            {type === 'email' ? 'Email enviado' : 'SMS enviado'}
          </h1>
          
          <p className="text-muted-foreground mb-2">
            Verifique seu {type === 'email' ? 'email' : 'telefone'} para um código de 6 dígitos e digite abaixo.
          </p>
          
          <p className="text-sm text-muted-foreground mb-8">
            {type === 'email' ? '(Pode estar na pasta de spam)' : ''}
          </p>

          {/* Error Message */}
          {error && (
            <Alert variant="destructive" className="mb-6">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {/* OTP Input */}
          <div className="mb-8">
            <OTPInput
              value={otp}
              onChange={setOtp}
              onComplete={handleVerify}
              disabled={loading}
            />
          </div>

          {/* Submit Button */}
          <Button 
            onClick={handleVerify}
            disabled={otp.length !== 6 || loading}
            className="w-full mb-4"
          >
            {loading ? 'Verificando...' : 'Verificar'}
          </Button>

          {/* Resend Button */}
          <div className="text-center">
            {canResend ? (
              <Button 
                variant="ghost" 
                onClick={handleResend}
                disabled={loading}
                className="text-primary hover:text-primary/80"
              >
                Reenviar código
              </Button>
            ) : (
              <p className="text-sm text-muted-foreground">
                Reenviar código em {countdown}s
              </p>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );
};