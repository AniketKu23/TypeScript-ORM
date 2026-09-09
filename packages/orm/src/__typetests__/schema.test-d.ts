import { defineModel, number, string, boolean } from "../schema";
import { createClient } from "../client";

const User = defineModel("user", {
  id: number(),
  name: string(),
  isActive: boolean(),
});

const schema = { user: User };
const db = createClient(schema, { connectionString: "dummy" });

// Accessing a non-existent field in where fails
// @ts-expect-error
db.user.findMany({ where: { notAField: "test" } });

// Passing the wrong primitive type for a field fails
// @ts-expect-error
db.user.update({ where: { id: 1 }, data: { name: 123 } });

// Omitting a required (non-id) field from create() fails
// @ts-expect-error
db.user.create({ isActive: true });

// Valid usages that should compile correctly
db.user.create({ name: "Alice", isActive: true }); // id omitted (valid)
db.user.create({ id: 1, name: "Bob", isActive: false }); // id provided (valid)
db.user.findMany({ where: { id: 1, name: "Alice" } });
db.user.update({ where: { id: 1 }, data: { isActive: true } });
