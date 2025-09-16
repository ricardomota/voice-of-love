import { useEffect } from 'react';
import { useLanguage } from '@/hooks/useLanguage';

export const useDocumentTitle = () => {
  const { currentLanguage } = useLanguage();

  const getTitleByLanguage = (language: string) => {
    const titles = {
      en: "Eterna - Preserve Love Forever",
      'pt-BR': "Eterna - Preserve o Amor Para Sempre",
      'zh-CN': "Eterna - 永远保存爱",
      'zh-TW': "Eterna - 永遠保存愛",
      es: "Eterna - Preserva el Amor Para Siempre",
      fr: "Eterna - Préservez l'Amour Pour Toujours",
      de: "Eterna - Bewahre die Liebe für Immer",
      it: "Eterna - Preserva l'Amore Per Sempre",
      ru: "Eterna - Сохрани Любовь Навсегда",
      ja: "Eterna - 愛を永遠に保つ",
      ko: "Eterna - 영원히 사랑을 보존하다",
      ar: "Eterna - احفظ الحب إلى الأبد",
      hi: "Eterna - प्रेम को हमेशा के लिए संरक्षित करें",
      nl: "Eterna - Bewaar Liefde Voor Altijd",
      sv: "Eterna - Bevara Kärlek För Alltid",
      no: "Eterna - Bevar Kjærlighet For Alltid",
      da: "Eterna - Bevar Kærlighed For Altid",
      fi: "Eterna - Säilytä Rakkaus Ikuisesti"
    };
    
    return titles[language as keyof typeof titles] || titles.en;
  };

  useEffect(() => {
    document.title = getTitleByLanguage(currentLanguage);
  }, [currentLanguage]);
};