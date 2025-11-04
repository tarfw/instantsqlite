import type { InstantRules } from "@instantdb/react-native";

// For development - allows anyone to read/write todos
// In production, you'd want more restrictive permissions
const rules = {
  todos: {
    allow: {
      view: "true", // Anyone can view todos
      create: "true", // Anyone can create todos
      update: "true", // Anyone can update todos
      delete: "true", // Anyone can delete todos
    },
  },
} satisfies InstantRules;

export default rules;
