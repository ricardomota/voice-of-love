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

    // 1) Listen for auth changes FIRST (prevents missed events)
    const { data: { subscription } } = authService.onAuthStateChange((event, newSession) => {
      // Only synchronous state updates here per best practices
      setSession(newSession);
      setUser(newSession?.user ?? null);
      setLoading(false);
    });

    // 2) THEN check existing session
    authService
      .getCurrentUser()
      .then(({ user, session: initialSession }) => {
        setSession(initialSession ?? null);
        setUser(user);
        setLoading(false);
      })
      .catch((error) => {
        console.error('useAuth: Exception getting initial user:', error);
        setUser(null);
        setSession(null);
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
