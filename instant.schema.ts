import { i } from "@instantdb/react-native";

const _schema = i.schema({
  entities: {
    todos: i.entity({
      title: i.string(),
      completed: i.boolean(),
      userId: i.string(),
      createdAt: i.string(),
      updatedAt: i.string(),
    }),
  },
  links: {},
  rooms: {},
});

// This helps TypeScript display nicer intellisense
type _AppSchema = typeof _schema;
interface AppSchema extends _AppSchema {}
const schema: AppSchema = _schema;

export type { AppSchema };
export default schema;
