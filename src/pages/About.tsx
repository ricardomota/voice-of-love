import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  ArrowLeft, 
  Heart, 
  Users, 
  Shield, 
  Sparkles,
  Mail,
  Github,
  Twitter,
  Globe
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useLanguage } from '@/hooks/useLanguage';

const getContent = (language: string) => {
  const content = {
    'pt-BR': {
      title: 'Sobre o Eterna',
      mission: 'Nossa Missão',
      missionText: 'O Eterna nasceu da necessidade de preservar as memórias mais preciosas da nossa vida. Nossa missão é criar uma ponte entre gerações, permitindo que vozes, histórias e a essência das pessoas que amamos sejam preservadas para sempre através de tecnologia de inteligência artificial ética e responsável.',
      story: 'Nossa História',
      storyText: 'Criado após testemunhar a jornada de uma mãe com Alzheimer, o Eterna surgiu da percepção de como nossas memórias podem ser frágeis. O projeto começou como uma forma de preservar não apenas lembranças, mas a essência completa de uma pessoa - sua voz, seu jeito de falar, suas histórias e sabedoria.',
      values: 'Nossos Valores',
      valuesItems: [
        { title: 'Privacidade', desc: 'Seus dados são seus. Mantemos tudo seguro e privado.' },
        { title: 'Ética', desc: 'IA responsável que respeita a dignidade humana.' },
        { title: 'Simplicidade', desc: 'Tecnologia complexa com interface simples.' },
        { title: 'Conexão', desc: 'Unindo gerações através de memórias compartilhadas.' }
      ],
      team: 'Equipe',
      contact: 'Contato',
      version: 'Versão',
      madeWith: 'Feito com'
    },
    en: {
      title: 'About Eterna',
      mission: 'Our Mission',
      missionText: 'Eterna was born from the need to preserve the most precious memories of our lives. Our mission is to create a bridge between generations, allowing voices, stories, and the essence of people we love to be preserved forever through ethical and responsible artificial intelligence technology.',
      story: 'Our Story',
      storyText: 'Created after witnessing a mother\'s journey with Alzheimer\'s, Eterna emerged from the perception of how fragile our memories can be. The project began as a way to preserve not just memories, but the complete essence of a person - their voice, their way of speaking, their stories and wisdom.',
      values: 'Our Values',
      valuesItems: [
        { title: 'Privacy', desc: 'Your data is yours. We keep everything safe and private.' },
        { title: 'Ethics', desc: 'Responsible AI that respects human dignity.' },
        { title: 'Simplicity', desc: 'Complex technology with simple interface.' },
        { title: 'Connection', desc: 'Connecting generations through shared memories.' }
      ],
      team: 'Team',
      contact: 'Contact',
      version: 'Version',
      madeWith: 'Made with'
    }
  };
  return content[language as keyof typeof content] || content.en;
};

export const About: React.FC = () => {
  const navigate = useNavigate();
  const { currentLanguage } = useLanguage();
  const content = getContent(currentLanguage);

  const teamMembers = [
    {
      name: 'Fundador',
      role: 'CEO & Fundador',
      description: 'Visionário por trás do Eterna',
      avatar: '👨‍💻'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background/95 to-muted/20">
      {/* Header */}
      <div className="sticky top-0 bg-background/80 backdrop-blur-sm border-b z-50">
        <div className="max-w-6xl mx-auto px-4 py-4">
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
              <Heart className="w-5 h-5 text-primary" />
              <h1 className="text-xl font-semibold">{content.title}</h1>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-8 space-y-12">
        {/* Hero Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center space-y-4"
        >
          <div className="w-20 h-20 mx-auto bg-gradient-to-br from-primary to-primary/60 rounded-2xl flex items-center justify-center mb-6">
            <Heart className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
            {content.title}
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            Preservando memórias, conectando corações através de gerações
          </p>
          <div className="flex items-center justify-center gap-2 mt-6">
            <Badge variant="outline" className="gap-1">
              <Sparkles className="w-3 h-3" />
              {content.version} Beta 0.3.0
            </Badge>
          </div>
        </motion.div>

        {/* Mission */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-2xl">
                <Globe className="w-6 h-6 text-primary" />
                {content.mission}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-lg text-muted-foreground leading-relaxed">
                {content.missionText}
              </p>
            </CardContent>
          </Card>
        </motion.div>

        {/* Story */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-2xl">
                <Heart className="w-6 h-6 text-primary" />
                {content.story}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-lg text-muted-foreground leading-relaxed">
                {content.storyText}
              </p>
            </CardContent>
          </Card>
        </motion.div>

        {/* Values */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-2xl">
                <Shield className="w-6 h-6 text-primary" />
                {content.values}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {content.valuesItems.map((value, index) => (
                  <motion.div
                    key={value.title}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5, delay: 0.4 + index * 0.1 }}
                    className="space-y-2"
                  >
                    <h3 className="text-lg font-semibold text-foreground">{value.title}</h3>
                    <p className="text-muted-foreground">{value.desc}</p>
                  </motion.div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Team */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-2xl">
                <Users className="w-6 h-6 text-primary" />
                {content.team}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {teamMembers.map((member, index) => (
                  <motion.div
                    key={member.name}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.5 + index * 0.1 }}
                    className="text-center space-y-3"
                  >
                    <div className="w-16 h-16 mx-auto bg-muted rounded-full flex items-center justify-center text-2xl">
                      {member.avatar}
                    </div>
                    <div>
                      <h3 className="font-semibold text-foreground">{member.name}</h3>
                      <p className="text-sm text-primary">{member.role}</p>
                      <p className="text-sm text-muted-foreground mt-1">{member.description}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Contact */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.5 }}
        >
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-2xl">
                <Mail className="w-6 h-6 text-primary" />
                {content.contact}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 gap-6">
                <Button 
                  variant="outline" 
                  className="h-16 gap-3"
                  onClick={() => navigate('/support')}
                >
                  <Mail className="w-5 h-5" />
                  <div className="text-left">
                    <div className="font-medium">Suporte</div>
                    <div className="text-sm text-muted-foreground">Central de ajuda e contato</div>
                  </div>
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Footer */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.6 }}
          className="text-center text-muted-foreground border-t pt-8"
        >
          <p className="flex items-center justify-center gap-2">
            {content.madeWith} <Heart className="w-4 h-4 text-red-500" /> no Brasil
          </p>
        </motion.div>
      </div>
    </div>
  );
};