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
      {/* Show header if user is logged in */}
      {user && <EternaHeader />}
      
      <div className={`min-h-screen bg-gradient-to-br from-background via-background to-muted/20 flex items-center justify-center p-4 ${user ? 'pt-20' : ''}`}>
      <div className="w-full max-w-md">
        <motion.div initial={{
          opacity: 0,
          y: 20
        }} animate={{
          opacity: 1,
          y: 0
        }} transition={{
          duration: 0.5
        }}>
          {/* Logo and Title */}
          <div className="text-center mb-8">
            
            <h1 className="text-2xl md:text-3xl font-bold mb-2">
              {mode === 'signin' ? getText('welcomeBack') : getText('createAccount')}
            </h1>
            <p className="text-muted-foreground">
              {mode === 'signin' ? getText('signInToAccess') : getText('startPreserving')}
            </p>
          </div>

          <Card className="shadow-lg border-0 bg-card/50 backdrop-blur-sm">
            <CardHeader className="pb-4">
              <CardTitle className="text-center text-lg">
                {mode === 'signin' ? getText('signIn') : getText('signUp')}
              </CardTitle>
            </CardHeader>
            
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                {/* Email Field */}
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-sm font-medium">
                    {getText('emailAddress')}
                  </Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input id="email" type="email" value={email} onChange={e => setEmail(e.target.value)} className="pl-10 h-11" placeholder={getText('enterEmail')} disabled={loading} autoComplete="email" />
                  </div>
                </div>

                {/* Password Field */}
                <div className="space-y-2">
                  <Label htmlFor="password" className="text-sm font-medium">
                    {getText('password')}
                  </Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input id="password" type={showPassword ? 'text' : 'password'} value={password} onChange={e => setPassword(e.target.value)} className="pl-10 pr-10 h-11" placeholder={getText('enterPassword')} disabled={loading} autoComplete={mode === 'signin' ? 'current-password' : 'new-password'} />
                    <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground">
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                  {mode === 'signup' && password && <div className="text-xs text-muted-foreground">
                      {getText('passwordStrength')}: {password.length < 6 ? getText('tooShort') : password.length < 8 ? getText('fair') : getText('good')}
                    </div>}
                </div>

                {/* Confirm Password Field (Signup only) */}
                {mode === 'signup' && <div className="space-y-2">
                    <Label htmlFor="confirmPassword" className="text-sm font-medium">
                      {getText('confirmPassword')}
                    </Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input id="confirmPassword" type={showPassword ? 'text' : 'password'} value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} className="pl-10 h-11" placeholder={getText('confirmPasswordPlaceholder')} disabled={loading} autoComplete="new-password" />
                    </div>
                  </div>}

                {/* Error Alert */}
                {error && <Alert variant="destructive">
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>{error}</AlertDescription>
                  </Alert>}

                {/* Success Alert */}
                {success && <Alert className="border-green-200 bg-green-50">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    <AlertDescription className="text-green-800">{success}</AlertDescription>
                  </Alert>}

                {/* Submit Button */}
                <Button type="submit" disabled={loading} className="w-full h-11 text-base font-medium" size="lg">
                  {loading ? <div className="flex items-center gap-2">
                      <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                      {mode === 'signin' ? getText('signingIn') : getText('creatingAccount')}
                    </div> : <>
                      {mode === 'signin' ? getText('signIn') : getText('createAccountBtn')}
                      <ArrowRight className="h-4 w-4 ml-2" />
                    </>}
                </Button>

                {/* Mode Switch */}
                <div className="relative">
                  <Separator className="my-6" />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="bg-card px-3 text-xs text-muted-foreground">
                      {mode === 'signin' ? getText('dontHaveAccount') : getText('alreadyHaveAccount')}
                    </div>
                  </div>
                </div>

                <Button type="button" variant="ghost" onClick={switchMode} disabled={loading} className="w-full">
                  {mode === 'signin' ? getText('createNewAccount') : getText('signInExisting')}
                </Button>

                {/* Quick signup options */}
                <div className="my-6">
                  <div className="text-center text-xs text-muted-foreground mb-3">{getText('orContinueWith')}</div>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                    <Button type="button" variant="outline" disabled={loading} onClick={() => authService.signInWithOAuth('google', selectedPlan && selectedPlan !== 'free' ? `${window.location.origin}/payment?plan=${selectedPlan}` : `${window.location.origin}/`)}>
                      <svg width="18" height="18" viewBox="0 0 48 48" className="mr-2"><path fill="#FFC107" d="M43.6 20.5H42V20H24v8h11.3C33.7 32.6 29.2 36 24 36c-6.6 0-12-5.4-12-12s5.4-12 12-12c3.1 0 5.9 1.2 8 3.1l5.7-5.7C34.6 6.1 29.6 4 24 4 12.9 4 4 12.9 4 24s8.9 20 20 20 20-8.9 20-20c0-1.2-.1-2.3-.4-3.5z"/><path fill="#FF3D00" d="M6.3 14.7l6.6 4.8C14.8 16.3 19 14 24 14c3.1 0 5.9 1.2 8 3.1l5.7-5.7C34.6 6.1 29.6 4 24 4 15.5 4 8.2 8.7 6.3 14.7z"/><path fill="#4CAF50" d="M24 44c5.1 0 9.8-1.9 13.3-5.1l-6.1-5c-2.1 1.5-4.8 2.3-7.2 2.3-5.2 0-9.6-3.4-11.3-8.1l-6.6 5.1C8.1 39.3 15.4 44 24 44z"/><path fill="#1976D2" d="M43.6 20.5H42V20H24v8h11.3c-1 3-3.4 5.4-6.4 6.7l6.1 5C37.5 41.2 44 36 44 24c0-1.2-.1-2.3-.4-3.5z"/></svg>
                      Google
                    </Button>
                    <Button type="button" variant="outline" disabled={loading} onClick={() => authService.signInWithOAuth('apple', selectedPlan && selectedPlan !== 'free' ? `${window.location.origin}/payment?plan=${selectedPlan}` : `${window.location.origin}/`)}>
                      <Apple className="w-4 h-4 mr-2" /> Apple
                    </Button>
                    <Button type="button" variant="outline" disabled={loading} onClick={() => setShowPhone(!showPhone)}>
                      <PhoneIcon className="w-4 h-4 mr-2" /> {getText('continueWithPhone')}
                    </Button>
                  </div>

                  {showPhone && (
                    <div className="mt-4 space-y-2">
                      {!otpSent ? (
                        <>
                          <Label htmlFor="phone" className="text-sm font-medium">{getText('phoneNumber')}</Label>
                          <Input id="phone" type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder={getText('enterPhone')} disabled={loading} />
                          <Button type="button" className="w-full" disabled={loading || !phone} onClick={async () => {
                            setError('');
                            const { error } = await authService.signInWithOtp(phone);
                            if (error) setError(error.message); else {
                              setOtpSent(true);
                              toast({ title: getText('codeSent') });
                            }
                          }}>{getText('sendCode')}</Button>
                        </>
                      ) : (
                        <>
                          <Label htmlFor="code" className="text-sm font-medium">{getText('code')}</Label>
                          <Input id="code" value={smsCode} onChange={(e) => setSmsCode(e.target.value)} placeholder={getText('enterCode')} disabled={loading} />
                          <Button type="button" className="w-full" disabled={loading || !smsCode} onClick={async () => {
                            setError('');
                            const { error } = await authService.verifyOtp(phone, smsCode);
                            if (error) setError(getText('invalidCode')); else {
                              // Phone sign-in successful
                              if (selectedPlan && selectedPlan !== 'free') {
                                window.location.href = `/payment?plan=${selectedPlan}`;
                              } else {
                                window.location.href = redirectTo;
                              }
                            }
                          }}>{getText('verifyCode')}</Button>
                        </>
                      )}
                    </div>
                  )}
                </div>

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
            </CardContent>
          </Card>

          {/* Back to Home */}
          <div className="text-center mt-6">
            <Button variant="ghost" onClick={() => window.location.href = '/'} className="text-muted-foreground">
              {getText('backToHome')}
            </Button>
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
    </>;
};
export default Auth;