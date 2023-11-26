import { Result } from "./types";

// Overloads
export function catcher<T, E extends Error>(
  op: () => Promise<T>,
  errorOnFailure: E,
): Promise<Result<T, E>>;

export function catcher<T, E extends Error>(
  op: () => T,
  errorOnFailure: E,
): Result<T, E>;

/**
 * Executes a function and handles the result or potential error. Depending on the options provided,
 * it can return an `Option` or `Result` type. If the operation fails, an error is logged and
 * the failure is handled based on the provided options.
 */
export function catcher<T, E extends Error>(
  op: () => T | Promise<T>,
  errorOnFailure: E,
) {
  try {
    const result = op();

    if (result instanceof Promise) {
      return result.then(
        (asyncResult) => ok(asyncResult),
        () => fail(errorOnFailure),
      );
    }

    return ok(result);
  } catch (e) {
    return fail(errorOnFailure);
  }
}

function ok<T>(data: T): Result<T, never> {
  return { ok: true, data };
}

function fail<E extends Error>(error: E): Result<never, E> {
  return { ok: false, error };
}


