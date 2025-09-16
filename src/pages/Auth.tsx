import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Eye, EyeOff, AlertCircle, Heart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { FloatingInput } from '@/components/ui/floating-input';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';
import { useLanguage } from '@/hooks/useLanguage';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { analyticsIntegrations } from '@/lib/integrations';
import { EternaHeader } from '@/components/layout/EternaHeader';
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
  const { signIn, signUp, user } = useAuth();
  const { toast } = useToast();
  const { currentLanguage } = useLanguage();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  // State
  const [mode, setMode] = useState<AuthMode>('signin');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [showPlanModal, setShowPlanModal] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null);

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
      accountCreated: 'Conta criada! Verifique seu email para confirmar sua conta.',
      welcomeBackToast: 'Bem-vindo de volta!',
      signedInSuccessfully: 'Você entrou com sucesso.',
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
      accountCreated: 'Account created! Please check your email to verify your account.',
      welcomeBackToast: 'Welcome back!',
      signedInSuccessfully: 'You have been signed in successfully.',
    }
  };

  const t = translations[currentLanguage as keyof typeof translations] || translations['en'];

  useEffect(() => {
    // Redirect to dashboard if already authenticated
    if (user) {
      navigate('/dashboard');
    }
  }, [user, navigate]);

  useEffect(() => {
    const plan = searchParams.get('plan');
    if (plan) {
      setSelectedPlan(plan);
    }
  }, [searchParams]);

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    // Email validation
    if (!email) {
      newErrors.email = t.enterEmailAddress;
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      newErrors.email = t.enterValidEmail;
    }

    // Password validation
    if (!password) {
      newErrors.password = t.enterPasswordField;
    } else if (password.length < 6) {
      newErrors.password = t.passwordMinLength;
    }

    // Confirm password validation for signup
    if (mode === 'signup') {
      if (!confirmPassword) {
        newErrors.confirmPassword = t.confirmPasswordPlaceholder;
      } else if (password !== confirmPassword) {
        newErrors.confirmPassword = t.passwordsNoMatch;
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setLoading(true);
    setErrors({});

    try {
      if (mode === 'signin') {
        const { data, error } = await signIn(email, password);
        
        if (error) {
          if (error.message?.includes('Invalid login credentials')) {
            setErrors({ general: t.invalidCredentials });
          } else if (error.message?.includes('Email not confirmed')) {
            setErrors({ general: t.emailNotConfirmed });
          } else {
            setErrors({ general: t.errorOccurred });
          }
          return;
        }

        if (data.user) {
          await analyticsIntegrations.trackEvent('user_signed_in', {
            user_id: data.user.id,
            email: data.user.email,
            timestamp: new Date().toISOString()
          });

          toast({
            title: t.welcomeBackToast,
            description: t.signedInSuccessfully,
          });

          navigate('/dashboard');
        }
      } else {
        const { data, error } = await signUp(email, password, currentLanguage);
        
        if (error) {
          if (error.message?.includes('User already registered')) {
            setErrors({ general: t.userAlreadyRegistered });
          } else {
            setErrors({ general: t.errorOccurred });
          }
          return;
        }

        if (data.user) {
          await analyticsIntegrations.trackEvent('user_signed_up', {
            user_id: data.user.id,
            email: data.user.email,
            timestamp: new Date().toISOString()
          });

          setMode('email_confirmation');
          
          toast({
            title: t.accountCreated,
            description: t.accountCreated,
          });
        }
      }
    } catch (error) {
      console.error('Auth error:', error);
      setErrors({ general: t.unexpectedError });
    } finally {
      setLoading(false);
    }
  };

  const getPasswordStrength = (password: string) => {
    if (password.length < 6) return { label: t.tooShort, color: 'text-destructive' };
    if (password.length < 8) return { label: t.fair, color: 'text-yellow-500' };
    return { label: t.good, color: 'text-green-500' };
  };

  const passwordStrength = password ? getPasswordStrength(password) : null;

  // Show email confirmation screen
  if (mode === 'email_confirmation') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-background/50 to-secondary/20">
        <EternaHeader />
        <div className="flex items-center justify-center min-h-screen pt-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="w-full max-w-md mx-auto px-6"
          >
            <div className="text-center mb-8">
              <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-primary to-secondary rounded-full flex items-center justify-center">
                <Heart className="w-8 h-8 text-white" />
              </div>
              <h1 className="text-2xl font-bold text-foreground mb-2">
                {t.accountCreated}
              </h1>
              <p className="text-muted-foreground">
                Check your email to complete your registration.
              </p>
            </div>
            
            <Button
              onClick={() => setMode('signin')}
              variant="outline"
              className="w-full"
            >
              {t.backToHome}
            </Button>
          </motion.div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background/50 to-secondary/20">
      <EternaHeader />
      
      <div className="flex items-center justify-center min-h-screen pt-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-md mx-auto px-6"
        >
          {/* Header */}
          <div className="text-center mb-8">
            <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-primary to-secondary rounded-full flex items-center justify-center">
              <Heart className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-2xl font-bold text-foreground mb-2">
              {mode === 'signin' ? t.welcomeBack : t.createAccount}
            </h1>
            <p className="text-muted-foreground">
              {mode === 'signin' ? t.signInToAccess : t.startPreserving}
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {errors.general && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{errors.general}</AlertDescription>
              </Alert>
            )}

            {/* Email Field */}
            <div className="space-y-2">
              <div className={`relative ${errors.email ? 'ring-2 ring-destructive rounded-full' : ''}`}>
                <FloatingInput
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder={t.enterEmail}
                  label={t.emailAddress}
                  className="w-full"
                />
              </div>
              {errors.email && (
                <p className="text-sm text-destructive">{errors.email}</p>
              )}
            </div>

            {/* Password Field */}
            <div className="space-y-2">
              <div className={`relative ${errors.password ? 'ring-2 ring-destructive rounded-full' : ''}`}>
                <FloatingInput
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder={t.enterPassword}
                  label={t.password}
                  className="w-full pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
              {errors.password && (
                <p className="text-sm text-destructive">{errors.password}</p>
              )}
              {mode === 'signup' && password && passwordStrength && (
                <p className={`text-sm ${passwordStrength.color}`}>
                  {t.passwordStrength}: {passwordStrength.label}
                </p>
              )}
            </div>

            {/* Confirm Password Field (only for signup) */}
            {mode === 'signup' && (
              <div className="space-y-2">
                <div className={`relative ${errors.confirmPassword ? 'ring-2 ring-destructive rounded-full' : ''}`}>
                  <FloatingInput
                    id="confirmPassword"
                    type={showConfirmPassword ? "text" : "password"}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder={t.confirmPasswordPlaceholder}
                    label={t.confirmPassword}
                    className="w-full pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
                {errors.confirmPassword && (
                  <p className="text-sm text-destructive">{errors.confirmPassword}</p>
                )}
              </div>
            )}

            {/* Submit Button */}
            <Button
              type="submit"
              className="w-full"
              disabled={loading}
            >
              {loading ? (
                mode === 'signin' ? t.signingIn : t.creatingAccount
              ) : (
                mode === 'signin' ? t.signIn : t.createAccountBtn
              )}
            </Button>

            {/* Toggle Mode */}
            <div className="text-center">
              <p className="text-sm text-muted-foreground">
                {mode === 'signin' ? t.dontHaveAccount : t.alreadyHaveAccount}{' '}
                <button
                  type="button"
                  onClick={() => {
                    setMode(mode === 'signin' ? 'signup' : 'signin');
                    setErrors({});
                  }}
                  className="text-primary hover:underline font-medium"
                >
                  {mode === 'signin' ? t.createNewAccount : t.signInExisting}
                </button>
              </p>
            </div>

            {/* Terms */}
            {mode === 'signup' && (
              <div className="text-center">
                <p className="text-xs text-muted-foreground">
                  {t.byContinuing}{' '}
                  <a href="/terms" className="text-primary hover:underline">
                    {t.termsOfService}
                  </a>{' '}
                  {t.and}{' '}
                  <a href="/privacy" className="text-primary hover:underline">
                    {t.privacyPolicy}
                  </a>
                </p>
              </div>
            )}
          </form>
        </motion.div>
      </div>

      {/* Plan Selection Modal */}
      {showPlanModal && selectedPlan && (
        <PlanSelectionModal
          isOpen={showPlanModal}
          onClose={() => setShowPlanModal(false)}
          onPlanSelect={(plan) => {
            setSelectedPlan(plan);
            setShowPlanModal(false);
          }}
          selectedPlan={selectedPlan}
        />
      )}
    </div>
  );
};

export default Auth;