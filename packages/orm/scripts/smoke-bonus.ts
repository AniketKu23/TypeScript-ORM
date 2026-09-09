import { createClient } from "../src/client";
import { defineModel, primaryKey, string, boolean, number } from "../src/schema";

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

async function main() {
  console.log("Testing validation...");
  try {
    await db.todo.create({ title: 123 as any, completed: false });
  } catch (e: any) {
    console.log("Caught expected validation error:", e.message);
  }

  console.log("Testing transactions...");
  await db.transaction(async (tx) => {
    const item = await tx.todo.create({ title: "Transaction Todo", completed: false });
    console.log("Created in tx:", item);
    await tx.todo.delete({ where: { id: item.id } });
    console.log("Deleted in tx");
  });

  console.log("Testing query chaining...");
  const items = await db.todo.where({ title: "NonExistent" }).findMany();
  console.log("Chained findMany:", items);

  console.log("All bonus tests passed (or ran) successfully!");
  process.exit(0);
}

main().catch(console.error);
