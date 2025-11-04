import { Stack } from 'expo-router';
import { useEffect } from 'react';
import { StatusBar } from 'expo-status-bar';
import * as SplashScreen from 'expo-splash-screen';
import { storage } from '@/lib/instant/InstantConfig';

// Keep the splash screen visible while we fetch resources
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  useEffect(() => {
    // Initialize app and storage
    const prepareApp = async () => {
      try {
        // Wait for SQLite storage to initialize
        await storage.getItem('init_check');
        console.log('✅ App initialized successfully');

        // Hide splash screen once initialization is complete
        await SplashScreen.hideAsync();
      } catch (error) {
        console.error('❌ App initialization failed:', error);
        await SplashScreen.hideAsync();
      }
    };

    prepareApp();
  }, []);

  return (
    <>
      <StatusBar style="dark" />
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="index" options={{ title: 'Home' }} />
        <Stack.Screen name="modal" options={{ presentation: 'modal' }} />
        <Stack.Screen name="todo" options={{ title: 'Tasks' }} />
        <Stack.Screen name="settings" options={{ title: 'Settings' }} />
      </Stack>
    </>
  );
}
