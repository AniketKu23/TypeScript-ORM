import fs from "fs";
import postgres from "postgres";
import path from "path";

async function apply() {
  const sqlContent = fs.readFileSync(path.join(__dirname, "../../../apps/todo-app/db/schema.sql"), "utf-8");
  const sql = postgres(process.env.DATABASE_URL!, { ssl: "require", prepare: false });
  await sql.unsafe(sqlContent);
  console.log("Applied schema.sql successfully.");
  process.exit(0);
}

apply().catch(err => {
  console.error("Failed:", err);
  process.exit(1);
});
