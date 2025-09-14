// Enhanced Auth page matching OpenAI design
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Eye, EyeOff, AlertCircle, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { FloatingInput } from '@/components/ui/floating-input';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';
import { useLanguage } from '@/hooks/useLanguage';
import { analyticsIntegrations } from '@/lib/integrations';
import { EternaHeader } from '@/components/layout/EternaHeader';
import { EmailConfirmationScreen } from '@/components/EmailConfirmationScreen';
import { PlanSelectionModal } from '@/components/PlanSelectionModal';
import { authService } from '@/services/authService';

type AuthMode = 'signin' | 'signup' | 'email_confirmation';

interface AuthProps {
  language?: string;
  initialPlan?: string;
}

export const Auth: React.FC<AuthProps> = ({
  language = 'pt',
  initialPlan
}) => {
  const {
    signIn,
    signUp,
    user
  } = useAuth();
  const {
    toast
  } = useToast();
  const {
    currentLanguage
  } = useLanguage();

  // Translations
  const translations = {
    'pt-BR': {
      welcomeBack: 'Bem-vindo de volta',
      createAccount: 'Crie sua conta',
      signInToAccess: 'Entre para acessar sua Carteira de Memórias',
      startPreserving: 'Comece a preservar suas memórias preciosas',
      signIn: 'Entrar',
      signUp: 'Cadastrar',
      emailAddress: 'Endereço de email',
      enterEmail: 'Digite seu email',
      password: 'Senha',
      enterPassword: 'Digite sua senha',
      confirmPassword: 'Confirmar senha',
      confirmPasswordPlaceholder: 'Confirme sua senha',
      passwordStrength: 'Força da senha',
      tooShort: 'Muito curta',
      fair: 'Razoável',
      good: 'Boa',
      signingIn: 'Entrando...',
      creatingAccount: 'Criando conta...',
      createAccountBtn: 'Criar Conta',
      dontHaveAccount: "Não tem uma conta?",
      alreadyHaveAccount: "Já tem uma conta?",
      createNewAccount: 'Criar uma nova conta',
      signInExisting: 'Entrar na conta existente',
      byContinuing: 'Ao continuar, você concorda com nossos',
      termsOfService: 'Termos de Serviço',
      and: 'e',
      privacyPolicy: 'Política de Privacidade',
      backToHome: '← Voltar para Home',
      // Error messages
      enterEmailAddress: 'Por favor, digite seu endereço de email',
      enterValidEmail: 'Por favor, digite um endereço de email válido',
      enterPasswordField: 'Por favor, digite sua senha',
      passwordMinLength: 'A senha deve ter pelo menos 6 caracteres',
      passwordsNoMatch: 'As senhas não coincidem',
      invalidCredentials: 'Email ou senha inválidos. Verifique suas credenciais e tente novamente.',
      userAlreadyRegistered: 'Uma conta com este email já existe. Tente entrar.',
      emailNotConfirmed: 'Verifique seu email e clique no link de confirmação antes de entrar.',
      errorOccurred: 'Ocorreu um erro. Tente novamente.',
      unexpectedError: 'Ocorreu um erro inesperado. Tente novamente.',
      // Success messages
      accountCreated: 'Conta criada! Verifique seu email para confirmar sua conta.',
      welcomeBackToast: 'Bem-vindo de volta!',
      signedInSuccessfully: 'Você entrou com sucesso.',
      // Quick signup
      orContinueWith: 'Ou continuar com',
      continueWithGoogle: 'Continuar com Google',
      continueWithApple: 'Continuar com Apple',
      continueWithPhone: 'Continuar com Telefone',
      phoneNumber: 'Número de telefone',
      enterPhone: 'Digite seu número de telefone',
      sendCode: 'Enviar código',
      code: 'Código',
      enterCode: 'Digite o código',
      verifyCode: 'Verificar código',
      codeSent: 'Código de verificação enviado!',
      invalidCode: 'Código inválido. Tente novamente.',
      resendConfirmationEmail: 'Reenviar email de confirmação'
    },
    'en': {
      welcomeBack: 'Welcome back',
      createAccount: 'Create your account',
      signInToAccess: 'Sign in to access your Memory Wallet',
      startPreserving: 'Start preserving your precious memories',
      signIn: 'Sign In',
      signUp: 'Sign Up',
      emailAddress: 'Email address',
      enterEmail: 'Enter your email',
      password: 'Password',
      enterPassword: 'Enter your password',
      confirmPassword: 'Confirm password',
      confirmPasswordPlaceholder: 'Confirm your password',
      passwordStrength: 'Password strength',
      tooShort: 'Too short',
      fair: 'Fair',
      good: 'Good',
      signingIn: 'Signing in...',
      creatingAccount: 'Creating account...',
      createAccountBtn: 'Create Account',
      dontHaveAccount: "Don't have an account?",
      alreadyHaveAccount: "Already have an account?",
      createNewAccount: 'Create a new account',
      signInExisting: 'Sign in to existing account',
      byContinuing: 'By continuing, you agree to our',
      termsOfService: 'Terms of Service',
      and: 'and',
      privacyPolicy: 'Privacy Policy',
      backToHome: '← Back to Home',
      // Error messages
      enterEmailAddress: 'Please enter your email address',
      enterValidEmail: 'Please enter a valid email address',
      enterPasswordField: 'Please enter your password',
      passwordMinLength: 'Password must be at least 6 characters',
      passwordsNoMatch: 'Passwords do not match',
      invalidCredentials: 'Invalid email or password. Please check your credentials and try again.',
      userAlreadyRegistered: 'An account with this email already exists. Try signing in instead.',
      emailNotConfirmed: 'Please check your email and click the confirmation link before signing in.',
      errorOccurred: 'An error occurred. Please try again.',
      unexpectedError: 'An unexpected error occurred. Please try again.',
      // Success messages
      accountCreated: 'Account created! Please check your email to verify your account.',
      welcomeBackToast: 'Welcome back!',
      signedInSuccessfully: 'You have been signed in successfully.',
      // Quick signup
      orContinueWith: 'Or continue with',
      continueWithGoogle: 'Continue with Google',
      continueWithApple: 'Continue with Apple',
      continueWithPhone: 'Continue with Phone',
      phoneNumber: 'Phone number',
      enterPhone: 'Enter your phone number',
      sendCode: 'Send code',
      code: 'Code',
      enterCode: 'Enter the code',
      verifyCode: 'Verify code',
      codeSent: 'Verification code sent!',
      invalidCode: 'Invalid code. Please try again.',
      resendConfirmationEmail: 'Resend confirmation email'
    },
    'es': {
      welcomeBack: 'Bienvenido de nuevo',
      createAccount: 'Crea tu cuenta',
      signInToAccess: 'Inicia sesión para acceder a tu Cartera de Recuerdos',
      startPreserving: 'Comienza a preservar tus recuerdos preciados',
      signIn: 'Iniciar sesión',
      signUp: 'Registrarse',
      emailAddress: 'Correo electrónico',
      enterEmail: 'Ingresa tu correo electrónico',
      password: 'Contraseña',
      enterPassword: 'Ingresa tu contraseña',
      confirmPassword: 'Confirmar contraseña',
      confirmPasswordPlaceholder: 'Confirma tu contraseña',
      passwordStrength: 'Fortaleza de la contraseña',
      tooShort: 'Demasiado corta',
      fair: 'Aceptable',
      good: 'Buena',
      signingIn: 'Iniciando sesión...',
      creatingAccount: 'Creando cuenta...',
      createAccountBtn: 'Crear cuenta',
      dontHaveAccount: '¿No tienes una cuenta?',
      alreadyHaveAccount: '¿Ya tienes una cuenta?',
      createNewAccount: 'Crear una nueva cuenta',
      signInExisting: 'Iniciar sesión en una cuenta existente',
      byContinuing: 'Al continuar, aceptas nuestros',
      termsOfService: 'Términos del Servicio',
      and: 'y',
      privacyPolicy: 'Política de Privacidad',
      backToHome: '← Volver al inicio',
      // Error messages
      enterEmailAddress: 'Por favor, ingresa tu correo electrónico',
      enterValidEmail: 'Por favor, ingresa un correo electrónico válido',
      enterPasswordField: 'Por favor, ingresa tu contraseña',
      passwordMinLength: 'La contraseña debe tener al menos 6 caracteres',
      passwordsNoMatch: 'Las contraseñas no coinciden',
      invalidCredentials: 'Correo o contraseña inválidos. Verifica tus credenciales e inténtalo de nuevo.',
      userAlreadyRegistered: 'Ya existe una cuenta con este correo. Intenta iniciar sesión.',
      emailNotConfirmed: 'Revisa tu correo y haz clic en el enlace de confirmación antes de iniciar sesión.',
      errorOccurred: 'Ocurrió un error. Inténtalo de nuevo.',
      unexpectedError: 'Ocurrió un error inesperado. Inténtalo de nuevo.',
      // Success messages
      accountCreated: '¡Cuenta creada! Revisa tu correo para verificar tu cuenta.',
      welcomeBackToast: '¡Bienvenido de nuevo!',
      signedInSuccessfully: 'Has iniciado sesión correctamente.',
      // Quick signup
      orContinueWith: 'O continúa con',
      continueWithGoogle: 'Continuar con Google',
      continueWithApple: 'Continuar con Apple',
      continueWithPhone: 'Continuar con Teléfono',
      phoneNumber: 'Número de teléfono',
      enterPhone: 'Ingresa tu número de teléfono',
      sendCode: 'Enviar código',
      code: 'Código',
      enterCode: 'Ingresa el código',
      verifyCode: 'Verificar código',
      codeSent: '¡Código de verificación enviado!',
      invalidCode: 'Código inválido. Inténtalo de nuevo.',
      resendConfirmationEmail: 'Reenviar email de confirmación'
    }
  };

  const getText = (key: string) => {
    return translations[currentLanguage as keyof typeof translations]?.[key as keyof typeof translations['en']] || translations['en'][key as keyof typeof translations['en']];
  };

  // State management
  const [mode, setMode] = useState<AuthMode>('signin');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [selectedPlan, setSelectedPlan] = useState<string>(initialPlan || 'free');
  const [showPlanModal, setShowPlanModal] = useState(false);
  const [pendingSignupEmail, setPendingSignupEmail] = useState('');

  // Get redirect and plan from URL params
  const urlParams = new URLSearchParams(window.location.search);
  const redirectTo = urlParams.get('redirect') || '/dashboard';
  const urlPlan = urlParams.get('plan');
  
  // Set initial plan from URL if provided
  useEffect(() => {
    if (urlPlan && !selectedPlan) {
      setSelectedPlan(urlPlan);
    }
  }, [urlPlan]);

  // Redirect if already authenticated
  useEffect(() => {
    if (user) {
      // Check if user has a selected plan and redirect to checkout
      if (selectedPlan && selectedPlan !== 'free') {
        window.location.href = `/payment?plan=${selectedPlan}`;
      } else {
        window.location.href = redirectTo;
      }
    }
  }, [user, redirectTo, selectedPlan]);

  // Form validation
  const validateForm = () => {
    if (!email.trim()) {
      setError(getText('enterEmailAddress'));
      return false;
    }
    if (!email.includes('@')) {
      setError(getText('enterValidEmail'));
      return false;
    }
    if (mode === 'signin' && !password) {
      setError(getText('enterPasswordField'));
      return false;
    }
    if (mode === 'signin' && password.length < 6) {
      setError(getText('passwordMinLength'));
      return false;
    }
    return true;
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    if (!validateForm()) return;
    setLoading(true);
    try {
      let result;
      if (mode === 'signup') {
        result = await signUp(email.trim(), password || 'temp-password', currentLanguage);
        if (!result.error) {
          await analyticsIntegrations.trackEvent('auth_signup_success', {
            email: email.trim(),
            plan: selectedPlan
          });
          setPendingSignupEmail(email.trim());
          setMode('email_confirmation');
        }
      } else {
        result = await signIn(email.trim(), password);
        if (!result.error) {
          await analyticsIntegrations.trackEvent('auth_signin_success', {
            email: email.trim()
          });
          toast({
            title: getText('welcomeBackToast'),
            description: getText('signedInSuccessfully'),
            variant: 'default'
          });

          // Check if user has a selected plan and redirect to checkout
          if (selectedPlan && selectedPlan !== 'free') {
            setTimeout(() => {
              window.location.href = `/payment?plan=${selectedPlan}`;
            }, 1000);
          } else {
            // Redirect will happen automatically via useEffect
          }
        }
      }
      if (result.error) {
        // Handle specific error types
        switch (result.error.message) {
          case 'Invalid login credentials':
            setError(getText('invalidCredentials'));
            break;
          case 'User already registered':
            setError(getText('userAlreadyRegistered'));
            setMode('signin');
            break;
          case 'Email not confirmed':
            setError(getText('emailNotConfirmed'));
            break;
          default:
            setError(result.error.message || getText('errorOccurred'));
        }
      }
    } catch (error) {
      console.error('Auth error:', error);
      setError(getText('unexpectedError'));
    } finally {
      setLoading(false);
    }
  };

  const switchMode = () => {
    setMode(mode === 'signin' ? 'signup' : 'signin');
    setError('');
    setSuccess('');
    setPassword('');
    setConfirmPassword('');
  };

  const handlePlanSelect = (planId: string) => {
    setSelectedPlan(planId);
    setShowPlanModal(false);
    if (mode === 'signin') {
      setMode('signup');
    }
  };

  const handleEmailConfirmed = () => {
    setMode('signin');
    setPendingSignupEmail('');
  };

  // Show email confirmation screen
  if (mode === 'email_confirmation') {
    return (
      <EmailConfirmationScreen
        email={pendingSignupEmail}
        selectedPlan={selectedPlan !== 'free' ? selectedPlan : undefined}
        onConfirmed={handleEmailConfirmed}
      />
    );
  }

  return (
    <>
      {/* Show header if user is logged in */}
      {user && <EternaHeader />}
      
      {/* OpenAI Style Auth Page */}
      <div className="min-h-screen bg-background flex flex-col justify-center items-center p-4">
        {/* Back to Home Button */}
        <div className="w-full max-w-sm mb-8">
          <Button
            variant="ghost"
            onClick={() => window.location.href = '/'}
            className="text-muted-foreground hover:text-foreground transition-colors"
          >
            {getText('backToHome')}
          </Button>
        </div>

        <div className="w-full max-w-sm">
          <motion.div 
            initial={{ opacity: 0, y: 20 }} 
            animate={{ opacity: 1, y: 0 }} 
            transition={{ duration: 0.5 }}
          >
            {/* Title - exactly like OpenAI */}
            <div className="text-center mb-8">
              <h1 className="text-2xl font-semibold text-foreground">
                {mode === 'signin' ? getText('welcomeBack') : getText('createAccount')}
              </h1>
            </div>

            {/* Error/Success Messages */}
            {error && (
              <Alert variant="destructive" className="mb-6">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            {success && (
              <Alert className="mb-6">
                <CheckCircle className="h-4 w-4" />
                <AlertDescription>{success}</AlertDescription>
              </Alert>
            )}

            {/* Main Form - OpenAI Floating Labels */}
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Email Field - OpenAI Style Floating Label */}
              <FloatingInput
                id="email"
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                label="Email address"
                disabled={loading}
                autoComplete="email"
              />

              {/* Password Field - Only show for signin with OpenAI Style Floating Label */}
              {mode === 'signin' && (
                <FloatingInput
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  label="Password"
                  disabled={loading}
                  autoComplete="current-password"
                  className="pr-12"
                >
                  <Button 
                    type="button" 
                    variant="ghost" 
                    size="sm" 
                    className="absolute right-2 top-1/2 -translate-y-1/2 h-10 w-10 hover:bg-muted rounded-full text-muted-foreground hover:text-foreground" 
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </Button>
                </FloatingInput>
              )}

              {/* Continue Button - exactly like OpenAI */}
              <Button 
                type="submit" 
                className="w-full h-12 text-base font-semibold bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 text-primary-foreground shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 rounded-xl mt-6" 
                disabled={loading || !email.trim()}
              >
                Continue
              </Button>
            </form>

            {/* Mode Switch Link - exactly like OpenAI */}
            <div className="text-center mt-4">
              <span className="text-sm text-muted-foreground">
                {mode === 'signin' ? getText('dontHaveAccount') : getText('alreadyHaveAccount')}{' '}
                <button 
                  type="button" 
                  onClick={switchMode} 
                  className="text-primary hover:underline font-medium"
                >
                  {mode === 'signin' ? 'Sign up' : 'Log in'}
                </button>
              </span>
            </div>

            {/* Divider - exactly like OpenAI */}
            <div className="flex items-center my-8">
              <div className="flex-1 border-t border-border"></div>
              <div className="px-4 text-sm text-muted-foreground font-medium">OR</div>
              <div className="flex-1 border-t border-border"></div>
            </div>

            {/* Social Login Buttons - Eterna Colors */}
            <div className="space-y-3">
              <Button 
                type="button" 
                variant="outline" 
                className="w-full h-12 justify-start rounded-xl border-border hover:bg-card hover:border-primary transition-colors text-base text-foreground hover:text-foreground" 
                onClick={() => window.location.href = '/auth/google'}
              >
                <svg className="w-5 h-5 mr-3" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                </svg>
                Continue with Google
              </Button>

              <Button 
                type="button" 
                variant="outline" 
                className="w-full h-12 justify-start rounded-xl border-border hover:bg-card hover:border-primary transition-colors text-base text-foreground hover:text-foreground" 
                onClick={() => window.location.href = '/auth/microsoft'}
              >
                <svg className="w-4 h-4 mr-3" viewBox="0 0 24 24">
                  <path fill="#F25022" d="M11.4 24H0V12.6h11.4V24z"/>
                  <path fill="#00A4EF" d="M24 24H12.6V12.6H24V24z"/>
                  <path fill="#7FBA00" d="M11.4 11.4H0V0h11.4v11.4z"/>
                  <path fill="#FFB900" d="M24 11.4H12.6V0H24v11.4z"/>
                </svg>
                Continue with Microsoft Account
              </Button>

              <Button 
                type="button" 
                variant="outline" 
                className="w-full h-12 justify-start rounded-xl border-border hover:bg-card hover:border-primary transition-colors text-base text-foreground hover:text-foreground" 
                onClick={() => window.location.href = '/auth/apple'}
              >
                <svg className="w-5 h-5 mr-3" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/>
                </svg>
                Continue with Apple
              </Button>
            </div>

            {/* Privacy Notice - exactly like OpenAI */}
            <div className="mt-8 text-center">
              <p className="text-xs text-muted-foreground">
                <a href="/terms" className="hover:underline">{getText('termsOfService')}</a>
                {' '}<span className="mx-2">|</span>{' '}
                <a href="/privacy" className="hover:underline">{getText('privacyPolicy')}</a>
              </p>
            </div>
          </motion.div>

          {/* Plan Selection Modal */}
          <PlanSelectionModal
            isOpen={showPlanModal}
            onClose={() => setShowPlanModal(false)}
            onPlanSelect={handlePlanSelect}
            selectedPlan={selectedPlan}
          />
        </div>
      </div>
    </>
  );
};

export default Auth;