import type postgres from "postgres";
import { buildWhere } from "./query-builder";
import type { Repository } from "./client";

export class QueryChain<TRow extends Record<string, unknown>> {
  private whereClause?: Partial<TRow>;
  
  constructor(
    private sql: postgres.Sql,
    private table: string,
    private validateData: (data: any) => void
  ) {}

  where(args: Partial<TRow>): this {
    this.whereClause = { ...this.whereClause, ...args };
    return this;
  }

  async findMany(): Promise<TRow[]> {
    const whereStr = buildWhere(this.sql, this.whereClause);
    return await this.sql`
      SELECT * FROM ${this.sql(this.table)}
      ${whereStr}
    `;
  }

  async findUnique(): Promise<TRow | null> {
    const whereStr = buildWhere(this.sql, this.whereClause);
    const rows = await this.sql`
      SELECT * FROM ${this.sql(this.table)}
      ${whereStr}
      LIMIT 1
    `;
    return rows.length > 0 ? (rows[0] as TRow) : null;
  }

  async update(data: Partial<TRow>): Promise<TRow> {
    this.validateData(data);
    const whereStr = buildWhere(this.sql, this.whereClause);
    const rows = await this.sql`
      UPDATE ${this.sql(this.table)}
      SET ${this.sql(data as any)}
      ${whereStr}
      RETURNING *
    `;
    return rows[0] as TRow;
  }

  async delete(): Promise<TRow> {
    const whereStr = buildWhere(this.sql, this.whereClause);
    const rows = await this.sql`
      DELETE FROM ${this.sql(this.table)}
      ${whereStr}
      RETURNING *
    `;
    return rows[0] as TRow;
  }
}
