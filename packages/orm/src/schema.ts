export interface ColumnDefinition<T, TMeta extends { hasDefault?: boolean; [key: string]: any } = {}> {
  readonly _type: T;
  readonly sqlType: "integer" | "text" | "boolean" | "timestamp";
  readonly hasDefault?: TMeta["hasDefault"];
  validate(value: unknown): boolean;
}

export function primaryKey<T extends ColumnDefinition<any>>(
  column: T
): T & { hasDefault: true } {
  return {
    ...column,
    hasDefault: true,
  };
}

export function number(): ColumnDefinition<number> {
  return {
    _type: undefined as any,
    sqlType: "integer",
    validate: (value) => typeof value === "number" && !isNaN(value),
  };
}

export function timestamp(): ColumnDefinition<Date> {
  return {
    _type: undefined as any,
    sqlType: "timestamp",
    validate: (value) => value instanceof Date,
  };
}

export function belongsTo<TModelName extends string>(model: TModelName): ColumnDefinition<number, { relation: "belongsTo", target: TModelName }> {
  return {
    _type: undefined as any,
    sqlType: "integer" as any,
    validate: (value) => typeof value === "number" && !isNaN(value),
  };
}

export function hasMany<TModelName extends string>(model: TModelName): ColumnDefinition<any[], { relation: "hasMany", target: TModelName }> {
  return {
    _type: undefined as any,
    sqlType: "integer" as any, // Dummy type for TS inference, not used in SQL
    validate: (value) => true,
  };
}

export function string(): ColumnDefinition<string> {
  return {
    _type: undefined as any,
    sqlType: "text",
    validate: (value) => typeof value === "string",
  };
}

export function boolean(): ColumnDefinition<boolean> {
  return {
    _type: undefined as any,
    sqlType: "boolean",
    validate: (value) => typeof value === "boolean",
  };
}

export interface ModelDefinition<TName extends string, TShape extends Record<string, ColumnDefinition<unknown, any>>> {
  readonly name: TName;
  readonly shape: TShape;
}

export function defineModel<TName extends string, TShape extends Record<string, ColumnDefinition<unknown, any>>>(
  name: TName,
  shape: TShape
): ModelDefinition<TName, TShape> {
  return {
    name,
    shape,
  };
}
