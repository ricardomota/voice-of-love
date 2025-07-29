import { useState, useEffect } from "react";
import { WelcomeView } from "@/components/WelcomeView";
import { Dashboard } from "@/pages/Dashboard";
import { CreatePerson } from "@/pages/CreatePerson";
import { Chat } from "@/pages/Chat";
import { Person } from "@/types/person";
import { useLocalStorage } from "@/hooks/useLocalStorage";
import { useToast } from "@/hooks/use-toast";

type AppState = 'welcome' | 'dashboard' | 'create' | 'chat' | 'settings';

const Index = () => {
  const [people, setPeople] = useLocalStorage<Person[]>('eterna-people', []);
  const [appState, setAppState] = useState<AppState>('welcome');
  const [selectedPersonId, setSelectedPersonId] = useState<string | null>(null);
  const { toast } = useToast();

  // Check if user has people and should go to dashboard
  useEffect(() => {
    if (people.length > 0 && appState === 'welcome') {
      setAppState('dashboard');
    }
  }, [people, appState]);

  const handleCreatePerson = () => {
    setAppState('create');
  };

  const handleSavePerson = (personData: Omit<Person, 'id' | 'createdAt' | 'updatedAt'>) => {
    const newPerson: Person = {
      ...personData,
      id: Date.now().toString(),
      createdAt: new Date(),
      updatedAt: new Date()
    };

    setPeople(prev => [...prev, newPerson]);
    setAppState('dashboard');
    
    toast({
      title: "Pessoa Eterna criada!",
      description: `${newPerson.name} foi adicionado com sucesso.`,
    });
  };

  const handleChat = (personId: string) => {
    setSelectedPersonId(personId);
    setAppState('chat');
    
    // Update last conversation time
    setPeople(prev => prev.map(person => 
      person.id === personId 
        ? { ...person, lastConversation: new Date() }
        : person
    ));
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

  const selectedPerson = selectedPersonId 
    ? people.find(p => p.id === selectedPersonId) 
    : null;

  // Render based on app state
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
        />
      );
    
    case 'create':
      return (
        <CreatePerson 
          onSave={handleSavePerson}
          onBack={handleBack}
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
        />
      );
    
    default:
      return (
        <Dashboard 
          people={people}
          onCreatePerson={handleCreatePerson}
          onChat={handleChat}
          onSettings={handleSettings}
        />
      );
  }
};

export default Index;
