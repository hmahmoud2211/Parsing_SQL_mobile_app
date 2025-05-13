import { useEffect } from 'react';
import { Redirect } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';

SplashScreen.preventAutoHideAsync();

export default function Index() {
  useEffect(() => {
    // Hide splash screen after a short delay
    const timer = setTimeout(() => {
      SplashScreen.hideAsync();
    }, 1000);
    
    return () => clearTimeout(timer);
  }, []);

  // Redirect to the tabs layout
  return <Redirect href="/(tabs)" />;
}