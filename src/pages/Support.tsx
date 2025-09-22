import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  ArrowLeft, 
  HelpCircle, 
  Mail, 
  MessageCircle, 
  Book,
  Search,
  ChevronDown,
  ChevronUp,
  ExternalLink
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { useLanguage } from '@/hooks/useLanguage';
import { useToast } from '@/hooks/use-toast';

const getContent = (language: string) => {
  const content = {
    'pt-BR': {
      title: 'Central de Ajuda',
      subtitle: 'Como podemos ajudar você hoje?',
      searchPlaceholder: 'Busque por ajuda...',
      faq: 'Perguntas Frequentes',
      contact: 'Entre em Contato',
      contactForm: 'Formulário de Contato',
      name: 'Nome',
      email: 'Email',
      subject: 'Assunto',
      message: 'Mensagem',
      send: 'Enviar Mensagem',
      sending: 'Enviando...',
      messageSent: 'Mensagem enviada!',
      quickLinks: 'Links Rápidos',
      faqItems: [
        {
          question: 'Como criar minha primeira pessoa no Eterna?',
          answer: 'Para criar sua primeira pessoa, clique em "Criar Pessoa" no dashboard, preencha as informações básicas como nome e relacionamento, adicione memórias em texto ou áudio, e configure a personalidade. O processo é guiado passo a passo.'
        },
        {
          question: 'Meus dados estão seguros?',
          answer: 'Sim, levamos a segurança muito a sério. Todos os seus dados são criptografados em trânsito e em repouso. Não compartilhamos suas informações pessoais com terceiros e você tem controle total sobre seus dados.'
        },
        {
          question: 'Como funciona a geração de voz?',
          answer: 'Nossa IA analisa as gravações de áudio que você fornece para criar uma representação da voz da pessoa. Quanto mais áudio de qualidade você fornecer, melhor será a qualidade da voz gerada.'
        },
        {
          question: 'Posso alterar as informações de uma pessoa após criar?',
          answer: 'Sim, você pode editar todas as informações de uma pessoa a qualquer momento através das configurações da pessoa no dashboard.'
        },
        {
          question: 'O que acontece com meus dados se eu cancelar minha conta?',
          answer: 'Se você cancelar sua conta, seus dados serão mantidos por 30 dias caso queira reativar. Após esse período, todos os dados são permanentemente excluídos de nossos servidores.'
        },
        {
          question: 'Como posso melhorar a qualidade das conversas?',
          answer: 'Para melhorar as conversas, adicione mais memórias específicas, configure a personalidade com detalhes, e ajuste o estilo de fala. Quanto mais informações contextual você fornecer, mais natural será a conversa.'
        }
      ],
      quickLinksItems: [
        { title: 'Guia de Início Rápido', desc: 'Primeiros passos no Eterna' },
        { title: 'Política de Privacidade', desc: 'Como protegemos seus dados' },
        { title: 'Termos de Serviço', desc: 'Nossos termos e condições' },
        { title: 'Status do Sistema', desc: 'Verifique o status dos nossos serviços' }
      ]
    },
    en: {
      title: 'Help Center',
      subtitle: 'How can we help you today?',
      searchPlaceholder: 'Search for help...',
      faq: 'Frequently Asked Questions',
      contact: 'Contact Us',
      contactForm: 'Contact Form',
      name: 'Name',
      email: 'Email',
      subject: 'Subject',
      message: 'Message',
      send: 'Send Message',
      sending: 'Sending...',
      messageSent: 'Message sent!',
      quickLinks: 'Quick Links',
      faqItems: [
        {
          question: 'How do I create my first person in Eterna?',
          answer: 'To create your first person, click "Create Person" on the dashboard, fill in basic information like name and relationship, add memories in text or audio, and configure personality. The process is guided step by step.'
        },
        {
          question: 'Is my data safe?',
          answer: 'Yes, we take security very seriously. All your data is encrypted in transit and at rest. We don\'t share your personal information with third parties and you have full control over your data.'
        },
        {
          question: 'How does voice generation work?',
          answer: 'Our AI analyzes the audio recordings you provide to create a representation of the person\'s voice. The more quality audio you provide, the better the quality of the generated voice.'
        },
        {
          question: 'Can I edit person information after creating?',
          answer: 'Yes, you can edit all person information at any time through the person settings on the dashboard.'
        },
        {
          question: 'What happens to my data if I cancel my account?',
          answer: 'If you cancel your account, your data will be kept for 30 days in case you want to reactivate. After this period, all data is permanently deleted from our servers.'
        },
        {
          question: 'How can I improve conversation quality?',
          answer: 'To improve conversations, add more specific memories, configure personality with details, and adjust speaking style. The more contextual information you provide, the more natural the conversation will be.'
        }
      ],
      quickLinksItems: [
        { title: 'Quick Start Guide', desc: 'First steps in Eterna' },
        { title: 'Privacy Policy', desc: 'How we protect your data' },
        { title: 'Terms of Service', desc: 'Our terms and conditions' },
        { title: 'System Status', desc: 'Check our services status' }
      ]
    }
  };
  return content[language as keyof typeof content] || content.en;
};

