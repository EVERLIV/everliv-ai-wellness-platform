import { CapacitorConfig } from '@capacitor/core';

const config: CapacitorConfig = {
  appId: 'online.everliv.app',
  appName: 'EVERLIV',
  webDir: 'dist',
  server: {
    androidScheme: 'https',
    url: 'https://everliv.online',
    cleartext: true
  },
  android: {
    allowMixedContent: true,
    captureInput: true,
    webContentsDebuggingEnabled: true
  },
  plugins: {
    SplashScreen: {
      launchShowDuration: 2000,
      backgroundColor: '#3b82f6',
      androidSplashResourceName: 'splash',
      showSpinner: false
    },
    StatusBar: {
      style: 'default',
      backgroundColor: '#3b82f6'
    }
  }
};

export default config;