export type Result<T, E extends Error> =
  | { ok: true; data: T }
  | { ok: false; error: E };
