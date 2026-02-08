export type UnknownRecord = Record<string, unknown>;

export const isRecord = (value: unknown): value is UnknownRecord => {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
};

export const asRecord = (value: unknown, context: string): UnknownRecord => {
  if (!isRecord(value)) {
    throw new Error(`${context}: expected object`);
  }
  return value;
};

export const pick = (obj: UnknownRecord, keys: string[]): unknown => {
  for (const key of keys) {
    if (key in obj) return obj[key];
  }
  return undefined;
};

export const asString = (value: unknown, context: string): string => {
  if (typeof value === 'string') return value;
  if (typeof value === 'number') return String(value);
  throw new Error(`${context}: expected string`);
};

export const asOptionalString = (value: unknown, context: string): string | undefined => {
  if (value === undefined || value === null) return undefined;
  return asString(value, context);
};

export const asNumber = (value: unknown, context: string): number => {
  if (typeof value === 'number' && !Number.isNaN(value)) return value;
  if (typeof value === 'string' && value.trim() !== '') {
    const parsed = Number(value);
    if (!Number.isNaN(parsed)) return parsed;
  }
  throw new Error(`${context}: expected number`);
};

export const asOptionalNumber = (value: unknown, context: string): number | undefined => {
  if (value === undefined || value === null) return undefined;
  return asNumber(value, context);
};

export const asBoolean = (value: unknown, context: string): boolean => {
  if (typeof value === 'boolean') return value;
  if (value === 1 || value === 0) return Boolean(value);
  if (value === 'true' || value === 'false') return value === 'true';
  throw new Error(`${context}: expected boolean`);
};

export const asOptionalBoolean = (value: unknown, context: string): boolean | undefined => {
  if (value === undefined || value === null) return undefined;
  return asBoolean(value, context);
};

export const asArray = (value: unknown, context: string): unknown[] => {
  if (Array.isArray(value)) return value;
  throw new Error(`${context}: expected array`);
};

export const asOptionalArray = (value: unknown, context: string): unknown[] | undefined => {
  if (value === undefined || value === null) return undefined;
  return asArray(value, context);
};

export const asEnum = <T extends string>(value: unknown, allowed: readonly T[], context: string): T => {
  if (typeof value === 'string' && (allowed as readonly string[]).includes(value)) {
    return value as T;
  }
  throw new Error(`${context}: expected ${allowed.join(' | ')}`);
};

export const asOptionalEnum = <T extends string>(
  value: unknown,
  allowed: readonly T[],
  context: string
): T | undefined => {
  if (value === undefined || value === null) return undefined;
  return asEnum(value, allowed, context);
};

