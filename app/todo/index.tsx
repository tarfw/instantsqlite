import React, { useState } from 'react';
import {
View,
Text,
TextInput,
TouchableOpacity,
FlatList,
KeyboardAvoidingView,
Platform,
Alert,
StyleSheet,
SafeAreaView,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import Constants from 'expo-constants';
import { db, storage } from '@/lib/instant';
import { id } from '@instantdb/react-native';
import type { InstaQLEntity } from '@instantdb/react-native';
import schema from '../../instant.schema';

type Todo = InstaQLEntity<typeof schema, 'todos'>;
import TodoItem from '@/components/TodoItem';
import LoadingSpinner from '@/components/LoadingSpinner';

export default function TodoScreen() {
  const [newTodoTitle, setNewTodoTitle] = useState('');

  // Use InstantDB's useQuery hook for real-time sync
  const { isLoading, error, data } = db.useQuery({ todos: {} });

  // Extract todos from the query result
  const todos = data?.todos || [];

  const addTodo = async () => {
    if (!newTodoTitle.trim()) {
      Alert.alert('Error', 'Please enter a todo title');
      return;
    }

    try {
      const now = new Date().toISOString();
      const todoId = id();

      // Use InstantDB transaction API - this will automatically sync to local SQLite
      await db.transact(
        db.tx.todos[todoId].update({
          title: newTodoTitle,
          completed: false,
          userId: 'user-123',
          createdAt: now,
          updatedAt: now,
        })
      );

      setNewTodoTitle('');
    } catch (error) {
      console.error('Failed to add todo:', error);
      Alert.alert('Error', 'Failed to add todo. Please try again.');
    }
  };

  const toggleTodo = async (todoId: string) => {
    try {
      const todo = todos.find((t: Todo) => t.id === todoId);
      if (todo) {
        const now = new Date().toISOString();
        const updatedCompleted = !todo.completed;

        // Use InstantDB transaction API - this will automatically sync
        await db.transact(
          db.tx.todos[todoId].update({
            completed: updatedCompleted,
            updatedAt: now
          })
        );
      }
    } catch (error) {
      console.error('Failed to update todo:', error);
      Alert.alert('Error', 'Failed to update todo. Please try again.');
    }
  };

  const deleteTodo = async (todoId: string) => {
    try {
      await db.transact(db.tx.todos[todoId].delete());
    } catch (error) {
      console.error('Failed to delete todo:', error);
      Alert.alert('Error', 'Failed to delete todo. Please try again.');
    }
  };

  const cleanupOldData = async () => {
    try {
      const deletedCount = await storage.cleanup();
      Alert.alert('Cleanup Complete', `Cleaned up ${deletedCount} old SQLite records`);
    } catch (error) {
      console.error('Failed to cleanup data:', error);
      Alert.alert('Error', 'Failed to cleanup data. Please try again.');
    }
  };

  if (isLoading) {
    return <LoadingSpinner message="Loading todos..." />;
  }

  if (error) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>Error loading todos</Text>
        <Text style={styles.errorDetail}>{error.message}</Text>
      </View>
    );
  }

  return (
  <View style={styles.container}>
  <SafeAreaView style={styles.safeArea}>
  <StatusBar backgroundColor="#FFFFFF" style="dark" />
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Tasks</Text>
          <Text style={styles.headerCount}>{todos.length}</Text>
        </View>
      </SafeAreaView>

      <KeyboardAvoidingView
        style={styles.keyboardView}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            value={newTodoTitle}
            onChangeText={setNewTodoTitle}
            placeholder="Add a task..."
            placeholderTextColor="#999999"
            returnKeyType="done"
            onSubmitEditing={addTodo}
          />
          <TouchableOpacity
            style={[
              styles.addButton,
              !newTodoTitle.trim() && styles.addButtonDisabled
            ]}
            onPress={addTodo}
            disabled={!newTodoTitle.trim()}
            activeOpacity={0.6}
          >
            <Text style={styles.addButtonText}>+</Text>
          </TouchableOpacity>
        </View>

        <FlatList
          data={todos}
          renderItem={({ item }) => (
            <TodoItem todo={item} onToggle={toggleTodo} />
          )}
          keyExtractor={(item) => item.id}
          style={styles.list}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyText}>No tasks yet</Text>
              <Text style={styles.emptySubtext}>Add one above to get started</Text>
            </View>
          }
        />
      </KeyboardAvoidingView>
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
  keyboardView: {
    flex: 1,
  },
  header: {
  flexDirection: 'row',
  justifyContent: 'space-between',
  alignItems: 'center',
  paddingHorizontal: 20,
  paddingTop: Constants.statusBarHeight + 24,
  paddingBottom: 24,
  backgroundColor: '#FFFFFF',
  borderBottomWidth: 1,
    borderBottomColor: '#E5E5E5',
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: '700',
    color: '#000000',
    letterSpacing: -0.5,
  },
  headerCount: {
    fontSize: 16,
    color: '#666666',
  },
  inputContainer: {
    flexDirection: 'row',
    padding: 20,
    gap: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5E5',
  },
  input: {
    flex: 1,
    height: 44,
    borderWidth: 1,
    borderColor: '#E5E5E5',
    borderRadius: 8,
    paddingHorizontal: 16,
    backgroundColor: '#FFFFFF',
    fontSize: 16,
    color: '#000000',
  },
  addButton: {
    width: 44,
    height: 44,
    borderRadius: 8,
    backgroundColor: '#000000',
    justifyContent: 'center',
    alignItems: 'center',
  },
  addButtonDisabled: {
    backgroundColor: '#E5E5E5',
  },
  addButtonText: {
    color: '#FFFFFF',
    fontSize: 24,
    fontWeight: '400',
  },
  list: {
    flex: 1,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 100,
  },
  emptyText: {
    fontSize: 18,
    color: '#000000',
    marginBottom: 8,
    fontWeight: '500',
  },
  emptySubtext: {
    fontSize: 14,
    color: '#999999',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#FFFFFF',
  },
  errorText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#000000',
    marginBottom: 8,
  },
  errorDetail: {
    fontSize: 14,
    color: '#666666',
    textAlign: 'center',
  },
});
