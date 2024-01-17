export type Result<T, E extends string> =
  | { ok: true; data: T }
  | { ok: false; error: E };

export interface Safe<E extends string> {
  ok<T>(data: T): Result<T, never>;
  ok(): Result<undefined, never>;
  fail(error: E): Result<never, E>;
}

export function safe<E extends string>(): Safe<E> {
  function ok<T>(data?: T): Result<T, never> | Result<undefined, never> {
    return { ok: true, data: data as T };
  }
  return {
    ok,
    fail: (error: E) => ({ ok: false, error }),
  };
}

