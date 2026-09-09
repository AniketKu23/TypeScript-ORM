import { defineModel, number, string, boolean } from "../src/schema";
import { createClient } from "../src/client";

async function main() {
  const connectionString = process.env.DATABASE_URL;
  if (!connectionString) {
    console.error("Please set DATABASE_URL to run the smoke test.");
    process.exit(1);
  }

  const User = defineModel("smoke_users", {
    id: number(),
    name: string(),
    isActive: boolean(),
  });

  const db = createClient({ users: User }, { connectionString });

  try {
    // We assume the table doesn't exist, but postgres.js allows creating it via raw sql.
    // However, createClient doesn't expose the raw sql instance.
    // For smoke testing, we just try to execute CRUD assuming a table is created
    // or we'll create it via raw postgres.js here.
    
    // So let's import postgres directly to create the table
    const postgres = (await import("postgres")).default;
    const sql = postgres(connectionString, { ssl: "require", prepare: false });
    
    await sql`
      CREATE TABLE IF NOT EXISTS smoke_users (
        id SERIAL PRIMARY KEY,
        name TEXT NOT NULL,
        "isActive" BOOLEAN NOT NULL
      )
    `;
    
    // Create
    console.log("Testing CREATE...");
    const created = await db.users.create({ name: "Alice", isActive: true });
    console.log("Created:", created);

    // Find Many
    console.log("Testing FIND MANY...");
    const users = await db.users.findMany();
    console.log("All users:", users);

    // Find Unique
    console.log("Testing FIND UNIQUE...");
    const unique = await db.users.findUnique({ where: { id: created.id } });
    console.log("Unique user:", unique);

    // Update
    console.log("Testing UPDATE...");
    const updated = await db.users.update({ where: { id: created.id }, data: { isActive: false } });
    console.log("Updated:", updated);

    // Delete
    console.log("Testing DELETE...");
    const deleted = await db.users.delete({ where: { id: created.id } });
    console.log("Deleted:", deleted);

    await sql`DROP TABLE smoke_users`;
    console.log("Smoke test passed!");
    process.exit(0);
  } catch (err) {
    console.error("Smoke test failed:", err);
    process.exit(1);
  }
}

main();
