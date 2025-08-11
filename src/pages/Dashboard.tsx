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
    <div className="min-h-screen relative overflow-hidden" style={{backgroundColor: '#FDFBCB'}}>
      {/* Subtle pattern background */}
      <div className="absolute inset-0">
        <div className="absolute top-20 left-20 w-72 h-72 rounded-full animate-float" style={{backgroundColor: '#F8F4E6'}}></div>
        <div className="absolute top-40 right-20 w-72 h-72 rounded-full animate-float" style={{backgroundColor: '#F0EDD7', animationDelay: '2s'}}></div>
        <div className="absolute bottom-20 left-1/2 w-72 h-72 rounded-full animate-float" style={{backgroundColor: '#E8E3C8', animationDelay: '4s'}}></div>
      </div>
      
      <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {/* Header Card */}
        <div className="glass-card p-6 lg:p-8 mb-8 sm:mb-12 hover-lift fade-in-up">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex-1">
              <h1 className="text-3xl lg:text-4xl font-zilla font-medium italic flex items-center gap-4 mb-2" style={{color: '#441632'}}>
                <div className="feature-icon w-12 h-12 rounded-xl flex items-center justify-center" style={{backgroundColor: '#441632'}}>
                  <Favorite className="w-6 h-6" style={{color: '#FDFBCB'}} />
                </div>
                Eterna
              </h1>
              <p className="text-base lg:text-lg font-work" style={{color: '#331122'}}>
                Suas pessoas eternas aguardam por você
              </p>
            </div>
            
            <button 
              onClick={onCreatePerson}
              className="w-full sm:w-auto px-6 py-3 rounded-xl font-semibold hover-lift transition-all"
              style={{backgroundColor: '#441632', color: '#FDFBCB'}}
            >
              <Add className="w-5 h-5 mr-3" />
              Nova pessoa
            </button>
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
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6 lg:gap-8">
            {people.map((person, index) => (
              <div 
                key={person.id}
                className="fade-in-up hover-lift"
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
          <div className="text-center py-16 lg:py-24">
            <div className="glass-card p-8 lg:p-12 max-w-lg mx-auto hover-lift fade-in-up">
              <div className="w-24 h-24 lg:w-32 lg:h-32 mx-auto mb-8 rounded-2xl flex items-center justify-center" style={{backgroundColor: '#441632'}}>
                <Favorite className="w-12 h-12 lg:w-16 lg:h-16" style={{color: '#FDFBCB'}} />
              </div>
              
              <h2 className="text-2xl lg:text-3xl font-zilla font-medium italic mb-4" style={{color: '#441632'}}>
                Nenhuma pessoa eterna ainda
              </h2>
              
              <p className="mb-8 text-base lg:text-lg leading-relaxed max-w-sm mx-auto font-work" style={{color: '#331122'}}>
                Comece criando sua primeira pessoa eterna. Preserve memórias e mantenha viva a conexão com quem você ama.
              </p>
              
              <button 
                onClick={onCreatePerson}
                className="w-full max-w-xs mx-auto px-8 py-4 rounded-xl font-semibold text-lg hover-lift transition-all"
                style={{backgroundColor: '#441632', color: '#FDFBCB'}}
              >
                <Add className="w-6 h-6 mr-3" />
                Criar primeira pessoa
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
});

Dashboard.displayName = 'Dashboard';

export { Dashboard };