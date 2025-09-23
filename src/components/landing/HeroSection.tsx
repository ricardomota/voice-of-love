import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/hooks/useLanguage';
import { Group, PlayFilled, Security } from '@carbon/icons-react';
import { supabase } from '@/integrations/supabase/client';
import { motion } from 'framer-motion';

interface HeroSectionProps {
  onTryFree: () => void;
  onSeePricing: () => void;
  onLogin: () => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({
  onTryFree,
  onSeePricing,
  onLogin
}) => {
  const [waitlistCount, setWaitlistCount] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  const { currentLanguage } = useLanguage();
  
  const content = {
    en: {
      badge: "Preserve memories with AI",
      headline: "Keep their voice and wisdom alive forever",
      subhead: "Help families affected by Alzheimer's preserve precious memories and stay connected through AI-powered conversations.",
      tryFree: "Join Waitlist",
      seePricing: "See Pricing",
      trustBadge: "✨ Built for families"
    },
    'pt-BR': {
      badge: "Preserve memórias com IA",
      headline: "Mantenha a voz e sabedoria deles vivos para sempre",
      subhead: "Ajude famílias afetadas pelo Alzheimer a preservar memórias preciosas e permanecer conectadas através de conversas com IA.",
      tryFree: "Entrar na Lista",
      seePricing: "Ver Preços",
      trustBadge: "Feito para famílias"
    },
    'zh-CN': {
      badge: "用AI保存记忆",
      headline: "让他们的声音和智慧永远活着",
      subhead: "帮助受阿尔茨海默症影响的家庭保存珍贵记忆，通过AI对话保持联系。",
      tryFree: "加入等候名单",
      seePricing: "查看定价",
      trustBadge: "为家庭而建"
    },
    'zh-TW': {
      badge: "用AI保存記憶",
      headline: "讓他們的聲音和智慧永遠活著",
      subhead: "幫助受阿茲海默症影響的家庭保存珍貴記憶，通過AI對話保持聯繫。",
      tryFree: "加入等候名單",
      seePricing: "查看定價",
      trustBadge: "為家庭而建"
    },
    es: {
      badge: "Preserva recuerdos con IA",
      headline: "Mantén su voz y sabiduría vivas para siempre",
      subhead: "Ayuda a las familias afectadas por el Alzheimer a preservar recuerdos preciosos y mantenerse conectadas a través de conversaciones con IA.",
      tryFree: "Unirse a la Lista",
      seePricing: "Ver Precios",
      trustBadge: "Construido para familias"
    },
    fr: {
      badge: "Préservez les souvenirs avec l'IA",
      headline: "Gardez leur voix et leur sagesse vivantes pour toujours",
      subhead: "Aidez les familles touchées par Alzheimer à préserver des souvenirs précieux et à rester connectées grâce aux conversations IA.",
      tryFree: "Rejoindre la Liste",
      seePricing: "Voir les Prix",
      trustBadge: "Conçu pour les familles"
    },
    de: {
      badge: "Erinnerungen mit KI bewahren",
      headline: "Ihre Stimme und Weisheit für immer am Leben erhalten",
      subhead: "Helfen Sie Familien, die von Alzheimer betroffen sind, kostbare Erinnerungen zu bewahren und durch KI-gestützte Gespräche verbunden zu bleiben.",
      tryFree: "Warteliste beitreten",
      seePricing: "Preise ansehen",
      trustBadge: "Für Familien gebaut"
    },
    it: {
      badge: "Preserva i ricordi con l'IA",
      headline: "Mantieni viva per sempre la loro voce e saggezza",
      subhead: "Aiuta le famiglie colpite dall'Alzheimer a preservare ricordi preziosi e rimanere connesse attraverso conversazioni AI.",
      tryFree: "Unisciti alla Lista",
      seePricing: "Vedi Prezzi",
      trustBadge: "Costruito per le famiglie"
    },
    ru: {
      badge: "Сохраните воспоминания с ИИ",
      headline: "Сохраните их голос и мудрость навсегда",
      subhead: "Помогите семьям, пострадавшим от болезни Альцгеймера, сохранить драгоценные воспоминания и оставаться на связи через разговоры с ИИ.",
      tryFree: "Присоединиться к списку ожидания",
      seePricing: "Посмотреть цены",
      trustBadge: "Создано для семей"
    },
    ja: {
      badge: "AIで思い出を保存",
      headline: "彼らの声と知恵を永遠に生かし続ける",
      subhead: "アルツハイマー病の影響を受けた家族が大切な思い出を保存し、AI会話を通じてつながりを保つお手伝いをします。",
      tryFree: "ウェイトリストに参加",
      seePricing: "料金を見る",
      trustBadge: "家族のために作られました"
    },
    ko: {
      badge: "AI로 추억 보존",
      headline: "그들의 목소리와 지혜를 영원히 살려두세요",
      subhead: "알츠하이머에 영향을 받은 가족들이 소중한 추억을 보존하고 AI 대화를 통해 연결을 유지할 수 있도록 도와드립니다.",
      tryFree: "대기자 명단 참여",
      seePricing: "가격 보기",
      trustBadge: "가족을 위해 만들어졌습니다"
    },
    ar: {
      badge: "احفظ الذكريات بالذكاء الاصطناعي",
      headline: "أبق صوتهم وحكمتهم حيين إلى الأبد",
      subhead: "ساعد العائلات المتأثرة بالزهايمر على حفظ الذكريات الثمينة والبقاء متصلين من خلال محادثات الذكاء الاصطناعي.",
      tryFree: "انضم لقائمة الانتظار",
      seePricing: "عرض الأسعار",
      trustBadge: "مبني للعائلات"
    },
    hi: {
      badge: "AI के साथ यादें संरक्षित करें",
      headline: "उनकी आवाज़ और बुद्धिमत्ता को हमेशा के लिए जीवित रखें",
      subhead: "अल्जाइमर से प्रभावित परिवारों को कीमती यादों को संरक्षित करने और AI वार्तालाप के माध्यम से जुड़े रहने में मदद करें।",
      tryFree: "प्रतीक्षा सूची में शामिल हों",
      seePricing: "मूल्य देखें",
      trustBadge: "परिवारों के लिए बनाया गया"
    },
    nl: {
      badge: "Bewaar herinneringen met AI",
      headline: "Houd hun stem en wijsheid voor altijd levend",
      subhead: "Help families die getroffen zijn door Alzheimer om kostbare herinneringen te bewaren en verbonden te blijven door AI-gesprekken.",
      tryFree: "Doe mee aan wachtlijst",
      seePricing: "Bekijk prijzen",
      trustBadge: "Gebouwd voor families"
    },
    sv: {
      badge: "Bevara minnen med AI",
      headline: "Håll deras röst och visdom levande för alltid",
      subhead: "Hjälp familjer som drabbats av Alzheimer att bevara värdefulla minnen och hålla kontakten genom AI-samtal.",
      tryFree: "Gå med i väntelistan",
      seePricing: "Se priser",
      trustBadge: "Byggd för familjer"
    },
    no: {
      badge: "Bevar minner med AI",
      headline: "Hold deres stemme og visdom levende for alltid",
      subhead: "Hjelp familier påvirket av Alzheimer med å bevare verdifulle minner og holde kontakten gjennom AI-samtaler.",
      tryFree: "Bli med på ventelisten",
      seePricing: "Se priser",
      trustBadge: "Bygget for familier"
    },
    da: {
      badge: "Bevar minder med AI",
      headline: "Hold deres stemme og visdom levende for evigt",
      subhead: "Hjælp familier påvirket af Alzheimer med at bevare værdifulde minder og forblive forbundet gennem AI-samtaler.",
      tryFree: "Tilmeld dig ventelisten",
      seePricing: "Se priser",
      trustBadge: "Bygget til familier"
    },
    fi: {
      badge: "Säilytä muistoja tekoälyllä",
      headline: "Pidä heidän äänensä ja viisautensa elossa ikuisesti",
      subhead: "Auta Alzheimerin taudista kärsiviä perheitä säilyttämään arvokkaita muistoja ja pysymään yhteydessä tekoälykeskustelujen kautta.",
      tryFree: "Liity jonotuslistalle",
      seePricing: "Katso hinnat",
      trustBadge: "Rakennettu perheille"
    }
  };
  
  const text = content[currentLanguage as keyof typeof content] || content.en;
  
  useEffect(() => {
    const checkWaitlistCount = async () => {
      try {
        const { count, error } = await supabase
          .from('waitlist')
          .select('*', { count: 'exact', head: true });
          
        if (error) {
          console.error('Error getting waitlist count:', error);
          setWaitlistCount(0);
        } else {
          setWaitlistCount(count || 0);
        }
      } catch (error) {
        console.error('Error in checkWaitlistCount:', error);
        setWaitlistCount(0);
      } finally {
        setIsLoading(false);
      }
    };
    checkWaitlistCount();
  }, []);

  return (
    <section className="relative min-h-screen flex items-center justify-center bg-background overflow-hidden">
      {/* Subtle animated background elements */}
      <div className="absolute inset-0 opacity-20 dark:opacity-10">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-gradient-to-r from-primary/10 via-accent/10 to-muted/20 rounded-full blur-3xl animate-pulse" 
             style={{ animationDuration: '8s' }} />
        <div className="absolute top-1/3 right-1/4 w-80 h-80 bg-gradient-to-r from-accent/10 via-muted/15 to-primary/10 rounded-full blur-3xl animate-pulse" 
             style={{ animationDuration: '12s', animationDelay: '2s' }} />
        <div className="absolute bottom-1/4 left-1/3 w-72 h-72 bg-gradient-to-r from-muted/15 via-accent/10 to-primary/10 rounded-full blur-3xl animate-pulse" 
             style={{ animationDuration: '10s', animationDelay: '4s' }} />
      </div>
      
      {/* Main content */}
      <div className="relative w-full max-w-4xl mx-auto px-6 py-24 text-center">
        
        {/* Status badge */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-8"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-muted text-muted-foreground text-sm font-medium border border-border/50">
            <div className="w-1.5 h-1.5 bg-primary rounded-full" />
            {text.badge}
          </div>
        </motion.div>

        {/* Hero headline */}
        <motion.h1 
          className="text-5xl sm:text-6xl lg:text-7xl font-semibold text-foreground mb-6 leading-tight tracking-tight"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.1 }}
        >
          {text.headline}
        </motion.h1>

        {/* Subtitle */}
        <motion.p 
          className="text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed mb-12 font-light"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          {text.subhead}
        </motion.p>

        {/* CTA buttons */}
        <motion.div 
          className="flex flex-col sm:flex-row gap-3 justify-center items-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
        >
          {!isLoading && (
            <>
              <Button 
                onClick={onTryFree}
                size="lg"
                className="px-8 py-3 text-base font-medium bg-primary hover:bg-primary/90 text-primary-foreground rounded-lg transition-all duration-300 hover:shadow-lg hover:shadow-primary/25"
              >
                {text.tryFree}
              </Button>
              
              <Button 
                onClick={onSeePricing}
                variant="ghost"
                size="lg"
                className="px-6 py-3 text-base font-medium text-muted-foreground hover:text-foreground transition-all duration-300"
              >
                {text.seePricing}
              </Button>
            </>
          )}
        </motion.div>

        {/* Trust indicator */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="flex items-center justify-center gap-2 text-sm text-muted-foreground"
        >
          <Security className="w-4 h-4" />
          <span>{text.trustBadge}</span>
        </motion.div>
      </div>
    </section>
  );
};