export const Support: React.FC = () => {
  const navigate = useNavigate();
  const { currentLanguage } = useLanguage();
  const { toast } = useToast();
  const content = getContent(currentLanguage);

  const [searchQuery, setSearchQuery] = useState('');
  const [contactForm, setContactForm] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const filteredFAQ = content.faqItems.filter(item =>
    item.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.answer.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate form submission
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    toast({
      title: content.messageSent,
      description: 'Entraremos em contato em breve'
    });
    
    setContactForm({ name: '', email: '', subject: '', message: '' });
    setIsSubmitting(false);
  };

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
              <HelpCircle className="w-5 h-5 text-primary" />
              <h1 className="text-xl font-semibold">{content.title}</h1>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Hero Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center space-y-4 mb-12"
        >
          <h1 className="text-4xl font-bold text-foreground">{content.title}</h1>
          <p className="text-xl text-muted-foreground">{content.subtitle}</p>
          
          {/* Search Bar */}
          <div className="max-w-md mx-auto relative">
            <Search className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder={content.searchPlaceholder}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* FAQ Section */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="lg:col-span-2"
          >
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Book className="w-5 h-5 text-primary" />
                  {content.faq}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Accordion type="single" collapsible className="space-y-2">
                  {filteredFAQ.map((item, index) => (
                    <AccordionItem key={index} value={`item-${index}`} className="border rounded-lg px-4">
                      <AccordionTrigger className="text-left font-medium hover:no-underline">
                        {item.question}
                      </AccordionTrigger>
                      <AccordionContent className="text-muted-foreground pt-2">
                        {item.answer}
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              </CardContent>
            </Card>
          </motion.div>

          {/* Sidebar */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="space-y-6"
          >
            {/* Quick Links */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <ExternalLink className="w-5 h-5 text-primary" />
                  {content.quickLinks}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {content.quickLinksItems.map((link, index) => (
                  <Button
                    key={index}
                    variant="outline"
                    className="w-full h-auto p-4 justify-start"
                    onClick={() => {
                      if (link.title.includes('Privacidade')) navigate('/privacy');
                      else if (link.title.includes('Termos')) navigate('/terms');
                      else if (link.title.includes('Privacy')) navigate('/privacy');
                      else if (link.title.includes('Terms')) navigate('/terms');
                      else toast({ title: 'Em breve', description: 'Esta funcionalidade será disponibilizada em breve' });
                    }}
                  >
                    <div className="text-left">
                      <div className="font-medium">{link.title}</div>
                      <div className="text-sm text-muted-foreground">{link.desc}</div>
                    </div>
                  </Button>
                ))}
              </CardContent>
            </Card>

            {/* Contact Form */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MessageCircle className="w-5 h-5 text-primary" />
                  {content.contactForm}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <Label htmlFor="name">{content.name}</Label>
                    <Input
                      id="name"
                      value={contactForm.name}
                      onChange={(e) => setContactForm(prev => ({ ...prev, name: e.target.value }))}
                      required
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="email">{content.email}</Label>
                    <Input
                      id="email"
                      type="email"
                      value={contactForm.email}
                      onChange={(e) => setContactForm(prev => ({ ...prev, email: e.target.value }))}
                      required
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="subject">{content.subject}</Label>
                    <Input
                      id="subject"
                      value={contactForm.subject}
                      onChange={(e) => setContactForm(prev => ({ ...prev, subject: e.target.value }))}
                      required
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="message">{content.message}</Label>
                    <Textarea
                      id="message"
                      value={contactForm.message}
                      onChange={(e) => setContactForm(prev => ({ ...prev, message: e.target.value }))}
                      rows={4}
                      required
                    />
                  </div>
                  
                  <Button type="submit" className="w-full" disabled={isSubmitting}>
                    {isSubmitting ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                        {content.sending}
                      </>
                    ) : (
                      <>
                        <Mail className="w-4 h-4 mr-2" />
                        {content.send}
                      </>
                    )}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </div>
  );
};