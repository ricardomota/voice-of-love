import { useState, useEffect } from "react";
import { WelcomeView } from "@/components/WelcomeView";
import { Dashboard } from "@/pages/Dashboard";
import { CreatePerson } from "@/pages/CreatePerson";
import { AddMemory } from "@/components/AddMemory";
import { Chat } from "@/pages/Chat";
import { Person } from "@/types/person";
import { useToast } from "@/hooks/use-toast";
import { AuthGate } from "@/components/AuthGate";
import { peopleService } from "@/services/peopleService";
import { useAuth } from "@/hooks/useAuth";
import { Loader2 } from "lucide-react";

type AppState = 'welcome' | 'dashboard' | 'create' | 'chat' | 'settings' | 'add-memory';

const Index = () => {
  const [people, setPeople] = useState<Person[]>([]);
  const [appState, setAppState] = useState<AppState>('welcome');
  const [selectedPersonId, setSelectedPersonId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();
  const { user, loading: authLoading } = useAuth();

  // Load people from Supabase only after authentication is confirmed
  useEffect(() => {
    if (authLoading || !user) {
      setLoading(false);
      return;
    }

    const loadPeople = async () => {
      try {
        const peopleData = await peopleService.getAllPeople();
        setPeople(peopleData);
        if (peopleData.length > 0 && appState === 'welcome') {
          setAppState('dashboard');
        }
      } catch (error: any) {
        console.error('Error loading people:', error);
        toast({
          title: "Erro",
          description: "Não foi possível carregar as pessoas",
          variant: "destructive"
        });
      } finally {
        setLoading(false);
      }
    };

    loadPeople();
  }, [user, authLoading, appState, toast]);

  const loadPeople = async () => {
    try {
      const peopleData = await peopleService.getAllPeople();
      setPeople(peopleData);
    } catch (error: any) {
      console.error('Error loading people:', error);
      toast({
        title: "Erro",
        description: "Não foi possível carregar as pessoas",
        variant: "destructive"
      });
    }
  };

  const handleCreatePerson = () => {
    setAppState('create');
  };

  const handleSavePerson = async (personData: Omit<Person, 'id' | 'createdAt' | 'updatedAt'>) => {
    try {
      const newPerson = await peopleService.createPerson(personData);
      setPeople(prev => [...prev, newPerson]);
      setAppState('dashboard');
      
      toast({
        title: "Pessoa Eterna criada!",
        description: `${newPerson.name} foi adicionado com sucesso.`,
      });
    } catch (error: any) {
      console.error('Error creating person:', error);
      toast({
        title: "Erro",
        description: "Não foi possível criar a pessoa",
        variant: "destructive"
      });
    }
  };

  const handleChat = async (personId: string) => {
    setSelectedPersonId(personId);
    setAppState('chat');
    
    try {
      // Update last conversation time in Supabase
      await peopleService.updatePersonLastConversation(personId);
      
      // Update local state
      setPeople(prev => prev.map(person => 
        person.id === personId 
          ? { ...person, lastConversation: new Date() }
          : person
      ));
    } catch (error) {
      console.error('Error updating last conversation:', error);
    }
  };

  const handleSettings = (personId: string) => {
    setSelectedPersonId(personId);
    setAppState('settings');
  };

  const handleBack = () => {
    if (people.length > 0) {
      setAppState('dashboard');
    } else {
      setAppState('welcome');
    }
    setSelectedPersonId(null);
  };

  const handleAddMemory = (personId: string) => {
    setSelectedPersonId(personId);
    setAppState('add-memory');
  };

  const handleSaveMemory = async (memories: Omit<import("@/types/person").Memory, 'id'>[]) => {
    if (!selectedPersonId) return;
    
    try {
      const { memoriesService } = await import("@/services/memoriesService");
      
      // Save all memories
      const savedMemories = await Promise.all(
        memories.map(memory => memoriesService.createMemory(selectedPersonId, memory))
      );

      // Update local state with new memories and updated timestamp
      setPeople(prev => prev.map(person => 
        person.id === selectedPersonId 
          ? { 
              ...person, 
              memories: [...person.memories, ...savedMemories],
              updatedAt: new Date() // Update the last modified date
            }
          : person
      ));

      // Show success toast
      toast({
        title: "Sucesso",
        description: `${savedMemories.length} memórias adicionadas`,
      });

      // Navigate back to dashboard after a brief delay
      setTimeout(() => {
        setAppState('dashboard');
        setSelectedPersonId(null);
      }, 1000);
      
    } catch (error) {
      console.error('Error saving memories:', error);
      throw error;
    }
  };

  const selectedPerson = selectedPersonId 
    ? people.find(p => p.id === selectedPersonId) 
    : null;

  if (loading || authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  // Render based on app state
  return (
    <AuthGate>
      {(() => {
        switch (appState) {
          case 'welcome':
            return <WelcomeView onCreatePerson={handleCreatePerson} />;
          
          case 'dashboard':
            return (
              <Dashboard 
                people={people}
                onCreatePerson={handleCreatePerson}
                onChat={handleChat}
                onSettings={handleSettings}
                onAddMemory={handleAddMemory}
                onReload={loadPeople}
              />
            );
          
          case 'create':
            return (
              <CreatePerson 
                onSave={handleSavePerson}
                onBack={handleBack}
              />
            );
          
          case 'add-memory':
            return selectedPerson ? (
              <AddMemory 
                person={selectedPerson}
                onSave={handleSaveMemory}
                onBack={handleBack}
              />
            ) : (
              <Dashboard 
                people={people}
                onCreatePerson={handleCreatePerson}
                onChat={handleChat}
                onSettings={handleSettings}
                onAddMemory={handleAddMemory}
              />
            );
          
          case 'chat':
            return selectedPerson ? (
              <Chat 
                person={selectedPerson}
                onBack={handleBack}
              />
            ) : (
              <Dashboard 
                people={people}
                onCreatePerson={handleCreatePerson}
                onChat={handleChat}
                onSettings={handleSettings}
                onAddMemory={handleAddMemory}
              />
            );
          
          case 'settings':
            return selectedPerson ? (
              <CreatePerson 
                person={selectedPerson}
                onSave={async (personData) => {
                  try {
                    const updatedPerson = await peopleService.updatePerson(selectedPerson.id, personData);
                    setPeople(prev => prev.map(p => 
                      p.id === selectedPerson.id ? updatedPerson : p
                    ));
                    setAppState('dashboard');
                    toast({
                      title: "Pessoa atualizada!",
                      description: `${updatedPerson.name} foi atualizado com sucesso.`,
                    });
                  } catch (error: any) {
                    console.error('Error updating person:', error);
                    toast({
                      title: "Erro",
                      description: "Não foi possível atualizar a pessoa",
                      variant: "destructive"
                    });
                  }
                }}
                onBack={handleBack}
              />
            ) : (
              <Dashboard 
                people={people}
                onCreatePerson={handleCreatePerson}
                onChat={handleChat}
                onSettings={handleSettings}
                onAddMemory={handleAddMemory}
              />
            );
          default:
            return (
              <Dashboard 
                people={people}
                onCreatePerson={handleCreatePerson}
                onChat={handleChat}
                onSettings={handleSettings}
                onAddMemory={handleAddMemory}
              />
            );
        }
      })()}
    </AuthGate>
  );
};

export default Index;
