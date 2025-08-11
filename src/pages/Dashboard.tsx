import { memo } from "react";
import { Button } from "@/components/ui/button";
import { PersonCard } from "@/components/PersonCard";
import { UsageBar } from "@/components/ui/usage-bar";
import { Add, Favorite } from "@mui/icons-material";
import { Person } from "@/types/person";

interface UsageData {
  messagesUsed: number;
  messagesLimit: number;
  ttsUsed: number;
  ttsLimit: number;
  planId: string;
}

interface DashboardProps {
  people: Person[];
  onCreatePerson: () => void;
  onChat: (personId: string) => void;
  onSettings: (personId: string) => void;
  onAddMemory?: (personId: string) => void;
  onReload?: () => void;
  usage?: UsageData;
  onUpgrade?: () => void;
}

const Dashboard = memo(({ people, onCreatePerson, onChat, onSettings, onAddMemory, onReload, usage, onUpgrade }: DashboardProps) => {
  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Background with subtle patterns */}
      <div className="absolute inset-0 bg-gradient-to-br from-white via-white to-gray-50/30"></div>
      
      <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {/* Floating Glass Header */}
        <div className="glass-surface rounded-2xl sm:rounded-3xl p-4 sm:p-6 lg:p-8 mb-8 sm:mb-12 backdrop-blur-xl">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex-1">
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-display font-light text-foreground flex items-center gap-3 sm:gap-4 mb-2">
                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-accent/20 to-accent/10 rounded-xl sm:rounded-2xl flex items-center justify-center backdrop-blur-sm">
                  <Favorite className="w-5 h-5 sm:w-6 sm:h-6 lg:w-7 lg:h-7 text-accent" />
                </div>
                Eterna
              </h1>
              <p className="text-muted-foreground text-sm sm:text-base lg:text-lg font-light">
                Suas pessoas eternas aguardam por você
              </p>
            </div>
            
            <Button 
              onClick={onCreatePerson}
              size="lg"
              variant="glass"
              className="w-full sm:w-auto px-4 sm:px-6 lg:px-8 py-3 sm:py-4 text-sm sm:text-base font-medium"
            >
              <Add className="w-4 h-4 sm:w-5 sm:h-5 mr-2 sm:mr-3" />
              <span className="whitespace-nowrap">Nova Pessoa</span>
            </Button>
          </div>
          
          {/* Usage Tracking */}
          {usage && onUpgrade && (
            <UsageBar
              messagesUsed={usage.messagesUsed}
              messagesLimit={usage.messagesLimit}
              ttsUsed={usage.ttsUsed}
              ttsLimit={usage.ttsLimit}
              onUpgrade={onUpgrade}
              className="mt-6"
            />
          )}
        </div>

        {/* People Grid */}
        {people.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
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
                  birthDate={person.birthDate}
                  avatar={person.avatar}
                  memoriesCount={person.memories.length}
                  memories={person.memories}
                  voiceSettings={person.voiceSettings}
                  lastConversation={person.lastConversation}
                  updatedAt={person.updatedAt}
                  person={person}
                  onChat={onChat}
                  onSettings={onSettings}
                  onAddMemory={onAddMemory}
                  onDelete={onReload}
                />
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12 sm:py-16 lg:py-24">
            <div className="glass-surface rounded-2xl sm:rounded-3xl p-6 sm:p-8 lg:p-12 max-w-lg mx-auto backdrop-blur-xl">
              <div className="w-20 h-20 sm:w-24 sm:h-24 lg:w-32 lg:h-32 bg-gradient-to-br from-accent/10 to-accent/5 rounded-2xl sm:rounded-3xl flex items-center justify-center mx-auto mb-6 sm:mb-8 backdrop-blur-sm">
                <Favorite className="w-10 h-10 sm:w-12 sm:h-12 lg:w-16 lg:h-16 text-accent" />
              </div>
              
              <h2 className="text-xl sm:text-2xl lg:text-3xl font-display font-light text-foreground mb-3 sm:mb-4">
                Nenhuma pessoa eterna ainda
              </h2>
              
              <p className="text-muted-foreground mb-6 sm:mb-8 text-sm sm:text-base lg:text-lg leading-relaxed max-w-sm mx-auto">
                Comece criando sua primeira pessoa eterna. Preserve memórias e mantenha viva a conexão com quem você ama.
              </p>
              
              <Button 
                onClick={onCreatePerson}
                size="lg"
                variant="glass"
                className="w-full sm:w-auto px-6 sm:px-8 lg:px-10 py-3 sm:py-4 text-sm sm:text-base font-medium"
              >
                <Add className="w-5 h-5 sm:w-6 sm:h-6 mr-2 sm:mr-3" />
                <span className="whitespace-nowrap">Criar Primeira Pessoa</span>
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
});

Dashboard.displayName = 'Dashboard';

export { Dashboard };