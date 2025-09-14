import { useState, useEffect, useRef } from 'react';
import { authService } from '@/services/authService';
import type { Session, User } from '@supabase/supabase-js';

// Global state para evitar múltiplas instâncias
let globalAuthState = {
  user: null as User | null,
  session: null as Session | null,
  loading: true,
  initialized: false
};

let subscribers: Array<(state: typeof globalAuthState) => void> = [];

const notifySubscribers = () => {
  subscribers.forEach(callback => callback(globalAuthState));
};

// Singleton para gerenciar auth state
let authManager: {
  init: () => void;
  subscribe: (callback: (state: typeof globalAuthState) => void) => () => void;
  isInitialized: () => boolean;
} | null = null;

const getAuthManager = () => {
  if (!authManager) {
    let subscription: { unsubscribe: () => void } | null = null;
    
    authManager = {
      init: () => {
        if (globalAuthState.initialized) return;
        
        console.log('Initializing auth manager...');
        
        // Set up auth state listener FIRST
        const { data: { subscription: authSubscription } } = authService.onAuthStateChange((event, newSession) => {
          console.log('Auth state change:', event, newSession ? 'has session' : 'no session');
          globalAuthState.session = newSession;
          globalAuthState.user = newSession?.user ?? null;
          globalAuthState.loading = false;
          globalAuthState.initialized = true;
          notifySubscribers();
        });
        
        subscription = authSubscription;

        // THEN check for existing session
        authService
          .getCurrentUser()
          .then(({ user, session: initialSession }) => {
            console.log('Initial user check:', user ? 'has user' : 'no user');
            globalAuthState.session = initialSession ?? null;
            globalAuthState.user = user;
            globalAuthState.loading = false;
            globalAuthState.initialized = true;
            notifySubscribers();
          })
          .catch((error) => {
            console.error('useAuth: Exception getting initial user:', error);
            globalAuthState.user = null;
            globalAuthState.session = null;
            globalAuthState.loading = false;
            globalAuthState.initialized = true;
            notifySubscribers();
          });
      },
      
      subscribe: (callback: (state: typeof globalAuthState) => void) => {
        subscribers.push(callback);
        
        // Immediately call with current state
        callback(globalAuthState);
        
        return () => {
          subscribers = subscribers.filter(cb => cb !== callback);
          if (subscribers.length === 0 && subscription) {
            subscription.unsubscribe();
            subscription = null;
            globalAuthState.initialized = false;
          }
        };
      },
      
      isInitialized: () => globalAuthState.initialized
    };
  }
  
  return authManager;
};

export function useAuth() {
  const [state, setState] = useState(globalAuthState);
  const manager = getAuthManager();
  const initRef = useRef(false);

  useEffect(() => {
    // Initialize only once globally
    if (!manager.isInitialized() && !initRef.current) {
      initRef.current = true;
      manager.init();
    }

    // Subscribe to updates
    const unsubscribe = manager.subscribe((newState) => {
      setState({ ...newState });
    });

    return unsubscribe;
  }, [manager]);

  return {
    user: state.user,
    session: state.session,
    loading: state.loading,
    signUp: (email: string, password: string, language?: string) => 
      authService.signUp(email, password, language),
    signIn: authService.signIn,
    signOut: authService.signOut,
  };
}