import { i } from '@instantdb/react-native';

// Define your schema here
export const schema = i.schema({
  entities: {
    todos: i.entity({
      id: i.string(),
      title: i.string(),
      completed: i.boolean(),
      userId: i.string(),
      createdAt: i.string(),
      updatedAt: i.string(),
    }),
  },
});

// Export the types
export type Todo = typeof schema.entities.todos;
export type DB = typeof schema.db;
