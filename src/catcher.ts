import { Result } from "./types";

// Overloads
export function catcher<T>(op: () => Promise<T>): Promise<Result<T, Error>>;

export function catcher<T>(op: () => T): Result<T, Error>;

/**
 * Executes a function and handles the result or potential error. Depending on the options provided,
 * it can return an `Option` or `Result` type. If the operation fails, an error is logged and
 * the failure is handled based on the provided options.
 */
export function catcher<T>(op: () => T | Promise<T>) {
  try {
    const result = op();

    if (result instanceof Promise) {
      return result.then((asyncResult) => ok(asyncResult), fail);
    }

    return ok(result);
  } catch (e) {
    if (e instanceof Error) {
      return fail(e);
    }

    return fail(new Error(`Unknown error: ${JSON.stringify(e)}`));
  }
}

function ok<T>(data: T): Result<T, never> {
  return { ok: true, data };
}

function fail(error: Error): Result<never, Error> {
  return { ok: false, error };
}
