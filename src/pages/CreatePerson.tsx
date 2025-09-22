import { Person } from "@/types/person";
import { PersonForm } from "@/components/PersonForm/PersonForm";

interface CreatePersonProps {
  person?: Person;
  onSave: (person: Omit<Person, 'id' | 'createdAt' | 'updatedAt'>) => void;
  onBack: () => void;
}

export const CreatePerson = ({ person, onSave, onBack }: CreatePersonProps) => {
  return (
    <PersonForm
      person={person}
      onSave={onSave}
      onBack={onBack}
    />
  );
};