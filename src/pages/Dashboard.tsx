import { memo } from "react";
import { Button } from "@/components/ui/button";
import { PersonCard } from "@/components/PersonCard";
import { UsageBar } from "@/components/ui/usage-bar";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Add, Favorite, Settings, ExitToApp } from "@mui/icons-material";
import { Person } from "@/types/person";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";

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
  const { user, signOut } = useAuth();
  const { toast } = useToast();

  const handleLogout = async () => {
    try {
      const { error } = await signOut();
      if (error) {
        toast({
          title: "Erro ao sair",
          description: error.message,
          variant: "destructive"
        });
      } else {
        toast({
          title: "Logout realizado",
          description: "Você foi desconectado com sucesso."
        });
      }
    } catch (error) {
      toast({
        title: "Erro",
        description: "Ocorreu um erro inesperado ao fazer logout.",
        variant: "destructive"
      });
    }
  };

  const getUserInitials = () => {
    if (!user?.email) return "?";
    return user.email.charAt(0).toUpperCase();
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {/* Header Card */}
        <div className="bg-card border border-border rounded-xl p-6 lg:p-8 pt-10 lg:pt-12 mb-8 sm:mb-12 shadow-sm">
          {/* Top Row with User Menu */}
          <div className="flex justify-between items-center mb-6">
            <div></div> {/* Empty div for spacing */}
            
            {/* User Profile Menu */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-10 w-10 rounded-full">
                  <Avatar className="h-10 w-10">
                    <AvatarImage src="" alt={user?.email || ""} />
                    <AvatarFallback className="bg-primary text-primary-foreground">
                      {getUserInitials()}
                    </AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56" align="end">
                <div className="flex items-center justify-start gap-2 p-2">
                  <div className="flex flex-col space-y-1 leading-none">
                    <p className="font-medium text-sm">{user?.email}</p>
                    <p className="w-[200px] truncate text-xs text-muted-foreground">
                      {user?.email}
                    </p>
                  </div>
                </div>
                <DropdownMenuSeparator />
                <DropdownMenuItem className="cursor-pointer">
                  <Settings className="mr-2 h-4 w-4" />
                  <span>Configurações</span>
                </DropdownMenuItem>
                <DropdownMenuItem 
                  className="cursor-pointer text-red-600 focus:text-red-600" 
                  onClick={handleLogout}
                >
                  <ExitToApp className="mr-2 h-4 w-4" />
                  <span>Sair</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex-1">
              <h1 className="font-serif text-[clamp(1.5rem,3.5vw,2.75rem)] flex items-center gap-4 mb-2 text-foreground leading-tight">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary to-primary/70 flex items-center justify-center shadow-lg">
                  <span className="text-primary-foreground text-2xl">💖</span>
                </div>
                ✨ Eterna
              </h1>
              <p className="text-base lg:text-lg text-muted-foreground">
                Suas pessoas eternas aguardam por você 🌟
              </p>
            </div>
            
            <Button 
              onClick={onCreatePerson}
              className="w-full sm:w-auto bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 shadow-lg hover:shadow-xl transition-all"
            >
              <Add className="w-5 h-5 mr-3" />
              ✨ Nova pessoa
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
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6 lg:gap-8">
            {people.map((person, index) => (
              <div key={person.id}>
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
            <div className="bg-card border border-border rounded-xl p-8 lg:p-12 max-w-lg mx-auto shadow-sm">
              <div className="w-24 h-24 lg:w-32 lg:h-32 mx-auto mb-8 rounded-2xl bg-foreground flex items-center justify-center">
                <Favorite className="w-12 h-12 lg:w-16 lg:h-16 text-background" />
              </div>
              
              <h2 className="font-serif text-[clamp(1.25rem,3vw,2rem)] mb-4 text-foreground leading-tight">
                🌟 Nenhuma pessoa eterna ainda
              </h2>
              
              <p className="mb-8 text-base lg:text-lg leading-relaxed max-w-sm mx-auto text-muted-foreground">
                Comece criando sua primeira pessoa eterna. Preserve memórias preciosas e mantenha viva a conexão mágica com quem você ama! 💫❤️
              </p>
              
              <Button 
                onClick={onCreatePerson}
                className="w-full max-w-xs mx-auto bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 shadow-lg hover:shadow-xl transition-all"
                size="lg"
              >
                <Add className="w-6 h-6 mr-3" />
                🚀 Criar primeira pessoa
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