import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { CheckCircle, ArrowLeft } from 'lucide-react';
import { motion } from 'framer-motion';
import { useLanguage } from '@/hooks/useLanguage';
import { supabase } from '@/integrations/supabase/client';

interface SimpleWaitlistModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SimpleWaitlistModal: React.FC<SimpleWaitlistModalProps> = ({ isOpen, onClose }) => {
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const { currentLanguage } = useLanguage();

  const content = {
    en: {
      title: "Join the waitlist",
      subtitle: "Be the first to know when Eterna launches",
      emailLabel: "Email address",
      emailPlaceholder: "your@email.com",
      submit: "Join waitlist",
      submitting: "Joining...",
      success: {
        title: "You're on the list!",
        subtitle: "We'll notify you when Eterna is ready"
      },
      back: "Back"
    },
    'pt-BR': {
      title: "Entrar na lista de espera",
      subtitle: "Seja o primeiro a saber quando o Eterna for lançado",
      emailLabel: "Endereço de email",
      emailPlaceholder: "seu@email.com",
      submit: "Entrar na lista",
      submitting: "Entrando...",
      success: {
        title: "Você está na lista!",
        subtitle: "Notificaremos você quando o Eterna estiver pronto"
      },
      back: "Voltar"
    },
    'zh-CN': {
      title: "加入等候名单",
      subtitle: "第一时间了解Eterna发布消息",
      emailLabel: "电子邮件地址",
      emailPlaceholder: "你的@邮箱.com",
      submit: "加入等候名单",
      submitting: "加入中...",
      success: {
        title: "您已在名单中！",
        subtitle: "当Eterna准备就绪时我们会通知您"
      },
      back: "返回"
    },
    'zh-TW': {
      title: "加入等候名單",
      subtitle: "第一時間了解Eterna發布消息",
      emailLabel: "電子郵件地址",
      emailPlaceholder: "你的@郵箱.com",
      submit: "加入等候名單",
      submitting: "加入中...",
      success: {
        title: "您已在名單中！",
        subtitle: "當Eterna準備就緒時我們會通知您"
      },
      back: "返回"
    },
    es: {
      title: "Unirse a la lista de espera",
      subtitle: "Sé el primero en saber cuándo se lance Eterna",
      emailLabel: "Dirección de correo",
      emailPlaceholder: "tu@email.com",
      submit: "Unirse a la lista",
      submitting: "Uniéndose...",
      success: {
        title: "¡Estás en la lista!",
        subtitle: "Te notificaremos cuando Eterna esté listo"
      },
      back: "Atrás"
    },
    fr: {
      title: "Rejoindre la liste d'attente",
      subtitle: "Soyez le premier à savoir quand Eterna sera lancé",
      emailLabel: "Adresse e-mail",
      emailPlaceholder: "votre@email.com",
      submit: "Rejoindre la liste",
      submitting: "Inscription...",
      success: {
        title: "Vous êtes sur la liste !",
        subtitle: "Nous vous préviendrons quand Eterna sera prêt"
      },
      back: "Retour"
    },
    de: {
      title: "Der Warteliste beitreten",
      subtitle: "Seien Sie der Erste, der erfährt, wann Eterna startet",
      emailLabel: "E-Mail-Adresse",
      emailPlaceholder: "ihre@email.com",
      submit: "Warteliste beitreten",
      submitting: "Beitritt läuft...",
      success: {
        title: "Sie stehen auf der Liste!",
        subtitle: "Wir benachrichtigen Sie, wenn Eterna bereit ist"
      },
      back: "Zurück"
    },
    it: {
      title: "Unisciti alla lista d'attesa",
      subtitle: "Sii il primo a sapere quando Eterna sarà lanciata",
      emailLabel: "Indirizzo email",
      emailPlaceholder: "tua@email.com",
      submit: "Unisciti alla lista",
      submitting: "Registrazione...",
      success: {
        title: "Sei nella lista!",
        subtitle: "Ti avviseremo quando Eterna sarà pronto"
      },
      back: "Indietro"
    },
    ru: {
      title: "Присоединиться к списку ожидания",
      subtitle: "Узнайте первыми о запуске Eterna",
      emailLabel: "Адрес электронной почты",
      emailPlaceholder: "ваш@email.com",
      submit: "Присоединиться к списку",
      submitting: "Присоединение...",
      success: {
        title: "Вы в списке!",
        subtitle: "Мы уведомим вас, когда Eterna будет готова"
      },
      back: "Назад"
    },
    ja: {
      title: "ウェイトリストに参加",
      subtitle: "Eternaのローンチを最初に知る",
      emailLabel: "メールアドレス",
      emailPlaceholder: "your@email.com",
      submit: "ウェイトリストに参加",
      submitting: "参加中...",
      success: {
        title: "リストに登録されました！",
        subtitle: "Eternaの準備ができたらお知らせします"
      },
      back: "戻る"
    },
    ko: {
      title: "대기자 명단에 참여",
      subtitle: "Eterna 출시를 가장 먼저 알아보세요",
      emailLabel: "이메일 주소",
      emailPlaceholder: "your@email.com",
      submit: "대기자 명단 참여",
      submitting: "참여 중...",
      success: {
        title: "명단에 등록되었습니다!",
        subtitle: "Eterna가 준비되면 알려드리겠습니다"
      },
      back: "뒤로"
    },
    ar: {
      title: "انضم لقائمة الانتظار",
      subtitle: "كن أول من يعرف عند إطلاق Eterna",
      emailLabel: "عنوان البريد الإلكتروني",
      emailPlaceholder: "your@email.com",
      submit: "انضم لقائمة الانتظار",
      submitting: "الانضمام...",
      success: {
        title: "أنت في القائمة!",
        subtitle: "سنخطرك عندما يصبح Eterna جاهزاً"
      },
      back: "العودة"
    },
    hi: {
      title: "प्रतीक्षा सूची में शामिल हों",
      subtitle: "Eterna लॉन्च होने पर सबसे पहले जानें",
      emailLabel: "ईमेल पता",
      emailPlaceholder: "आपका@ईमेल.com",
      submit: "प्रतीक्षा सूची में शामिल हों",
      submitting: "शामिल हो रहे हैं...",
      success: {
        title: "आप सूची में हैं!",
        subtitle: "जब Eterna तैयार होगा तो हम आपको सूचित करेंगे"
      },
      back: "वापस"
    },
    nl: {
      title: "Doe mee aan de wachtlijst",
      subtitle: "Wees de eerste die het weet wanneer Eterna wordt gelanceerd",
      emailLabel: "E-mailadres",
      emailPlaceholder: "jouw@email.com",
      submit: "Doe mee aan wachtlijst",
      submitting: "Aanmelden...",
      success: {
        title: "Je staat op de lijst!",
        subtitle: "We sturen je een bericht wanneer Eterna klaar is"
      },
      back: "Terug"
    },
    sv: {
      title: "Gå med i väntelistan",
      subtitle: "Var först med att veta när Eterna lanseras",
      emailLabel: "E-postadress",
      emailPlaceholder: "din@email.com",
      submit: "Gå med i väntelistan",
      submitting: "Ansluter...",
      success: {
        title: "Du är med på listan!",
        subtitle: "Vi meddelar dig när Eterna är redo"
      },
      back: "Tillbaka"
    },
    no: {
      title: "Bli med på ventelisten",
      subtitle: "Vær den første til å vite når Eterna lanseres",
      emailLabel: "E-postadresse",
      emailPlaceholder: "din@email.com",
      submit: "Bli med på ventelisten",
      submitting: "Melder på...",
      success: {
        title: "Du er på listen!",
        subtitle: "Vi varsler deg når Eterna er klar"
      },
      back: "Tilbake"
    },
    da: {
      title: "Tilmeld dig ventelisten",
      subtitle: "Vær den første til at vide, hvornår Eterna lanceres",
      emailLabel: "E-mailadresse",
      emailPlaceholder: "din@email.com",
      submit: "Tilmeld dig ventelisten",
      submitting: "Tilmelder...",
      success: {
        title: "Du er på listen!",
        subtitle: "Vi giver dig besked, når Eterna er klar"
      },
      back: "Tilbage"
    },
    fi: {
      title: "Liity jonotuslistalle",
      subtitle: "Ole ensimmäinen tietämään kun Eterna julkaistaan",
      emailLabel: "Sähköpostiosoite",
      emailPlaceholder: "sinun@sahkoposti.com",
      submit: "Liity jonotuslistalle",
      submitting: "Liitytään...",
      success: {
        title: "Olet listalla!",
        subtitle: "Ilmoitamme sinulle kun Eterna on valmis"
      },
      back: "Takaisin"
    }
  };

