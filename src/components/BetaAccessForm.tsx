import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

interface BetaAccessFormProps {
  onAccessGranted: (accessCode: string) => void;
}

export const BetaAccessForm: React.FC<BetaAccessFormProps> = ({ onAccessGranted }) => {
  const [accessCode, setAccessCode] = useState('');
  const [email, setEmail] = useState('');
  const [isValidating, setIsValidating] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!accessCode.trim() || !email.trim()) {
      toast({
        title: "Campos obrigatórios",
        description: "Por favor, preencha email e código de acesso.",
        variant: "destructive"
      });
      return;
    }

    setIsValidating(true);

    try {
      // Verifica se o código e email estão corretos
      const { data, error } = await supabase
        .from('beta_access')
        .select('*')
        .eq('access_code', accessCode.trim())
        .eq('email', email.trim().toLowerCase())
        .single();

      if (error || !data) {
        toast({
          title: "Código inválido",
          description: "Código de acesso ou email incorretos.",
          variant: "destructive"
        });
        return;
      }

      // Marca como usado
      const { error: updateError } = await supabase
        .from('beta_access')
        .update({ used_at: new Date().toISOString() })
        .eq('id', data.id);

      if (updateError) {
        console.error('Error updating access:', updateError);
      }

      onAccessGranted(accessCode.trim());
    } catch (error) {
      console.error('Error validating access code:', error);
      toast({
        title: "Erro",
        description: "Ocorreu um erro ao validar o código. Tente novamente.",
        variant: "destructive"
      });
    } finally {
      setIsValidating(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="email">Email cadastrado</Label>
        <Input
          id="email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email do convite"
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="accessCode">Código de acesso</Label>
        <Input
          id="accessCode"
          type="text"
          value={accessCode}
          onChange={(e) => setAccessCode(e.target.value)}
          placeholder="Digite seu código"
          required
        />
      </div>

      <Button 
        type="submit" 
        className="w-full" 
        disabled={isValidating}
      >
        {isValidating ? 'Validando...' : 'Acessar Beta'}
      </Button>
    </form>
  );
};