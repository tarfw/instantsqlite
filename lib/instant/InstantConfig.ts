import { init, type InstantReactNativeConfig } from '@instantdb/react-native';
import { ExpoSQLiteStorage } from './ExpoSQLiteStorage';
import schema from '../../instant.schema';

// Create a singleton instance of the SQLite storage
export const storage = new ExpoSQLiteStorage('instant_app.db');

// Get InstantDB App ID from environment
export const INSTANT_APP_ID = process.env.EXPO_PUBLIC_INSTANT_APP_ID || '6c8aaad6-c988-4c46-bbd6-4076a9a06dc9';

if (!process.env.EXPO_PUBLIC_INSTANT_APP_ID) {
  console.warn('⚠️ EXPO_PUBLIC_INSTANT_APP_ID not set in .env, using fallback');
}

// Create storage adapter compatible with InstantDB
const storageAdapter = {
  getItem: async (key: string) => {
    try {
      return await storage.getItem(key);
    } catch (error) {
      console.error('Storage getItem error:', error);
      return null;
    }
  },
  setItem: async (key: string, value: string) => {
    try {
      await storage.setItem(key, value);
    } catch (error) {
      console.error('Storage setItem error:', error);
      throw error;
    }
  },
  removeItem: async (key: string) => {
    try {
      await storage.removeItem(key);
    } catch (error) {
      console.error('Storage removeItem error:', error);
      throw error;
    }
  },
};

export const instantConfig: InstantReactNativeConfig = {
  appId: INSTANT_APP_ID,
  schema,
  storage: storageAdapter as any,
};

// Initialize InstantDB client with SQLite storage
export const db = init(instantConfig);

export const config = instantConfig;

console.log('✅ InstantDB initialized with SQLite storage adapter');
