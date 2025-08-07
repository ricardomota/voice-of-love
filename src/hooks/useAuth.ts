import { useState, useEffect, useRef } from 'react';
import { authService } from '@/services/authService';

export function useAuth() {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const initialized = useRef(false);

  useEffect(() => {
    if (initialized.current) {
      return;
    }
    
    initialized.current = true;

    // Get initial session
    console.log('useAuth: Checking initial session...');
    authService.getCurrentUser().then(({ user, error }) => {
      console.log('useAuth: Initial session result:', { user: !!user, error: error?.message });
      setUser(user);
      setLoading(false);
    }).catch((error) => {
      console.error('useAuth: Exception getting initial user:', error);
      setUser(null);
      setLoading(false);
    });

    // Listen for auth changes
    console.log('useAuth: Setting up auth state listener...');
    const { data: { subscription } } = authService.onAuthStateChange(
      (event, session) => {
        console.log('useAuth: Auth state changed:', { event, hasSession: !!session });
        setUser(session?.user ?? null);
        setLoading(false);
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  return {
    user,
    loading,
    signUp: authService.signUp,
    signIn: authService.signIn,
    signOut: authService.signOut,
  };
}