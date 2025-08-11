import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { useLanguage } from '@/hooks/useLanguage';
import { Shield, Lock, UserCheck, Database } from 'lucide-react';

const getContent = (language: string) => {
  const content = {
    en: {
      title: "Privacy & Ownership",
      subtitle: "Your voice models and memories are private by default and never shared without your permission.",
      guarantees: [
        {
          title: "Your Data, Your Control",
          description: "You own all voice models, conversations, and memories. Export or delete anytime.",
          icon: UserCheck
        },
        {
          title: "End-to-End Security",
          description: "Military-grade encryption protects your family's most precious moments.",
          icon: Shield
        },
        {
          title: "No Third-Party Sharing",
          description: "We never sell, share, or analyze your personal data for advertising purposes.",
          icon: Lock
        },
        {
          title: "Transparent Storage",
          description: "All data stored in secure, compliant databases with regular backups.",
          icon: Database
        }
      ]
    },
    'pt-BR': {
      title: "Privacidade e Propriedade",
      subtitle: "Seus modelos de voz e memórias são privados por padrão e nunca compartilhados sem sua permissão.",
      guarantees: [
        {
          title: "Seus Dados, Seu Controle",
          description: "Você possui todos os modelos de voz, conversas e memórias. Exporte ou delete a qualquer momento.",
          icon: UserCheck
        },
        {
          title: "Segurança Ponta a Ponta",
          description: "Criptografia de grau militar protege os momentos mais preciosos da sua família.",
          icon: Shield
        },
        {
          title: "Sem Compartilhamento com Terceiros",
          description: "Nunca vendemos, compartilhamos ou analisamos seus dados pessoais para fins publicitários.",
          icon: Lock
        },
        {
          title: "Armazenamento Transparente",
          description: "Todos os dados armazenados em bancos de dados seguros e compatíveis com backups regulares.",
          icon: Database
        }
      ]
    },
    es: {
      title: "Privacidad y Propiedad",
      subtitle: "Tus modelos de voz y memorias son privados por defecto y nunca se comparten sin tu permiso.",
      guarantees: [
        {
          title: "Tus Datos, Tu Control",
          description: "Posees todos los modelos de voz, conversaciones y memorias. Exporta o elimina en cualquier momento.",
          icon: UserCheck
        },
        {
          title: "Seguridad Extremo a Extremo",
          description: "Cifrado de grado militar protege los momentos más preciados de tu familia.",
          icon: Shield
        },
        {
          title: "Sin Intercambio con Terceros",
          description: "Nunca vendemos, compartimos o analizamos tus datos personales con fines publicitarios.",
          icon: Lock
        },
        {
          title: "Almacenamiento Transparente",
          description: "Todos los datos almacenados en bases de datos seguras y compatibles con respaldos regulares.",
          icon: Database
        }
      ]
    }
  };
  return content[language as keyof typeof content] || content.en;
};

export const PrivacySection: React.FC = () => {
  const { currentLanguage } = useLanguage();
  const content = getContent(currentLanguage);

  return (
    <section className="py-20 sm:py-24 lg:py-32">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 lg:mb-20">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-semibold text-foreground mb-6">
            {content.title}
          </h2>
          <p className="text-lg sm:text-xl text-muted-foreground leading-relaxed">
            {content.subtitle}
          </p>
        </div>

        {/* Privacy Guarantees */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
          {content.guarantees.map((guarantee, index) => {
            const IconComponent = guarantee.icon;
            return (
              <Card key={index} className="group hover:shadow-xl transition-all duration-300 border-2 hover:border-primary/20 bg-gradient-to-br from-card to-card/80">
                <CardContent className="p-6 sm:p-8 space-y-4">
                  
                  <div className="flex items-start gap-4">
                    {/* Icon */}
                    <div className="w-14 h-14 bg-gradient-to-br from-primary/10 to-primary/5 rounded-2xl flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform duration-300">
                      <IconComponent className="w-7 h-7 text-primary" />
                    </div>

                    {/* Content */}
                    <div className="space-y-3 flex-1">
                      <h3 className="text-lg sm:text-xl font-semibold text-foreground">
                        {guarantee.title}
                      </h3>
                      <p className="text-muted-foreground leading-relaxed">
                        {guarantee.description}
                      </p>
                    </div>
                  </div>

                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Trust Badge */}
        <div className="text-center mt-16 lg:mt-20">
          <div className="inline-flex items-center gap-3 bg-muted/50 rounded-2xl px-6 py-4 border border-border/50">
            <Shield className="w-6 h-6 text-primary" />
            <span className="text-sm font-medium text-foreground">
              GDPR & CCPA Compliant • WCAG AA Accessible • SOC 2 Certified
            </span>
          </div>
        </div>

      </div>
    </section>
  );
};