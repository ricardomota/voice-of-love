import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Shield, Eye, Lock, Database, UserCheck, FileText } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useLanguage } from '@/hooks/useLanguage';

const getContent = (language: string) => {
  const content = {
    'pt-BR': {
      title: 'Política de Privacidade',
      lastUpdated: 'Última atualização: 19 de Agosto de 2024',
      intro: 'No Eterna, sua privacidade é fundamental. Esta política explica como coletamos, usamos e protegemos suas informações pessoais.',
      sections: [
        {
          icon: <Database className="w-5 h-5" />,
          title: 'Informações que Coletamos',
          content: [
            'Informações de conta: email, nome, foto de perfil',
            'Dados de uso: como você interage com nossa plataforma',
            'Conteúdo criado: memórias, conversas e configurações das pessoas',
            'Dados técnicos: endereço IP, tipo de navegador, dispositivo usado'
          ]
        },
        {
          icon: <Eye className="w-5 h-5" />,
          title: 'Como Usamos Suas Informações',
          content: [
            'Fornecer e melhorar nossos serviços',
            'Personalizar sua experiência na plataforma',
            'Comunicar atualizações e novidades importantes',
            'Garantir a segurança e prevenir fraudes',
            'Cumprir obrigações legais quando necessário'
          ]
        },
        {
          icon: <UserCheck className="w-5 h-5" />,
          title: 'Compartilhamento de Dados',
          content: [
            'Não vendemos suas informações pessoais para terceiros',
            'Podemos compartilhar dados com provedores de serviços essenciais',
            'Compartilhamos apenas quando exigido por lei',
            'Você controla quais informações compartilha conosco'
          ]
        },
        {
          icon: <Lock className="w-5 h-5" />,
          title: 'Segurança dos Dados',
          content: [
            'Criptografia end-to-end para dados sensíveis',
            'Servidores seguros com certificações de segurança',
            'Acesso restrito aos dados por nossa equipe',
            'Monitoramento contínuo contra ameaças'
          ]
        },
        {
          icon: <UserCheck className="w-5 h-5" />,
          title: 'Seus Direitos',
          content: [
            'Acessar e baixar seus dados a qualquer momento',
            'Corrigir informações incorretas em seu perfil',
            'Solicitar a exclusão de sua conta e dados',
            'Optar por não receber comunicações de marketing',
            'Portar seus dados para outras plataformas'
          ]
        },
        {
          icon: <FileText className="w-5 h-5" />,
          title: 'Retenção de Dados',
          content: [
            'Mantemos seus dados enquanto sua conta estiver ativa',
            'Dados são excluídos permanentemente após 30 dias da exclusão da conta',
            'Alguns dados podem ser mantidos por obrigações legais',
            'Você pode solicitar exclusão de dados específicos a qualquer momento'
          ]
        }
      ],
      contact: 'Entre em Contato',
      contactText: 'Se você tiver dúvidas sobre esta política de privacidade, entre em contato através do formulário de suporte.',
    },
    en: {
      title: 'Privacy Policy',
      lastUpdated: 'Last updated: August 19, 2024',
      intro: 'At Eterna, your privacy is fundamental. This policy explains how we collect, use, and protect your personal information.',
      sections: [
        {
          icon: <Database className="w-5 h-5" />,
          title: 'Information We Collect',
          content: [
            'Account information: email, name, profile picture',
            'Usage data: how you interact with our platform',
            'Created content: memories, conversations, and people settings',
            'Technical data: IP address, browser type, device used'
          ]
        },
        {
          icon: <Eye className="w-5 h-5" />,
          title: 'How We Use Your Information',
          content: [
            'Provide and improve our services',
            'Personalize your platform experience',
            'Communicate important updates and news',
            'Ensure security and prevent fraud',
            'Comply with legal obligations when necessary'
          ]
        },
        {
          icon: <UserCheck className="w-5 h-5" />,
          title: 'Data Sharing',
          content: [
            'We do not sell your personal information to third parties',
            'We may share data with essential service providers',
            'We share only when required by law',
            'You control what information you share with us'
          ]
        },
        {
          icon: <Lock className="w-5 h-5" />,
          title: 'Data Security',
          content: [
            'End-to-end encryption for sensitive data',
            'Secure servers with security certifications',
            'Restricted access to data by our team',
            'Continuous monitoring against threats'
          ]
        },
        {
          icon: <UserCheck className="w-5 h-5" />,
          title: 'Your Rights',
          content: [
            'Access and download your data at any time',
            'Correct incorrect information in your profile',
            'Request deletion of your account and data',
            'Opt out of marketing communications',
            'Port your data to other platforms'
          ]
        },
        {
          icon: <FileText className="w-5 h-5" />,
          title: 'Data Retention',
          content: [
            'We keep your data while your account is active',
            'Data is permanently deleted 30 days after account deletion',
            'Some data may be kept for legal obligations',
            'You can request deletion of specific data at any time'
          ]
        }
      ],
      contact: 'Contact Us',
      contactText: 'If you have questions about this privacy policy, contact us through the support form.'
    }
  };
  return content[language as keyof typeof content] || content.en;
};

export const Privacy: React.FC = () => {
  const navigate = useNavigate();
  const { currentLanguage } = useLanguage();
  const content = getContent(currentLanguage);

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background/95 to-muted/20">
      {/* Header */}
      <div className="sticky top-0 bg-background/80 backdrop-blur-sm border-b z-50">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate('/')}
              className="gap-2"
            >
              <ArrowLeft className="w-4 h-4" />
              Voltar
            </Button>
            <div className="flex items-center gap-2">
              <Shield className="w-5 h-5 text-primary" />
              <h1 className="text-xl font-semibold">{content.title}</h1>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-8 space-y-8">
        {/* Introduction */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Card>
            <CardHeader>
              <CardTitle className="text-3xl">{content.title}</CardTitle>
              <p className="text-muted-foreground">{content.lastUpdated}</p>
            </CardHeader>
            <CardContent>
              <p className="text-lg text-muted-foreground leading-relaxed">
                {content.intro}
              </p>
            </CardContent>
          </Card>
        </motion.div>

        {/* Policy Sections */}
        {content.sections.map((section, index) => (
          <motion.div
            key={section.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 + index * 0.1 }}
          >
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-xl">
                  <span className="text-primary">{section.icon}</span>
                  {section.title}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {section.content.map((item, itemIndex) => (
                    <li key={itemIndex} className="flex items-start gap-2">
                      <div className="w-1.5 h-1.5 bg-primary rounded-full mt-2 flex-shrink-0" />
                      <span className="text-muted-foreground">{item}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </motion.div>
        ))}

        {/* Contact Information */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.7 }}
        >
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="w-5 h-5 text-primary" />
                {content.contact}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-4">
                {content.contactText}
              </p>
              <Button 
                variant="outline" 
                onClick={() => navigate('/support')}
                className="gap-2"
              >
                <Shield className="w-4 h-4" />
                Ir para Suporte
              </Button>
            </CardContent>
          </Card>
        </motion.div>

        {/* Footer Note */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.8 }}
          className="text-center text-muted-foreground border-t pt-8"
        >
          <p>
            Nossos termos podem ser atualizados ocasionalmente. Notificaremos sobre mudanças importantes.
          </p>
        </motion.div>
      </div>
    </div>
  );
};