import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { StorageInfo as StorageInfoType } from '@/lib/instant/ExpoSQLiteStorage';

interface StorageInfoProps {
  storageInfo: StorageInfoType;
}

export default function StorageInfo({ storageInfo }: StorageInfoProps) {
  const formatSize = (bytes: number): string => {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>📊 Storage Information</Text>
      <View style={styles.stats}>
        <View style={styles.stat}>
          <Text style={styles.statLabel}>Keys:</Text>
          <Text style={styles.statValue}>{storageInfo.keyCount.toLocaleString()}</Text>
        </View>
        <View style={styles.stat}>
          <Text style={styles.statLabel}>Size:</Text>
          <Text style={styles.statValue}>{formatSize(storageInfo.dbSize)}</Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'white',
    padding: 16,
    margin: 16,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2C3E50',
    marginBottom: 12,
  },
  stats: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  stat: {
    alignItems: 'center',
  },
  statLabel: {
    fontSize: 14,
    color: '#7F8C8D',
    marginBottom: 4,
  },
  statValue: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#2C3E50',
  },
});
