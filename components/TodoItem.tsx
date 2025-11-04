import React from 'react';
import { TouchableOpacity, View, Text, StyleSheet } from 'react-native';
import { Todo } from '@/types/todo';

interface TodoItemProps {
  todo: Todo;
  onToggle: (id: string) => void;
}

export default function TodoItem({ todo, onToggle }: TodoItemProps) {
  return (
    <TouchableOpacity
      style={styles.container}
      onPress={() => onToggle(todo.id)}
      activeOpacity={0.6}
    >
      <View style={styles.checkbox}>
        {todo.completed && <View style={styles.checkboxFilled} />}
      </View>
      <View style={styles.content}>
        <Text style={[
          styles.title,
          todo.completed && styles.completed
        ]}>
          {todo.title}
        </Text>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 18,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5E5',
    backgroundColor: '#FFFFFF',
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#000000',
    marginRight: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkboxFilled: {
    width: 14,
    height: 14,
    borderRadius: 7,
    backgroundColor: '#000000',
  },
  content: {
    flex: 1,
  },
  title: {
    fontSize: 16,
    color: '#000000',
    letterSpacing: 0.2,
  },
  completed: {
    textDecorationLine: 'line-through',
    color: '#999999',
  },
});
