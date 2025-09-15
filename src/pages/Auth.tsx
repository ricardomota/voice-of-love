import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Eye, EyeOff, AlertCircle, CheckCircle, Mail, Phone, ArrowLeft, Heart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { FloatingInput } from '@/components/ui/floating-input';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';
import { useLanguage } from '@/hooks/useLanguage';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { analyticsIntegrations } from '@/lib/integrations';
import { EternaHeader } from '@/components/layout/EternaHeader';
import { EmailConfirmationScreen } from '@/components/EmailConfirmationScreen';
import { PlanSelectionModal } from '@/components/PlanSelectionModal';
import { OTPVerification } from '@/components/OTPVerification';
import { authService } from '@/services/authService';
import { supabase } from '@/integrations/supabase/client';

type AuthMode = 'signin' | 'signup' | 'email_confirmation' | 'email_otp' | 'phone_input' | 'phone_otp';

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
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

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
      orContinueWith: 'Ou continuar com',
      continueWithGoogle: 'Continuar com Google',
      continueWithMicrosoft: 'Continuar com Microsoft',
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
      resendConfirmationEmail: 'Reenviar email de confirmação',
      errorSendingCode: 'Erro ao enviar código de verificação.',
      checkEmailForCode: 'Verifique seu email para o código de verificação.',
      errorSendingEmailCode: 'Erro ao enviar código por email.',
      errorSendingPhoneCode: 'Erro ao enviar código por SMS.',
      checkPhoneForCode: 'Verifique seu telefone para o código de verificação.',
      welcomeVerified: 'Bem-vindo!',
      accountVerifiedSuccess: 'Sua conta foi verificada com sucesso.',
      errorConnectingWith: 'Erro ao conectar com',
      errorConnecting: 'Erro ao conectar. Tente novamente.',
      enterPhoneNumber: 'Por favor, digite seu número de telefone',
      codeSentTitle: 'Código enviado!',
      welcomeTitle: 'Bem-vindo!'
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
      orContinueWith: 'Or continue with',
      continueWithGoogle: 'Continue with Google',
      continueWithMicrosoft: 'Continue with Microsoft',
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
      resendConfirmationEmail: 'Resend confirmation email',
      errorSendingCode: 'Error sending verification code.',
      checkEmailForCode: 'Check your email for the verification code.',
      errorSendingEmailCode: 'Error sending email code.',
      errorSendingPhoneCode: 'Error sending SMS code.',
      checkPhoneForCode: 'Check your phone for the verification code.',
      welcomeVerified: 'Welcome!',
      accountVerifiedSuccess: 'Your account has been verified successfully.',
      errorConnectingWith: 'Error connecting with',
      errorConnecting: 'Error connecting. Please try again.',
      enterPhoneNumber: 'Please enter your phone number',
      codeSentTitle: 'Code sent!',
      welcomeTitle: 'Welcome!'
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
      accountCreated: '¡Cuenta creada! Revisa tu correo para verificar tu cuenta.',
      welcomeBackToast: '¡Bienvenido de nuevo!',
      signedInSuccessfully: 'Has iniciado sesión correctamente.',
      orContinueWith: 'O continúa con',
      continueWithGoogle: 'Continuar con Google',
      continueWithMicrosoft: 'Continuar con Microsoft',
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
      resendConfirmationEmail: 'Reenviar email de confirmación',
      errorSendingCode: 'Error al enviar código de verificación.',
      checkEmailForCode: 'Revisa tu correo para el código de verificación.',
      errorSendingEmailCode: 'Error al enviar código por correo.',
      errorSendingPhoneCode: 'Error al enviar código por SMS.',
      checkPhoneForCode: 'Revisa tu teléfono para el código de verificación.',
      welcomeVerified: '¡Bienvenido!',
      accountVerifiedSuccess: 'Tu cuenta ha sido verificada exitosamente.',
      errorConnectingWith: 'Error al conectar con',
      errorConnecting: 'Error al conectar. Inténtalo de nuevo.',
      enterPhoneNumber: 'Por favor, ingresa tu número de teléfono',
      codeSentTitle: '¡Código enviado!',
      welcomeTitle: '¡Bienvenido!'
    },
    'zh-CN': {
      welcomeBack: '欢迎回来',
      createAccount: '创建您的账户',
      signInToAccess: '登录以访问您的记忆钱包',
      startPreserving: '开始保存您的珍贵记忆',
      signIn: '登录',
      signUp: '注册',
      emailAddress: '电子邮箱地址',
      enterEmail: '输入您的邮箱',
      password: '密码',
      enterPassword: '输入您的密码',
      confirmPassword: '确认密码',
      confirmPasswordPlaceholder: '确认您的密码',
      passwordStrength: '密码强度',
      tooShort: '太短',
      fair: '一般',
      good: '良好',
      signingIn: '登录中...',
      creatingAccount: '创建账户中...',
      createAccountBtn: '创建账户',
      dontHaveAccount: '还没有账户？',
      alreadyHaveAccount: '已有账户？',
      createNewAccount: '创建新账户',
      signInExisting: '登录现有账户',
      byContinuing: '继续即表示您同意我们的',
      termsOfService: '服务条款',
      and: '和',
      privacyPolicy: '隐私政策',
      backToHome: '← 返回首页',
      enterEmailAddress: '请输入您的邮箱地址',
      enterValidEmail: '请输入有效的邮箱地址',
      enterPasswordField: '请输入您的密码',
      passwordMinLength: '密码必须至少6个字符',
      passwordsNoMatch: '密码不匹配',
      invalidCredentials: '邮箱或密码无效。请检查您的凭据并重试。',
      userAlreadyRegistered: '此邮箱已存在账户。请尝试登录。',
      emailNotConfirmed: '请检查您的邮箱并点击确认链接后再登录。',
      errorOccurred: '发生错误。请重试。',
      unexpectedError: '发生意外错误。请重试。',
      accountCreated: '账户已创建！请检查您的邮箱以验证账户。',
      welcomeBackToast: '欢迎回来！',
      signedInSuccessfully: '您已成功登录。',
      orContinueWith: '或继续使用',
      continueWithGoogle: '使用 Google 继续',
      continueWithMicrosoft: '使用 Microsoft 继续',
      continueWithApple: '使用 Apple 继续',
      continueWithPhone: '使用手机继续',
      phoneNumber: '手机号码',
      enterPhone: '输入您的手机号码',
      sendCode: '发送验证码',
      code: '验证码',
      enterCode: '输入验证码',
      verifyCode: '验证验证码',
      codeSent: '验证码已发送！',
      invalidCode: '验证码无效。请重试。',
      resendConfirmationEmail: '重新发送确认邮件',
      errorSendingCode: '发送验证码时出错。',
      checkEmailForCode: '请检查您的邮箱获取验证码。',
      errorSendingEmailCode: '发送邮箱验证码时出错。',
      errorSendingPhoneCode: '发送短信验证码时出错。',
      checkPhoneForCode: '请检查您的手机获取验证码。',
      welcomeVerified: '欢迎！',
      accountVerifiedSuccess: '您的账户已成功验证。',
      errorConnectingWith: '连接出错',
      errorConnecting: '连接出错。请重试。',
      enterPhoneNumber: '请输入您的手机号码',
      codeSentTitle: '验证码已发送！',
      welcomeTitle: '欢迎！'
    },
    'fr': {
      welcomeBack: 'Bon retour',
      createAccount: 'Créez votre compte',
      signInToAccess: 'Connectez-vous pour accéder à votre Portefeuille de Souvenirs',
      startPreserving: 'Commencez à préserver vos souvenirs précieux',
      signIn: 'Se connecter',
      signUp: "S'inscrire",
      emailAddress: 'Adresse e-mail',
      enterEmail: 'Entrez votre e-mail',
      password: 'Mot de passe',
      enterPassword: 'Entrez votre mot de passe',
      confirmPassword: 'Confirmer le mot de passe',
      confirmPasswordPlaceholder: 'Confirmez votre mot de passe',
      passwordStrength: 'Force du mot de passe',
      tooShort: 'Trop court',
      fair: 'Acceptable',
      good: 'Bon',
      signingIn: 'Connexion...',
      creatingAccount: 'Création du compte...',
      createAccountBtn: 'Créer un compte',
      dontHaveAccount: "Vous n'avez pas de compte ?",
      alreadyHaveAccount: 'Vous avez déjà un compte ?',
      createNewAccount: 'Créer un nouveau compte',
      signInExisting: 'Se connecter au compte existant',
      byContinuing: 'En continuant, vous acceptez nos',
      termsOfService: 'Conditions de service',
      and: 'et',
      privacyPolicy: 'Politique de confidentialité',
      backToHome: "← Retour à l'accueil",
      enterEmailAddress: 'Veuillez entrer votre adresse e-mail',
      enterValidEmail: 'Veuillez entrer une adresse e-mail valide',
      enterPasswordField: 'Veuillez entrer votre mot de passe',
      passwordMinLength: 'Le mot de passe doit contenir au moins 6 caractères',
      passwordsNoMatch: 'Les mots de passe ne correspondent pas',
      invalidCredentials: 'E-mail ou mot de passe invalide. Vérifiez vos identifiants et réessayez.',
      userAlreadyRegistered: 'Un compte avec cet e-mail existe déjà. Essayez de vous connecter.',
      emailNotConfirmed: 'Vérifiez votre e-mail et cliquez sur le lien de confirmation avant de vous connecter.',
      errorOccurred: 'Une erreur est survenue. Veuillez réessayer.',
      unexpectedError: 'Une erreur inattendue est survenue. Veuillez réessayer.',
      accountCreated: 'Compte créé ! Vérifiez votre e-mail pour vérifier votre compte.',
      welcomeBackToast: 'Bon retour !',
      signedInSuccessfully: 'Vous vous êtes connecté avec succès.',
      orContinueWith: 'Ou continuer avec',
      continueWithGoogle: 'Continuer avec Google',
      continueWithMicrosoft: 'Continuer avec Microsoft',
      continueWithApple: 'Continuer avec Apple',
      continueWithPhone: 'Continuer avec le téléphone',
      phoneNumber: 'Numéro de téléphone',
      enterPhone: 'Entrez votre numéro de téléphone',
      sendCode: 'Envoyer le code',
      code: 'Code',
      enterCode: 'Entrez le code',
      verifyCode: 'Vérifier le code',
      codeSent: 'Code de vérification envoyé !',
      invalidCode: 'Code invalide. Veuillez réessayer.',
      resendConfirmationEmail: 'Renvoyer l\'e-mail de confirmation',
      errorSendingCode: 'Erreur lors de l\'envoi du code de vérification.',
      checkEmailForCode: 'Vérifiez votre e-mail pour le code de vérification.',
      errorSendingEmailCode: 'Erreur lors de l\'envoi du code par e-mail.',
      errorSendingPhoneCode: 'Erreur lors de l\'envoi du code par SMS.',
      checkPhoneForCode: 'Vérifiez votre téléphone pour le code de vérification.',
      welcomeVerified: 'Bienvenue !',
      accountVerifiedSuccess: 'Votre compte a été vérifié avec succès.',
      errorConnectingWith: 'Erreur de connexion avec',
      errorConnecting: 'Erreur de connexion. Veuillez réessayer.',
      enterPhoneNumber: 'Veuillez entrer votre numéro de téléphone',
      codeSentTitle: 'Code envoyé !',
      welcomeTitle: 'Bienvenue !'
    },
    'de': {
      welcomeBack: 'Willkommen zurück',
      createAccount: 'Erstellen Sie Ihr Konto',
      signInToAccess: 'Anmelden, um auf Ihre Erinnerungssammlung zuzugreifen',
      startPreserving: 'Beginnen Sie, Ihre wertvollen Erinnerungen zu bewahren',
      signIn: 'Anmelden',
      signUp: 'Registrieren',
      emailAddress: 'E-Mail-Adresse',
      enterEmail: 'Geben Sie Ihre E-Mail ein',
      password: 'Passwort',
      enterPassword: 'Geben Sie Ihr Passwort ein',
      confirmPassword: 'Passwort bestätigen',
      confirmPasswordPlaceholder: 'Bestätigen Sie Ihr Passwort',
      passwordStrength: 'Passwortstärke',
      tooShort: 'Zu kurz',
      fair: 'Akzeptabel',
      good: 'Gut',
      signingIn: 'Anmelden...',
      creatingAccount: 'Konto wird erstellt...',
      createAccountBtn: 'Konto erstellen',
      dontHaveAccount: 'Haben Sie noch kein Konto?',
      alreadyHaveAccount: 'Haben Sie bereits ein Konto?',
      createNewAccount: 'Ein neues Konto erstellen',
      signInExisting: 'Bei bestehendem Konto anmelden',
      byContinuing: 'Durch Fortfahren stimmen Sie unseren',
      termsOfService: 'Nutzungsbedingungen',
      and: 'und',
      privacyPolicy: 'Datenschutzrichtlinie',
      backToHome: '← Zurück zur Startseite',
      enterEmailAddress: 'Bitte geben Sie Ihre E-Mail-Adresse ein',
      enterValidEmail: 'Bitte geben Sie eine gültige E-Mail-Adresse ein',
      enterPasswordField: 'Bitte geben Sie Ihr Passwort ein',
      passwordMinLength: 'Das Passwort muss mindestens 6 Zeichen lang sein',
      passwordsNoMatch: 'Passwörter stimmen nicht überein',
      invalidCredentials: 'Ungültige E-Mail oder Passwort. Überprüfen Sie Ihre Anmeldedaten und versuchen Sie es erneut.',
      userAlreadyRegistered: 'Ein Konto mit dieser E-Mail existiert bereits. Versuchen Sie sich anzumelden.',
      emailNotConfirmed: 'Überprüfen Sie Ihre E-Mail und klicken Sie auf den Bestätigungslink, bevor Sie sich anmelden.',
      errorOccurred: 'Ein Fehler ist aufgetreten. Bitte versuchen Sie es erneut.',
      unexpectedError: 'Ein unerwarteter Fehler ist aufgetreten. Bitte versuchen Sie es erneut.',
      accountCreated: 'Konto erstellt! Überprüfen Sie Ihre E-Mail, um Ihr Konto zu verifizieren.',
      welcomeBackToast: 'Willkommen zurück!',
      signedInSuccessfully: 'Sie haben sich erfolgreich angemeldet.',
      orContinueWith: 'Oder fortfahren mit',
      continueWithGoogle: 'Mit Google fortfahren',
      continueWithMicrosoft: 'Mit Microsoft fortfahren',
      continueWithApple: 'Mit Apple fortfahren',
      continueWithPhone: 'Mit Telefon fortfahren',
      phoneNumber: 'Telefonnummer',
      enterPhone: 'Geben Sie Ihre Telefonnummer ein',
      sendCode: 'Code senden',
      code: 'Code',
      enterCode: 'Geben Sie den Code ein',
      verifyCode: 'Code verifizieren',
      codeSent: 'Bestätigungscode gesendet!',
      invalidCode: 'Ungültiger Code. Bitte versuchen Sie es erneut.',
      resendConfirmationEmail: 'Bestätigungs-E-Mail erneut senden',
      errorSendingCode: 'Fehler beim Senden des Bestätigungscodes.',
      checkEmailForCode: 'Überprüfen Sie Ihre E-Mail für den Bestätigungscode.',
      errorSendingEmailCode: 'Fehler beim Senden des E-Mail-Codes.',
      errorSendingPhoneCode: 'Fehler beim Senden des SMS-Codes.',
      checkPhoneForCode: 'Überprüfen Sie Ihr Telefon für den Bestätigungscode.',
      welcomeVerified: 'Willkommen!',
      accountVerifiedSuccess: 'Ihr Konto wurde erfolgreich verifiziert.',
      errorConnectingWith: 'Fehler beim Verbinden mit',
      errorConnecting: 'Verbindungsfehler. Bitte versuchen Sie es erneut.',
      enterPhoneNumber: 'Bitte geben Sie Ihre Telefonnummer ein',
      codeSentTitle: 'Code gesendet!',
      welcomeTitle: 'Willkommen!'
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
  const [pendingPhone, setPendingPhone] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');

  // Get redirect and plan from URL params
  const redirectTo = searchParams.get('redirect') || '/dashboard';
  const urlPlan = searchParams.get('plan');
  
  // Set initial plan from URL if provided
  useEffect(() => {
    if (urlPlan && !selectedPlan) {
      setSelectedPlan(urlPlan);
    }
  }, [urlPlan]);

  // Handle OAuth callback and redirect if already authenticated
  useEffect(() => {
    // Check for plan parameter from OAuth callback
    const planFromCallback = searchParams.get('plan');
    if (planFromCallback && planFromCallback !== selectedPlan) {
      setSelectedPlan(planFromCallback);
    }

    if (user) {
      // Check if user has a selected plan and redirect to checkout
      if (selectedPlan && selectedPlan !== 'free') {
        navigate(`/payment?plan=${selectedPlan}`, { replace: true });
      } else {
        navigate(redirectTo, { replace: true });
      }
    }
  }, [user, redirectTo, selectedPlan, navigate, searchParams]);

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

  // Handle email authentication with OTP
  const handleEmailAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) {
      setError(getText('enterEmailAddress'));
      return;
    }
    if (!email.includes('@')) {
      setError(getText('enterValidEmail'));
      return;
    }
    
    setLoading(true);
    setError('');
    
    try {
      const result = await authService.sendEmailOtp(email.trim());
      if (result.error) {
        setError(getText('errorSendingCode'));
      } else {
        setPendingSignupEmail(email.trim());
        setMode('email_otp');
        toast({
          title: getText('codeSent'),
          description: getText('checkEmailForCode'),
        });
      }
    } catch (error) {
      console.error('Email OTP error:', error);
      setError(getText('errorConnecting'));
    } finally {
      setLoading(false);
    }
  };

  // Legacy password-based auth for fallback
  const handlePasswordAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    if (!validateForm()) return;
    setLoading(true);
    
    try {
      const result = await signIn(email.trim(), password);
      if (!result.error) {
        await analyticsIntegrations.trackEvent('auth_signin_success', {
          email: email.trim()
        });
        toast({
          title: getText('welcomeBackToast'),
          description: getText('signedInSuccessfully'),
          variant: 'default'
        });

        if (selectedPlan && selectedPlan !== 'free') {
          setTimeout(() => {
            navigate(`/payment?plan=${selectedPlan}`, { replace: true });
          }, 1000);
        }
      } else {
        switch (result.error.message) {
          case 'Invalid login credentials':
            setError(getText('invalidCredentials'));
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

  const handleOAuthSignIn = async (provider: 'google' | 'apple' | 'azure') => {
    try {
      const redirectUrl = selectedPlan && selectedPlan !== 'free' 
        ? `${window.location.origin}/auth?plan=${selectedPlan}`
        : `${window.location.origin}/dashboard`;
      
      const result = await authService.signInWithOAuth(provider, redirectUrl);
      if (result.error) {
        setError(getText('errorConnectingWith') + ' ' + provider);
      }
    } catch (error) {
      console.error('OAuth error:', error);
      setError(getText('errorConnecting'));
    }
  };

  const handleEmailOtp = async () => {
    if (!email.trim()) {
      setError(getText('enterEmailAddress'));
      return;
    }
    
    setLoading(true);
    try {
      const result = await authService.sendEmailOtp(email.trim());
      if (result.error) {
        setError(getText('errorSendingEmailCode'));
      } else {
        setPendingSignupEmail(email.trim());
        setMode('email_otp');
        toast({
          title: getText('codeSentTitle'),
          description: getText('checkEmailForCode'),
        });
      }
    } catch (error) {
      console.error('Email OTP error:', error);
      setError(getText('errorConnecting'));
    } finally {
      setLoading(false);
    }
  };

  const handlePhoneOtp = async () => {
    if (!phoneNumber.trim()) {
      setError(getText('enterPhoneNumber'));
      return;
    }
    
    setLoading(true);
    try {
      const result = await authService.sendPhoneOtp(phoneNumber.trim());
      if (result.error) {
        setError(getText('errorSendingPhoneCode'));
      } else {
        setPendingPhone(phoneNumber.trim());
        setMode('phone_otp');
        toast({
          title: getText('codeSentTitle'),
          description: getText('checkPhoneForCode'),
        });
      }
    } catch (error) {
      console.error('Phone OTP error:', error);
      setError(getText('errorConnecting'));
    } finally {
      setLoading(false);
    }
  };

  const handleOtpVerified = () => {
    toast({
      title: getText('welcomeTitle'),
      description: getText('accountVerifiedSuccess'),
    });
    
    if (selectedPlan && selectedPlan !== 'free') {
      navigate(`/payment?plan=${selectedPlan}`, { replace: true });
    } else {
      navigate('/dashboard', { replace: true });
    }
  };

  // Show verification screens
  if (mode === 'email_confirmation') {
    return (
      <EmailConfirmationScreen
        email={pendingSignupEmail}
        selectedPlan={selectedPlan !== 'free' ? selectedPlan : undefined}
        onConfirmed={handleEmailConfirmed}
      />
    );
  }

  if (mode === 'email_otp') {
    return (
      <>
        {user && <EternaHeader />}
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
                <Button variant="ghost" onClick={() => setMode('signin')} className="flex items-center gap-2">
                  <ArrowLeft className="h-4 w-4" />
                  Voltar
                </Button>
              </div>

              {/* Icon */}
              <div className="flex justify-center mb-6">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center">
                  <Mail className="h-8 w-8 text-primary" />
                </div>
              </div>

              {/* Title and Description */}
              <h1 className="text-2xl font-semibold text-foreground mb-2">
                Email enviado
              </h1>
              
              <p className="text-muted-foreground mb-2">
                Verifique seu email para um código de 6 dígitos e digite abaixo.
              </p>
              
              <p className="text-sm text-muted-foreground mb-8">
                (Pode estar na pasta de spam)
              </p>

              {/* Error Message */}
              {error && (
                <Alert variant="destructive" className="mb-6">
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              <OTPVerification
                type="email"
                identifier={pendingSignupEmail}
                onVerified={handleOtpVerified}
                onBack={() => setMode('signin')}
              />
            </motion.div>
          </div>
        </div>
      </>
    );
  }

  if (mode === 'phone_otp') {
    return (
      <OTPVerification
        type="phone"
        identifier={pendingPhone}
        onVerified={handleOtpVerified}
        onBack={() => setMode('phone_input')}
        onResend={() => handlePhoneOtp()}
      />
    );
  }

  if (mode === 'phone_input') {
    return (
      <>
        {user && <EternaHeader />}
        <div className="min-h-screen bg-background flex flex-col justify-center items-center p-4 relative">
          <div className="w-full max-w-sm relative z-20">
            <motion.div 
              initial={{ opacity: 0, y: 20 }} 
              animate={{ opacity: 1, y: 0 }} 
              transition={{ duration: 0.5 }}
            >
              <div className="text-center mb-8">
                <h1 className="text-2xl font-semibold text-foreground">
                  {getText('phoneNumber')}
                </h1>
              </div>

              {error && (
                <Alert variant="destructive" className="mb-6">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              <div className="space-y-6">
                <FloatingInput
                  id="phone"
                  type="tel"
                  value={phoneNumber}
                  onChange={e => setPhoneNumber(e.target.value)}
                  label={getText('phoneNumber')}
                  placeholder={getText('enterPhone')}
                  disabled={loading}
                />

                <Button
                  onClick={handlePhoneOtp}
                  disabled={loading || !phoneNumber.trim()}
                  className="w-full"
                >
                  {loading ? 'Enviando...' : getText('sendCode')}
                </Button>

                <Button
                  variant="ghost"
                  onClick={() => setMode('signin')}
                  className="w-full"
                >
                  Voltar
                </Button>
              </div>
            </motion.div>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      {/* Show header if user is logged in */}
      {user && <EternaHeader />}
      
      {/* OpenAI Style Auth Page */}
      <div className="min-h-screen bg-background flex flex-col justify-center items-center p-4 relative">
        {/* Gradient blur effect at top */}
        <div className="absolute top-0 left-0 right-0 h-32 bg-gradient-to-b from-background/95 via-background/70 to-transparent backdrop-blur-md pointer-events-none z-10"></div>
        {/* Back to Home Button */}
        <div className="w-full max-w-sm mb-8 relative z-20">
          <Button
            variant="ghost"
            onClick={() => navigate('/')}
            className="text-muted-foreground hover:text-foreground transition-colors"
          >
            {getText('backToHome')}
          </Button>
        </div>

        <div className="w-full max-w-sm relative z-20">
          <motion.div 
            initial={{ opacity: 0, y: 20 }} 
            animate={{ opacity: 1, y: 0 }} 
            transition={{ duration: 0.5 }}
            className="relative z-20"
          >
            <div className="text-center mb-10">
              <motion.div 
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                className="w-20 h-20 mx-auto bg-gradient-to-br from-primary/20 to-primary/10 rounded-3xl flex items-center justify-center mb-8"
              >
                <Heart className="w-10 h-10 text-primary" />
              </motion.div>
              <h1 className="text-3xl font-semibold text-foreground tracking-tight">
                Bem-vindo
              </h1>
              <p className="text-muted-foreground/70 mt-3 text-lg">
                Entre para acessar suas memórias
              </p>
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
            <form onSubmit={handleEmailAuth} className="space-y-6">
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

              {/* Continue Button - Fixed primary colors */}
              <Button 
                type="submit" 
                className="w-full h-12 text-base font-semibold bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 rounded-xl mt-6" 
                disabled={loading || !email.trim()}
              >
                {loading ? 'Enviando código...' : 'Continuar com Email'}
              </Button>
            </form>

            {/* Divider */}
            <div className="flex items-center justify-center my-6">
              <div className="flex-1 border-t border-border"></div>
              <span className="px-4 text-sm text-muted-foreground">{getText('orContinueWith')}</span>
              <div className="flex-1 border-t border-border"></div>
            </div>

            {/* Social Login Buttons */}
            <div className="space-y-3">
              <Button
                type="button"
                variant="outline"
                onClick={() => handleOAuthSignIn('google')}
                disabled={loading}
                className="w-full h-12 text-base font-medium border-border hover:bg-muted/50 transition-colors"
              >
                <svg className="w-5 h-5 mr-3" viewBox="0 0 24 24">
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
                onClick={() => handleOAuthSignIn('apple')}
                disabled={loading}
                className="w-full h-12 text-base font-medium border-border hover:bg-muted/50 transition-colors"
              >
                <svg className="w-5 h-5 mr-3" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/>
                </svg>
                {getText('continueWithApple')}
              </Button>
              
              <Button
                type="button"
                variant="outline"
                onClick={() => handleOAuthSignIn('azure')}
                disabled={loading}
                className="w-full h-12 text-base font-medium border-border hover:bg-muted/50 transition-colors"
              >
                <svg className="w-5 h-5 mr-3" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M5.8 2L12.7 3.3L22 5.2V18.8L12.7 20.7L5.8 22L2 18.8V5.2L5.8 2M7.5 4.9V19.1L20 17.4V6.6L7.5 4.9M9.8 7.5L17.6 6.3V17.7L9.8 16.5V7.5Z"/>
                </svg>
                {getText('continueWithMicrosoft')}
              </Button>
            </div>

            {/* Alternative Auth Methods */}
            <div className="mt-6 space-y-3">
              <Button
                type="button"
                variant="outline"
                onClick={handleEmailOtp}
                disabled={loading || !email.trim()}
                className="w-full h-12 text-base font-medium border-border hover:bg-muted/50 transition-colors"
              >
                <Mail className="w-5 h-5 mr-3" />
                Continuar com código por email
              </Button>
              
              <Button
                type="button"
                variant="outline"
                onClick={() => setMode('phone_input')}
                disabled={loading}
                className="w-full h-12 text-base font-medium border-border hover:bg-muted/50 transition-colors"
              >
                <Phone className="w-5 h-5 mr-3" />
                {getText('continueWithPhone')}
              </Button>
            </div>

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