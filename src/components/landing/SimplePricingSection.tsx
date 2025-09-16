import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Check, AlertTriangle, Heart } from 'lucide-react';
import { motion } from 'framer-motion';
import { Alert, AlertDescription } from '@/components/ui/alert';
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
    }
  };

  const text = content[currentLanguage as keyof typeof content] || content.en;

  return (
    <section id="pricing" className="py-24 bg-gray-50 dark:bg-gray-900">
      <div className="max-w-6xl mx-auto px-6">
        {/* Beta Notice */}
        <div className="max-w-2xl mx-auto mb-16">
          <Alert className="bg-amber-50 border-amber-200 dark:bg-amber-950/20 dark:border-amber-800">
            <AlertTriangle className="h-4 w-4 text-amber-600 dark:text-amber-400" />
            <AlertDescription className="text-amber-800 dark:text-amber-200 font-medium">
              {text.disclaimer}
            </AlertDescription>
          </Alert>
        </div>

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
                        ? 'bg-black hover:bg-gray-800 text-white dark:bg-white dark:text-black dark:hover:bg-gray-100' 
                        : 'bg-gray-100 hover:bg-gray-200 text-gray-900 dark:bg-gray-800 dark:text-white dark:hover:bg-gray-700'
                    }`}
                  >
                    {(() => {
                      const joinTexts = {
                        en: 'Join Waitlist',
                        'pt-BR': 'Entrar na Lista',
                        'zh-CN': '加入等候名单',
                        'zh-TW': '加入等候名單',
                        es: 'Unirse a la Lista',
                        fr: 'Rejoindre la Liste'
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