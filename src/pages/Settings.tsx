import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  ArrowLeft, 
  Settings as SettingsIcon, 
  Languages,
  Palette,
  Bell,
  Shield,
  Download,
  Trash2,
  Volume2,
  Monitor
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { LanguageSelector } from '@/components/ui/language-selector';
import { useLanguage } from '@/hooks/useLanguage';
import { useToast } from '@/hooks/use-toast';

const getContent = (language: string) => {
  const content = {
    'pt-BR': {
      title: 'Configurações',
      appearance: 'Aparência',
      theme: 'Tema',
      themeSystem: 'Sistema',
      themeLight: 'Claro',
      themeDark: 'Escuro',
      language: 'Idioma',
      notifications: 'Notificações',
      emailNotifications: 'Notificações por Email',
      emailDesc: 'Receber atualizações e novidades por email',
      pushNotifications: 'Notificações Push',
      pushDesc: 'Notificações em tempo real no navegador',
      privacy: 'Privacidade',
      dataCollection: 'Coleta de Dados',
      dataDesc: 'Permitir coleta de dados para melhorar a experiência',
      analytics: 'Analytics',
      analyticsDesc: 'Ajudar a melhorar o produto com dados anônimos',
      audio: 'Áudio',
      voiceVolume: 'Volume da Voz',
      soundEffects: 'Efeitos Sonoros',
      soundDesc: 'Sons de interface e feedback',
      data: 'Dados',
      exportData: 'Exportar Dados',
      exportDesc: 'Baixar uma cópia dos seus dados',
      clearCache: 'Limpar Cache',
      cacheDesc: 'Remover dados temporários armazenados',
      save: 'Salvar Configurações',
      saved: 'Configurações salvas!'
    },
    en: {
      title: 'Settings',
      appearance: 'Appearance',
      theme: 'Theme',
      themeSystem: 'System',
      themeLight: 'Light',
      themeDark: 'Dark',
      language: 'Language',
      notifications: 'Notifications',
      emailNotifications: 'Email Notifications',
      emailDesc: 'Receive updates and news via email',
      pushNotifications: 'Push Notifications',
      pushDesc: 'Real-time notifications in the browser',
      privacy: 'Privacy',
      dataCollection: 'Data Collection',
      dataDesc: 'Allow data collection to improve experience',
      analytics: 'Analytics',
      analyticsDesc: 'Help improve the product with anonymous data',
      audio: 'Audio',
      voiceVolume: 'Voice Volume',
      soundEffects: 'Sound Effects',
      soundDesc: 'Interface sounds and feedback',
      data: 'Data',
      exportData: 'Export Data',
      exportDesc: 'Download a copy of your data',
      clearCache: 'Clear Cache',
      cacheDesc: 'Remove temporarily stored data',
      save: 'Save Settings',
      saved: 'Settings saved!'
    }
  };
  return content[language as keyof typeof content] || content.en;
};

