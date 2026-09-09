"use server";

import { revalidatePath } from "next/cache";
import { db } from "../db/models";

export async function createTodo(formData: FormData) {
  const title = formData.get("title") as string;
  if (!title) return;

  await db.todo.create({ title, completed: false });
  revalidatePath("/");
}

export async function listTodos(filter?: { completed?: boolean }) {
  const args = filter && filter.completed !== undefined ? { where: filter } : undefined;
  return await db.todo.findMany(args);
}

export async function toggleTodo(id: number, currentCompleted: boolean) {
  await db.todo.update({ where: { id }, data: { completed: !currentCompleted } });
  revalidatePath("/");
}

export async function deleteTodo(id: number) {
  await db.todo.delete({ where: { id } });
  revalidatePath("/");
}
