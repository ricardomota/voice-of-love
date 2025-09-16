import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { CheckCircle, ArrowLeft } from 'lucide-react';
import { motion } from 'framer-motion';
import { useLanguage } from '@/hooks/useLanguage';

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
    }
  };

  const text = content[currentLanguage as keyof typeof content] || content.en;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email) {
      const requiredTexts = {
        en: 'Email is required',
        'pt-BR': 'Email é obrigatório',
        'zh-CN': '邮箱是必需的',
        'zh-TW': '郵箱是必需的',
        es: 'El email es requerido',
        fr: 'L\'email est requis'
      };
      toast.error(requiredTexts[currentLanguage as keyof typeof requiredTexts] || requiredTexts.en);
      return;
    }

    setIsSubmitting(true);

    try {
      const { error } = await supabase
        .from('waitlist')
        .insert({
          email,
          full_name: '',
          user_id: crypto.randomUUID()
        });

      if (error) {
        if (error.code === '23505') {
          const duplicateTexts = {
            en: 'This email is already on the list',
            'pt-BR': 'Este email já está na lista',
            'zh-CN': '此邮箱已在名单中',
            'zh-TW': '此郵箱已在名單中',
            es: 'Este email ya está en la lista',
            fr: 'Cet email est déjà sur la liste'
          };
          toast.error(duplicateTexts[currentLanguage as keyof typeof duplicateTexts] || duplicateTexts.en);
        } else {
          throw error;
        }
      } else {
        setIsSubmitted(true);
        const successTexts = {
          en: 'Added to waitlist!',
          'pt-BR': 'Adicionado à lista!',
          'zh-CN': '已加入等候名单！',
          'zh-TW': '已加入等候名單！',
          es: '¡Añadido a la lista!',
          fr: 'Ajouté à la liste !'
        };
        toast.success(successTexts[currentLanguage as keyof typeof successTexts] || successTexts.en);
      }
    } catch (error) {
      console.error('Error submitting to waitlist:', error);
      const errorTexts = {
        en: 'Error signing up',
        'pt-BR': 'Erro ao cadastrar',
        'zh-CN': '注册出错',
        'zh-TW': '註冊出錯',
        es: 'Error al registrarse',
        fr: 'Erreur lors de l\'inscription'
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
                      fr: 'Merci de nous avoir rejoint ! Nous vous contacterons bientôt.'
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