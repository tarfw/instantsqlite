import * as SQLite from 'expo-sqlite';

export interface StorageInfo {
  keyCount: number;
  dbSize: number;
}

export class ExpoSQLiteStorage {
  private db: SQLite.SQLiteDatabase | null = null;
  private isInitialized = false;
  private dbName: string;
  private initPromise: Promise<void> | null = null;

  constructor(dbName = 'instant_data.db') {
    this.dbName = dbName;
    this.initPromise = this.init();
  }

  private async init(): Promise<void> {
    if (this.isInitialized) return;

    try {
      // Open database using modern async API
      this.db = await SQLite.openDatabaseAsync(this.dbName);

      // Create main tables
      await this.db.execAsync(`
        CREATE TABLE IF NOT EXISTS instant_data (
          key TEXT PRIMARY KEY,
          value TEXT NOT NULL,
          updated_at INTEGER NOT NULL
        );

        CREATE INDEX IF NOT EXISTS idx_updated_at
        ON instant_data(updated_at);
      `);

      this.isInitialized = true;
      console.log('✅ Expo SQLite storage initialized successfully');
    } catch (error) {
      console.error('❌ Failed to initialize Expo SQLite storage:', error);
      throw error;
    }
  }

  private async ensureInit(): Promise<void> {
    if (!this.isInitialized && this.initPromise) {
      await this.initPromise;
    }
  }

  // Storage interface methods
  async getItem(key: string): Promise<string | null> {
    await this.ensureInit();
    if (!this.db) return null;

    try {
      const result = await this.db.getFirstAsync<{ value: string }>(
        'SELECT value FROM instant_data WHERE key = ?',
        [key]
      );

      return result?.value || null;
    } catch (error) {
      console.error(`Failed to get item ${key}:`, error);
      return null;
    }
  }

  async setItem(key: string, value: string): Promise<void> {
    await this.ensureInit();
    if (!this.db) throw new Error('Database not initialized');

    try {
      const now = Date.now();
      await this.db.runAsync(
        'INSERT OR REPLACE INTO instant_data (key, value, updated_at) VALUES (?, ?, ?)',
        [key, value, now]
      );
    } catch (error) {
      console.error(`Failed to set item ${key}:`, error);
      throw error;
    }
  }

  async removeItem(key: string): Promise<void> {
    await this.ensureInit();
    if (!this.db) throw new Error('Database not initialized');

    try {
      await this.db.runAsync('DELETE FROM instant_data WHERE key = ?', [key]);
    } catch (error) {
      console.error(`Failed to remove item ${key}:`, error);
      throw error;
    }
  }

  async clear(): Promise<void> {
    await this.ensureInit();
    if (!this.db) throw new Error('Database not initialized');

    try {
      await this.db.runAsync('DELETE FROM instant_data');
    } catch (error) {
      console.error('Failed to clear storage:', error);
      throw error;
    }
  }

  async key(index: number): Promise<string | null> {
    await this.ensureInit();
    if (!this.db) return null;

    try {
      const result = await this.db.getFirstAsync<{ key: string }>(
        'SELECT key FROM instant_data ORDER BY key LIMIT 1 OFFSET ?',
        [index]
      );

      return result?.key || null;
    } catch (error) {
      console.error(`Failed to get key at index ${index}:`, error);
      return null;
    }
  }

  async length(): Promise<number> {
    await this.ensureInit();
    if (!this.db) return 0;

    try {
      const result = await this.db.getFirstAsync<{ count: number }>(
        'SELECT COUNT(*) as count FROM instant_data'
      );

      return result?.count || 0;
    } catch (error) {
      console.error('Failed to get storage length:', error);
      return 0;
    }
  }

  // Extended methods for better performance
  async getAllKeys(): Promise<string[]> {
    await this.ensureInit();
    if (!this.db) return [];

    try {
      const results = await this.db.getAllAsync<{ key: string }>(
        'SELECT key FROM instant_data ORDER BY key'
      );

      return results.map(row => row.key);
    } catch (error) {
      console.error('Failed to get all keys:', error);
      return [];
    }
  }

  async getItems(keys: string[]): Promise<Record<string, string>> {
    await this.ensureInit();
    if (!this.db || keys.length === 0) return {};

    try {
      const placeholders = keys.map(() => '?').join(',');
      const results = await this.db.getAllAsync<{ key: string; value: string }>(
        `SELECT key, value FROM instant_data WHERE key IN (${placeholders})`,
        keys
      );

      const items: Record<string, string> = {};
      for (const row of results) {
        items[row.key] = row.value;
      }
      return items;
    } catch (error) {
      console.error('Failed to get multiple items:', error);
      return {};
    }
  }

  async setItems(items: Record<string, string>): Promise<void> {
    await this.ensureInit();
    if (!this.db) throw new Error('Database not initialized');

    try {
      const now = Date.now();
      const entries = Object.entries(items);

      // Use a transaction for batch inserts
      await this.db.withTransactionAsync(async () => {
        for (const [key, value] of entries) {
          await this.db!.runAsync(
            'INSERT OR REPLACE INTO instant_data (key, value, updated_at) VALUES (?, ?, ?)',
            [key, value, now]
          );
        }
      });
    } catch (error) {
      console.error('Failed to set multiple items:', error);
      throw error;
    }
  }

  // Cleanup old data based on timestamp
  async cleanup(olderThan?: number): Promise<number> {
    await this.ensureInit();
    if (!this.db) return 0;

    try {
      const cutoffTime = olderThan || Date.now() - (7 * 24 * 60 * 60 * 1000); // 7 days default
      const result = await this.db.runAsync(
        'DELETE FROM instant_data WHERE updated_at < ?',
        [cutoffTime]
      );

      return result.changes || 0;
    } catch (error) {
      console.error('Failed to cleanup old data:', error);
      return 0;
    }
  }

  // Performance monitoring
  async getStorageInfo(): Promise<StorageInfo> {
    await this.ensureInit();
    if (!this.db) return { keyCount: 0, dbSize: 0 };

    try {
      const keyCount = await this.length();

      // Get approximate database size using PRAGMA
      const result = await this.db.getFirstAsync<{ size: number }>(
        'SELECT page_count * page_size as size FROM pragma_page_count(), pragma_page_size()'
      );

      const dbSize = result?.size || 0;

      return { keyCount, dbSize };
    } catch (error) {
      console.error('Failed to get storage info:', error);
      return { keyCount: 0, dbSize: 0 };
    }
  }
}
