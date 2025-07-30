import { Person } from "@/types/person";

interface PersonFormProps {
  person?: Person;
  onSave: (person: Omit<Person, 'id' | 'createdAt' | 'updatedAt'>) => void;
  onBack: () => void;
}

export const PersonForm = ({ person, onSave, onBack }: PersonFormProps) => {
  // Por enquanto, vamos manter a implementação simples
  // até refatorarmos todos os componentes do form
  return (
    <div className="min-h-screen bg-gradient-warm p-4">
      <div className="max-w-4xl mx-auto py-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">
            {person ? 'Editar Pessoa' : 'Criar Nova Pessoa'}
          </h1>
          <p className="text-muted-foreground mb-8">
            Esta funcionalidade está sendo refatorada para melhor experiência.
          </p>
          <button 
            onClick={onBack}
            className="px-4 py-2 bg-primary text-primary-foreground rounded"
          >
            Voltar
          </button>
        </div>
      </div>
    </div>
  );
};