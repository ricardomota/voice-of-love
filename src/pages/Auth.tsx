// Enhanced Auth page with improved UX and mobile optimization
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Eye, EyeOff, Mail, Lock, User, ArrowRight, AlertCircle, CheckCircle, Phone as PhoneIcon, Apple } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
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
  // Phone auth state
  const [phone, setPhone] = useState('');
  const [smsCode, setSmsCode] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [showPhone, setShowPhone] = useState(false);

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
    if (!password) {
      setError(getText('enterPasswordField'));
      return false;
    }
    if (password.length < 6) {
      setError(getText('passwordMinLength'));
      return false;
    }
    if (mode === 'signup' && password !== confirmPassword) {
      setError(getText('passwordsNoMatch'));
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
        result = await signUp(email.trim(), password, currentLanguage);
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
  return <>
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <div className="w-full max-w-sm">
          <motion.div 
            initial={{ opacity: 0, y: 20 }} 
            animate={{ opacity: 1, y: 0 }} 
            transition={{ duration: 0.5 }}
            className="space-y-8"
          >
            {/* Title */}
            <div className="text-center">
              <h1 className="text-2xl font-semibold text-foreground">
                {mode === 'signin' ? getText('welcomeBack') : getText('createAccount')}
              </h1>
            </div>

            {/* Main Form */}
            <div className="space-y-6">
              <form onSubmit={handleSubmit} className="space-y-4">
                {/* Email Field */}
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-sm font-medium text-foreground/80">
                    {getText('emailAddress')}
                  </Label>
                  <Input 
                    id="email" 
                    type="email" 
                    value={email} 
                    onChange={e => setEmail(e.target.value)} 
                    className="h-12 text-base" 
                    placeholder={getText('emailAddress')} 
                    disabled={loading} 
                    autoComplete="email" 
                  />
                </div>

                {/* Password Field (only for signin mode initially) */}
                {(mode === 'signin' || (mode === 'signup' && email)) && (
                  <div className="space-y-2">
                    <Label htmlFor="password" className="text-sm font-medium text-foreground/80">
                      {getText('password')}
                    </Label>
                    <div className="relative">
                      <Input 
                        id="password" 
                        type={showPassword ? 'text' : 'password'} 
                        value={password} 
                        onChange={e => setPassword(e.target.value)} 
                        className="h-12 text-base pr-10" 
                        placeholder={getText('password')} 
                        disabled={loading} 
                        autoComplete={mode === 'signin' ? 'current-password' : 'new-password'} 
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="absolute right-0 top-0 h-12 px-3 hover:bg-transparent"
                        onClick={() => setShowPassword(!showPassword)}
                        disabled={loading}
                      >
                        {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </Button>
                    </div>
                  </div>
                )}

                {/* Confirm Password (only for signup) */}
                {mode === 'signup' && password && (
                  <div className="space-y-2">
                    <Label htmlFor="confirmPassword" className="text-sm font-medium text-foreground/80">
                      {getText('confirmPassword')}
                    </Label>
                    <Input 
                      id="confirmPassword" 
                      type={showPassword ? 'text' : 'password'} 
                      value={confirmPassword} 
                      onChange={e => setConfirmPassword(e.target.value)} 
                      className="h-12 text-base" 
                      placeholder={getText('confirmPassword')} 
                      disabled={loading} 
                      autoComplete="new-password" 
                    />
                  </div>
                )}

                {/* Error Alert */}
                {error && (
                  <Alert variant="destructive" className="text-sm">
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>{error}</AlertDescription>
                  </Alert>
                )}

                {/* Success Alert */}
                {success && (
                  <Alert className="border-green-200 bg-green-50 text-green-800">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    <AlertDescription className="text-green-800">{success}</AlertDescription>
                  </Alert>
                )}

                {/* Submit Button */}
                <Button 
                  type="submit" 
                  disabled={loading || !email || (mode === 'signin' && !password) || (mode === 'signup' && (!password || !confirmPassword))} 
                  className="w-full h-12 text-base font-medium bg-primary hover:bg-primary/90"
                  size="lg"
                >
                  {loading ? (
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                      {mode === 'signin' ? getText('signingIn') : getText('creatingAccount')}
                    </div>
                  ) : (
                    mode === 'signin' ? getText('signIn') : getText('createAccountBtn')
                  )}
                </Button>
              </form>

              {/* Mode Switch */}
              <div className="text-center">
                <span className="text-sm text-muted-foreground">
                  {mode === 'signin' ? getText('dontHaveAccount') : getText('alreadyHaveAccount')}{' '}
                  <button 
                    type="button"
                    onClick={switchMode}
                    disabled={loading}
                    className="text-primary hover:underline font-medium"
                  >
                    {mode === 'signin' ? getText('signUp') : getText('signIn')}
                  </button>
                </span>
              </div>

              {/* Divider */}
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-border"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="bg-background px-4 text-muted-foreground font-medium">OR</span>
                </div>
              </div>

              {/* Social Login Options */}
              <div className="space-y-3">
                <Button 
                  type="button" 
                  variant="outline" 
                  disabled={loading} 
                  onClick={() => authService.signInWithOAuth('google', selectedPlan && selectedPlan !== 'free' ? `${window.location.origin}/payment?plan=${selectedPlan}` : `${window.location.origin}/`)}
                  className="w-full h-12 justify-start gap-3 font-medium text-base hover:bg-muted/50 border-border"
                >
                  <svg width="18" height="18" viewBox="0 0 24 24">
                    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                  </svg>
                  {getText('continueWithGoogle')}
                </Button>
                
                <Button 
                  type="button" 
                  variant="outline" 
                  disabled={loading} 
                  onClick={() => authService.signInWithOAuth('apple', selectedPlan && selectedPlan !== 'free' ? `${window.location.origin}/payment?plan=${selectedPlan}` : `${window.location.origin}/`)}
                  className="w-full h-12 justify-start gap-3 font-medium text-base hover:bg-muted/50 border-border"
                >
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/>
                  </svg>
                  {getText('continueWithApple')}
                </Button>
                
                <Button 
                  type="button" 
                  variant="outline" 
                  disabled={loading} 
                  onClick={() => setShowPhone(!showPhone)}
                  className="w-full h-12 justify-start gap-3 font-medium text-base hover:bg-muted/50 border-border"
                >
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                    <path fillRule="evenodd" clipRule="evenodd" d="M2 5.57143C2 3.59898 3.59898 2 5.57143 2H8.625C9.0287 2 9.39281 2.24274 9.54808 2.61538L11.4231 7.11538C11.5744 7.47863 11.4987 7.89686 11.2295 8.18394L9.82741 9.67954C10.9044 11.7563 12.2732 13.2047 14.3016 14.2842L15.7929 12.7929C16.0794 12.5064 16.5106 12.4211 16.8846 12.5769L21.3846 14.4519C21.7573 14.6072 22 14.9713 22 15.375V18.4286C22 20.401 20.401 22 18.4286 22C9.35532 22 2 14.6447 2 5.57143ZM5.57143 4C4.70355 4 4 4.70355 4 5.57143C4 13.5401 10.4599 20 18.4286 20C19.2964 20 20 19.2964 20 18.4286V16.0417L16.7336 14.6807L15.2071 16.2071C14.9098 16.5044 14.4582 16.584 14.0771 16.4062C11.0315 14.9849 9.12076 12.9271 7.71882 9.92289C7.54598 9.55251 7.61592 9.11423 7.89546 8.81606L9.32824 7.28777L7.95833 4H5.57143Z"/>
                  </svg>
                  {getText('continueWithPhone')}
                </Button>
              </div>

              {/* Phone Auth Section */}
              {showPhone && (
                <div className="space-y-4 pt-4 border-t border-border">
                  {!otpSent ? (
                    <div className="space-y-3">
                      <div className="space-y-2">
                        <Label htmlFor="phone" className="text-sm font-medium text-foreground/80">
                          {getText('phoneNumber')}
                        </Label>
                        <Input 
                          id="phone" 
                          type="tel" 
                          value={phone} 
                          onChange={(e) => setPhone(e.target.value)} 
                          placeholder={getText('enterPhone')} 
                          disabled={loading} 
                          className="h-12 text-base"
                        />
                      </div>
                      <Button 
                        type="button" 
                        className="w-full h-12" 
                        disabled={loading || !phone} 
                        onClick={async () => {
                          setError('');
                          const { error } = await authService.signInWithOtp(phone);
                          if (error) setError(error.message); 
                          else {
                            setOtpSent(true);
                            toast({ title: getText('codeSent') });
                          }
                        }}
                      >
                        {getText('sendCode')}
                      </Button>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      <div className="space-y-2">
                        <Label htmlFor="code" className="text-sm font-medium text-foreground/80">
                          {getText('code')}
                        </Label>
                        <Input 
                          id="code" 
                          value={smsCode} 
                          onChange={(e) => setSmsCode(e.target.value)} 
                          placeholder={getText('enterCode')} 
                          disabled={loading} 
                          className="h-12 text-base"
                        />
                      </div>
                      <Button 
                        type="button" 
                        className="w-full h-12" 
                        disabled={loading || !smsCode} 
                        onClick={async () => {
                          setError('');
                          const { error } = await authService.verifyOtp(phone, smsCode);
                          if (error) setError(getText('invalidCode')); 
                          else {
                            if (selectedPlan && selectedPlan !== 'free') {
                              window.location.href = `/payment?plan=${selectedPlan}`;
                            } else {
                              window.location.href = redirectTo;
                            }
                          }
                        }}
                      >
                        {getText('verifyCode')}
                      </Button>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="text-center pt-8 border-t border-border">
              <p className="text-xs text-muted-foreground">
                <a href="/terms" className="hover:underline">{getText('termsOfService')}</a>
                <span className="mx-2">•</span>
                <a href="/privacy" className="hover:underline">{getText('privacyPolicy')}</a>
              </p>
            </div>
          </motion.div>
        </div>

        {/* Plan Selection Modal */}
        <PlanSelectionModal
          isOpen={showPlanModal}
          onClose={() => setShowPlanModal(false)}
          onPlanSelect={handlePlanSelect}
          selectedPlan={selectedPlan}
        />
      </div>
    </>;
  };
export default Auth;