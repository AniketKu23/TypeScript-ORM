import postgres from "postgres";

export function createSql(connectionString: string) {
  // We configure { prepare: false } for compatibility with serverless Postgres poolers
  // like Neon and Supabase in transaction-pooling mode. pgbouncer-style transaction
  // pooling does not support prepared statements.
  return postgres(connectionString, {
    ssl: "require",
    prepare: false,
  });
}
