import React, { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  ArrowLeft, 
  Camera, 
  User, 
  Mail, 
  Calendar, 
  Settings, 
  Shield, 
  Heart,
  Trash2,
  Edit,
  Upload
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useAuth } from '@/hooks/useAuth';
import { useProfile } from '@/hooks/useProfile';
import { useToast } from '@/hooks/use-toast';
import { useLanguage } from '@/hooks/useLanguage';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { UpgradeSection } from '@/components/profile/UpgradeSection';

const getContent = (language: string) => {
  const content = {
    'pt-BR': {
      title: 'Meu Perfil',
      personalInfo: 'Informações Pessoais',
      displayName: 'Nome de Exibição',
      bio: 'Bio',
      bioPlaceholder: 'Conte um pouco sobre você...',
      avatar: 'Foto do Perfil',
      changeAvatar: 'Alterar Foto',
      removeAvatar: 'Remover Foto',
      email: 'Email',
      memberSince: 'Membro desde',
      accountSettings: 'Configurações da Conta',
      dangerZone: 'Zona de Perigo',
      deleteAccount: 'Deletar Conta',
      deleteWarning: 'Esta ação é irreversível. Todos os seus dados serão permanentemente removidos.',
      confirmDelete: 'Deletar Minha Conta',
      cancel: 'Cancelar',
      save: 'Salvar Alterações',
      saving: 'Salvando...',
      success: 'Perfil atualizado com sucesso!',
      error: 'Erro ao atualizar perfil',
      uploadError: 'Erro ao fazer upload da imagem',
      deleteAccountTitle: 'Tem certeza?',
      deleteAccountDescription: 'Esta ação não pode ser desfeita. Isso irá deletar permanentemente sua conta e remover todos os seus dados dos nossos servidores.'
    },
    en: {
      title: 'My Profile',
      personalInfo: 'Personal Information',
      displayName: 'Display Name',
      bio: 'Bio',
      bioPlaceholder: 'Tell us a bit about yourself...',
      avatar: 'Profile Picture',
      changeAvatar: 'Change Picture',
      removeAvatar: 'Remove Picture',
      email: 'Email',
      memberSince: 'Member since',
      accountSettings: 'Account Settings',
      dangerZone: 'Danger Zone',
      deleteAccount: 'Delete Account',
      deleteWarning: 'This action is irreversible. All your data will be permanently removed.',
      confirmDelete: 'Delete My Account',
      cancel: 'Cancel',
      save: 'Save Changes',
      saving: 'Saving...',
      success: 'Profile updated successfully!',
      error: 'Error updating profile',
      uploadError: 'Error uploading image',
      deleteAccountTitle: 'Are you sure?',
      deleteAccountDescription: 'This action cannot be undone. This will permanently delete your account and remove all your data from our servers.'
    }
  };
  return content[language as keyof typeof content] || content.en;
};

