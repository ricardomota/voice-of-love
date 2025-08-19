import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, FileText, Scale, AlertTriangle, UserCheck, Shield, Gavel } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useLanguage } from '@/hooks/useLanguage';

const getContent = (language: string) => {
  const content = {
    'pt-BR': {
      title: 'Termos de Serviço',
      lastUpdated: 'Última atualização: 19 de Agosto de 2024',
      intro: 'Bem-vindo ao Eterna. Estes termos governam o uso de nossa plataforma e serviços. Ao usar o Eterna, você concorda com estes termos.',
      sections: [
        {
          icon: <UserCheck className="w-5 h-5" />,
          title: 'Aceitação dos Termos',
          content: [
            'Ao acessar ou usar o Eterna, você concorda em seguir estes termos',
            'Se você não concorda com algum termo, não deve usar nossos serviços',
            'Estes termos podem ser atualizados ocasionalmente',
            'O uso continuado após mudanças constitui aceitação dos novos termos'
          ]
        },
        {
          icon: <Scale className="w-5 h-5" />,
          title: 'Uso Aceitável',
          content: [
            'Use o Eterna apenas para fins legais e apropriados',
            'Não use para criar conteúdo ofensivo, prejudicial ou ilegal',
            'Respeite os direitos de propriedade intelectual de terceiros',
            'Não tente acessar sistemas ou dados não autorizados',
            'Mantenha suas credenciais de login seguras e confidenciais'
          ]
        },
        {
          icon: <FileText className="w-5 h-5" />,
          title: 'Seu Conteúdo',
          content: [
            'Você mantém os direitos sobre o conteúdo que cria no Eterna',
            'Você nos concede licença para processar e armazenar seu conteúdo',
            'Você é responsável pela precisão e legalidade do seu conteúdo',
            'Não carregue conteúdo que viole direitos de terceiros',
            'Reservamos o direito de remover conteúdo inadequado'
          ]
        },
        {
          icon: <Shield className="w-5 h-5" />,
          title: 'Propriedade Intelectual',
          content: [
            'O Eterna e nossa tecnologia são protegidos por direitos autorais',
            'Você não pode copiar, modificar ou distribuir nossa tecnologia',
            'Marcas comerciais do Eterna são de nossa propriedade exclusiva',
            'Respeitamos a propriedade intelectual de terceiros',
            'Relatórios de violação serão investigados e tratados adequadamente'
          ]
        },
        {
          icon: <AlertTriangle className="w-5 h-5" />,
          title: 'Limitações e Responsabilidades',
          content: [
            'O Eterna é fornecido "como está", sem garantias expressas',
            'Não garantimos disponibilidade ininterrupta dos serviços',
            'Não somos responsáveis por perdas de dados ou danos indiretos',
            'Sua responsabilidade está limitada aos valores pagos pelos serviços',
            'Você deve fazer backup regular de seus dados importantes'
          ]
        },
        {
          icon: <Gavel className="w-5 h-5" />,
          title: 'Rescisão e Suspensão',
          content: [
            'Você pode encerrar sua conta a qualquer momento',
            'Podemos suspender ou encerrar contas por violação destes termos',
            'Mediante rescisão, seu acesso aos serviços será interrompido',
            'Dados podem ser mantidos conforme nossa política de privacidade',
            'Certas seções destes termos sobrevivem à rescisão'
          ]
        }
      ],
      contact: 'Entre em Contato',
      contactText: 'Para questões sobre estes termos, entre em contato:',
      email: 'legal@eterna.ai',
      jurisdiction: 'Jurisdição',
      jurisdictionText: 'Estes termos são regidos pelas leis do Brasil. Disputas serão resolvidas nos tribunais competentes do Brasil.'
    },
    en: {
      title: 'Terms of Service',
      lastUpdated: 'Last updated: August 19, 2024',
      intro: 'Welcome to Eterna. These terms govern the use of our platform and services. By using Eterna, you agree to these terms.',
      sections: [
        {
          icon: <UserCheck className="w-5 h-5" />,
          title: 'Acceptance of Terms',
          content: [
            'By accessing or using Eterna, you agree to follow these terms',
            'If you do not agree with any term, you should not use our services',
            'These terms may be updated occasionally',
            'Continued use after changes constitutes acceptance of new terms'
          ]
        },
        {
          icon: <Scale className="w-5 h-5" />,
          title: 'Acceptable Use',
          content: [
            'Use Eterna only for legal and appropriate purposes',
            'Do not use to create offensive, harmful, or illegal content',
            'Respect third-party intellectual property rights',
            'Do not attempt to access unauthorized systems or data',
            'Keep your login credentials secure and confidential'
          ]
        },
        {
          icon: <FileText className="w-5 h-5" />,
          title: 'Your Content',
          content: [
            'You retain rights to the content you create on Eterna',
            'You grant us license to process and store your content',
            'You are responsible for the accuracy and legality of your content',
            'Do not upload content that violates third-party rights',
            'We reserve the right to remove inappropriate content'
          ]
        },
        {
          icon: <Shield className="w-5 h-5" />,
          title: 'Intellectual Property',
          content: [
            'Eterna and our technology are protected by copyright',
            'You may not copy, modify, or distribute our technology',
            'Eterna trademarks are our exclusive property',
            'We respect third-party intellectual property',
            'Violation reports will be investigated and addressed appropriately'
          ]
        },
        {
          icon: <AlertTriangle className="w-5 h-5" />,
          title: 'Limitations and Responsibilities',
          content: [
            'Eterna is provided "as is" without express warranties',
            'We do not guarantee uninterrupted service availability',
            'We are not responsible for data loss or indirect damages',
            'Your liability is limited to amounts paid for services',
            'You should regularly backup your important data'
          ]
        },
        {
          icon: <Gavel className="w-5 h-5" />,
          title: 'Termination and Suspension',
          content: [
            'You may terminate your account at any time',
            'We may suspend or terminate accounts for violating these terms',
            'Upon termination, your access to services will be discontinued',
            'Data may be retained according to our privacy policy',
            'Certain sections of these terms survive termination'
          ]
        }
      ],
      contact: 'Contact Us',
      contactText: 'For questions about these terms, contact us:',
      email: 'legal@eterna.ai',
      jurisdiction: 'Jurisdiction',
      jurisdictionText: 'These terms are governed by Brazilian law. Disputes will be resolved in competent Brazilian courts.'
    }
  };
  return content[language as keyof typeof content] || content.en;
};

export const Terms: React.FC = () => {
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
              <FileText className="w-5 h-5 text-primary" />
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

        {/* Terms Sections */}
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

        {/* Jurisdiction */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.7 }}
        >
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Scale className="w-5 h-5 text-primary" />
                {content.jurisdiction}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                {content.jurisdictionText}
              </p>
            </CardContent>
          </Card>
        </motion.div>

        {/* Contact Information */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.8 }}
        >
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="w-5 h-5 text-primary" />
                {content.contact}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-4">
                {content.contactText}
              </p>
              <Button 
                variant="outline" 
                onClick={() => window.location.href = `mailto:${content.email}`}
                className="gap-2"
              >
                <FileText className="w-4 h-4" />
                {content.email}
              </Button>
            </CardContent>
          </Card>
        </motion.div>

        {/* Footer Note */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.9 }}
          className="text-center text-muted-foreground border-t pt-8"
        >
          <p>
            Ao usar o Eterna, você confirma ter lido e aceito estes termos de serviço.
          </p>
        </motion.div>
      </div>
    </div>
  );
};