export const Settings: React.FC = () => {
  const navigate = useNavigate();
  const { currentLanguage } = useLanguage();
  const { toast } = useToast();
  const content = getContent(currentLanguage);

  const [settings, setSettings] = useState({
    theme: 'system',
    emailNotifications: true,
    pushNotifications: true,
    dataCollection: true,
    analytics: true,
    soundEffects: true,
    voiceVolume: [75]
  });

  const handleSave = () => {
    // Here you would save the settings to backend/localStorage
    toast({
      title: content.saved,
      description: 'Suas preferências foram atualizadas'
    });
  };

  const handleExportData = () => {
    toast({
      title: "Exportando dados...",
      description: "Sua solicitação de exportação foi iniciada"
    });
  };

  const handleClearCache = () => {
    toast({
      title: "Cache limpo",
      description: "Dados temporários foram removidos"
    });
  };

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
              <SettingsIcon className="w-5 h-5 text-primary" />
              <h1 className="text-xl font-semibold">{content.title}</h1>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-8 space-y-8">
        {/* Appearance */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Palette className="w-5 h-5 text-primary" />
                {content.appearance}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <Label className="text-base font-medium">{content.theme}</Label>
                </div>
                <Select 
                  value={settings.theme} 
                  onValueChange={(value) => setSettings(prev => ({ ...prev, theme: value }))}
                >
                  <SelectTrigger className="w-32">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="system">
                      <div className="flex items-center gap-2">
                        <Monitor className="w-4 h-4" />
                        {content.themeSystem}
                      </div>
                    </SelectItem>
                    <SelectItem value="light">{content.themeLight}</SelectItem>
                    <SelectItem value="dark">{content.themeDark}</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <Label className="text-base font-medium">{content.language}</Label>
                </div>
                <LanguageSelector />
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Notifications */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bell className="w-5 h-5 text-primary" />
                {content.notifications}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <Label className="text-base font-medium">{content.emailNotifications}</Label>
                  <p className="text-sm text-muted-foreground">{content.emailDesc}</p>
                </div>
                <Switch
                  checked={settings.emailNotifications}
                  onCheckedChange={(checked) => setSettings(prev => ({ ...prev, emailNotifications: checked }))}
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <Label className="text-base font-medium">{content.pushNotifications}</Label>
                  <p className="text-sm text-muted-foreground">{content.pushDesc}</p>
                </div>
                <Switch
                  checked={settings.pushNotifications}
                  onCheckedChange={(checked) => setSettings(prev => ({ ...prev, pushNotifications: checked }))}
                />
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Audio */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Volume2 className="w-5 h-5 text-primary" />
                {content.audio}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <Label className="text-base font-medium">{content.voiceVolume}</Label>
                  <span className="text-sm text-muted-foreground">{settings.voiceVolume[0]}%</span>
                </div>
                <Slider
                  value={settings.voiceVolume}
                  onValueChange={(value) => setSettings(prev => ({ ...prev, voiceVolume: value }))}
                  max={100}
                  step={1}
                  className="w-full"
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <Label className="text-base font-medium">{content.soundEffects}</Label>
                  <p className="text-sm text-muted-foreground">{content.soundDesc}</p>
                </div>
                <Switch
                  checked={settings.soundEffects}
                  onCheckedChange={(checked) => setSettings(prev => ({ ...prev, soundEffects: checked }))}
                />
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Privacy */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="w-5 h-5 text-primary" />
                {content.privacy}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <Label className="text-base font-medium">{content.dataCollection}</Label>
                  <p className="text-sm text-muted-foreground">{content.dataDesc}</p>
                </div>
                <Switch
                  checked={settings.dataCollection}
                  onCheckedChange={(checked) => setSettings(prev => ({ ...prev, dataCollection: checked }))}
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <Label className="text-base font-medium">{content.analytics}</Label>
                  <p className="text-sm text-muted-foreground">{content.analyticsDesc}</p>
                </div>
                <Switch
                  checked={settings.analytics}
                  onCheckedChange={(checked) => setSettings(prev => ({ ...prev, analytics: checked }))}
                />
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Data */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Download className="w-5 h-5 text-primary" />
                {content.data}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <Label className="text-base font-medium">{content.exportData}</Label>
                  <p className="text-sm text-muted-foreground">{content.exportDesc}</p>
                </div>
                <Button variant="outline" onClick={handleExportData} className="gap-2">
                  <Download className="w-4 h-4" />
                  Exportar
                </Button>
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <Label className="text-base font-medium">{content.clearCache}</Label>
                  <p className="text-sm text-muted-foreground">{content.cacheDesc}</p>
                </div>
                <Button variant="outline" onClick={handleClearCache} className="gap-2">
                  <Trash2 className="w-4 h-4" />
                  Limpar
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Save Button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.5 }}
          className="flex justify-end"
        >
          <Button onClick={handleSave} size="lg" className="gap-2">
            <SettingsIcon className="w-4 h-4" />
            {content.save}
          </Button>
        </motion.div>
      </div>
    </div>
  );
};