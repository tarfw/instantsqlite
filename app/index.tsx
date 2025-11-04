import { Link } from 'expo-router';
import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity } from 'react-native';
import { useState, useEffect } from 'react';
import { storage } from '@/lib/instant/InstantConfig';
import { StorageInfo as StorageInfoType } from '@/lib/instant/ExpoSQLiteStorage';

export default function HomeScreen() {
  const [storageInfo, setStorageInfo] = useState<StorageInfoType>({ keyCount: 0, dbSize: 0 });

  useEffect(() => {
    const updateStorageInfo = async () => {
      try {
        const info = await storage.getStorageInfo();
        setStorageInfo(info);
      } catch (error) {
        console.error('Failed to get storage info:', error);
      }
    };

    updateStorageInfo();
    const interval = setInterval(updateStorageInfo, 5000);

    return () => clearInterval(interval);
  }, []);

  return (
    <View style={styles.container}>
      <SafeAreaView style={styles.safeArea} />
      <View style={styles.header}>
        <Text style={styles.title}>Tasks</Text>
        <View style={styles.storageInfo}>
          <Text style={styles.storageLabel}>Storage</Text>
          <Text style={styles.storageValue}>
            {storageInfo.keyCount} items • {(storageInfo.dbSize / 1024).toFixed(1)} KB
          </Text>
        </View>
      </View>

      <View style={styles.content}>
        <Link href="/todo" asChild>
          <TouchableOpacity style={styles.menuItem} activeOpacity={0.6}>
            <Text style={styles.menuItemText}>Todo List</Text>
            <Text style={styles.menuItemArrow}>→</Text>
          </TouchableOpacity>
        </Link>

        <Link href="/settings" asChild>
          <TouchableOpacity style={styles.menuItem} activeOpacity={0.6}>
            <Text style={styles.menuItemText}>Settings</Text>
            <Text style={styles.menuItemArrow}>→</Text>
          </TouchableOpacity>
        </Link>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  safeArea: {
    backgroundColor: '#FFFFFF',
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 50,
    paddingBottom: 24,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5E5',
  },
  title: {
    fontSize: 32,
    fontWeight: '700',
    color: '#000000',
    letterSpacing: -0.5,
    marginBottom: 16,
  },
  storageInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  storageLabel: {
    fontSize: 14,
    color: '#666666',
  },
  storageValue: {
    fontSize: 14,
    color: '#000000',
    fontWeight: '500',
  },
  content: {
    flex: 1,
  },
  menuItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 20,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5E5',
  },
  menuItemText: {
    fontSize: 18,
    color: '#000000',
    fontWeight: '500',
  },
  menuItemArrow: {
    fontSize: 20,
    color: '#000000',
  },
});
