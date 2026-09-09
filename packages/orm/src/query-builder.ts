import type { Sql } from "postgres";

export function buildWhere(sql: Sql, where?: Record<string, any>) {
  if (!where) return sql``;
  
  const entries = Object.entries(where).filter(([_, v]) => v !== undefined);
  if (entries.length === 0) return sql``;

  return entries.reduce((acc, [key, value], index) => {
    if (index === 0) {
      return sql`WHERE ${sql(key)} = ${value}`;
    }
    return sql`${acc} AND ${sql(key)} = ${value}`;
  }, sql``);
}
