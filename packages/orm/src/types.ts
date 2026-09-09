import type { ColumnDefinition, ModelDefinition } from "./schema";

export type InferColumnType<C> = C extends ColumnDefinition<infer T, any> ? T : never;

export type InferRow<M> = M extends ModelDefinition<string, infer Shape>
  ? { [K in keyof Shape]: InferColumnType<Shape[K]> }
  : never;

export type InsertInput<M> = M extends ModelDefinition<string, infer Shape>
  ? Omit<InferRow<M>, "id"> & Partial<Pick<InferRow<M>, "id" & keyof Shape>>
  : never;
