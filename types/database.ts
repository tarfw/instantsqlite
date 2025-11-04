// Database schema types
export interface DatabaseSchema {
  todos: {
    id: string;
    title: string;
    completed: boolean;
    userId: string;
    createdAt: string;
    updatedAt: string;
  };
}

// InstantDB specific types
export interface InstantConfig {
  appId: string;
  storage?: any;
}
