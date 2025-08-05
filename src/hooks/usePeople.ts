import { useState, useCallback } from 'react';
import { Person } from '@/types/person';
import { peopleService } from '@/services/peopleService';
import { useToast } from '@/hooks/use-toast';

export function usePeople() {
  const [people, setPeople] = useState<Person[]>([]);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const loadPeople = useCallback(async () => {
    if (loading) {
      console.log('Already loading people, skipping duplicate request');
      return people;
    }

    setLoading(true);
    try {
      const peopleData = await peopleService.getAllPeople();
      setPeople(peopleData);
      return peopleData;
    } catch (error: any) {
      console.error('Error loading people:', error);
      toast({
        title: "Erro",
        description: "Não foi possível carregar as pessoas",
        variant: "destructive"
      });
      return [];
    } finally {
      setLoading(false);
    }
  }, [toast, loading, people]);

  const addPerson = useCallback((person: Person) => {
    setPeople(prev => [...prev, person]);
  }, []);

  const updatePerson = useCallback((personId: string, updatedPerson: Person) => {
    setPeople(prev => prev.map(p => 
      p.id === personId ? updatedPerson : p
    ));
  }, []);

  const updatePersonLastConversation = useCallback((personId: string) => {
    setPeople(prev => prev.map(person => 
      person.id === personId 
        ? { ...person, lastConversation: new Date() }
        : person
    ));
  }, []);

  const addMemoriesToPerson = useCallback((personId: string, memories: any[]) => {
    setPeople(prev => prev.map(person => 
      person.id === personId 
        ? { 
            ...person, 
            memories: [...person.memories, ...memories],
            updatedAt: new Date()
          }
        : person
    ));
  }, []);

  return {
    people,
    loading,
    loadPeople,
    addPerson,
    updatePerson,
    updatePersonLastConversation,
    addMemoriesToPerson
  };
}