import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Eye, EyeOff, AlertCircle, Heart, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { FloatingInput } from '@/components/ui/floating-input';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';
import { useLanguage } from '@/hooks/useLanguage';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { analyticsIntegrations } from '@/lib/integrations';
import { PlanSelectionModal } from '@/components/PlanSelectionModal';
import { LanguageSelector } from '@/components/ui/language-selector';

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
      backToHome: 'Voltar para Home',
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
      backToHome: 'Back to Home',
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
    },
    'es': {
      welcomeBack: 'Bienvenido de vuelta',
      createAccount: 'Crea tu cuenta',
      signInToAccess: 'Inicia sesión para acceder a tu Cartera de Memorias',
      startPreserving: 'Comienza a preservar tus memorias preciosas',
      signIn: 'Iniciar Sesión',
      signUp: 'Registrarse',
      emailAddress: 'Dirección de correo',
      enterEmail: 'Ingresa tu correo',
      password: 'Contraseña',
      enterPassword: 'Ingresa tu contraseña',
      confirmPassword: 'Confirmar contraseña',
      confirmPasswordPlaceholder: 'Confirma tu contraseña',
      passwordStrength: 'Fuerza de la contraseña',
      tooShort: 'Muy corta',
      fair: 'Regular',
      good: 'Buena',
      signingIn: 'Iniciando sesión...',
      creatingAccount: 'Creando cuenta...',
      createAccountBtn: 'Crear Cuenta',
      dontHaveAccount: "¿No tienes una cuenta?",
      alreadyHaveAccount: "¿Ya tienes una cuenta?",
      createNewAccount: 'Crear una nueva cuenta',
      signInExisting: 'Iniciar sesión en cuenta existente',
      byContinuing: 'Al continuar, aceptas nuestros',
      termsOfService: 'Términos de Servicio',
      and: 'y',
      privacyPolicy: 'Política de Privacidad',
      backToHome: 'Volver al Inicio',
      enterEmailAddress: 'Por favor ingresa tu dirección de correo',
      enterValidEmail: 'Por favor ingresa una dirección de correo válida',
      enterPasswordField: 'Por favor ingresa tu contraseña',
      passwordMinLength: 'La contraseña debe tener al menos 6 caracteres',
      passwordsNoMatch: 'Las contraseñas no coinciden',
      invalidCredentials: 'Correo o contraseña inválidos. Verifica tus credenciales e intenta de nuevo.',
      userAlreadyRegistered: 'Ya existe una cuenta con este correo. Intenta iniciar sesión.',
      emailNotConfirmed: 'Verifica tu correo y haz clic en el enlace de confirmación antes de iniciar sesión.',
      errorOccurred: 'Ocurrió un error. Intenta de nuevo.',
      unexpectedError: 'Ocurrió un error inesperado. Intenta de nuevo.',
      accountCreated: '¡Cuenta creada! Verifica tu correo para confirmar tu cuenta.',
      welcomeBackToast: '¡Bienvenido de vuelta!',
      signedInSuccessfully: 'Has iniciado sesión exitosamente.',
    },
    'fr': {
      welcomeBack: 'Bon retour',
      createAccount: 'Créez votre compte',
      signInToAccess: 'Connectez-vous pour accéder à votre Portefeuille de Souvenirs',
      startPreserving: 'Commencez à préserver vos souvenirs précieux',
      signIn: 'Se Connecter',
      signUp: "S'inscrire",
      emailAddress: 'Adresse e-mail',
      enterEmail: 'Entrez votre e-mail',
      password: 'Mot de passe',
      enterPassword: 'Entrez votre mot de passe',
      confirmPassword: 'Confirmer le mot de passe',
      confirmPasswordPlaceholder: 'Confirmez votre mot de passe',
      passwordStrength: 'Force du mot de passe',
      tooShort: 'Trop court',
      fair: 'Correct',
      good: 'Bon',
      signingIn: 'Connexion...',
      creatingAccount: 'Création du compte...',
      createAccountBtn: 'Créer un Compte',
      dontHaveAccount: "Vous n'avez pas de compte ?",
      alreadyHaveAccount: "Vous avez déjà un compte ?",
      createNewAccount: 'Créer un nouveau compte',
      signInExisting: 'Se connecter au compte existant',
      byContinuing: 'En continuant, vous acceptez nos',
      termsOfService: 'Conditions de Service',
      and: 'et',
      privacyPolicy: 'Politique de Confidentialité',
      backToHome: "Retour à l'Accueil",
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
      accountCreated: 'Compte créé ! Vérifiez votre e-mail pour confirmer votre compte.',
      welcomeBackToast: 'Bon retour !',
      signedInSuccessfully: 'Vous vous êtes connecté avec succès.',
    },
    'de': {
      welcomeBack: 'Willkommen zurück',
      createAccount: 'Erstelle dein Konto',
      signInToAccess: 'Melde dich an, um auf deine Erinnerungsmappe zuzugreifen',
      startPreserving: 'Beginne damit, deine kostbaren Erinnerungen zu bewahren',
      signIn: 'Anmelden',
      signUp: 'Registrieren',
      emailAddress: 'E-Mail-Adresse',
      enterEmail: 'Gib deine E-Mail ein',
      password: 'Passwort',
      enterPassword: 'Gib dein Passwort ein',
      confirmPassword: 'Passwort bestätigen',
      confirmPasswordPlaceholder: 'Bestätige dein Passwort',
      passwordStrength: 'Passwortstärke',
      tooShort: 'Zu kurz',
      fair: 'Angemessen',
      good: 'Gut',
      signingIn: 'Anmeldung...',
      creatingAccount: 'Konto wird erstellt...',
      createAccountBtn: 'Konto Erstellen',
      dontHaveAccount: "Hast du noch kein Konto?",
      alreadyHaveAccount: "Hast du bereits ein Konto?",
      createNewAccount: 'Neues Konto erstellen',
      signInExisting: 'Bei bestehendem Konto anmelden',
      byContinuing: 'Durch Fortfahren stimmst du unseren',
      termsOfService: 'Nutzungsbedingungen',
      and: 'und',
      privacyPolicy: 'Datenschutzrichtlinien',
      backToHome: 'Zurück zur Startseite',
      enterEmailAddress: 'Bitte gib deine E-Mail-Adresse ein',
      enterValidEmail: 'Bitte gib eine gültige E-Mail-Adresse ein',
      enterPasswordField: 'Bitte gib dein Passwort ein',
      passwordMinLength: 'Das Passwort muss mindestens 6 Zeichen haben',
      passwordsNoMatch: 'Die Passwörter stimmen nicht überein',
      invalidCredentials: 'Ungültige E-Mail oder Passwort. Überprüfe deine Anmeldedaten und versuche es erneut.',
      userAlreadyRegistered: 'Ein Konto mit dieser E-Mail existiert bereits. Versuche dich anzumelden.',
      emailNotConfirmed: 'Überprüfe deine E-Mail und klicke auf den Bestätigungslink, bevor du dich anmeldest.',
      errorOccurred: 'Ein Fehler ist aufgetreten. Bitte versuche es erneut.',
      unexpectedError: 'Ein unerwarteter Fehler ist aufgetreten. Bitte versuche es erneut.',
      accountCreated: 'Konto erstellt! Überprüfe deine E-Mail, um dein Konto zu bestätigen.',
      welcomeBackToast: 'Willkommen zurück!',
      signedInSuccessfully: 'Du hast dich erfolgreich angemeldet.',
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
      passwordStrength: 'Forza della password',
      tooShort: 'Troppo corta',
      fair: 'Discreta',
      good: 'Buona',
      signingIn: 'Accesso in corso...',
      creatingAccount: 'Creazione account...',
      createAccountBtn: 'Crea Account',
      dontHaveAccount: "Non hai un account?",
      alreadyHaveAccount: "Hai già un account?",
      createNewAccount: 'Crea un nuovo account',
      signInExisting: 'Accedi all\'account esistente',
      byContinuing: 'Continuando, accetti i nostri',
      termsOfService: 'Termini di Servizio',
      and: 'e',
      privacyPolicy: 'Informativa sulla Privacy',
      backToHome: 'Torna alla Home',
      enterEmailAddress: 'Inserisci il tuo indirizzo email',
      enterValidEmail: 'Inserisci un indirizzo email valido',
      enterPasswordField: 'Inserisci la tua password',
      passwordMinLength: 'La password deve avere almeno 6 caratteri',
      passwordsNoMatch: 'Le password non corrispondono',
      invalidCredentials: 'Email o password non valide. Controlla le tue credenziali e riprova.',
      userAlreadyRegistered: 'Un account con questa email esiste già. Prova ad accedere.',
      emailNotConfirmed: 'Controlla la tua email e clicca sul link di conferma prima di accedere.',
      errorOccurred: 'Si è verificato un errore. Riprova.',
      unexpectedError: 'Si è verificato un errore imprevisto. Riprova.',
      accountCreated: 'Account creato! Controlla la tua email per verificare il tuo account.',
      welcomeBackToast: 'Bentornato!',
      signedInSuccessfully: 'Hai effettuato l\'accesso con successo.',
    },
    'ru': {
      welcomeBack: 'Добро пожаловать обратно',
      createAccount: 'Создайте свой аккаунт',
      signInToAccess: 'Войдите, чтобы получить доступ к вашему Кошельку Воспоминаний',
      startPreserving: 'Начните сохранять ваши драгоценные воспоминания',
      signIn: 'Войти',
      signUp: 'Регистрация',
      emailAddress: 'Адрес электронной почты',
      enterEmail: 'Введите вашу почту',
      password: 'Пароль',
      enterPassword: 'Введите ваш пароль',
      confirmPassword: 'Подтвердите пароль',
      confirmPasswordPlaceholder: 'Подтвердите ваш пароль',
      passwordStrength: 'Сила пароля',
      tooShort: 'Слишком короткий',
      fair: 'Нормально',
      good: 'Хорошо',
      signingIn: 'Вход...',
      creatingAccount: 'Создание аккаунта...',
      createAccountBtn: 'Создать Аккаунт',
      dontHaveAccount: "Нет аккаунта?",
      alreadyHaveAccount: "Уже есть аккаунт?",
      createNewAccount: 'Создать новый аккаунт',
      signInExisting: 'Войти в существующий аккаунт',
      byContinuing: 'Продолжая, вы соглашаетесь с нашими',
      termsOfService: 'Условиями Обслуживания',
      and: 'и',
      privacyPolicy: 'Политикой Конфиденциальности',
      backToHome: 'Назад на Главную',
      enterEmailAddress: 'Пожалуйста, введите ваш адрес электронной почты',
      enterValidEmail: 'Пожалуйста, введите действительный адрес электронной почты',
      enterPasswordField: 'Пожалуйста, введите ваш пароль',
      passwordMinLength: 'Пароль должен содержать не менее 6 символов',
      passwordsNoMatch: 'Пароли не совпадают',
      invalidCredentials: 'Неверная почта или пароль. Проверьте ваши данные и попробуйте снова.',
      userAlreadyRegistered: 'Аккаунт с этой почтой уже существует. Попробуйте войти.',
      emailNotConfirmed: 'Проверьте вашу почту и нажмите на ссылку подтверждения перед входом.',
      errorOccurred: 'Произошла ошибка. Попробуйте снова.',
      unexpectedError: 'Произошла неожиданная ошибка. Попробуйте снова.',
      accountCreated: 'Аккаунт создан! Проверьте вашу почту для подтверждения аккаунта.',
      welcomeBackToast: 'Добро пожаловать обратно!',
      signedInSuccessfully: 'Вы успешно вошли в систему.',
    },
    'ja': {
      welcomeBack: 'おかえりなさい',
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
      good: '良い',
      signingIn: 'サインイン中...',
      creatingAccount: 'アカウント作成中...',
      createAccountBtn: 'アカウント作成',
      dontHaveAccount: "アカウントをお持ちではありませんか？",
      alreadyHaveAccount: "すでにアカウントをお持ちですか？",
      createNewAccount: '新しいアカウントを作成',
      signInExisting: '既存のアカウントにサインイン',
      byContinuing: '続行することで、当社の',
      termsOfService: '利用規約',
      and: 'と',
      privacyPolicy: 'プライバシーポリシー',
      backToHome: 'ホームに戻る',
      enterEmailAddress: 'メールアドレスを入力してください',
      enterValidEmail: '有効なメールアドレスを入力してください',
      enterPasswordField: 'パスワードを入力してください',
      passwordMinLength: 'パスワードは6文字以上である必要があります',
      passwordsNoMatch: 'パスワードが一致しません',
      invalidCredentials: '無効なメールアドレスまたはパスワードです。認証情報を確認して再試行してください。',
      userAlreadyRegistered: 'このメールアドレスのアカウントは既に存在します。サインインを試してください。',
      emailNotConfirmed: 'サインインする前に、メールを確認し確認リンクをクリックしてください。',
      errorOccurred: 'エラーが発生しました。再試行してください。',
      unexpectedError: '予期しないエラーが発生しました。再試行してください。',
      accountCreated: 'アカウントが作成されました！アカウントを確認するためにメールをチェックしてください。',
      welcomeBackToast: 'おかえりなさい！',
      signedInSuccessfully: '正常にサインインしました。',
    },
    'zh-CN': {
      welcomeBack: '欢迎回来',
      createAccount: '创建您的账户',
      signInToAccess: '登录以访问您的记忆钱包',
      startPreserving: '开始保存您珍贵的回忆',
      signIn: '登录',
      signUp: '注册',
      emailAddress: '邮箱地址',
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
      dontHaveAccount: "没有账户？",
      alreadyHaveAccount: "已有账户？",
      createNewAccount: '创建新账户',
      signInExisting: '登录现有账户',
      byContinuing: '继续即表示您同意我们的',
      termsOfService: '服务条款',
      and: '和',
      privacyPolicy: '隐私政策',
      backToHome: '返回首页',
      enterEmailAddress: '请输入您的邮箱地址',
      enterValidEmail: '请输入有效的邮箱地址',
      enterPasswordField: '请输入您的密码',
      passwordMinLength: '密码必须至少6个字符',
      passwordsNoMatch: '密码不匹配',
      invalidCredentials: '无效的邮箱或密码。请检查您的凭据并重试。',
      userAlreadyRegistered: '此邮箱的账户已存在。请尝试登录。',
      emailNotConfirmed: '请检查您的邮箱并在登录前点击确认链接。',
      errorOccurred: '发生错误。请重试。',
      unexpectedError: '发生意外错误。请重试。',
      accountCreated: '账户已创建！请检查您的邮箱以验证您的账户。',
      welcomeBackToast: '欢迎回来！',
      signedInSuccessfully: '您已成功登录。',
    },
    'zh-TW': {
      welcomeBack: '歡迎回來',
      createAccount: '建立您的帳戶',
      signInToAccess: '登入以存取您的記憶錢包',
      startPreserving: '開始保存您珍貴的回憶',
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
      dontHaveAccount: "沒有帳戶？",
      alreadyHaveAccount: "已有帳戶？",
      createNewAccount: '建立新帳戶',
      signInExisting: '登入現有帳戶',
      byContinuing: '繼續即表示您同意我們的',
      termsOfService: '服務條款',
      and: '和',
      privacyPolicy: '隱私政策',
      backToHome: '返回首頁',
      enterEmailAddress: '請輸入您的電子郵件地址',
      enterValidEmail: '請輸入有效的電子郵件地址',
      enterPasswordField: '請輸入您的密碼',
      passwordMinLength: '密碼必須至少6個字元',
      passwordsNoMatch: '密碼不符',
      invalidCredentials: '無效的電子郵件或密碼。請檢查您的憑據並重試。',
      userAlreadyRegistered: '此電子郵件的帳戶已存在。請嘗試登入。',
      emailNotConfirmed: '請檢查您的電子郵件並在登入前點擊確認連結。',
      errorOccurred: '發生錯誤。請重試。',
      unexpectedError: '發生意外錯誤。請重試。',
      accountCreated: '帳戶已建立！請檢查您的電子郵件以驗證您的帳戶。',
      welcomeBackToast: '歡迎回來！',
      signedInSuccessfully: '您已成功登入。',
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
      dontHaveAccount: "계정이 없으신가요?",
      alreadyHaveAccount: "이미 계정이 있으신가요?",
      createNewAccount: '새 계정 만들기',
      signInExisting: '기존 계정으로 로그인',
      byContinuing: '계속하면 다음에 동의하는 것입니다',
      termsOfService: '서비스 약관',
      and: '및',
      privacyPolicy: '개인정보 보호정책',
      backToHome: '홈으로 돌아가기',
      enterEmailAddress: '이메일 주소를 입력해주세요',
      enterValidEmail: '유효한 이메일 주소를 입력해주세요',
      enterPasswordField: '비밀번호를 입력해주세요',
      passwordMinLength: '비밀번호는 최소 6자 이상이어야 합니다',
      passwordsNoMatch: '비밀번호가 일치하지 않습니다',
      invalidCredentials: '잘못된 이메일 또는 비밀번호입니다. 자격 증명을 확인하고 다시 시도하세요.',
      userAlreadyRegistered: '이 이메일로 된 계정이 이미 존재합니다. 로그인을 시도해보세요.',
      emailNotConfirmed: '로그인하기 전에 이메일을 확인하고 확인 링크를 클릭하세요.',
      errorOccurred: '오류가 발생했습니다. 다시 시도해주세요.',
      unexpectedError: '예상치 못한 오류가 발생했습니다. 다시 시도해주세요.',
      accountCreated: '계정이 생성되었습니다! 계정을 확인하려면 이메일을 확인하세요.',
      welcomeBackToast: '다시 오신 것을 환영합니다!',
      signedInSuccessfully: '성공적으로 로그인했습니다.',
    },
    'ar': {
      welcomeBack: 'مرحباً بعودتك',
      createAccount: 'أنشئ حسابك',
      signInToAccess: 'سجل الدخول للوصول إلى محفظة الذكريات',
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
      dontHaveAccount: "ليس لديك حساب؟",
      alreadyHaveAccount: "لديك حساب بالفعل؟",
      createNewAccount: 'إنشاء حساب جديد',
      signInExisting: 'تسجيل الدخول للحساب الموجود',
      byContinuing: 'بالمتابعة، أنت توافق على',
      termsOfService: 'شروط الخدمة',
      and: 'و',
      privacyPolicy: 'سياسة الخصوصية',
      backToHome: 'العودة للرئيسية',
      enterEmailAddress: 'يرجى إدخال عنوان بريدك الإلكتروني',
      enterValidEmail: 'يرجى إدخال عنوان بريد إلكتروني صحيح',
      enterPasswordField: 'يرجى إدخال كلمة المرور',
      passwordMinLength: 'يجب أن تكون كلمة المرور 6 أحرف على الأقل',
      passwordsNoMatch: 'كلمات المرور غير متطابقة',
      invalidCredentials: 'بريد إلكتروني أو كلمة مرور غير صحيحة. تحقق من بياناتك وحاول مرة أخرى.',
      userAlreadyRegistered: 'يوجد حساب بهذا البريد الإلكتروني بالفعل. جرب تسجيل الدخول.',
      emailNotConfirmed: 'تحقق من بريدك الإلكتروني وانقر على رابط التأكيد قبل تسجيل الدخول.',
      errorOccurred: 'حدث خطأ. يرجى المحاولة مرة أخرى.',
      unexpectedError: 'حدث خطأ غير متوقع. يرجى المحاولة مرة أخرى.',
      accountCreated: 'تم إنشاء الحساب! تحقق من بريدك الإلكتروني لتأكيد حسابك.',
      welcomeBackToast: 'مرحباً بعودتك!',
      signedInSuccessfully: 'تم تسجيل الدخول بنجاح.',
    },
    'hi': {
      welcomeBack: 'वापस स्वागत है',
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
      dontHaveAccount: "कोई खाता नहीं है?",
      alreadyHaveAccount: "पहले से खाता है?",
      createNewAccount: 'नया खाता बनाएं',
      signInExisting: 'मौजूदा खाते में साइन इन करें',
      byContinuing: 'जारी रखकर, आप हमारी',
      termsOfService: 'सेवा की शर्तों',
      and: 'और',
      privacyPolicy: 'गोपनीयता नीति',
      backToHome: 'होम पर वापस जाएं',
      enterEmailAddress: 'कृपया अपना ईमेल पता दर्ज करें',
      enterValidEmail: 'कृपया एक वैध ईमेल पता दर्ज करें',
      enterPasswordField: 'कृपया अपना पासवर्ड दर्ज करें',
      passwordMinLength: 'पासवर्ड कम से कम 6 अक्षर का होना चाहिए',
      passwordsNoMatch: 'पासवर्ड मेल नहीं खाते',
      invalidCredentials: 'अमान्य ईमेल या पासवर्ड। अपनी जानकारी जांचें और पुनः प्रयास करें।',
      userAlreadyRegistered: 'इस ईमेल के साथ खाता पहले से मौजूद है। साइन इन करने की कोशिश करें।',
      emailNotConfirmed: 'साइन इन करने से पहले अपना ईमेल जांचें और पुष्टि लिंक पर क्लिक करें।',
      errorOccurred: 'एक त्रुटि हुई। कृपया पुनः प्रयास करें।',
      unexpectedError: 'एक अप्रत्याशित त्रुटि हुई। कृपया पुनः प्रयास करें।',
      accountCreated: 'खाता बनाया गया! अपने खाते की पुष्टि के लिए अपना ईमेल जांचें।',
      welcomeBackToast: 'वापस स्वागत है!',
      signedInSuccessfully: 'आपने सफलतापूर्वक साइन इन किया है।',
    },
    'nl': {
      welcomeBack: 'Welkom terug',
      createAccount: 'Maak je account aan',
      signInToAccess: 'Log in om toegang te krijgen tot je Geheugenportemonnee',
      startPreserving: 'Begin met het bewaren van je kostbare herinneringen',
      signIn: 'Inloggen',
      signUp: 'Registreren',
      emailAddress: 'E-mailadres',
      enterEmail: 'Voer je e-mail in',
      password: 'Wachtwoord',
      enterPassword: 'Voer je wachtwoord in',
      confirmPassword: 'Bevestig wachtwoord',
      confirmPasswordPlaceholder: 'Bevestig je wachtwoord',
      passwordStrength: 'Wachtwoordsterkte',
      tooShort: 'Te kort',
      fair: 'Redelijk',
      good: 'Goed',
      signingIn: 'Inloggen...',
      creatingAccount: 'Account aanmaken...',
      createAccountBtn: 'Account Aanmaken',
      dontHaveAccount: "Heb je geen account?",
      alreadyHaveAccount: "Heb je al een account?",
      createNewAccount: 'Nieuw account aanmaken',
      signInExisting: 'Inloggen op bestaand account',
      byContinuing: 'Door verder te gaan, ga je akkoord met onze',
      termsOfService: 'Servicevoorwaarden',
      and: 'en',
      privacyPolicy: 'Privacybeleid',
      backToHome: 'Terug naar Home',
      enterEmailAddress: 'Voer je e-mailadres in',
      enterValidEmail: 'Voer een geldig e-mailadres in',
      enterPasswordField: 'Voer je wachtwoord in',
      passwordMinLength: 'Wachtwoord moet minimaal 6 tekens bevatten',
      passwordsNoMatch: 'Wachtwoorden komen niet overeen',
      invalidCredentials: 'Ongeldig e-mailadres of wachtwoord. Controleer je gegevens en probeer opnieuw.',
      userAlreadyRegistered: 'Er bestaat al een account met dit e-mailadres. Probeer in te loggen.',
      emailNotConfirmed: 'Controleer je e-mail en klik op de bevestigingslink voordat je inlogt.',
      errorOccurred: 'Er is een fout opgetreden. Probeer opnieuw.',
      unexpectedError: 'Er is een onverwachte fout opgetreden. Probeer opnieuw.',
      accountCreated: 'Account aangemaakt! Controleer je e-mail om je account te verifiëren.',
      welcomeBackToast: 'Welkom terug!',
      signedInSuccessfully: 'Je bent succesvol ingelogd.',
    },
    'sv': {
      welcomeBack: 'Välkommen tillbaka',
      createAccount: 'Skapa ditt konto',
      signInToAccess: 'Logga in för att komma åt din Minnesplånbok',
      startPreserving: 'Börja bevara dina dyrbara minnen',
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
      fair: 'Bra',
      good: 'Bra',
      signingIn: 'Loggar in...',
      creatingAccount: 'Skapar konto...',
      createAccountBtn: 'Skapa Konto',
      dontHaveAccount: "Har du inget konto?",
      alreadyHaveAccount: "Har du redan ett konto?",
      createNewAccount: 'Skapa nytt konto',
      signInExisting: 'Logga in på befintligt konto',
      byContinuing: 'Genom att fortsätta godkänner du våra',
      termsOfService: 'Användarvillkor',
      and: 'och',
      privacyPolicy: 'Integritetspolicy',
      backToHome: 'Tillbaka till Hem',
      enterEmailAddress: 'Vänligen ange din e-postadress',
      enterValidEmail: 'Vänligen ange en giltig e-postadress',
      enterPasswordField: 'Vänligen ange ditt lösenord',
      passwordMinLength: 'Lösenordet måste vara minst 6 tecken',
      passwordsNoMatch: 'Lösenorden stämmer inte överens',
      invalidCredentials: 'Ogiltig e-post eller lösenord. Kontrollera dina uppgifter och försök igen.',
      userAlreadyRegistered: 'Ett konto med denna e-post finns redan. Försök logga in istället.',
      emailNotConfirmed: 'Kontrollera din e-post och klicka på bekräftelselänken innan du loggar in.',
      errorOccurred: 'Ett fel uppstod. Vänligen försök igen.',
      unexpectedError: 'Ett oväntat fel uppstod. Vänligen försök igen.',
      accountCreated: 'Konto skapat! Kontrollera din e-post för att verifiera ditt konto.',
      welcomeBackToast: 'Välkommen tillbaka!',
      signedInSuccessfully: 'Du har loggat in framgångsrikt.',
    },
    'no': {
      welcomeBack: 'Velkommen tilbake',
      createAccount: 'Opprett din konto',
      signInToAccess: 'Logg inn for å få tilgang til din Minnelommebok',
      startPreserving: 'Begynn å bevare dine dyrebare minner',
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
      createAccountBtn: 'Opprett Konto',
      dontHaveAccount: "Har du ikke en konto?",
      alreadyHaveAccount: "Har du allerede en konto?",
      createNewAccount: 'Opprett ny konto',
      signInExisting: 'Logg inn på eksisterende konto',
      byContinuing: 'Ved å fortsette godtar du våre',
      termsOfService: 'Servicevilkår',
      and: 'og',
      privacyPolicy: 'Personvernpolicy',
      backToHome: 'Tilbake til Hjem',
      enterEmailAddress: 'Vennligst skriv inn din e-postadresse',
      enterValidEmail: 'Vennligst skriv inn en gyldig e-postadresse',
      enterPasswordField: 'Vennligst skriv inn ditt passord',
      passwordMinLength: 'Passordet må være minst 6 tegn',
      passwordsNoMatch: 'Passordene stemmer ikke overens',
      invalidCredentials: 'Ugyldig e-post eller passord. Sjekk dine opplysninger og prøv igjen.',
      userAlreadyRegistered: 'En konto med denne e-posten eksisterer allerede. Prøv å logge inn i stedet.',
      emailNotConfirmed: 'Sjekk din e-post og klikk på bekreftelseslenken før du logger inn.',
      errorOccurred: 'En feil oppstod. Vennligst prøv igjen.',
      unexpectedError: 'En uventet feil oppstod. Vennligst prøv igjen.',
      accountCreated: 'Konto opprettet! Sjekk din e-post for å verifisere kontoen din.',
      welcomeBackToast: 'Velkommen tilbake!',
      signedInSuccessfully: 'Du har logget inn vellykket.',
    },
    'da': {
      welcomeBack: 'Velkommen tilbage',
      createAccount: 'Opret din konto',
      signInToAccess: 'Log ind for at få adgang til din Hukommelsespung',
      startPreserving: 'Begynd at bevare dine dyrebare minder',
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
      fair: 'Rimelig',
      good: 'God',
      signingIn: 'Logger ind...',
      creatingAccount: 'Opretter konto...',
      createAccountBtn: 'Opret Konto',
      dontHaveAccount: "Har du ikke en konto?",
      alreadyHaveAccount: "Har du allerede en konto?",
      createNewAccount: 'Opret ny konto',
      signInExisting: 'Log ind på eksisterende konto',
      byContinuing: 'Ved at fortsætte accepterer du vores',
      termsOfService: 'Servicevilkår',
      and: 'og',
      privacyPolicy: 'Privatlivspolitik',
      backToHome: 'Tilbage til Hjem',
      enterEmailAddress: 'Indtast venligst din e-mailadresse',
      enterValidEmail: 'Indtast venligst en gyldig e-mailadresse',
      enterPasswordField: 'Indtast venligst din adgangskode',
      passwordMinLength: 'Adgangskoden skal være mindst 6 tegn',
      passwordsNoMatch: 'Adgangskoderne stemmer ikke overens',
      invalidCredentials: 'Ugyldig e-mail eller adgangskode. Tjek dine oplysninger og prøv igen.',
      userAlreadyRegistered: 'En konto med denne e-mail eksisterer allerede. Prøv at logge ind i stedet.',
      emailNotConfirmed: 'Tjek din e-mail og klik på bekræftelseslinket før du logger ind.',
      errorOccurred: 'Der opstod en fejl. Prøv venligst igen.',
      unexpectedError: 'Der opstod en uventet fejl. Prøv venligst igen.',
      accountCreated: 'Konto oprettet! Tjek din e-mail for at verificere din konto.',
      welcomeBackToast: 'Velkommen tilbage!',
      signedInSuccessfully: 'Du er logget ind med succes.',
    },
    'fi': {
      welcomeBack: 'Tervetuloa takaisin',
      createAccount: 'Luo tilisi',
      signInToAccess: 'Kirjaudu sisään päästäksesi Muistilompakolle',
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
      createAccountBtn: 'Luo Tili',
      dontHaveAccount: "Eikö sinulla ole tiliä?",
      alreadyHaveAccount: "Onko sinulla jo tili?",
      createNewAccount: 'Luo uusi tili',
      signInExisting: 'Kirjaudu olemassa olevalle tilille',
      byContinuing: 'Jatkamalla hyväksyt meidän',
      termsOfService: 'Käyttöehdot',
      and: 'ja',
      privacyPolicy: 'Tietosuojakäytännön',
      backToHome: 'Takaisin Kotiin',
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
      <div className="min-h-screen flex">
        {/* Left Side - Confirmation */}
        <div className="flex-1 flex items-center justify-center bg-background p-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="w-full max-w-md"
          >
            {/* Header with Go Back and Language Selector */}
            <div className="flex justify-between items-center mb-8">
              <Button
                variant="ghost"
                onClick={() => navigate('/')}
                className="p-0 h-auto text-muted-foreground hover:text-foreground"
              >
                ← {t.backToHome}
              </Button>
              <LanguageSelector />
            </div>

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
          </motion.div>
        </div>

        {/* Right Side - Image */}
        <div className="hidden lg:flex flex-1 relative bg-gradient-to-br from-primary/20 to-secondary/20">
          <div className="absolute inset-0 bg-gradient-to-br from-primary/80 to-secondary/80" />
          <div className="relative flex items-center justify-center w-full">
            <div className="text-center text-white">
              <Heart className="w-24 h-24 mx-auto mb-6 opacity-80" />
              <h2 className="text-3xl font-bold mb-4">Welcome to Eterna</h2>
              <p className="text-xl opacity-90">Preserve your precious memories forever</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex">
      {/* Left Side - Form */}
      <div className="flex-1 flex items-center justify-center bg-background p-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-md"
        >
          {/* Header with Go Back and Language Selector */}
          <div className="flex justify-between items-center mb-8">
            <Button
              variant="ghost"
              onClick={() => navigate('/')}
              className="p-0 h-auto text-muted-foreground hover:text-foreground"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              {t.backToHome}
            </Button>
            <LanguageSelector />
          </div>

          {/* Header */}
          <div className="mb-8">
            <div className="w-12 h-12 mb-4 bg-gradient-to-br from-primary to-secondary rounded-full flex items-center justify-center">
              <Heart className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-foreground mb-2">
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
              className="w-full h-12 text-base"
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

      {/* Right Side - Hero Image */}
      <div className="hidden lg:flex flex-1 relative bg-gradient-to-br from-primary/20 to-secondary/20">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/80 to-secondary/80" />
        <div className="relative flex items-center justify-center w-full p-12">
          <div className="text-center text-white max-w-md">
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 }}
            >
              <Heart className="w-24 h-24 mx-auto mb-6 opacity-80" />
              <h2 className="text-4xl font-bold mb-4">Welcome to Eterna</h2>
              <p className="text-xl opacity-90 leading-relaxed">
                Preserve your precious memories forever and keep your loved ones close to your heart
              </p>
            </motion.div>
          </div>
        </div>
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