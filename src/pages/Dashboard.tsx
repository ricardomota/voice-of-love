import { Button } from "@/components/ui/button";
import { PersonCard } from "@/components/PersonCard";
import { Add, Favorite } from "@mui/icons-material";
import { Person } from "@/types/person";

interface DashboardProps {
  people: Person[];
  onCreatePerson: () => void;
  onChat: (personId: string) => void;
  onSettings: (personId: string) => void;
}

export const Dashboard = ({ people, onCreatePerson, onChat, onSettings }: DashboardProps) => {
  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Background with subtle patterns */}
      <div className="absolute inset-0 bg-gradient-to-br from-white via-white to-gray-50/30"></div>
      
      <div className="relative max-w-6xl mx-auto p-8">
        {/* Floating Glass Header */}
        <div className="glass-surface rounded-3xl p-8 mb-12 backdrop-blur-xl">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-display flex items-center gap-4 mb-3">
                <div className="w-14 h-14 bg-gradient-to-br from-accent/20 to-accent/10 rounded-3xl flex items-center justify-center backdrop-blur-sm">
                  <Favorite className="w-8 h-8 text-accent" />
                </div>
                Eterna
              </h1>
              <p className="text-subtitle">
                Suas pessoas eternas aguardam por você
              </p>
            </div>
            
            <Button 
              onClick={onCreatePerson}
              size="lg"
              variant="glass"
              className="px-8 py-4 text-base"
            >
              <Add className="w-5 h-5 mr-3" />
              Nova Pessoa
            </Button>
          </div>
        </div>

        {/* People Grid */}
        {people.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
            {people.map((person, index) => (
              <div 
                key={person.id}
                className="fade-in-up"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <PersonCard
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
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-24">
            <div className="glass-surface rounded-3xl p-12 max-w-lg mx-auto backdrop-blur-xl">
              <div className="w-32 h-32 bg-gradient-to-br from-accent/10 to-accent/5 rounded-3xl flex items-center justify-center mx-auto mb-8 backdrop-blur-sm">
                <Favorite className="w-16 h-16 text-accent" />
              </div>
              
              <h2 className="mb-6">
                Nenhuma pessoa eterna ainda
              </h2>
              
              <p className="text-subtitle mb-10 max-w-sm mx-auto">
                Comece criando sua primeira pessoa eterna. Preserve memórias e mantenha viva a conexão com quem você ama.
              </p>
              
              <Button 
                onClick={onCreatePerson}
                size="lg"
                variant="glass"
                className="px-10 py-4 text-base"
              >
                <Add className="w-6 h-6 mr-3" />
                Criar Primeira Pessoa
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};