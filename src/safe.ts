import { configDotenv } from "dotenv";

export interface Logger {
  error(...args: string[]): void;
  info(...args: string[]): void;
  log(...args: string[]): void;
}

export type Result<T, E extends string> =
  | { ok: true; data: T }
  | { ok: false; error: E };

export interface Safe<E extends string> {
  ok<T>(data: T): Result<T, never>;
  ok(): Result<undefined, never>;
  fail(error: E): Result<never, E>;
}

export function safe<E extends string>(
  { logger }: { logger: Logger } = { logger: console },
): Safe<E> {
  configDotenv();

  function ok<T>(data?: T): Result<T, never> | Result<undefined, never> {
    return { ok: true, data: data as T };
  }

  return {
    ok,
    fail: (error: E) => {
      if (process.env.DEBUG === "1") {
        logger.error(error);
      }

      return { ok: false, error };
    },
  };
}
