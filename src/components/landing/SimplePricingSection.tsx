import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Check, Heart } from 'lucide-react';
import { motion } from 'framer-motion';
import { useLanguage } from '@/hooks/useLanguage';

interface SimplePricingSectionProps {
  onJoinWaitlist: () => void;
}

export const SimplePricingSection: React.FC<SimplePricingSectionProps> = ({ onJoinWaitlist }) => {
  const { currentLanguage } = useLanguage();

  const content = {
    en: {
      title: "Simple, transparent pricing",
      subtitle: "Free during beta. Launch pricing shown below.",
      disclaimer: "Currently in beta - all features free during development",
      plans: [
        {
          name: "Free",
          price: "$0",
          period: "forever",
          description: "Perfect for getting started",
          features: [
            "1 loved one profile",
            "Basic conversations",
            "Photo memories",
            "Community support"
          ]
        },
        {
          name: "Family",
          price: "$29",
          period: "per month",
          description: "For growing families",
          features: [
            "Up to 3 profiles",
            "Voice messages",
            "Advanced personality",
            "Audio memories",
            "Family sharing"
          ]
        },
        {
          name: "Legacy",
          price: "$79",
          period: "per month",
          description: "Preserve everything",
          features: [
            "Unlimited profiles",
            "Custom voice cloning",
            "Video memories",
            "Priority support",
            "Extended sharing"
          ]
        }
      ]
    },
    'pt-BR': {
      title: "Preços simples e transparentes",
      subtitle: "Grátis durante o beta. Preços de lançamento mostrados abaixo.",
      disclaimer: "Atualmente em beta - todos os recursos gratuitos durante o desenvolvimento",
      plans: [
        {
          name: "Grátis",
          price: "$0",
          period: "para sempre",
          description: "Perfeito para começar",
          features: [
            "1 perfil de ente querido",
            "Conversas básicas",
            "Memórias em foto",
            "Suporte da comunidade"
          ]
        },
        {
          name: "Família",
          price: "$29",
          period: "por mês",
          description: "Para famílias em crescimento",
          features: [
            "Até 3 perfis",
            "Mensagens de voz",
            "Personalidade avançada",
            "Memórias em áudio",
            "Compartilhamento familiar"
          ]
        },
        {
          name: "Legado",
          price: "$79",
          period: "por mês",
          description: "Preserve tudo",
          features: [
            "Perfis ilimitados",
            "Clonagem de voz personalizada",
            "Memórias em vídeo",
            "Suporte prioritário",
            "Compartilhamento estendido"
          ]
        }
      ]
    },
    'zh-CN': {
      title: "简单透明的定价",
      subtitle: "测试期间免费。下方显示发布定价。",
      disclaimer: "目前在测试阶段 - 开发期间所有功能免费",
      plans: [
        {
          name: "免费",
          price: "$0",
          period: "永远",
          description: "完美的开始",
          features: [
            "1个亲人档案",
            "基本对话",
            "照片记忆",
            "社区支持"
          ]
        },
        {
          name: "家庭",
          price: "$29",
          period: "每月",
          description: "适合成长中的家庭",
          features: [
            "最多3个档案",
            "语音消息",
            "高级个性",
            "音频记忆",
            "家庭分享"
          ]
        },
        {
          name: "传承",
          price: "$79",
          period: "每月",
          description: "保存一切",
          features: [
            "无限档案",
            "定制语音克隆",
            "视频记忆",
            "优先支持",
            "扩展分享"
          ]
        }
      ]
    },
    'zh-TW': {
      title: "簡單透明的定價",
      subtitle: "測試期間免費。下方顯示發佈定價。",
      disclaimer: "目前在測試階段 - 開發期間所有功能免費",
      plans: [
        {
          name: "免費",
          price: "$0",
          period: "永遠",
          description: "完美的開始",
          features: [
            "1個親人檔案",
            "基本對話",
            "照片記憶",
            "社區支持"
          ]
        },
        {
          name: "家庭",
          price: "$29",
          period: "每月",
          description: "適合成長中的家庭",
          features: [
            "最多3個檔案",
            "語音消息",
            "高級個性",
            "音頻記憶",
            "家庭分享"
          ]
        },
        {
          name: "傳承",
          price: "$79",
          period: "每月",
          description: "保存一切",
          features: [
            "無限檔案",
            "定制語音克隆",
            "視頻記憶",
            "優先支持",
            "擴展分享"
          ]
        }
      ]
    },
    es: {
      title: "Precios simples y transparentes",
      subtitle: "Gratis durante la beta. Precios de lanzamiento mostrados abajo.",
      disclaimer: "Actualmente en beta - todas las funciones gratis durante el desarrollo",
      plans: [
        {
          name: "Gratis",
          price: "$0",
          period: "para siempre",
          description: "Perfecto para comenzar",
          features: [
            "1 perfil de ser querido",
            "Conversaciones básicas",
            "Recuerdos fotográficos",
            "Soporte comunitario"
          ]
        },
        {
          name: "Familiar",
          price: "$29",
          period: "por mes",
          description: "Para familias en crecimiento",
          features: [
            "Hasta 3 perfiles",
            "Mensajes de voz",
            "Personalidad avanzada",
            "Recuerdos de audio",
            "Compartir familiar"
          ]
        },
        {
          name: "Legado",
          price: "$79",
          period: "por mes",
          description: "Preservar todo",
          features: [
            "Perfiles ilimitados",
            "Clonación de voz personalizada",
            "Recuerdos de video",
            "Soporte prioritario",
            "Compartir extendido"
          ]
        }
      ]
    },
    fr: {
      title: "Prix simples et transparents",
      subtitle: "Gratuit pendant la bêta. Prix de lancement montrés ci-dessous.",
      disclaimer: "Actuellement en bêta - toutes les fonctionnalités gratuites pendant le développement",
      plans: [
        {
          name: "Gratuit",
          price: "$0",
          period: "pour toujours",
          description: "Parfait pour commencer",
          features: [
            "1 profil d'être cher",
            "Conversations de base",
            "Souvenirs photo",
            "Support communautaire"
          ]
        },
        {
          name: "Famille",
          price: "$29",
          period: "par mois",
          description: "Pour les familles grandissantes",
          features: [
            "Jusqu'à 3 profils",
            "Messages vocaux",
            "Personnalité avancée",
            "Souvenirs audio",
            "Partage familial"
          ]
        },
        {
          name: "Héritage",
          price: "$79",
          period: "par mois",
          description: "Tout préserver",
          features: [
            "Profils illimités",
            "Clonage vocal personnalisé",
            "Souvenirs vidéo",
            "Support prioritaire",
            "Partage étendu"
          ]
        }
      ]
    },
    de: {
      title: "Einfache, transparente Preise",
      subtitle: "Kostenlos während der Beta. Launch-Preise unten gezeigt.",
      disclaimer: "Derzeit in der Beta - alle Funktionen kostenlos während der Entwicklung",
      plans: [
        {
          name: "Kostenlos",
          price: "$0",
          period: "für immer",
          description: "Perfekt zum Einstieg",
          features: [
            "1 Profil eines geliebten Menschen",
            "Grundlegende Gespräche",
            "Foto-Erinnerungen",
            "Community-Support"
          ]
        },
        {
          name: "Familie",
          price: "$29",
          period: "pro Monat",
          description: "Für wachsende Familien",
          features: [
            "Bis zu 3 Profile",
            "Sprachnachrichten",
            "Erweiterte Persönlichkeit",
            "Audio-Erinnerungen",
            "Familien-Sharing"
          ]
        },
        {
          name: "Vermächtnis",
          price: "$79",
          period: "pro Monat",
          description: "Alles bewahren",
          features: [
            "Unbegrenzte Profile",
            "Benutzerdefiniertes Stimm-Klonen",
            "Video-Erinnerungen",
            "Priority-Support",
            "Erweitertes Sharing"
          ]
        }
      ]
    },
    it: {
      title: "Prezzi semplici e trasparenti",
      subtitle: "Gratuito durante la beta. Prezzi di lancio mostrati sotto.",
      disclaimer: "Attualmente in beta - tutte le funzionalità gratuite durante lo sviluppo",
      plans: [
        {
          name: "Gratuito",
          price: "$0",
          period: "per sempre",
          description: "Perfetto per iniziare",
          features: [
            "1 profilo di una persona cara",
            "Conversazioni di base",
            "Ricordi fotografici",
            "Supporto della community"
          ]
        },
        {
          name: "Famiglia",
          price: "$29",
          period: "al mese",
          description: "Per famiglie in crescita",
          features: [
            "Fino a 3 profili",
            "Messaggi vocali",
            "Personalità avanzata",
            "Ricordi audio",
            "Condivisione familiare"
          ]
        },
        {
          name: "Eredità",
          price: "$79",
          period: "al mese",
          description: "Preserva tutto",
          features: [
            "Profili illimitati",
            "Clonazione vocale personalizzata",
            "Ricordi video",
            "Supporto prioritario",
            "Condivisione estesa"
          ]
        }
      ]
    },
    ru: {
      title: "Простые, прозрачные цены",
      subtitle: "Бесплатно во время бета-версии. Цены запуска показаны ниже.",
      disclaimer: "В настоящее время в бета-версии - все функции бесплатны во время разработки",
      plans: [
        {
          name: "Бесплатно",
          price: "$0",
          period: "навсегда",
          description: "Идеально для начала",
          features: [
            "1 профиль близкого человека",
            "Базовые разговоры",
            "Фото-воспоминания",
            "Поддержка сообщества"
          ]
        },
        {
          name: "Семья",
          price: "$29",
          period: "в месяц",
          description: "Для растущих семей",
          features: [
            "До 3 профилей",
            "Голосовые сообщения",
            "Расширенная личность",
            "Аудио-воспоминания",
            "Семейный доступ"
          ]
        },
        {
          name: "Наследие",
          price: "$79",
          period: "в месяц",
          description: "Сохранить все",
          features: [
            "Неограниченные профили",
            "Пользовательское клонирование голоса",
            "Видео-воспоминания",
            "Приоритетная поддержка",
            "Расширенный доступ"
          ]
        }
      ]
    },
    ja: {
      title: "シンプルで透明な価格設定",
      subtitle: "ベータ期間中は無料。ローンチ価格は以下に表示されています。",
      disclaimer: "現在ベータ版 - 開発期間中はすべての機能が無料",
      plans: [
        {
          name: "無料",
          price: "$0",
          period: "永続",
          description: "始めるのに最適",
          features: [
            "愛する人のプロフィール1件",
            "基本的な会話",
            "写真の思い出",
            "コミュニティサポート"
          ]
        },
        {
          name: "ファミリー",
          price: "$29",
          period: "月額",
          description: "成長する家族向け",
          features: [
            "最大3つのプロフィール",
            "音声メッセージ",
            "高度な個性",
            "音声の思い出",
            "家族共有"
          ]
        },
        {
          name: "レガシー",
          price: "$79",
          period: "月額",
          description: "すべてを保存",
          features: [
            "無制限のプロフィール",
            "カスタム音声クローニング",
            "ビデオの思い出",
            "優先サポート",
            "拡張共有"
          ]
        }
      ]
    },
    ko: {
      title: "간단하고 투명한 가격",
      subtitle: "베타 기간 동안 무료. 출시 가격은 아래에 표시됩니다.",
      disclaimer: "현재 베타 중 - 개발 기간 동안 모든 기능 무료",
      plans: [
        {
          name: "무료",
          price: "$0",
          period: "영구",
          description: "시작하기에 완벽",
          features: [
            "사랑하는 사람 프로필 1개",
            "기본 대화",
            "사진 추억",
            "커뮤니티 지원"
          ]
        },
        {
          name: "가족",
          price: "$29",
          period: "월간",
          description: "성장하는 가족을 위해",
          features: [
            "최대 3개 프로필",
            "음성 메시지",
            "고급 성격",
            "오디오 추억",
            "가족 공유"
          ]
        },
        {
          name: "레거시",
          price: "$79",
          period: "월간",
          description: "모든 것을 보존",
          features: [
            "무제한 프로필",
            "맞춤 음성 복제",
            "비디오 추억",
            "우선 지원",
            "확장 공유"
          ]
        }
      ]
    },
    ar: {
      title: "أسعار بسيطة وشفافة",
      subtitle: "مجاني خلال فترة التجريب. أسعار الإطلاق موضحة أدناه.",
      disclaimer: "حاليًا في مرحلة التجريب - جميع الميزات مجانية خلال التطوير",
      plans: [
        {
          name: "مجاني",
          price: "$0",
          period: "إلى الأبد",
          description: "مثالي للبداية",
          features: [
            "ملف شخصي واحد لشخص عزيز",
            "محادثات أساسية",
            "ذكريات الصور",
            "دعم المجتمع"
          ]
        },
        {
          name: "عائلة",
          price: "$29",
          period: "شهرياً",
          description: "للعائلات المتنامية",
          features: [
            "حتى 3 ملفات شخصية",
            "رسائل صوتية",
            "شخصية متقدمة",
            "ذكريات صوتية",
            "مشاركة عائلية"
          ]
        },
        {
          name: "إرث",
          price: "$79",
          period: "شهرياً",
          description: "احفظ كل شيء",
          features: [
            "ملفات شخصية غير محدودة",
            "استنساخ صوتي مخصص",
            "ذكريات فيديو",
            "دعم أولوية",
            "مشاركة موسعة"
          ]
        }
      ]
    },
    hi: {
      title: "सरल, पारदर्शी मूल्य निर्धारण",
      subtitle: "बीटा के दौरान मुफ्त। लॉन्च मूल्य नीचे दिखाए गए हैं।",
      disclaimer: "वर्तमान में बीटा में - विकास के दौरान सभी सुविधाएं मुफ्त",
      plans: [
        {
          name: "मुफ्त",
          price: "$0",
          period: "हमेशा के लिए",
          description: "शुरुआत के लिए बेहतरीन",
          features: [
            "प्रिय व्यक्ति की 1 प्रोफ़ाइल",
            "बुनियादी बातचीत",
            "फोटो यादें",
            "समुदायिक सहायता"
          ]
        },
        {
          name: "पारिवारिक",
          price: "$29",
          period: "प्रति माह",
          description: "बढ़ते परिवारों के लिए",
          features: [
            "3 तक प्रोफ़ाइल",
            "ध्वनि संदेश",
            "उन्नत व्यक्तित्व",
            "ऑडियो यादें",
            "पारिवारिक साझाकरण"
          ]
        },
        {
          name: "विरासत",
          price: "$79",
          period: "प्रति माह",
          description: "सब कुछ संरक्षित करें",
          features: [
            "असीमित प्रोफ़ाइल",
            "कस्टम आवाज़ क्लोनिंग",
            "वीडियो यादें",
            "प्राथमिकता सहायता",
            "विस्तारित साझाकरण"
          ]
        }
      ]
    },
    nl: {
      title: "Eenvoudige, transparante prijzen",
      subtitle: "Gratis tijdens beta. Lancering prijzen hieronder weergegeven.",
      disclaimer: "Momenteel in beta - alle functies gratis tijdens ontwikkeling",
      plans: [
        {
          name: "Gratis",
          price: "$0",
          period: "voor altijd",
          description: "Perfect om te beginnen",
          features: [
            "1 profiel van dierbare",
            "Basis gesprekken",
            "Foto herinneringen",
            "Community ondersteuning"
          ]
        },
        {
          name: "Familie",
          price: "$29",
          period: "per maand",
          description: "Voor groeiende families",
          features: [
            "Tot 3 profielen",
            "Spraakberichten",
            "Geavanceerde persoonlijkheid",
            "Audio herinneringen",
            "Familie delen"
          ]
        },
        {
          name: "Erfenis",
          price: "$79",
          period: "per maand",
          description: "Bewaar alles",
          features: [
            "Onbeperkte profielen",
            "Aangepaste stem klonen",
            "Video herinneringen",
            "Prioriteit ondersteuning",
            "Uitgebreid delen"
          ]
        }
      ]
    },
    sv: {
      title: "Enkla, transparenta priser",
      subtitle: "Gratis under beta. Lansering priser visas nedan.",
      disclaimer: "För närvarande i beta - alla funktioner gratis under utveckling",
      plans: [
        {
          name: "Gratis",
          price: "$0",
          period: "för alltid",
          description: "Perfekt för att komma igång",
          features: [
            "1 profil av kär person",
            "Grundläggande samtal",
            "Fotominnen",
            "Community support"
          ]
        },
        {
          name: "Familj",
          price: "$29",
          period: "per månad",
          description: "För växande familjer",
          features: [
            "Upp till 3 profiler",
            "Röstmeddelanden",
            "Avancerad personlighet",
            "Ljudminnen",
            "Familj delning"
          ]
        },
        {
          name: "Arv",
          price: "$79",
          period: "per månad",
          description: "Bevara allt",
          features: [
            "Obegränsade profiler",
            "Anpassad röst kloning",
            "Videominnen",
            "Prioritet support",
            "Utökad delning"
          ]
        }
      ]
    },
    no: {
      title: "Enkle, transparente priser",
      subtitle: "Gratis under beta. Lansering priser vist nedenfor.",
      disclaimer: "For øyeblikket i beta - alle funksjoner gratis under utvikling",
      plans: [
        {
          name: "Gratis",
          price: "$0",
          period: "for alltid",
          description: "Perfekt for å komme i gang",
          features: [
            "1 profil av kjær person",
            "Grunnleggende samtaler",
            "Foto minner",
            "Community støtte"
          ]
        },
        {
          name: "Familie",
          price: "$29",
          period: "per måned",
          description: "For voksende familier",
          features: [
            "Opptil 3 profiler",
            "Stemmemeldinger",
            "Avansert personlighet",
            "Lyd minner",
            "Familie deling"
          ]
        },
        {
          name: "Arv",
          price: "$79",
          period: "per måned",
          description: "Bevar alt",
          features: [
            "Ubegrensede profiler",
            "Tilpasset stemme kloning",
            "Video minner",
            "Prioritet støtte",
            "Utvidet deling"
          ]
        }
      ]
    },
    da: {
      title: "Enkle, gennemsigtige priser",
      subtitle: "Gratis under beta. Lancering priser vist nedenfor.",
      disclaimer: "I øjeblikket i beta - alle funktioner gratis under udvikling",
      plans: [
        {
          name: "Gratis",
          price: "$0",
          period: "for evigt",
          description: "Perfekt til at komme i gang",
          features: [
            "1 profil af kær person",
            "Grundlæggende samtaler",
            "Foto minder",
            "Community støtte"
          ]
        },
        {
          name: "Familie",
          price: "$29",
          period: "pr. måned",
          description: "Til voksende familier",
          features: [
            "Op til 3 profiler",
            "Stemmemeddelelser",
            "Avanceret personlighed",
            "Lyd minder",
            "Familie deling"
          ]
        },
        {
          name: "Arv",
          price: "$79",
          period: "pr. måned",
          description: "Bevar alt",
          features: [
            "Ubegrænsede profiler",
            "Tilpasset stemme kloning",
            "Video minder",
            "Prioritet støtte",
            "Udvidet deling"
          ]
        }
      ]
    },
    fi: {
      title: "Yksinkertaiset, läpinäkyvät hinnat",
      subtitle: "Ilmainen beta-aikana. Julkaisuhinnat näytetty alla.",
      disclaimer: "Tällä hetkellä beta-vaiheessa - kaikki ominaisuudet ilmaisia kehityksen aikana",
      plans: [
        {
          name: "Ilmainen",
          price: "$0",
          period: "ikuisesti",
          description: "Täydellinen aloittamiseen",
          features: [
            "1 rakkaan henkilön profiili",
            "Peruskeskustelut",
            "Valokuvamuistot",
            "Yhteisötuki"
          ]
        },
        {
          name: "Perhe",
          price: "$29",
          period: "kuukaudessa",
          description: "Kasvaville perheille",
          features: [
            "Jopa 3 profiilia",
            "Ääniviestit",
            "Edistynyt persoonallisuus",
            "Äänimuistot",
            "Perhejako"
          ]
        },
        {
          name: "Perintö",
          price: "$79",
          period: "kuukaudessa",
          description: "Säilytä kaikki",
          features: [
            "Rajattomat profiilit",
            "Räätälöity äänikloonaus",
            "Videomuistot",
            "Ensisijainen tuki",
            "Laajennettu jako"
          ]
        }
      ]
    }
  };

  const text = content[currentLanguage as keyof typeof content] || content.en;

  return (
    <section id="pricing" className="py-24 bg-gray-50 dark:bg-gray-900">
      <div className="max-w-6xl mx-auto px-6">

        {/* Header */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl sm:text-5xl font-semibold text-gray-900 dark:text-white mb-4 tracking-tight">
            {text.title}
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-400 font-light">
            {text.subtitle}
          </p>
        </motion.div>

        {/* Pricing Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {text.plans.map((plan, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
            >
              <Card className="relative h-full border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-950 hover:shadow-lg transition-all duration-300">
                <CardContent className="p-8">
                  {/* Plan header */}
                  <div className="mb-8">
                    <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                      {plan.name}
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                      {plan.description}
                    </p>
                    <div className="flex items-baseline gap-1">
                      <span className="text-3xl font-semibold text-gray-900 dark:text-white">
                        {plan.price}
                      </span>
                      <span className="text-sm text-gray-600 dark:text-gray-400">
                        {plan.period}
                      </span>
                    </div>
                  </div>

                  {/* Features */}
                  <div className="space-y-3 mb-8">
                    {plan.features.map((feature, featureIndex) => (
                      <div key={featureIndex} className="flex items-start gap-3">
                        <Check className="w-4 h-4 text-emerald-500 mt-0.5 flex-shrink-0" />
                        <span className="text-sm text-gray-700 dark:text-gray-300">
                          {feature}
                        </span>
                      </div>
                    ))}
                  </div>

                  {/* CTA Button */}
                  <Button 
                    onClick={onJoinWaitlist}
                    className={`w-full ${
                      index === 1 
                        ? 'bg-[#FEA8BF] hover:bg-[#FD8FAD] text-white dark:bg-[#FEA8BF] dark:text-white dark:hover:bg-[#FD8FAD]' 
                        : 'bg-[#FDE7E9] hover:bg-[#FDD4D9] text-[#FEA8BF] dark:bg-[#FDE7E9] dark:text-[#FEA8BF] dark:hover:bg-[#FDD4D9]'
                    }`}
                  >
                    {(() => {
                      const joinTexts = {
                        en: 'Join Waitlist',
                        'pt-BR': 'Entrar na Lista',
                        'zh-CN': '加入等候名单',
                        'zh-TW': '加入等候名單',
                        es: 'Unirse a la Lista',
                        fr: 'Rejoindre la Liste',
                        de: 'Warteliste beitreten',
                        it: 'Unisciti alla Lista',
                        ru: 'Присоединиться к списку',
                        ja: 'ウェイトリストに参加',
                        ko: '대기자 명단 참여',
                        ar: 'انضم لقائمة الانتظار',
                        hi: 'प्रतीक्षा सूची में शामिल हों',
                        nl: 'Doe mee aan wachtlijst',
                        sv: 'Gå med i väntelistan',
                        no: 'Bli med på ventelisten',
                        da: 'Tilmeld dig ventelisten',
                        fi: 'Liity jonotuslistalle'
                      };
                      return joinTexts[currentLanguage as keyof typeof joinTexts] || joinTexts.en;
                    })()}
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};