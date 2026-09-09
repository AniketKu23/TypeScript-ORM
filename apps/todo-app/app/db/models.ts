import "server-only";
import { defineModel, number, string, boolean, createClient } from "@light-orm/core";

const Todo = defineModel("todo", {
  id: number(),
  title: string(),
  completed: boolean(),
});

const connectionString = process.env.DATABASE_URL;
if (!connectionString) {
  throw new Error("DATABASE_URL is not set");
}

export const db = createClient(
  { todo: Todo },
  { connectionString }
);
