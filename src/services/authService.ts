import { supabase } from "@/integrations/supabase/client";

export const authService = {
  async signUp(email: string, password: string, language?: string) {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: `${window.location.origin}/`,
        data: {
          language: language || 'pt'
        }
      }
    });
    return { data, error };
  },

  async signIn(email: string, password: string) {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    return { data, error };
  },

  async signOut() {
    const { error } = await supabase.auth.signOut();
    return { error };
  },

  async getCurrentUser() {
    const { data: { session }, error } = await supabase.auth.getSession();
    return { user: session?.user || null, session, error };
  },

  onAuthStateChange(callback: (event: string, session: any) => void) {
    return supabase.auth.onAuthStateChange(callback);
  },

  // OAuth providers
  async signInWithOAuth(provider: 'google' | 'apple' | 'azure', redirectTo?: string) {
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider,
      options: {
        redirectTo: redirectTo || `${window.location.origin}/`
      }
    });
    return { data, error };
  },

  // Email OTP - send code
  async sendEmailOtp(email: string) {
    const { data, error } = await supabase.auth.signInWithOtp({
      email,
      options: {
        shouldCreateUser: true,
        emailRedirectTo: `${window.location.origin}/`
      }
    });
    return { data, error };
  },

  // Phone OTP - send code
  async sendPhoneOtp(phone: string) {
    const { data, error } = await supabase.auth.signInWithOtp({
      phone,
      options: {
        channel: 'sms'
      }
    });
    return { data, error };
  },

  // Verify OTP - works for both email and phone
  async verifyOtp(identifier: string, token: string, type: 'email' | 'sms') {
    const verifyData = type === 'email' 
      ? { email: identifier, token, type: 'email' as const }
      : { phone: identifier, token, type: 'sms' as const };
    
    const { data, error } = await supabase.auth.verifyOtp(verifyData);
    return { data, error };
  },

  // Resend email confirmation
  async resendConfirmation(email: string) {
    const { data, error } = await supabase.auth.resend({
      type: 'signup',
      email,
      options: {
        emailRedirectTo: `${window.location.origin}/`
      }
    });
    return { data, error };
  }
};