  const text = content[currentLanguage as keyof typeof content] || content.en;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log('🔵 1. Form submitted with email:', email);
    
    if (!email) {
      const requiredTexts = {
        en: 'Email is required',
        'pt-BR': 'Email é obrigatório',
        'zh-CN': '邮箱是必需的',
        'zh-TW': '郵箱是必需的',
        es: 'El email es requerido',
        fr: 'L\'email est requis',
        de: 'E-Mail ist erforderlich',
        it: 'L\'email è richiesta',
        ru: 'Электронная почта обязательна',
        ja: 'メールアドレスが必要です',
        ko: '이메일이 필요합니다',
        ar: 'البريد الإلكتروني مطلوب',
        hi: 'ईमेल आवश्यक है',
        nl: 'E-mail is verplicht',
        sv: 'E-post krävs',
        no: 'E-post er påkrevd',
        da: 'E-mail er påkrævet',
        fi: 'Sähköposti vaaditaan'
      };
      toast.error(requiredTexts[currentLanguage as keyof typeof requiredTexts] || requiredTexts.en);
      return;
    }

    setIsSubmitting(true);
    console.log('🔵 2. Setting isSubmitting to true, starting process...');

    try {
      console.log('🔵 3. Making API request to waitlist endpoint...');
      
      // Use the waitlist-signup edge function via Supabase client
      const { data: result, error } = await supabase.functions.invoke('waitlist-signup', {
        body: {
          email: email.trim().toLowerCase(),
          full_name: 'Anonymous User',
          primary_interest: 'general',
          how_did_you_hear: 'website'
        },
      });

      console.log('🔵 4. Edge function response received');
      console.log('🔵 5. API response data:', result, 'Error:', error);

      if (error) {
        if (error.message?.includes('INVALID_EMAIL')) {
          const invalidTexts = {
            en: 'Please enter a valid email address',
            'pt-BR': 'Por favor, insira um endereço de email válido',
            'zh-CN': '请输入有效的电子邮件地址',
            'zh-TW': '請輸入有效的電子郵件地址',
            es: 'Por favor, introduce una dirección de correo válida',
            fr: 'Veuillez entrer une adresse e-mail valide',
            de: 'Bitte geben Sie eine gültige E-Mail-Adresse ein',
            it: 'Inserisci un indirizzo email valido',
            ru: 'Пожалуйста, введите действительный адрес электронной почты',
            ja: '有効なメールアドレスを入力してください',
            ko: '유효한 이메일 주소를 입력해주세요',
            ar: 'يرجى إدخال عنوان بريد إلكتروني صالح',
            hi: 'कृपया एक वैध ईमेल पता दर्ज करें',
            nl: 'Voer een geldig e-mailadres in',
            sv: 'Ange en giltig e-postadress',
            no: 'Vennligst oppgi en gyldig e-postadresse',
            da: 'Indtast venligst en gyldig e-mailadresse',
            fi: 'Anna kelvollinen sähköpostiosoite'
          };
          toast.error(invalidTexts[currentLanguage as keyof typeof invalidTexts] || invalidTexts.en);
          return;
        }
        throw new Error(error.message || 'Unknown error');
      }

      // Handle success or duplicate
      if (result?.ok) {
        setIsSubmitted(true);
        
        if (result.message === 'ALREADY_EXISTS') {
          // Email already exists - show friendly message
          const duplicateTexts = {
            en: 'You\'re already on our waitlist!',
            'pt-BR': 'Você já está na nossa lista!',
            'zh-CN': '您已在我们的等候名单中！',
            'zh-TW': '您已在我們的等候名單中！',
            es: '¡Ya estás en nuestra lista!',
            fr: 'Vous êtes déjà sur notre liste !',
            de: 'Sie stehen bereits auf unserer Liste!',
            it: 'Sei già nella nostra lista!',
            ru: 'Вы уже в нашем списке!',
            ja: '既にウェイトリストに登録されています！',
            ko: '이미 대기자 명단에 등록되어 있습니다!',
            ar: 'أنت بالفعل في قائمة الانتظار لدينا!',
            hi: 'आप पहले से ही हमारी प्रतीक्षा सूची में हैं!',
            nl: 'Je staat al op onze wachtlijst!',
            sv: 'Du finns redan på vår väntelista!',
            no: 'Du er allerede på ventelisten vår!',
            da: 'Du er allerede på vores venteliste!',
            fi: 'Olet jo jonotilauksessamme!'
          };
          toast.success(duplicateTexts[currentLanguage as keyof typeof duplicateTexts] || duplicateTexts.en);
        } else {
          // New signup success
          console.log('🔵 6. SUCCESS! Email added to waitlist:', email.trim().toLowerCase());
          const successTexts = {
            en: 'Added to waitlist!',
            'pt-BR': 'Adicionado à lista!',
            'zh-CN': '已加入等候名单！',
            'zh-TW': '已加入等候名單！',
            es: '¡Añadido a la lista!',
            fr: 'Ajouté à la liste !',
            de: 'Zur Warteliste hinzugefügt!',
            it: 'Aggiunto alla lista!',
            ru: 'Добавлено в список!',
            ja: 'ウェイトリストに追加されました！',
            ko: '대기자 명단에 추가되었습니다!',
            ar: 'تمت الإضافة لقائمة الانتظار!',
            hi: 'प्रतीक्षा सूची में जोड़ा गया!',
            nl: 'Toegevoegd aan wachtlijst!',
            sv: 'Tillagd i väntelistan!',
            no: 'Lagt til i ventelisten!',
            da: 'Tilføjet til ventelisten!',
            fi: 'Lisätty jonotuslistalle!'
          };
          toast.success(successTexts[currentLanguage as keyof typeof successTexts] || successTexts.en);
        }
      }
    } catch (error) {
      console.error('❌ Caught error submitting to waitlist:', error);
      const errorTexts = {
        en: 'Error signing up',
        'pt-BR': 'Erro ao cadastrar',
        'zh-CN': '注册出错',
        'zh-TW': '註冊出錯',
        es: 'Error al registrarse',
        fr: 'Erreur lors de l\'inscription',
        de: 'Fehler bei der Anmeldung',
        it: 'Errore durante la registrazione',
        ru: 'Ошибка при регистрации',
        ja: '登録エラー',
        ko: '가입 오류',
        ar: 'خطأ في التسجيل',
        hi: 'साइन अप करने में त्रुटि',
        nl: 'Fout bij aanmelden',
        sv: 'Fel vid registrering',
        no: 'Feil ved registrering',
        da: 'Fejl ved tilmelding',
        fi: 'Virhe rekisteröitymisessä'
      };
      toast.error(errorTexts[currentLanguage as keyof typeof errorTexts] || errorTexts.en);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    setEmail('');
    setIsSubmitted(false);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="w-full max-w-md"
      >
        <Card className="border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-950">
          <CardHeader className="pb-4">
            <div className="flex items-center gap-3">
              <Button
                variant="ghost"
                size="sm"
                onClick={handleClose}
                className="p-1 h-auto"
              >
                <ArrowLeft className="w-4 h-4" />
              </Button>
              <div>
                <CardTitle className="text-xl font-semibold text-gray-900 dark:text-white">
                  {isSubmitted ? text.success.title : text.title}
                </CardTitle>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                  {isSubmitted ? text.success.subtitle : text.subtitle}
                </p>
              </div>
            </div>
          </CardHeader>

          <CardContent>
            {isSubmitted ? (
              <div className="text-center py-8">
                <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-emerald-100 dark:bg-emerald-900/30 mb-4">
                  <CheckCircle className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {(() => {
                    const thankTexts = {
                      en: 'Thanks for joining! We\'ll be in touch soon.',
                      'pt-BR': 'Obrigado por se juntar! Entraremos em contato em breve.',
                      'zh-CN': '感谢加入！我们很快就会联系您。',
                      'zh-TW': '感謝加入！我們很快就會聯繫您。',
                      es: '¡Gracias por unirte! Nos pondremos en contacto pronto.',
                      fr: 'Merci de nous avoir rejoint ! Nous vous contacterons bientôt.',
                      de: 'Danke fürs Mitmachen! Wir melden uns bald.',
                      it: 'Grazie per esserti unito! Ti contatteremo presto.',
                      ru: 'Спасибо за участие! Мы скоро свяжемся с вами.',
                      ja: '参加していただきありがとうございます！すぐにご連絡いたします。',
                      ko: '참여해 주셔서 감사합니다! 곧 연락드리겠습니다.',
                      ar: 'شكراً للانضمام! سنتواصل معك قريباً.',
                      hi: 'शामिल होने के लिए धन्यवाद! हम जल्द ही संपर्क करेंगे।',
                      nl: 'Bedankt voor het meedoen! We nemen binnenkort contact op.',
                      sv: 'Tack för att du gick med! Vi hör av oss snart.',
                      no: 'Takk for at du ble med! Vi tar kontakt snart.',
                      da: 'Tak for at du meldte dig! Vi kontakter dig snart.',
                      fi: 'Kiitos liittymisestä! Otamme pian yhteyttä.'
                    };
                    return thankTexts[currentLanguage as keyof typeof thankTexts] || thankTexts.en;
                  })()}
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <Label htmlFor="email" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    {text.emailLabel}
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder={text.emailPlaceholder}
                    required
                    className="mt-1"
                  />
                </div>

                <Button 
                  type="submit" 
                  className="w-full bg-black hover:bg-gray-800 text-white dark:bg-white dark:text-black dark:hover:bg-gray-100"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? text.submitting : text.submit}
                </Button>
              </form>
            )}
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
};