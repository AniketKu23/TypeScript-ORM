import { createClient, defineModel, primaryKey, string, boolean, number } from "@light-orm/core";

const Todo = defineModel("todo", {
  id: primaryKey(number()),
  title: string(),
  completed: boolean(),
});

const db = createClient({
  todo: Todo,
}, {
  connectionString: process.env.DATABASE_URL!,
});

async function run() {
  console.log("Adding a task...");
  const task = await db.todo.create({ title: "Test Todo for UI", completed: false });
  console.log("Task added:", task);

  console.log("Listing tasks...");
  const tasks1 = await db.todo.findMany();
  console.log(tasks1);

  console.log("Toggling task...");
  // Simulate the action
  await db.todo.update({ where: { id: task.id }, data: { completed: !task.completed } });
  
  console.log("Listing completed tasks...");
  const tasks2 = await db.todo.findMany({ where: { completed: true } });
  console.log(tasks2);

  console.log("Cleaning up...");
  await db.todo.delete({ where: { id: task.id } });

  console.log("Test passed!");
  process.exit(0);
}

run().catch(console.error);
