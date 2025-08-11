import { useState, useEffect, useRef } from 'react';
import { authService } from '@/services/authService';
import type { Session, User } from '@supabase/supabase-js';

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const initialized = useRef(false);

  useEffect(() => {
    if (initialized.current) return;
    initialized.current = true;

    let initialCheckComplete = false;

    // 1) Listen for auth changes FIRST (prevents missed events)
    const { data: { subscription } } = authService.onAuthStateChange((event, newSession) => {
      console.log('Auth state change:', event, newSession ? 'has session' : 'no session');
      setSession(newSession);
      setUser(newSession?.user ?? null);
      if (initialCheckComplete) {
        setLoading(false);
      }
    });

    // 2) THEN check existing session
    authService
      .getCurrentUser()
      .then(({ user, session: initialSession }) => {
        console.log('Initial user check:', user ? 'has user' : 'no user');
        if (!initialCheckComplete) {
          setSession(initialSession ?? null);
          setUser(user);
        }
        initialCheckComplete = true;
        setLoading(false);
      })
      .catch((error) => {
        console.error('useAuth: Exception getting initial user:', error);
        if (!initialCheckComplete) {
          setUser(null);
          setSession(null);
        }
        initialCheckComplete = true;
        setLoading(false);
      });

    return () => subscription.unsubscribe();
  }, []);

  return {
    user,
    session,
    loading,
    signUp: authService.signUp,
    signIn: authService.signIn,
    signOut: authService.signOut,
  };
}
