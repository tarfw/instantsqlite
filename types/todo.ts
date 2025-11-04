export interface Todo {
  id: string;
  title: string;
  completed: boolean;
  userId: string;
  createdAt: string;
  updatedAt: string;
}

export interface TodoInput {
  title: string;
  userId?: string;
}
