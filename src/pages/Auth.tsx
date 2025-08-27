// Enhanced Auth page with improved UX and mobile optimization
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Eye, EyeOff, Mail, Lock, User, ArrowRight, AlertCircle, CheckCircle } from 'lucide-react';
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
      signedInSuccessfully: 'Você entrou com sucesso.'
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
      signedInSuccessfully: 'You have been signed in successfully.'
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
      signedInSuccessfully: 'Has iniciado sesión correctamente.'
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