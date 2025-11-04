import { init } from '@instantdb/react-native';
import schema from '../../instant.schema';
import { storage } from './InstantConfig';

const APP_ID = process.env.EXPO_PUBLIC_INSTANT_APP_ID || '';

if (!APP_ID) {
  console.warn('⚠️ EXPO_PUBLIC_INSTANT_APP_ID not set in .env file');
}

// Initialize InstantDB with SQLite storage adapter
export const db = init({
  appId: APP_ID,
  schema,
  storage: storage as any, // Custom SQLite storage adapter
});

export type { AppSchema } from '../../instant.schema';
