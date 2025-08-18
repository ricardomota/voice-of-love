import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'app.lovable.7f81fa118aec4a549c2f22759f0bc7ef',
  appName: 'voice-of-love',
  webDir: 'dist',
  server: {
    url: 'https://7f81fa11-8aec-4a54-9c2f-22759f0bc7ef.lovableproject.com?forceHideBadge=true',
    cleartext: true
  },
  plugins: {
    SplashScreen: {
      launchShowDuration: 2000,
      backgroundColor: '#ffffff',
      showSpinner: true,
      spinnerColor: '#007bff'
    },
    StatusBar: {
      style: 'default',
      backgroundColor: '#ffffff'
    }
  }
};

export default config;