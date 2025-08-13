import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

export const WaitlistForm: React.FC = () => {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.fullName || !formData.email) {
      toast({
        title: "Campos obrigatórios",
        description: "Por favor, preencha nome e email.",
        variant: "destructive"
      });
      return;
    }

    setIsSubmitting(true);

    try {
      const { error } = await supabase
        .from('waitlist')
        .insert([
          {
            full_name: formData.fullName,
            email: formData.email,
            message: formData.message || null
          }
        ]);

      if (error) {
        if (error.code === '23505') { // unique constraint violation
          toast({
            title: "Email já cadastrado",
            description: "Este email já está na nossa lista de espera.",
            variant: "destructive"
          });
        } else {
          throw error;
        }
      } else {
        setIsSubmitted(true);
        toast({
          title: "Sucesso!",
          description: "Você foi adicionado à nossa lista de espera. Entraremos em contato em breve!",
        });
      }
    } catch (error) {
      console.error('Error submitting to waitlist:', error);
      toast({
        title: "Erro",
        description: "Ocorreu um erro ao cadastrar. Tente novamente.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSubmitted) {
    return (
      <div className="text-center space-y-4 py-8">
        <div className="text-4xl">✅</div>
        <h3 className="text-xl font-semibold text-foreground">Obrigado!</h3>
        <p className="text-muted-foreground">
          Você foi adicionado à nossa lista de espera. Entraremos em contato em breve!
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="fullName">Nome completo *</Label>
        <Input
          id="fullName"
          type="text"
          value={formData.fullName}
          onChange={(e) => setFormData(prev => ({ ...prev, fullName: e.target.value }))}
          placeholder="Seu nome completo"
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="email">Email *</Label>
        <Input
          id="email"
          type="email"
          value={formData.email}
          onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
          placeholder="seu@email.com"
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="message">Mensagem (opcional)</Label>
        <Textarea
          id="message"
          value={formData.message}
          onChange={(e) => setFormData(prev => ({ ...prev, message: e.target.value }))}
          placeholder="Conte-nos por que você gostaria de usar o Eterna..."
          rows={3}
        />
      </div>

      <Button 
        type="submit" 
        className="w-full" 
        disabled={isSubmitting}
      >
        {isSubmitting ? 'Cadastrando...' : 'Entrar na lista de espera'}
      </Button>
    </form>
  );
};