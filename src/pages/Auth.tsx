// Enhanced Auth page with improved UX and mobile optimization
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Eye, EyeOff, Mail, Lock, User, ArrowRight, AlertCircle, CheckCircle, Phone as PhoneIcon, Apple } from 'lucide-react';
import { Button } from '@/components/ui/button';
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

  return (
    <>
      {/* Show header if user is logged in */}
      {user && <EternaHeader />}
      
      <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20 flex flex-col justify-center items-center p-4">
        {/* Back to Home Button - positioned at top */}
        <div className="w-full max-w-md mb-8">
          <Button
            variant="ghost"
            onClick={() => window.location.href = '/'}
            className="text-muted-foreground hover:text-foreground transition-colors"
          >
            {getText('backToHome')}
          </Button>
        </div>

        <div className="w-full max-w-md">
          <motion.div 
            initial={{ opacity: 0, y: 20 }} 
            animate={{ opacity: 1, y: 0 }} 
            transition={{ duration: 0.5 }}
          >
            {/* Title Block - OpenAI Style */}
            <div className="text-center mb-12">
              <h1 className="text-3xl font-bold mb-3">
                {mode === 'signin' ? getText('welcomeBack') : getText('createAccount')}
              </h1>
            </div>

            {/* Clean form container like OpenAI */}
            <div className="bg-card border border-border rounded-lg p-8">
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
              
              <form onSubmit={handleSubmit} className="space-y-5">
                {/* Email Field */}
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-sm font-medium">
                    {getText('emailAddress')}
                  </Label>
                  <Input 
                    id="email" 
                    type="email" 
                    value={email} 
                    onChange={e => setEmail(e.target.value)} 
                    className="h-12" 
                    placeholder={getText('enterEmail')} 
                    disabled={loading} 
                    autoComplete="email" 
                  />
                </div>

                {/* Password Field */}
                <div className="space-y-2">
                  <Label htmlFor="password" className="text-sm font-medium">
                    {getText('password')}
                  </Label>
                  <div className="relative">
                    <Input 
                      id="password" 
                      type={showPassword ? 'text' : 'password'} 
                      value={password} 
                      onChange={e => setPassword(e.target.value)} 
                      className="h-12 pr-10" 
                      placeholder={getText('enterPassword')} 
                      disabled={loading} 
                      autoComplete={mode === 'signup' ? 'new-password' : 'current-password'} 
                    />
                    <Button 
                      type="button" 
                      variant="ghost" 
                      size="sm" 
                      className="absolute right-0 top-0 h-12 px-3 hover:bg-transparent" 
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </Button>
                  </div>
                </div>

                {/* Confirm Password Field (only for signup) */}
                {mode === 'signup' && (
                  <div className="space-y-2">
                    <Label htmlFor="confirmPassword" className="text-sm font-medium">
                      {getText('confirmPassword')}
                    </Label>
                    <Input 
                      id="confirmPassword" 
                      type="password" 
                      value={confirmPassword} 
                      onChange={e => setConfirmPassword(e.target.value)} 
                      className="h-12" 
                      placeholder={getText('confirmPasswordPlaceholder')} 
                      disabled={loading} 
                      autoComplete="new-password" 
                    />
                  </div>
                )}

                {/* Continue Button */}
                <Button 
                  type="submit" 
                  className="w-full h-12" 
                  disabled={loading}
                >
                  {loading ? (
                    mode === 'signin' ? getText('signingIn') : getText('creatingAccount')
                  ) : (
                    mode === 'signin' ? getText('signIn') : getText('createAccountBtn')
                  )}
                </Button>

                {/* Mode Switch */}
                <div className="text-center">
                  <span className="text-sm text-muted-foreground">
                    {mode === 'signin' ? getText('dontHaveAccount') : getText('alreadyHaveAccount')}{' '}
                    <button 
                      type="button" 
                      onClick={switchMode} 
                      className="text-primary hover:underline"
                    >
                      {mode === 'signin' ? getText('createNewAccount') : getText('signInExisting')}
                    </button>
                  </span>
                </div>

                {/* Divider */}
                <div className="flex items-center my-6">
                  <div className="flex-1 border-t border-border"></div>
                  <div className="px-4 text-sm text-muted-foreground">OR</div>
                  <div className="flex-1 border-t border-border"></div>
                </div>

                {/* Social Login Buttons - OpenAI Style */}
                <div className="space-y-3">
                  <Button 
                    type="button" 
                    variant="outline" 
                    className="w-full h-12 justify-start" 
                    onClick={() => window.location.href = '/auth/google'}
                  >
                    <svg className="w-5 h-5 mr-3" viewBox="0 0 24 24">
                      <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                      <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                      <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                      <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                    </svg>
                    {getText('continueWithGoogle')}
                  </Button>

                  <Button 
                    type="button" 
                    variant="outline" 
                    className="w-full h-12 justify-start" 
                    onClick={() => window.location.href = '/auth/apple'}
                  >
                    <Apple className="w-5 h-5 mr-3" />
                    {getText('continueWithApple')}
                  </Button>

                  <Button 
                    type="button" 
                    variant="outline" 
                    className="w-full h-12 justify-start" 
                    onClick={() => setShowPhone(!showPhone)}
                  >
                    <PhoneIcon className="w-5 h-5 mr-3" />
                    {getText('continueWithPhone')}
                  </Button>
                </div>

                {/* Phone Authentication */}
                {showPhone && (
                  <div className="mt-4 p-4 border border-border rounded-lg space-y-4">
                    {!otpSent ? (
                      <>
                        <Label htmlFor="phone" className="text-sm font-medium">
                          {getText('phoneNumber')}
                        </Label>
                        <Input 
                          id="phone" 
                          value={phone} 
                          onChange={(e) => setPhone(e.target.value)} 
                          placeholder={getText('enterPhone')} 
                          disabled={loading} 
                        />
                        <Button 
                          type="button" 
                          className="w-full" 
                          disabled={loading || !phone} 
                          onClick={async () => {
                            setError('');
                            const { error } = await authService.signInWithOtp(phone);
                            if (error) setError(error.message);
                            else {
                              setOtpSent(true);
                              setSuccess(getText('codeSent'));
                            }
                          }}
                        >
                          {getText('sendCode')}
                        </Button>
                      </>
                    ) : (
                      <>
                        <Label htmlFor="code" className="text-sm font-medium">
                          {getText('code')}
                        </Label>
                        <Input 
                          id="code" 
                          value={smsCode} 
                          onChange={(e) => setSmsCode(e.target.value)} 
                          placeholder={getText('enterCode')} 
                          disabled={loading} 
                        />
                        <Button 
                          type="button" 
                          className="w-full" 
                          disabled={loading || !smsCode} 
                          onClick={async () => {
                            setError('');
                            const { error } = await authService.verifyOtp(phone, smsCode);
                            if (error) setError(getText('invalidCode'));
                            else {
                              // Phone sign-in successful
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
                      </>
                    )}
                  </div>
                )}

                {/* Plan Selection for Signup */}
                {mode === 'signup' && (
                  <div className="mt-4 pt-4 border-t">
                    <Button 
                      type="button" 
                      variant="outline" 
                      onClick={() => setShowPlanModal(true)}
                      className="w-full"
                    >
                      {selectedPlan === 'free' ? 'Select Plan (Currently: Free)' : `Selected: ${selectedPlan}`}
                    </Button>
                  </div>
                )}
              </form>

              {/* Privacy Notice */}
              <div className="mt-6 pt-4 border-t text-center">
                <p className="text-xs text-muted-foreground">
                  {getText('byContinuing')}{' '}
                  <a href="/terms" className="underline hover:text-foreground">{getText('termsOfService')}</a>
                  {' '}{getText('and')}{' '}
                  <a href="/privacy" className="underline hover:text-foreground">{getText('privacyPolicy')}</a>
                </p>
              </div>
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