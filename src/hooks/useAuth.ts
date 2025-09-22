import { useState, useEffect } from 'react';
import { authService } from '@/services/authService';
import type { Session, User } from '@supabase/supabase-js';

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  

  useEffect(() => {
    let isMounted = true;

    const { data: { subscription } } = authService.onAuthStateChange((event, newSession) => {
      console.log('Auth state change:', event, newSession ? 'has session' : 'no session');
      if (!isMounted) return;
      setSession(newSession);
      setUser(newSession?.user ?? null);
      setLoading(false);
    });

    authService
      .getCurrentUser()
      .then(({ user, session: initialSession }) => {
        console.log('Initial user check:', user ? 'has user' : 'no user');
        if (!isMounted) return;
        setSession(initialSession ?? null);
        setUser(user);
        setLoading(false);
      })
      .catch((error) => {
        console.error('useAuth: Exception getting initial user:', error);
        if (!isMounted) return;
        setUser(null);
        setSession(null);
        setLoading(false);
      });

    return () => {
      isMounted = false;
      subscription.unsubscribe();
    };
  }, []);

  return {
    user,
    session,
    loading,
    signUp: (email: string, password: string, language?: string) => 
      authService.signUp(email, password, language),
    signIn: authService.signIn,
    signOut: authService.signOut,
  };
}
