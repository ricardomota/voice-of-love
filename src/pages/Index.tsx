import { useEffect, useCallback } from "react";
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
import { usePeople } from "@/hooks/usePeople";
import { useAppState } from "@/hooks/useAppState";
import { Loader2 } from "lucide-react";

const Index = () => {
  const { toast } = useToast();
  const { user, loading: authLoading } = useAuth();
  const { 
    people, 
    loading: peopleLoading, 
    loadPeople, 
    addPerson, 
    updatePerson, 
    updatePersonLastConversation,
    addMemoriesToPerson 
  } = usePeople();
  const {
    appState,
    selectedPersonId,
    goBack,
    goToChat,
    goToSettings,
    goToAddMemory,
    goToCreate,
    goToDashboard
  } = useAppState('welcome');

  // Load people from Supabase only after authentication is confirmed
  useEffect(() => {
    if (authLoading || !user) return;

    const initializeApp = async () => {
      console.log('Index: Initializing app and loading people...');
      const peopleData = await loadPeople();
      if (peopleData.length > 0 && appState === 'welcome') {
        console.log('Index: Found people, navigating to dashboard');
        goToDashboard();
      }
    };

    initializeApp();
  }, [user, authLoading]); // Removidas dependências que causavam loop

  const handleSavePerson = useCallback(async (personData: Omit<Person, 'id' | 'createdAt' | 'updatedAt'>) => {
    try {
      const newPerson = await peopleService.createPerson(personData);
      addPerson(newPerson);
      goToDashboard();
      
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
  }, [addPerson, goToDashboard, toast]);

  const handleChat = useCallback(async (personId: string) => {
    goToChat(personId);
    
    try {
      // Update last conversation time in Supabase
      await peopleService.updatePersonLastConversation(personId);
      
      // Update local state
      updatePersonLastConversation(personId);
    } catch (error) {
      console.error('Error updating last conversation:', error);
    }
  }, [goToChat, updatePersonLastConversation]);

  const handleBack = useCallback(() => {
    goBack(people.length);
  }, [goBack, people.length]);

  const handleSaveMemory = useCallback(async (memories: Omit<import("@/types/person").Memory, 'id'>[]) => {
    if (!selectedPersonId) return;
    
    try {
      const { memoriesService } = await import("@/services/memoriesService");
      
      // Save all memories
      const savedMemories = await Promise.all(
        memories.map(memory => memoriesService.createMemory(selectedPersonId, memory))
      );

      // Update local state with new memories and updated timestamp
      addMemoriesToPerson(selectedPersonId, savedMemories);

      // Reload all people data to get the most up-to-date information
      await loadPeople();

      // Show success toast
      toast({
        title: "Sucesso",
        description: `${savedMemories.length} memórias adicionadas`,
      });

      // Navigate back to dashboard after a brief delay
      setTimeout(() => {
        goToDashboard();
      }, 1000);
      
    } catch (error) {
      console.error('Error saving memories:', error);
      throw error;
    }
  }, [selectedPersonId, addMemoriesToPerson, loadPeople, toast, goToDashboard]);

  const selectedPerson = people.find(p => p.id === selectedPersonId) || null;

  if (peopleLoading || authLoading) {
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
            return <WelcomeView onCreatePerson={goToCreate} />;
          
          case 'dashboard':
            return (
              <Dashboard 
                people={people}
                onCreatePerson={goToCreate}
                onChat={handleChat}
                onSettings={goToSettings}
                onAddMemory={goToAddMemory}
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
                onCreatePerson={goToCreate}
                onChat={handleChat}
                onSettings={goToSettings}
                onAddMemory={goToAddMemory}
                onReload={loadPeople}
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
                onCreatePerson={goToCreate}
                onChat={handleChat}
                onSettings={goToSettings}
                onAddMemory={goToAddMemory}
                onReload={loadPeople}
              />
            );
          
          case 'settings':
            return selectedPerson ? (
              <CreatePerson 
                person={selectedPerson}
                onSave={async (personData) => {
                  try {
                    const updatedPerson = await peopleService.updatePerson(selectedPerson.id, personData);
                    updatePerson(selectedPerson.id, updatedPerson);
                    goToDashboard();
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
                onCreatePerson={goToCreate}
                onChat={handleChat}
                onSettings={goToSettings}
                onAddMemory={goToAddMemory}
                onReload={loadPeople}
              />
            );
          default:
            return (
              <Dashboard 
                people={people}
                onCreatePerson={goToCreate}
                onChat={handleChat}
                onSettings={goToSettings}
                onAddMemory={goToAddMemory}
                onReload={loadPeople}
              />
            );
        }
      })()}
    </AuthGate>
  );
};

export default Index;
