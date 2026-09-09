import type postgres from "postgres";
import type { ModelDefinition } from "./schema";
import type { InferRow } from "./types";
import { createSql } from "./sql";
import { buildWhere } from "./query-builder";
import { QueryChain } from "./chaining";

export class ValidationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "ValidationError";
  }
}

export interface Repository<TRow extends Record<string, unknown>> {
  create(data: Omit<TRow, "id"> & Partial<Pick<TRow, "id" extends keyof TRow ? "id" : never>>): Promise<TRow>;
  findMany(args?: { where?: Partial<TRow> }): Promise<TRow[]>;
  findUnique(args: { where: Partial<TRow> }): Promise<TRow | null>;
  update(args: { where: Partial<TRow>; data: Partial<TRow> }): Promise<TRow>;
  delete(args: { where: Partial<TRow> }): Promise<TRow>;
  where(args: Partial<TRow>): QueryChain<TRow>;
}

export type Client<TSchema extends Record<string, ModelDefinition<string, any>>> = {
  [K in keyof TSchema]: Repository<InferRow<TSchema[K]>>;
} & {
  transaction<T>(callback: (tx: Client<TSchema>) => Promise<T>): Promise<T>;
};

export function createClient<TSchema extends Record<string, ModelDefinition<string, any>>>(
  schema: TSchema,
  options: { connectionString: string }
): Client<TSchema> {
  const rootSql = createSql(options.connectionString);

  function buildClient(sqlInstance: any) {
    const client: any = {}; // Internal implementation: mapping untyped proxies to strictly typed public interface
    
    for (const key of Object.keys(schema)) {
      const model = schema[key]!;
      const table = model.name;

      const validateData = (data: any) => {
        for (const col of Object.keys(data)) {
          if (model.shape[col]) {
            if (!model.shape[col].validate(data[col])) {
              throw new ValidationError(`Invalid value for column "${col}" in table "${table}"`);
            }
          }
        }
      };

      client[key] = {
        create: async (data: any) => {
          validateData(data);
          const rows = await sqlInstance`
            INSERT INTO ${sqlInstance(table)} ${sqlInstance(data)}
            RETURNING *
          `;
          return rows[0];
        },
        findMany: async (args?: any) => {
          const whereClause = buildWhere(sqlInstance, args?.where);
          return await sqlInstance`
            SELECT * FROM ${sqlInstance(table)}
            ${whereClause}
          `;
        },
        findUnique: async (args: any) => {
          const whereClause = buildWhere(sqlInstance, args?.where);
          const rows = await sqlInstance`
            SELECT * FROM ${sqlInstance(table)}
            ${whereClause}
            LIMIT 1
          `;
          return rows.length > 0 ? rows[0] : null;
        },
        update: async (args: any) => {
          validateData(args.data);
          const whereClause = buildWhere(sqlInstance, args?.where);
          const rows = await sqlInstance`
            UPDATE ${sqlInstance(table)}
            SET ${sqlInstance(args.data)}
            ${whereClause}
            RETURNING *
          `;
          return rows[0];
        },
        delete: async (args: any) => {
          const whereClause = buildWhere(sqlInstance, args?.where);
          const rows = await sqlInstance`
            DELETE FROM ${sqlInstance(table)}
            ${whereClause}
            RETURNING *
          `;
          return rows[0];
        },
        where: (args: any) => {
          return new QueryChain(sqlInstance, table, validateData).where(args);
        }
      };
    }
    
    client.transaction = async <T>(callback: (tx: Client<TSchema>) => Promise<T>): Promise<T> => {
      // In postgres.js, calling .begin on a transaction connection is supported (nested transactions).
      const res = await sqlInstance.begin(async (txSql: any) => {
        const txClient = buildClient(txSql);
        return await callback(txClient);
      });
      return res as unknown as T;
    };

    return client;
  }

  return buildClient(rootSql);
}