export const Profile: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { profile, updateProfile, loading } = useProfile();
  const { toast } = useToast();
  const { currentLanguage } = useLanguage();
  const content = getContent(currentLanguage);

  const [formData, setFormData] = useState({
    display_name: profile?.display_name || '',
    bio: profile?.bio || '',
    avatar_url: profile?.avatar_url || ''
  });
  const [isUploading, setIsUploading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const handleInputChange = useCallback((field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  }, []);

  const handleAvatarUpload = useCallback(async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      toast({
        title: content.error,
        description: 'Por favor, selecione uma imagem válida',
        variant: 'destructive'
      });
      return;
    }

    setIsUploading(true);
    try {
      // Here you would implement the actual file upload to Supabase Storage
      // For now, we'll use a placeholder
      const avatarUrl = URL.createObjectURL(file);
      setFormData(prev => ({ ...prev, avatar_url: avatarUrl }));
      
      toast({
        title: 'Sucesso!',
        description: 'Foto atualizada com sucesso'
      });
    } catch (error) {
      console.error('Upload error:', error);
      toast({
        title: content.error,
        description: content.uploadError,
        variant: 'destructive'
      });
    } finally {
      setIsUploading(false);
    }
  }, [content, toast]);

  const handleSave = useCallback(async () => {
    if (!user) return;

    setIsSaving(true);
    try {
      await updateProfile(formData);
      toast({
        title: content.success,
        description: 'Suas alterações foram salvas'
      });
    } catch (error) {
      console.error('Profile update error:', error);
      toast({
        title: content.error,
        description: 'Não foi possível salvar as alterações',
        variant: 'destructive'
      });
    } finally {
      setIsSaving(false);
    }
  }, [user, formData, updateProfile, toast, content]);

  const formatMemberSince = (date: string) => {
    return new Intl.DateTimeFormat(currentLanguage === 'pt-BR' ? 'pt-BR' : 'en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    }).format(new Date(date));
  };

  if (!user || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

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
              <User className="w-5 h-5 text-primary" />
              <h1 className="text-xl font-semibold">{content.title}</h1>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-8 space-y-8">
        {/* Profile Overview */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Card>
            <CardHeader className="text-center">
              <div className="relative mx-auto w-24 h-24 mb-4">
                <Avatar className="w-24 h-24">
                  <AvatarImage src={formData.avatar_url} alt={formData.display_name} />
                  <AvatarFallback className="text-xl">
                    {formData.display_name?.charAt(0) || user.email?.charAt(0)}
                  </AvatarFallback>
                </Avatar>
                
                <label htmlFor="avatar-upload" className="absolute -bottom-1 -right-1 cursor-pointer">
                  <div className="w-8 h-8 bg-primary text-primary-foreground rounded-full flex items-center justify-center hover:bg-primary/90 transition-colors">
                    {isUploading ? (
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    ) : (
                      <Camera className="w-4 h-4" />
                    )}
                  </div>
                </label>
                <input
                  id="avatar-upload"
                  type="file"
                  accept="image/*"
                  onChange={handleAvatarUpload}
                  className="hidden"
                  disabled={isUploading}
                />
              </div>
              
              <CardTitle className="text-2xl">
                {formData.display_name || user.email?.split('@')[0]}
              </CardTitle>
              <div className="flex items-center justify-center gap-2 text-muted-foreground">
                <Mail className="w-4 h-4" />
                <span>{user.email}</span>
              </div>
              <div className="flex items-center justify-center gap-2 text-muted-foreground">
                <Calendar className="w-4 h-4" />
                <span>{content.memberSince} {formatMemberSince(user.created_at)}</span>
              </div>
            </CardHeader>
          </Card>
        </motion.div>

        {/* Personal Information */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Heart className="w-5 h-5 text-primary" />
                {content.personalInfo}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="display_name">{content.displayName}</Label>
                <Input
                  id="display_name"
                  value={formData.display_name}
                  onChange={(e) => handleInputChange('display_name', e.target.value)}
                  placeholder="Seu nome"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="bio">{content.bio}</Label>
                <Textarea
                  id="bio"
                  value={formData.bio}
                  onChange={(e) => handleInputChange('bio', e.target.value)}
                  placeholder={content.bioPlaceholder}
                  rows={4}
                />
              </div>
              
              <div className="flex justify-end">
                <Button
                  onClick={handleSave}
                  disabled={isSaving}
                  className="gap-2"
                >
                  {isSaving ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      {content.saving}
                    </>
                  ) : (
                    <>
                      <Edit className="w-4 h-4" />
                      {content.save}
                    </>
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Upgrade Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Settings className="w-5 h-5 text-primary" />
                Upgrade & Credits
              </CardTitle>
            </CardHeader>
            <CardContent>
              <UpgradeSection />
            </CardContent>
          </Card>
        </motion.div>

        {/* Account Settings */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Settings className="w-5 h-5 text-primary" />
                {content.accountSettings}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Button
                variant="outline"
                onClick={() => navigate('/settings')}
                className="w-full justify-start gap-2"
              >
                <Settings className="w-4 h-4" />
                Configurações Gerais
              </Button>
              
              <Button
                variant="outline"
                onClick={() => navigate('/privacy')}
                className="w-full justify-start gap-2"
              >
                <Shield className="w-4 h-4" />
                Privacidade
              </Button>
            </CardContent>
          </Card>
        </motion.div>

        {/* Danger Zone */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          <Card className="border-destructive/20">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-destructive">
                <Shield className="w-5 h-5" />
                {content.dangerZone}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-4">
                {content.deleteWarning}
              </p>
              
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button variant="destructive" className="gap-2">
                    <Trash2 className="w-4 h-4" />
                    {content.deleteAccount}
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>{content.deleteAccountTitle}</AlertDialogTitle>
                    <AlertDialogDescription>
                      {content.deleteAccountDescription}
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>{content.cancel}</AlertDialogCancel>
                    <AlertDialogAction 
                      className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                      onClick={() => {
                        // Implement account deletion
                        toast({
                          title: "Funcionalidade em desenvolvimento",
                          description: "A exclusão de conta será implementada em breve"
                        });
                      }}
                    >
                      {content.confirmDelete}
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
};