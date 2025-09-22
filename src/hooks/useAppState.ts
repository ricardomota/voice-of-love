import { useState, useCallback, useMemo } from 'react';

export type AppState = 'welcome' | 'dashboard' | 'create' | 'chat' | 'settings' | 'add-memory';

export function useAppState(initialState: AppState = 'welcome') {
  const [appState, setAppState] = useState<AppState>(initialState);
  const [selectedPersonId, setSelectedPersonId] = useState<string | null>(null);

  const navigateTo = useCallback((newState: AppState, personId?: string) => {
    console.log('useAppState: Navigating to:', newState, personId ? `with personId: ${personId}` : '');
    setAppState(newState);
    setSelectedPersonId(personId || null);
  }, []);

  const goBack = useCallback((peopleLength: number) => {
    if (peopleLength > 0) {
      navigateTo('dashboard');
    } else {
      navigateTo('welcome');
    }
  }, [navigateTo]);

  const goToChat = useCallback((personId: string) => {
    navigateTo('chat', personId);
  }, [navigateTo]);

  const goToSettings = useCallback((personId: string) => {
    navigateTo('settings', personId);
  }, [navigateTo]);

  const goToAddMemory = useCallback((personId: string) => {
    navigateTo('add-memory', personId);
  }, [navigateTo]);

  const goToCreate = useCallback(() => {
    navigateTo('create');
  }, [navigateTo]);

  const goToDashboard = useCallback(() => {
    navigateTo('dashboard');
  }, [navigateTo]);

  return useMemo(() => ({
    appState,
    selectedPersonId,
    navigateTo,
    goBack,
    goToChat,
    goToSettings,
    goToAddMemory,
    goToCreate,
    goToDashboard
  }), [
    appState,
    selectedPersonId,
    navigateTo,
    goBack,
    goToChat,
    goToSettings,
    goToAddMemory,
    goToCreate,
    goToDashboard
  ]);
}