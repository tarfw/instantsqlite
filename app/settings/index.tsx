import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity, Alert, ScrollView } from 'react-native';
import { useState, useEffect } from 'react';
import { storage } from '@/lib/instant/InstantConfig';
import { StorageInfo as StorageInfoType } from '@/lib/instant/ExpoSQLiteStorage';

export default function SettingsScreen() {
  const [storageInfo, setStorageInfo] = useState<StorageInfoType>({ keyCount: 0, dbSize: 0 });

  useEffect(() => {
    updateStorageInfo();
  }, []);

  const updateStorageInfo = async () => {
    try {
      const info = await storage.getStorageInfo();
      setStorageInfo(info);
    } catch (error) {
      console.error('Failed to get storage info:', error);
    }
  };

  const clearAllData = () => {
    Alert.alert(
      'Clear All Data',
      'Are you sure you want to delete all data? This action cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete All',
          style: 'destructive',
          onPress: async () => {
            try {
              await storage.clear();
              Alert.alert('Success', 'All data has been cleared.');
              updateStorageInfo();
            } catch (error) {
              Alert.alert('Error', 'Failed to clear data.');
            }
          }
        },
      ]
    );
  };

  const exportData = async () => {
    try {
      const allKeys = await storage.getAllKeys();
      const allItems = await storage.getItems(allKeys);

      Alert.alert(
        'Export Data',
        `Data exported successfully!\\n\\nKeys: ${allKeys.length}\\nSize: ${(storageInfo.dbSize / 1024).toFixed(2)} KB\\n\\nNote: In a real app, you would export this data to a file or cloud storage.`,
        [{ text: 'OK' }]
      );
    } catch (error) {
      Alert.alert('Error', 'Failed to export data.');
    }
  };

  const importData = () => {
    Alert.alert(
      'Import Data',
      'In a real app, this would allow you to import data from a file or cloud storage.',
      [{ text: 'OK' }]
    );
  };

  return (
    <View style={styles.container}>
      <SafeAreaView style={styles.safeArea} />
      <ScrollView style={styles.scrollView}>
        <View style={styles.storageSection}>
          <Text style={styles.storageTitle}>Storage</Text>
          <View style={styles.storageRow}>
            <Text style={styles.storageLabel}>Items</Text>
            <Text style={styles.storageValue}>{storageInfo.keyCount}</Text>
          </View>
          <View style={styles.storageRow}>
            <Text style={styles.storageLabel}>Size</Text>
            <Text style={styles.storageValue}>{(storageInfo.dbSize / 1024).toFixed(2)} KB</Text>
          </View>
        </View>

        <View style={styles.section}>
          <TouchableOpacity style={styles.settingItem} onPress={exportData} activeOpacity={0.6}>
            <Text style={styles.settingText}>Export Data</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.settingItem} onPress={importData} activeOpacity={0.6}>
            <Text style={styles.settingText}>Import Data</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.settingItem} onPress={clearAllData} activeOpacity={0.6}>
            <Text style={[styles.settingText, styles.dangerText]}>Clear All Data</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.infoSection}>
          <View style={styles.infoItem}>
            <Text style={styles.infoLabel}>Storage</Text>
            <Text style={styles.infoValue}>SQLite</Text>
          </View>
          <View style={styles.infoItem}>
            <Text style={styles.infoLabel}>Database</Text>
            <Text style={styles.infoValue}>instant_app.db</Text>
          </View>
          <View style={styles.infoItem}>
            <Text style={styles.infoLabel}>Sync</Text>
            <Text style={styles.infoValue}>Real-time</Text>
          </View>
        </View>
      </ScrollView>
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
  scrollView: {
    flex: 1,
  },
  storageSection: {
    padding: 20,
    paddingTop: 50,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5E5',
  },
  storageTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#000000',
    marginBottom: 16,
  },
  storageRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 8,
  },
  storageLabel: {
    fontSize: 16,
    color: '#666666',
  },
  storageValue: {
    fontSize: 16,
    fontWeight: '500',
    color: '#000000',
  },
  section: {
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5E5',
  },
  settingItem: {
    paddingVertical: 18,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5E5',
  },
  settingText: {
    fontSize: 16,
    color: '#000000',
    fontWeight: '500',
  },
  dangerText: {
    color: '#000000',
  },
  infoSection: {
    paddingTop: 20,
  },
  infoItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 12,
    paddingHorizontal: 20,
  },
  infoLabel: {
    fontSize: 14,
    color: '#666666',
  },
  infoValue: {
    fontSize: 14,
    fontWeight: '500',
    color: '#000000',
  },
});
