import { Button } from "@/components/ui/button";
import { PersonCard } from "@/components/PersonCard";
import { Plus, Heart } from "lucide-react";
import { Person } from "@/types/person";

interface DashboardProps {
  people: Person[];
  onCreatePerson: () => void;
  onChat: (personId: string) => void;
  onSettings: (personId: string) => void;
}

export const Dashboard = ({ people, onCreatePerson, onChat, onSettings }: DashboardProps) => {
  return (
    <div className="min-h-screen bg-gradient-warm">
      <div className="max-w-6xl mx-auto p-4">
        {/* Header */}
        <div className="flex items-center justify-between mb-8 pt-4">
          <div>
            <h1 className="text-3xl font-bold text-foreground flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-memory rounded-full flex items-center justify-center shadow-medium">
                <Heart className="w-6 h-6 text-memory-foreground" />
              </div>
              Eterna
            </h1>
            <p className="text-muted-foreground mt-2">
              Suas pessoas eternas aguardam por você
            </p>
          </div>
          
          <Button 
            onClick={onCreatePerson}
            className="bg-primary hover:bg-primary/90 text-primary-foreground shadow-medium"
          >
            <Plus className="w-4 h-4 mr-2" />
            Nova Pessoa
          </Button>
        </div>

        {/* People Grid */}
        {people.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {people.map((person) => (
              <PersonCard
                key={person.id}
                id={person.id}
                name={person.name}
                relationship={person.relationship}
                birthYear={person.birthYear}
                avatar={person.avatar}
                memoriesCount={person.memories.length}
                lastConversation={person.lastConversation}
                onChat={onChat}
                onSettings={onSettings}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <div className="w-24 h-24 bg-gradient-memory rounded-full flex items-center justify-center mx-auto mb-6 shadow-medium">
              <Heart className="w-12 h-12 text-memory-foreground" />
            </div>
            
            <h2 className="text-2xl font-semibold text-foreground mb-3">
              Nenhuma pessoa eterna ainda
            </h2>
            
            <p className="text-muted-foreground mb-6 max-w-md mx-auto leading-relaxed">
              Comece criando sua primeira pessoa eterna. Preserve memórias e mantenha viva a conexão com quem você ama.
            </p>
            
            <Button 
              onClick={onCreatePerson}
              className="bg-primary hover:bg-primary/90 text-primary-foreground"
              size="lg"
            >
              <Plus className="w-5 h-5 mr-2" />
              Criar Primeira Pessoa
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};