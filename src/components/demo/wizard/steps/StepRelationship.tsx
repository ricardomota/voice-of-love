import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { DemoState, Relationship } from '../types';
import { useLanguage } from '@/contexts/LanguageContext';

interface Props {
  state: DemoState;
  setState: (s: Partial<DemoState>) => void;
}

const relationships: Relationship[] = ['Mom','Dad','Grandma','Grandpa','Partner','Friend','Other'];

const getContent = (language: string) => {
  const content = {
    en: {
      title: "Who should Eterna speak as?",
      subtitle: "This helps us set tone and word choices.",
      nameLabel: "What should they call you? (optional)",
      namePlaceholder: "e.g., my dear, sweetheart, John, honey...",
      nameHelp: "How this person addressed you - a nickname, term of endearment, or your name",
      relationships: {
        'Mom': 'Mom',
        'Dad': 'Dad', 
        'Grandma': 'Grandma',
        'Grandpa': 'Grandpa',
        'Partner': 'Partner',
        'Friend': 'Friend',
        'Other': 'Other'
      }
    },
    'pt-BR': {
      title: "Como quem a Eterna deve falar?",
      subtitle: "Isso nos ajuda a definir o tom e a escolha das palavras.",
      nameLabel: "Como eles devem te chamar? (opcional)",
      namePlaceholder: "ex: meu querido, amor, João, docinho...",
      nameHelp: "Como essa pessoa te chamava - um apelido, termo carinhoso ou seu nome",
      relationships: {
        'Mom': 'Mãe',
        'Dad': 'Pai',
        'Grandma': 'Vovó',
        'Grandpa': 'Vovô',
        'Partner': 'Parceiro(a)',
        'Friend': 'Amigo(a)',
        'Other': 'Outro'
      }
    },
    es: {
      title: "¿Como quién debería hablar Eterna?",
      subtitle: "Esto nos ayuda a establecer el tono y la elección de palabras.",
      nameLabel: "¿Cómo deberían llamarte? (opcional)",
      namePlaceholder: "ej: mi querido, amor, Juan, cariño...",
      nameHelp: "Cómo esta persona te llamaba - un apodo, término de cariño o tu nombre",
      relationships: {
        'Mom': 'Mamá',
        'Dad': 'Papá',
        'Grandma': 'Abuela',
        'Grandpa': 'Abuelo',
        'Partner': 'Pareja',
        'Friend': 'Amigo(a)',
        'Other': 'Otro'
      }
    }
  };
  return content[language as keyof typeof content] || content.en;
};

export const StepRelationship: React.FC<Props> = ({ state, setState }) => {
  const { currentLanguage } = useLanguage();
  const content = getContent(currentLanguage);
  
  return (
    <div className="space-y-6">
      <div className="text-center space-y-2">
        <h3 className="text-2xl md:text-3xl font-serif">{content.title}</h3>
        <p className="text-muted-foreground">{content.subtitle}</p>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {relationships.map((rel) => (
          <Button
            key={rel}
            variant={state.relationship === rel ? 'default' : 'outline'}
            className="h-12"
            onClick={() => setState({ relationship: rel })}
            aria-pressed={state.relationship === rel}
          >
            {content.relationships[rel]}
          </Button>
        ))}
      </div>

      <Card className="p-4 md:p-5">
        <label htmlFor="demo-name" className="block text-sm font-medium mb-2">{content.nameLabel}</label>
        <Input
          id="demo-name"
          placeholder={content.namePlaceholder}
          value={state.name || ''}
          onChange={(e) => setState({ name: e.target.value })}
          aria-label={content.nameLabel}
        />
        <p className="text-xs text-muted-foreground mt-2">{content.nameHelp}</p>
      </Card>
    </div>
  );
};
