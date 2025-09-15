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
    },
    'it': {
      welcomeBack: 'Bentornato',
      createAccount: 'Crea il tuo account',
      signInToAccess: 'Accedi per accedere al tuo Portafoglio della Memoria',
      startPreserving: 'Inizia a preservare i tuoi ricordi preziosi',
      signIn: 'Accedi',
      signUp: 'Registrati',
      emailAddress: 'Indirizzo email',
      enterEmail: 'Inserisci la tua email',
      password: 'Password',
      enterPassword: 'Inserisci la tua password',
      confirmPassword: 'Conferma password',
      confirmPasswordPlaceholder: 'Conferma la tua password',
      passwordStrength: 'Forza password',
      tooShort: 'Troppo corta',
      fair: 'Discreta',
      good: 'Buona',
      signingIn: 'Accesso in corso...',
      creatingAccount: 'Creazione account...',
      createAccountBtn: 'Crea Account',
      dontHaveAccount: 'Non hai un account?',
      alreadyHaveAccount: 'Hai già un account?',
      createNewAccount: 'Crea un nuovo account',
      signInExisting: 'Accedi all\'account esistente',
      byContinuing: 'Continuando, accetti i nostri',
      termsOfService: 'Termini di Servizio',
      and: 'e',
      privacyPolicy: 'Informativa sulla Privacy',
      backToHome: '← Torna alla Home',
      enterEmailAddress: 'Inserisci il tuo indirizzo email',
      enterValidEmail: 'Inserisci un indirizzo email valido',
      enterPasswordField: 'Inserisci la tua password',
      passwordMinLength: 'La password deve essere di almeno 6 caratteri',
      passwordsNoMatch: 'Le password non corrispondono',
      invalidCredentials: 'Email o password non validi. Controlla le tue credenziali e riprova.',
      userAlreadyRegistered: 'Un account con questa email esiste già. Prova ad accedere.',
      emailNotConfirmed: 'Controlla la tua email e clicca sul link di conferma prima di accedere.',
      errorOccurred: 'Si è verificato un errore. Riprova.',
      unexpectedError: 'Si è verificato un errore imprevisto. Riprova.',
      accountCreated: 'Account creato! Controlla la tua email per verificare il tuo account.',
      welcomeBackToast: 'Bentornato!',
      signedInSuccessfully: 'Hai effettuato l\'accesso con successo.',
      orContinueWith: 'O continua con',
      continueWithGoogle: 'Continua con Google',
      continueWithMicrosoft: 'Continua con Microsoft',
      continueWithApple: 'Continua con Apple',
      continueWithPhone: 'Continua con Telefono',
      phoneNumber: 'Numero di telefono',
      enterPhone: 'Inserisci il tuo numero di telefono',
      sendCode: 'Invia codice',
      code: 'Codice',
      enterCode: 'Inserisci il codice',
      verifyCode: 'Verifica codice',
      codeSent: 'Codice di verifica inviato!',
      invalidCode: 'Codice non valido. Riprova.',
      resendConfirmationEmail: 'Reinvia email di conferma',
      errorSendingCode: 'Errore nell\'invio del codice di verifica.',
      checkEmailForCode: 'Controlla la tua email per il codice di verifica.',
      errorSendingEmailCode: 'Errore nell\'invio del codice email.',
      errorSendingPhoneCode: 'Errore nell\'invio del codice SMS.',
      checkPhoneForCode: 'Controlla il tuo telefono per il codice di verifica.',
      welcomeVerified: 'Benvenuto!',
      accountVerifiedSuccess: 'Il tuo account è stato verificato con successo.',
      errorConnectingWith: 'Errore di connessione con',
      errorConnecting: 'Errore di connessione. Riprova.',
      enterPhoneNumber: 'Inserisci il tuo numero di telefono',
      codeSentTitle: 'Codice inviato!',
      welcomeTitle: 'Benvenuto!'
    },
    'ru': {
      welcomeBack: 'Добро пожаловать',
      createAccount: 'Создайте аккаунт',
      signInToAccess: 'Войдите, чтобы получить доступ к своему Кошельку Памяти',
      startPreserving: 'Начните сохранять свои драгоценные воспоминания',
      signIn: 'Войти',
      signUp: 'Регистрация',
      emailAddress: 'Адрес электронной почты',
      enterEmail: 'Введите свой email',
      password: 'Пароль',
      enterPassword: 'Введите пароль',
      confirmPassword: 'Подтвердите пароль',
      confirmPasswordPlaceholder: 'Подтвердите пароль',
      passwordStrength: 'Надежность пароля',
      tooShort: 'Слишком короткий',
      fair: 'Удовлетворительный',
      good: 'Хороший',
      signingIn: 'Вход...',
      creatingAccount: 'Создание аккаунта...',
      createAccountBtn: 'Создать аккаунт',
      dontHaveAccount: 'Нет аккаунта?',
      alreadyHaveAccount: 'Уже есть аккаунт?',
      createNewAccount: 'Создать новый аккаунт',
      signInExisting: 'Войти в существующий аккаунт',
      byContinuing: 'Продолжая, вы соглашаетесь с нашими',
      termsOfService: 'Условиями обслуживания',
      and: 'и',
      privacyPolicy: 'Политикой конфиденциальности',
      backToHome: '← Вернуться на главную',
      enterEmailAddress: 'Пожалуйста, введите свой адрес электронной почты',
      enterValidEmail: 'Пожалуйста, введите действительный адрес электронной почты',
      enterPasswordField: 'Пожалуйста, введите пароль',
      passwordMinLength: 'Пароль должен содержать не менее 6 символов',
      passwordsNoMatch: 'Пароли не совпадают',
      invalidCredentials: 'Неверный email или пароль. Проверьте данные и попробуйте снова.',
      userAlreadyRegistered: 'Аккаунт с таким email уже существует. Попробуйте войти.',
      emailNotConfirmed: 'Проверьте почту и нажмите на ссылку подтверждения перед входом.',
      errorOccurred: 'Произошла ошибка. Попробуйте снова.',
      unexpectedError: 'Произошла неожиданная ошибка. Попробуйте снова.',
      accountCreated: 'Аккаунт создан! Проверьте почту для подтверждения аккаунта.',
      welcomeBackToast: 'Добро пожаловать!',
      signedInSuccessfully: 'Вы успешно вошли в систему.',
      orContinueWith: 'Или продолжить с',
      continueWithGoogle: 'Продолжить с Google',
      continueWithMicrosoft: 'Продолжить с Microsoft',
      continueWithApple: 'Продолжить с Apple',
      continueWithPhone: 'Продолжить с телефоном',
      phoneNumber: 'Номер телефона',
      enterPhone: 'Введите номер телефона',
      sendCode: 'Отправить код',
      code: 'Код',
      enterCode: 'Введите код',
      verifyCode: 'Проверить код',
      codeSent: 'Код подтверждения отправлен!',
      invalidCode: 'Неверный код. Попробуйте снова.',
      resendConfirmationEmail: 'Отправить письмо подтверждения повторно',
      errorSendingCode: 'Ошибка отправки кода подтверждения.',
      checkEmailForCode: 'Проверьте почту для получения кода подтверждения.',
      errorSendingEmailCode: 'Ошибка отправки кода на email.',
      errorSendingPhoneCode: 'Ошибка отправки SMS-кода.',
      checkPhoneForCode: 'Проверьте телефон для получения кода подтверждения.',
      welcomeVerified: 'Добро пожаловать!',
      accountVerifiedSuccess: 'Ваш аккаунт успешно подтвержден.',
      errorConnectingWith: 'Ошибка подключения к',
      errorConnecting: 'Ошибка подключения. Попробуйте снова.',
      enterPhoneNumber: 'Пожалуйста, введите номер телефона',
      codeSentTitle: 'Код отправлен!',
      welcomeTitle: 'Добро пожаловать!'
    },
    'ja': {
      welcomeBack: 'お帰りなさい',
      createAccount: 'アカウントを作成',
      signInToAccess: 'メモリーウォレットにアクセスするためにサインイン',
      startPreserving: '大切な思い出の保存を始めましょう',
      signIn: 'サインイン',
      signUp: 'サインアップ',
      emailAddress: 'メールアドレス',
      enterEmail: 'メールアドレスを入力',
      password: 'パスワード',
      enterPassword: 'パスワードを入力',
      confirmPassword: 'パスワード確認',
      confirmPasswordPlaceholder: 'パスワードを確認',
      passwordStrength: 'パスワード強度',
      tooShort: '短すぎます',
      fair: '普通',
      good: '良好',
      signingIn: 'サインイン中...',
      creatingAccount: 'アカウント作成中...',
      createAccountBtn: 'アカウント作成',
      dontHaveAccount: 'アカウントをお持ちでない方は',
      alreadyHaveAccount: 'すでにアカウントをお持ちの方は',
      createNewAccount: '新しいアカウントを作成',
      signInExisting: '既存のアカウントでサインイン',
      byContinuing: '続行することで、当社の',
      termsOfService: '利用規約',
      and: 'と',
      privacyPolicy: 'プライバシーポリシー',
      backToHome: '← ホームに戻る',
      enterEmailAddress: 'メールアドレスを入力してください',
      enterValidEmail: '有効なメールアドレスを入力してください',
      enterPasswordField: 'パスワードを入力してください',
      passwordMinLength: 'パスワードは6文字以上である必要があります',
      passwordsNoMatch: 'パスワードが一致しません',
      invalidCredentials: 'メールアドレスまたはパスワードが無効です。認証情報を確認して再試行してください。',
      userAlreadyRegistered: 'このメールアドレスのアカウントは既に存在します。サインインをお試しください。',
      emailNotConfirmed: 'サインインする前にメールを確認し、確認リンクをクリックしてください。',
      errorOccurred: 'エラーが発生しました。再試行してください。',
      unexpectedError: '予期しないエラーが発生しました。再試行してください。',
      accountCreated: 'アカウントが作成されました！アカウントを確認するためにメールをチェックしてください。',
      welcomeBackToast: 'おかえりなさい！',
      signedInSuccessfully: '正常にサインインしました。',
      orContinueWith: 'または続行',
      continueWithGoogle: 'Googleで続行',
      continueWithMicrosoft: 'Microsoftで続行',
      continueWithApple: 'Appleで続行',
      continueWithPhone: '電話で続行',
      phoneNumber: '電話番号',
      enterPhone: '電話番号を入力',
      sendCode: 'コードを送信',
      code: 'コード',
      enterCode: 'コードを入力',
      verifyCode: 'コードを確認',
      codeSent: '確認コードが送信されました！',
      invalidCode: '無効なコードです。再試行してください。',
      resendConfirmationEmail: '確認メールを再送信',
      errorSendingCode: '確認コードの送信でエラーが発生しました。',
      checkEmailForCode: '確認コードのメールをチェックしてください。',
      errorSendingEmailCode: 'メールコードの送信でエラーが発生しました。',
      errorSendingPhoneCode: 'SMSコードの送信でエラーが発生しました。',
      checkPhoneForCode: '確認コードの電話をチェックしてください。',
      welcomeVerified: 'ようこそ！',
      accountVerifiedSuccess: 'アカウントが正常に確認されました。',
      errorConnectingWith: '接続エラー',
      errorConnecting: '接続エラーです。再試行してください。',
      enterPhoneNumber: '電話番号を入力してください',
      codeSentTitle: 'コードが送信されました！',
      welcomeTitle: 'ようこそ！'
    },
    'zh-TW': {
      welcomeBack: '歡迎回來',
      createAccount: '建立您的帳戶',
      signInToAccess: '登入以存取您的記憶錢包',
      startPreserving: '開始保存您的珍貴記憶',
      signIn: '登入',
      signUp: '註冊',
      emailAddress: '電子郵件地址',
      enterEmail: '輸入您的電子郵件',
      password: '密碼',
      enterPassword: '輸入您的密碼',
      confirmPassword: '確認密碼',
      confirmPasswordPlaceholder: '確認您的密碼',
      passwordStrength: '密碼強度',
      tooShort: '太短',
      fair: '一般',
      good: '良好',
      signingIn: '登入中...',
      creatingAccount: '建立帳戶中...',
      createAccountBtn: '建立帳戶',
      dontHaveAccount: '還沒有帳戶？',
      alreadyHaveAccount: '已有帳戶？',
      createNewAccount: '建立新帳戶',
      signInExisting: '登入現有帳戶',
      byContinuing: '繼續即表示您同意我們的',
      termsOfService: '服務條款',
      and: '和',
      privacyPolicy: '隱私政策',
      backToHome: '← 返回首頁',
      enterEmailAddress: '請輸入您的電子郵件地址',
      enterValidEmail: '請輸入有效的電子郵件地址',
      enterPasswordField: '請輸入您的密碼',
      passwordMinLength: '密碼必須至少6個字符',
      passwordsNoMatch: '密碼不匹配',
      invalidCredentials: '電子郵件或密碼無效。請檢查您的憑據並重試。',
      userAlreadyRegistered: '此電子郵件已存在帳戶。請嘗試登入。',
      emailNotConfirmed: '請檢查您的電子郵件並點擊確認連結後再登入。',
      errorOccurred: '發生錯誤。請重試。',
      unexpectedError: '發生意外錯誤。請重試。',
      accountCreated: '帳戶已建立！請檢查您的電子郵件以驗證帳戶。',
      welcomeBackToast: '歡迎回來！',
      signedInSuccessfully: '您已成功登入。',
      orContinueWith: '或繼續使用',
      continueWithGoogle: '使用 Google 繼續',
      continueWithMicrosoft: '使用 Microsoft 繼續',
      continueWithApple: '使用 Apple 繼續',
      continueWithPhone: '使用手機繼續',
      phoneNumber: '手機號碼',
      enterPhone: '輸入您的手機號碼',
      sendCode: '發送驗證碼',
      code: '驗證碼',
      enterCode: '輸入驗證碼',
      verifyCode: '驗證驗證碼',
      codeSent: '驗證碼已發送！',
      invalidCode: '驗證碼無效。請重試。',
      resendConfirmationEmail: '重新發送確認郵件',
      errorSendingCode: '發送驗證碼時出錯。',
      checkEmailForCode: '請檢查您的電子郵件獲取驗證碼。',
      errorSendingEmailCode: '發送電子郵件驗證碼時出錯。',
      errorSendingPhoneCode: '發送簡訊驗證碼時出錯。',
      checkPhoneForCode: '請檢查您的手機獲取驗證碼。',
      welcomeVerified: '歡迎！',
      accountVerifiedSuccess: '您的帳戶已成功驗證。',
      errorConnectingWith: '連接出錯',
      errorConnecting: '連接出錯。請重試。',
      enterPhoneNumber: '請輸入您的手機號碼',
      codeSentTitle: '驗證碼已發送！',
      welcomeTitle: '歡迎！'
    },
    'ko': {
      welcomeBack: '다시 오신 것을 환영합니다',
      createAccount: '계정 만들기',
      signInToAccess: '메모리 지갑에 액세스하려면 로그인하세요',
      startPreserving: '소중한 추억 보존을 시작하세요',
      signIn: '로그인',
      signUp: '회원가입',
      emailAddress: '이메일 주소',
      enterEmail: '이메일을 입력하세요',
      password: '비밀번호',
      enterPassword: '비밀번호를 입력하세요',
      confirmPassword: '비밀번호 확인',
      confirmPasswordPlaceholder: '비밀번호를 확인하세요',
      passwordStrength: '비밀번호 강도',
      tooShort: '너무 짧음',
      fair: '보통',
      good: '좋음',
      signingIn: '로그인 중...',
      creatingAccount: '계정 생성 중...',
      createAccountBtn: '계정 만들기',
      dontHaveAccount: '계정이 없으신가요?',
      alreadyHaveAccount: '이미 계정이 있으신가요?',
      createNewAccount: '새 계정 만들기',
      signInExisting: '기존 계정으로 로그인',
      byContinuing: '계속 진행하면 당사의',
      termsOfService: '서비스 약관',
      and: '및',
      privacyPolicy: '개인정보 보호정책',
      backToHome: '← 홈으로 돌아가기',
      enterEmailAddress: '이메일 주소를 입력해주세요',
      enterValidEmail: '유효한 이메일 주소를 입력해주세요',
      enterPasswordField: '비밀번호를 입력해주세요',
      passwordMinLength: '비밀번호는 최소 6자 이상이어야 합니다',
      passwordsNoMatch: '비밀번호가 일치하지 않습니다',
      invalidCredentials: '이메일 또는 비밀번호가 잘못되었습니다. 자격 증명을 확인하고 다시 시도하세요.',
      userAlreadyRegistered: '이 이메일로 계정이 이미 존재합니다. 로그인을 시도해보세요.',
      emailNotConfirmed: '로그인하기 전에 이메일을 확인하고 확인 링크를 클릭하세요.',
      errorOccurred: '오류가 발생했습니다. 다시 시도해주세요.',
      unexpectedError: '예상치 못한 오류가 발생했습니다. 다시 시도해주세요.',
      accountCreated: '계정이 생성되었습니다! 계정을 확인하려면 이메일을 확인하세요.',
      welcomeBackToast: '다시 오신 것을 환영합니다!',
      signedInSuccessfully: '성공적으로 로그인했습니다.',
      orContinueWith: '또는 다음으로 계속',
      continueWithGoogle: 'Google로 계속',
      continueWithMicrosoft: 'Microsoft로 계속',
      continueWithApple: 'Apple로 계속',
      continueWithPhone: '휴대폰으로 계속',
      phoneNumber: '휴대폰 번호',
      enterPhone: '휴대폰 번호를 입력하세요',
      sendCode: '코드 전송',
      code: '코드',
      enterCode: '코드를 입력하세요',
      verifyCode: '코드 확인',
      codeSent: '인증 코드가 전송되었습니다!',
      invalidCode: '잘못된 코드입니다. 다시 시도하세요.',
      resendConfirmationEmail: '확인 이메일 재전송',
      errorSendingCode: '인증 코드 전송 중 오류가 발생했습니다.',
      checkEmailForCode: '인증 코드를 위해 이메일을 확인하세요.',
      errorSendingEmailCode: '이메일 코드 전송 중 오류가 발생했습니다.',
      errorSendingPhoneCode: 'SMS 코드 전송 중 오류가 발생했습니다.',
      checkPhoneForCode: '인증 코드를 위해 휴대폰을 확인하세요.',
      welcomeVerified: '환영합니다!',
      accountVerifiedSuccess: '계정이 성공적으로 확인되었습니다.',
      errorConnectingWith: '연결 오류',
      errorConnecting: '연결 오류입니다. 다시 시도하세요.',
      enterPhoneNumber: '휴대폰 번호를 입력해주세요',
      codeSentTitle: '코드가 전송되었습니다!',
      welcomeTitle: '환영합니다!'
    },
    'ar': {
      welcomeBack: 'مرحباً بعودتك',
      createAccount: 'إنشاء حسابك',
      signInToAccess: 'قم بتسجيل الدخول للوصول إلى محفظة الذكريات',
      startPreserving: 'ابدأ في حفظ ذكرياتك الثمينة',
      signIn: 'تسجيل الدخول',
      signUp: 'التسجيل',
      emailAddress: 'عنوان البريد الإلكتروني',
      enterEmail: 'أدخل بريدك الإلكتروني',
      password: 'كلمة المرور',
      enterPassword: 'أدخل كلمة المرور',
      confirmPassword: 'تأكيد كلمة المرور',
      confirmPasswordPlaceholder: 'أكد كلمة المرور',
      passwordStrength: 'قوة كلمة المرور',
      tooShort: 'قصيرة جداً',
      fair: 'مقبولة',
      good: 'جيدة',
      signingIn: 'جاري تسجيل الدخول...',
      creatingAccount: 'جاري إنشاء الحساب...',
      createAccountBtn: 'إنشاء حساب',
      dontHaveAccount: 'ليس لديك حساب؟',
      alreadyHaveAccount: 'لديك حساب بالفعل؟',
      createNewAccount: 'إنشاء حساب جديد',
      signInExisting: 'تسجيل الدخول للحساب الموجود',
      byContinuing: 'بالمتابعة، أنت توافق على',
      termsOfService: 'شروط الخدمة',
      and: 'و',
      privacyPolicy: 'سياسة الخصوصية',
      backToHome: '← العودة للرئيسية',
      enterEmailAddress: 'يرجى إدخال عنوان بريدك الإلكتروني',
      enterValidEmail: 'يرجى إدخال عنوان بريد إلكتروني صحيح',
      enterPasswordField: 'يرجى إدخال كلمة المرور',
      passwordMinLength: 'يجب أن تحتوي كلمة المرور على 6 أحرف على الأقل',
      passwordsNoMatch: 'كلمات المرور غير متطابقة',
      invalidCredentials: 'البريد الإلكتروني أو كلمة المرور غير صحيحة. تحقق من بياناتك وحاول مرة أخرى.',
      userAlreadyRegistered: 'يوجد حساب بهذا البريد الإلكتروني بالفعل. حاول تسجيل الدخول.',
      emailNotConfirmed: 'تحقق من بريدك الإلكتروني وانقر على رابط التأكيد قبل تسجيل الدخول.',
      errorOccurred: 'حدث خطأ. يرجى المحاولة مرة أخرى.',
      unexpectedError: 'حدث خطأ غير متوقع. يرجى المحاولة مرة أخرى.',
      accountCreated: 'تم إنشاء الحساب! تحقق من بريدك الإلكتروني للتحقق من حسابك.',
      welcomeBackToast: 'مرحباً بعودتك!',
      signedInSuccessfully: 'تم تسجيل دخولك بنجاح.',
      orContinueWith: 'أو المتابعة مع',
      continueWithGoogle: 'المتابعة مع Google',
      continueWithMicrosoft: 'المتابعة مع Microsoft',
      continueWithApple: 'المتابعة مع Apple',
      continueWithPhone: 'المتابعة مع الهاتف',
      phoneNumber: 'رقم الهاتف',
      enterPhone: 'أدخل رقم هاتفك',
      sendCode: 'إرسال الرمز',
      code: 'الرمز',
      enterCode: 'أدخل الرمز',
      verifyCode: 'التحقق من الرمز',
      codeSent: 'تم إرسال رمز التحقق!',
      invalidCode: 'رمز غير صحيح. حاول مرة أخرى.',
      resendConfirmationEmail: 'إعادة إرسال بريد التأكيد',
      errorSendingCode: 'خطأ في إرسال رمز التحقق.',
      checkEmailForCode: 'تحقق من بريدك الإلكتروني للحصول على رمز التحقق.',
      errorSendingEmailCode: 'خطأ في إرسال رمز البريد الإلكتروني.',
      errorSendingPhoneCode: 'خطأ في إرسال رمز الرسائل النصية.',
      checkPhoneForCode: 'تحقق من هاتفك للحصول على رمز التحقق.',
      welcomeVerified: 'أهلاً وسهلاً!',
      accountVerifiedSuccess: 'تم التحقق من حسابك بنجاح.',
      errorConnectingWith: 'خطأ في الاتصال مع',
      errorConnecting: 'خطأ في الاتصال. حاول مرة أخرى.',
      enterPhoneNumber: 'يرجى إدخال رقم هاتفك',
      codeSentTitle: 'تم إرسال الرمز!',
      welcomeTitle: 'أهلاً وسهلاً!'
    },
    'hi': {
      welcomeBack: 'वापसी पर स्वागत',
      createAccount: 'अपना खाता बनाएं',
      signInToAccess: 'अपने मेमोरी वॉलेट तक पहुंचने के लिए साइन इन करें',
      startPreserving: 'अपनी कीमती यादों को संरक्षित करना शुरू करें',
      signIn: 'साइन इन',
      signUp: 'साइन अप',
      emailAddress: 'ईमेल पता',
      enterEmail: 'अपना ईमेल दर्ज करें',
      password: 'पासवर्ड',
      enterPassword: 'अपना पासवर्ड दर्ज करें',
      confirmPassword: 'पासवर्ड की पुष्टि करें',
      confirmPasswordPlaceholder: 'अपने पासवर्ड की पुष्टि करें',
      passwordStrength: 'पासवर्ड की मजबूती',
      tooShort: 'बहुत छोटा',
      fair: 'ठीक',
      good: 'अच्छा',
      signingIn: 'साइन इन हो रहा है...',
      creatingAccount: 'खाता बनाया जा रहा है...',
      createAccountBtn: 'खाता बनाएं',
      dontHaveAccount: 'खाता नहीं है?',
      alreadyHaveAccount: 'पहले से खाता है?',
      createNewAccount: 'नया खाता बनाएं',
      signInExisting: 'मौजूदा खाते में साइन इन करें',
      byContinuing: 'जारी रखकर, आप हमारी',
      termsOfService: 'सेवा की शर्तों',
      and: 'और',
      privacyPolicy: 'गोपनीयता नीति',
      backToHome: '← होम पर वापस',
      enterEmailAddress: 'कृपया अपना ईमेल पता दर्ज करें',
      enterValidEmail: 'कृपया एक वैध ईमेल पता दर्ज करें',
      enterPasswordField: 'कृपया अपना पासवर्ड दर्ज करें',
      passwordMinLength: 'पासवर्ड कम से कम 6 अक्षरों का होना चाहिए',
      passwordsNoMatch: 'पासवर्ड मेल नहीं खाते',
      invalidCredentials: 'अवैध ईमेल या पासवर्ड। कृपया अपनी साख की जांच करें और पुनः प्रयास करें।',
      userAlreadyRegistered: 'इस ईमेल के साथ पहले से एक खाता मौजूद है। साइन इन करने का प्रयास करें।',
      emailNotConfirmed: 'साइन इन करने से पहले कृपया अपना ईमेल जांचें और पुष्टि लिंक पर क्लिक करें।',
      errorOccurred: 'एक त्रुटि हुई। कृपया पुनः प्रयास करें।',
      unexpectedError: 'एक अप्रत्याशित त्रुटि हुई। कृपया पुनः प्रयास करें।',
      accountCreated: 'खाता बनाया गया! कृपया अपने खाते को सत्यापित करने के लिए अपना ईमेल जांचें।',
      welcomeBackToast: 'वापसी पर स्वागत!',
      signedInSuccessfully: 'आपने सफलतापूर्वक साइन इन किया है।',
      orContinueWith: 'या इसके साथ जारी रखें',
      continueWithGoogle: 'Google के साथ जारी रखें',
      continueWithMicrosoft: 'Microsoft के साथ जारी रखें',
      continueWithApple: 'Apple के साथ जारी रखें',
      continueWithPhone: 'फोन के साथ जारी रखें',
      phoneNumber: 'फोन नंबर',
      enterPhone: 'अपना फोन नंबर दर्ज करें',
      sendCode: 'कोड भेजें',
      code: 'कोड',
      enterCode: 'कोड दर्ज करें',
      verifyCode: 'कोड सत्यापित करें',
      codeSent: 'सत्यापन कोड भेजा गया!',
      invalidCode: 'अमान्य कोड। कृपया पुनः प्रयास करें।',
      resendConfirmationEmail: 'पुष्टि ईमेल पुनः भेजें',
      errorSendingCode: 'सत्यापन कोड भेजने में त्रुटि।',
      checkEmailForCode: 'सत्यापन कोड के लिए अपना ईमेल जांचें।',
      errorSendingEmailCode: 'ईमेल कोड भेजने में त्रुटि।',
      errorSendingPhoneCode: 'SMS कोड भेजने में त्रुटि।',
      checkPhoneForCode: 'सत्यापन कोड के लिए अपना फोन जांचें।',
      welcomeVerified: 'स्वागत!',
      accountVerifiedSuccess: 'आपका खाता सफलतापूर्वक सत्यापित हो गया है।',
      errorConnectingWith: 'कनेक्ट करने में त्रुटि',
      errorConnecting: 'कनेक्शन त्रुटि। कृपया पुनः प्रयास करें।',
      enterPhoneNumber: 'कृपया अपना फोन नंबर दर्ज करें',
      codeSentTitle: 'कोड भेजा गया!',
      welcomeTitle: 'स्वागत!'
    },
    'nl': {
      welcomeBack: 'Welkom terug',
      createAccount: 'Maak uw account aan',
      signInToAccess: 'Log in om toegang te krijgen tot uw Geheugen Portemonnee',
      startPreserving: 'Begin met het bewaren van uw kostbare herinneringen',
      signIn: 'Inloggen',
      signUp: 'Registreren',
      emailAddress: 'E-mailadres',
      enterEmail: 'Voer uw e-mail in',
      password: 'Wachtwoord',
      enterPassword: 'Voer uw wachtwoord in',
      confirmPassword: 'Bevestig wachtwoord',
      confirmPasswordPlaceholder: 'Bevestig uw wachtwoord',
      passwordStrength: 'Wachtwoord sterkte',
      tooShort: 'Te kort',
      fair: 'Redelijk',
      good: 'Goed',
      signingIn: 'Inloggen...',
      creatingAccount: 'Account aanmaken...',
      createAccountBtn: 'Account aanmaken',
      dontHaveAccount: 'Heeft u geen account?',
      alreadyHaveAccount: 'Heeft u al een account?',
      createNewAccount: 'Nieuw account aanmaken',
      signInExisting: 'Inloggen op bestaand account',
      byContinuing: 'Door door te gaan, gaat u akkoord met onze',
      termsOfService: 'Servicevoorwaarden',
      and: 'en',
      privacyPolicy: 'Privacybeleid',
      backToHome: '← Terug naar Home',
      enterEmailAddress: 'Voer uw e-mailadres in',
      enterValidEmail: 'Voer een geldig e-mailadres in',
      enterPasswordField: 'Voer uw wachtwoord in',
      passwordMinLength: 'Wachtwoord moet minimaal 6 tekens bevatten',
      passwordsNoMatch: 'Wachtwoorden komen niet overeen',
      invalidCredentials: 'Ongeldig e-mailadres of wachtwoord. Controleer uw gegevens en probeer opnieuw.',
      userAlreadyRegistered: 'Er bestaat al een account met dit e-mailadres. Probeer in te loggen.',
      emailNotConfirmed: 'Controleer uw e-mail en klik op de bevestigingslink voordat u inlogt.',
      errorOccurred: 'Er is een fout opgetreden. Probeer opnieuw.',
      unexpectedError: 'Er is een onverwachte fout opgetreden. Probeer opnieuw.',
      accountCreated: 'Account aangemaakt! Controleer uw e-mail om uw account te verifiëren.',
      welcomeBackToast: 'Welkom terug!',
      signedInSuccessfully: 'U bent succesvol ingelogd.',
      orContinueWith: 'Of ga door met',
      continueWithGoogle: 'Doorgaan met Google',
      continueWithMicrosoft: 'Doorgaan met Microsoft',
      continueWithApple: 'Doorgaan met Apple',
      continueWithPhone: 'Doorgaan met telefoon',
      phoneNumber: 'Telefoonnummer',
      enterPhone: 'Voer uw telefoonnummer in',
      sendCode: 'Code verzenden',
      code: 'Code',
      enterCode: 'Voer de code in',
      verifyCode: 'Code verifiëren',
      codeSent: 'Verificatiecode verzonden!',
      invalidCode: 'Ongeldige code. Probeer opnieuw.',
      resendConfirmationEmail: 'Bevestigings-e-mail opnieuw verzenden',
      errorSendingCode: 'Fout bij het verzenden van verificatiecode.',
      checkEmailForCode: 'Controleer uw e-mail voor de verificatiecode.',
      errorSendingEmailCode: 'Fout bij het verzenden van e-mailcode.',
      errorSendingPhoneCode: 'Fout bij het verzenden van SMS-code.',
      checkPhoneForCode: 'Controleer uw telefoon voor de verificatiecode.',
      welcomeVerified: 'Welkom!',
      accountVerifiedSuccess: 'Uw account is succesvol geverifieerd.',
      errorConnectingWith: 'Fout bij verbinden met',
      errorConnecting: 'Verbindingsfout. Probeer opnieuw.',
      enterPhoneNumber: 'Voer uw telefoonnummer in',
      codeSentTitle: 'Code verzonden!',
      welcomeTitle: 'Welkom!'
    },
    'sv': {
      welcomeBack: 'Välkommen tillbaka',
      createAccount: 'Skapa ditt konto',
      signInToAccess: 'Logga in för att komma åt din Minnesplånbok',
      startPreserving: 'Börja bevara dina värdefulla minnen',
      signIn: 'Logga in',
      signUp: 'Registrera',
      emailAddress: 'E-postadress',
      enterEmail: 'Ange din e-post',
      password: 'Lösenord',
      enterPassword: 'Ange ditt lösenord',
      confirmPassword: 'Bekräfta lösenord',
      confirmPasswordPlaceholder: 'Bekräfta ditt lösenord',
      passwordStrength: 'Lösenordsstyrka',
      tooShort: 'För kort',
      fair: 'Okej',
      good: 'Bra',
      signingIn: 'Loggar in...',
      creatingAccount: 'Skapar konto...',
      createAccountBtn: 'Skapa konto',
      dontHaveAccount: 'Har du inget konto?',
      alreadyHaveAccount: 'Har du redan ett konto?',
      createNewAccount: 'Skapa nytt konto',
      signInExisting: 'Logga in på befintligt konto',
      byContinuing: 'Genom att fortsätta godkänner du våra',
      termsOfService: 'Användarvillkor',
      and: 'och',
      privacyPolicy: 'Integritetspolicy',
      backToHome: '← Tillbaka till hem',
      enterEmailAddress: 'Vänligen ange din e-postadress',
      enterValidEmail: 'Vänligen ange en giltig e-postadress',
      enterPasswordField: 'Vänligen ange ditt lösenord',
      passwordMinLength: 'Lösenordet måste vara minst 6 tecken',
      passwordsNoMatch: 'Lösenorden matchar inte',
      invalidCredentials: 'Ogiltig e-post eller lösenord. Kontrollera dina uppgifter och försök igen.',
      userAlreadyRegistered: 'Ett konto med denna e-post finns redan. Försök logga in istället.',
      emailNotConfirmed: 'Kontrollera din e-post och klicka på bekräftelselänken innan du loggar in.',
      errorOccurred: 'Ett fel uppstod. Vänligen försök igen.',
      unexpectedError: 'Ett oväntat fel uppstod. Vänligen försök igen.',
      accountCreated: 'Konto skapat! Kontrollera din e-post för att verifiera ditt konto.',
      welcomeBackToast: 'Välkommen tillbaka!',
      signedInSuccessfully: 'Du har loggat in framgångsrikt.',
      orContinueWith: 'Eller fortsätt med',
      continueWithGoogle: 'Fortsätt med Google',
      continueWithMicrosoft: 'Fortsätt med Microsoft',
      continueWithApple: 'Fortsätt med Apple',
      continueWithPhone: 'Fortsätt med telefon',
      phoneNumber: 'Telefonnummer',
      enterPhone: 'Ange ditt telefonnummer',
      sendCode: 'Skicka kod',
      code: 'Kod',
      enterCode: 'Ange koden',
      verifyCode: 'Verifiera kod',
      codeSent: 'Verifieringskod skickad!',
      invalidCode: 'Ogiltig kod. Vänligen försök igen.',
      resendConfirmationEmail: 'Skicka bekräftelse-e-post igen',
      errorSendingCode: 'Fel vid sändning av verifieringskod.',
      checkEmailForCode: 'Kontrollera din e-post för verifieringskoden.',
      errorSendingEmailCode: 'Fel vid sändning av e-postkod.',
      errorSendingPhoneCode: 'Fel vid sändning av SMS-kod.',
      checkPhoneForCode: 'Kontrollera din telefon för verifieringskoden.',
      welcomeVerified: 'Välkommen!',
      accountVerifiedSuccess: 'Ditt konto har verifierats framgångsrikt.',
      errorConnectingWith: 'Fel vid anslutning med',
      errorConnecting: 'Anslutningsfel. Vänligen försök igen.',
      enterPhoneNumber: 'Vänligen ange ditt telefonnummer',
      codeSentTitle: 'Kod skickad!',
      welcomeTitle: 'Välkommen!'
    },
    'no': {
      welcomeBack: 'Velkommen tilbake',
      createAccount: 'Opprett din konto',
      signInToAccess: 'Logg inn for å få tilgang til din Minnelommebok',
      startPreserving: 'Begynn å bevare dine verdifulle minner',
      signIn: 'Logg inn',
      signUp: 'Registrer',
      emailAddress: 'E-postadresse',
      enterEmail: 'Skriv inn din e-post',
      password: 'Passord',
      enterPassword: 'Skriv inn ditt passord',
      confirmPassword: 'Bekreft passord',
      confirmPasswordPlaceholder: 'Bekreft ditt passord',
      passwordStrength: 'Passordstyrke',
      tooShort: 'For kort',
      fair: 'Greit',
      good: 'Bra',
      signingIn: 'Logger inn...',
      creatingAccount: 'Oppretter konto...',
      createAccountBtn: 'Opprett konto',
      dontHaveAccount: 'Har du ikke en konto?',
      alreadyHaveAccount: 'Har du allerede en konto?',
      createNewAccount: 'Opprett ny konto',
      signInExisting: 'Logg inn på eksisterende konto',
      byContinuing: 'Ved å fortsette godtar du våre',
      termsOfService: 'Tjenestevilkår',
      and: 'og',
      privacyPolicy: 'Personvernregler',
      backToHome: '← Tilbake til hjem',
      enterEmailAddress: 'Vennligst skriv inn din e-postadresse',
      enterValidEmail: 'Vennligst skriv inn en gyldig e-postadresse',
      enterPasswordField: 'Vennligst skriv inn ditt passord',
      passwordMinLength: 'Passordet må være minst 6 tegn',
      passwordsNoMatch: 'Passordene samsvarer ikke',
      invalidCredentials: 'Ugyldig e-post eller passord. Sjekk legitimasjonen din og prøv igjen.',
      userAlreadyRegistered: 'En konto med denne e-posten eksisterer allerede. Prøv å logge inn i stedet.',
      emailNotConfirmed: 'Sjekk e-posten din og klikk på bekreftelseslenken før du logger inn.',
      errorOccurred: 'En feil oppstod. Vennligst prøv igjen.',
      unexpectedError: 'En uventet feil oppstod. Vennligst prøv igjen.',
      accountCreated: 'Konto opprettet! Sjekk e-posten din for å verifisere kontoen din.',
      welcomeBackToast: 'Velkommen tilbake!',
      signedInSuccessfully: 'Du har logget inn vellykket.',
      orContinueWith: 'Eller fortsett med',
      continueWithGoogle: 'Fortsett med Google',
      continueWithMicrosoft: 'Fortsett med Microsoft',
      continueWithApple: 'Fortsett med Apple',
      continueWithPhone: 'Fortsett med telefon',
      phoneNumber: 'Telefonnummer',
      enterPhone: 'Skriv inn telefonnummeret ditt',
      sendCode: 'Send kode',
      code: 'Kode',
      enterCode: 'Skriv inn koden',
      verifyCode: 'Verifiser kode',
      codeSent: 'Verifiseringskode sendt!',
      invalidCode: 'Ugyldig kode. Vennligst prøv igjen.',
      resendConfirmationEmail: 'Send bekreftelses-e-post på nytt',
      errorSendingCode: 'Feil ved sending av verifiseringskode.',
      checkEmailForCode: 'Sjekk e-posten din for verifiseringskoden.',
      errorSendingEmailCode: 'Feil ved sending av e-postkode.',
      errorSendingPhoneCode: 'Feil ved sending av SMS-kode.',
      checkPhoneForCode: 'Sjekk telefonen din for verifiseringskoden.',
      welcomeVerified: 'Velkommen!',
      accountVerifiedSuccess: 'Kontoen din har blitt verifisert vellykket.',
      errorConnectingWith: 'Feil ved tilkobling med',
      errorConnecting: 'Tilkoblingsfeil. Vennligst prøv igjen.',
      enterPhoneNumber: 'Vennligst skriv inn telefonnummeret ditt',
      codeSentTitle: 'Kode sendt!',
      welcomeTitle: 'Velkommen!'
    },
    'da': {
      welcomeBack: 'Velkommen tilbage',
      createAccount: 'Opret din konto',
      signInToAccess: 'Log ind for at få adgang til din Hukkommelses Pung',
      startPreserving: 'Begynd at bevare dine værdifulde minder',
      signIn: 'Log ind',
      signUp: 'Tilmeld',
      emailAddress: 'E-mailadresse',
      enterEmail: 'Indtast din e-mail',
      password: 'Adgangskode',
      enterPassword: 'Indtast din adgangskode',
      confirmPassword: 'Bekræft adgangskode',
      confirmPasswordPlaceholder: 'Bekræft din adgangskode',
      passwordStrength: 'Adgangskodestyrke',
      tooShort: 'For kort',
      fair: 'Okay',
      good: 'God',
      signingIn: 'Logger ind...',
      creatingAccount: 'Opretter konto...',
      createAccountBtn: 'Opret konto',
      dontHaveAccount: 'Har du ikke en konto?',
      alreadyHaveAccount: 'Har du allerede en konto?',
      createNewAccount: 'Opret ny konto',
      signInExisting: 'Log ind på eksisterende konto',
      byContinuing: 'Ved at fortsætte accepterer du vores',
      termsOfService: 'Servicevilkår',
      and: 'og',
      privacyPolicy: 'Privatlivspolitik',
      backToHome: '← Tilbage til hjem',
      enterEmailAddress: 'Indtast venligst din e-mailadresse',
      enterValidEmail: 'Indtast venligst en gyldig e-mailadresse',
      enterPasswordField: 'Indtast venligst din adgangskode',
      passwordMinLength: 'Adgangskoden skal være mindst 6 tegn',
      passwordsNoMatch: 'Adgangskoderne matcher ikke',
      invalidCredentials: 'Ugyldig e-mail eller adgangskode. Tjek dine legitimationsoplysninger og prøv igen.',
      userAlreadyRegistered: 'En konto med denne e-mail eksisterer allerede. Prøv at logge ind i stedet.',
      emailNotConfirmed: 'Tjek din e-mail og klik på bekræftelseslinket før du logger ind.',
      errorOccurred: 'Der opstod en fejl. Prøv venligst igen.',
      unexpectedError: 'Der opstod en uventet fejl. Prøv venligst igen.',
      accountCreated: 'Konto oprettet! Tjek din e-mail for at verificere din konto.',
      welcomeBackToast: 'Velkommen tilbage!',
      signedInSuccessfully: 'Du er logget ind med succes.',
      orContinueWith: 'Eller fortsæt med',
      continueWithGoogle: 'Fortsæt med Google',
      continueWithMicrosoft: 'Fortsæt med Microsoft',
      continueWithApple: 'Fortsæt med Apple',
      continueWithPhone: 'Fortsæt med telefon',
      phoneNumber: 'Telefonnummer',
      enterPhone: 'Indtast dit telefonnummer',
      sendCode: 'Send kode',
      code: 'Kode',
      enterCode: 'Indtast koden',
      verifyCode: 'Verificer kode',
      codeSent: 'Verifikationskode sendt!',
      invalidCode: 'Ugyldig kode. Prøv venligst igen.',
      resendConfirmationEmail: 'Gensend bekræftelses-e-mail',
      errorSendingCode: 'Fejl ved afsendelse af verifikationskode.',
      checkEmailForCode: 'Tjek din e-mail for verifikationskoden.',
      errorSendingEmailCode: 'Fejl ved afsendelse af e-mailkode.',
      errorSendingPhoneCode: 'Fejl ved afsendelse af SMS-kode.',
      checkPhoneForCode: 'Tjek din telefon for verifikationskoden.',
      welcomeVerified: 'Velkommen!',
      accountVerifiedSuccess: 'Din konto er blevet verificeret med succes.',
      errorConnectingWith: 'Fejl ved forbindelse med',
      errorConnecting: 'Forbindelsesfejl. Prøv venligst igen.',
      enterPhoneNumber: 'Indtast venligst dit telefonnummer',
      codeSentTitle: 'Kode sendt!',
      welcomeTitle: 'Velkommen!'
    },
    'fi': {
      welcomeBack: 'Tervetuloa takaisin',
      createAccount: 'Luo tilisi',
      signInToAccess: 'Kirjaudu sisään päästäksesi Muistilompakoosi',
      startPreserving: 'Aloita arvokkaiden muistojesi säilyttäminen',
      signIn: 'Kirjaudu sisään',
      signUp: 'Rekisteröidy',
      emailAddress: 'Sähköpostiosoite',
      enterEmail: 'Syötä sähköpostisi',
      password: 'Salasana',
      enterPassword: 'Syötä salasanasi',
      confirmPassword: 'Vahvista salasana',
      confirmPasswordPlaceholder: 'Vahvista salasanasi',
      passwordStrength: 'Salasanan vahvuus',
      tooShort: 'Liian lyhyt',
      fair: 'Kohtalainen',
      good: 'Hyvä',
      signingIn: 'Kirjaudutaan sisään...',
      creatingAccount: 'Luodaan tiliä...',
      createAccountBtn: 'Luo tili',
      dontHaveAccount: 'Eikö sinulla ole tiliä?',
      alreadyHaveAccount: 'Onko sinulla jo tili?',
      createNewAccount: 'Luo uusi tili',
      signInExisting: 'Kirjaudu olemassa olevalle tilille',
      byContinuing: 'Jatkamalla hyväksyt meidän',
      termsOfService: 'Käyttöehdot',
      and: 'ja',
      privacyPolicy: 'Tietosuojakäytännön',
      backToHome: '← Takaisin kotiin',
      enterEmailAddress: 'Syötä sähköpostiosoitteesi',
      enterValidEmail: 'Syötä kelvollinen sähköpostiosoite',
      enterPasswordField: 'Syötä salasanasi',
      passwordMinLength: 'Salasanan tulee olla vähintään 6 merkkiä',
      passwordsNoMatch: 'Salasanat eivät täsmää',
      invalidCredentials: 'Virheellinen sähköposti tai salasana. Tarkista tietosi ja yritä uudelleen.',
      userAlreadyRegistered: 'Tili tällä sähköpostilla on jo olemassa. Yritä kirjautua sisään.',
      emailNotConfirmed: 'Tarkista sähköpostisi ja napsauta vahvistuslinkkiä ennen sisäänkirjautumista.',
      errorOccurred: 'Tapahtui virhe. Yritä uudelleen.',
      unexpectedError: 'Tapahtui odottamaton virhe. Yritä uudelleen.',
      accountCreated: 'Tili luotu! Tarkista sähköpostisi tilin vahvistamiseksi.',
      welcomeBackToast: 'Tervetuloa takaisin!',
      signedInSuccessfully: 'Olet kirjautunut sisään onnistuneesti.',
      orContinueWith: 'Tai jatka käyttäen',
      continueWithGoogle: 'Jatka Googlella',
      continueWithMicrosoft: 'Jatka Microsoftilla',
      continueWithApple: 'Jatka Applella',
      continueWithPhone: 'Jatka puhelimella',
      phoneNumber: 'Puhelinnumero',
      enterPhone: 'Syötä puhelinnumerosi',
      sendCode: 'Lähetä koodi',
      code: 'Koodi',
      enterCode: 'Syötä koodi',
      verifyCode: 'Vahvista koodi',
      codeSent: 'Vahvistuskoodi lähetetty!',
      invalidCode: 'Virheellinen koodi. Yritä uudelleen.',
      resendConfirmationEmail: 'Lähetä vahvistussähköposti uudelleen',
      errorSendingCode: 'Virhe vahvistuskoodin lähettämisessä.',
      checkEmailForCode: 'Tarkista sähköpostisi vahvistuskoodin saamiseksi.',
      errorSendingEmailCode: 'Virhe sähköpostikoodin lähettämisessä.',
      errorSendingPhoneCode: 'Virhe tekstiviestikoodin lähettämisessä.',
      checkPhoneForCode: 'Tarkista puhelimesi vahvistuskoodin saamiseksi.',
      welcomeVerified: 'Tervetuloa!',
      accountVerifiedSuccess: 'Tilisi on vahvistettu onnistuneesti.',
      errorConnectingWith: 'Virhe yhdistettäessä',
      errorConnecting: 'Yhteysvirhe. Yritä uudelleen.',
      enterPhoneNumber: 'Syötä puhelinnumerosi',
      codeSentTitle: 'Koodi lähetetty!',
      welcomeTitle: 'Tervetuloa!'
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