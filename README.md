# catcher

A library to help save people from try-catch hell. 

## Example

Imagine you have a function with a return that depends on two fallible operations.

Here's how you'd use `catcher` to manage this.

```ts
import { catcher } from "catcher";

function faillibleOperation() {
  return "hello world";
}

function fallibleAsyncOperation(data: string) {
  return Promise.resolve("hello world");
}

async function getTwoResultsExample() {
  const result1 = catcher(faillibleOperation, new Error("failed"));
  if (!result1.ok) {
    return result1.error; // handle first error here
  }

  const result2 = await catcher(() => fallibleAsyncOperation(result1.data), new Error("failed"));
  if (!result2.ok) {
    return result2.error; // handle second error here
  }

  return [result1, result2];
} // inferred return type is Promise<Result<[Result<string, Error>, Result<string, Error>], Error>>
```

As opposed to this:
```ts
async function getTwoResultsWithoutCatcher() {
  try {
    const result1 = faillibleOperation(); // try can fail here
    const result2 = await fallibleAsyncOperation(result1); // or here
    return [result1, result2];
  } catch (e) {
    return e; // so we can't handle the error differently for each operation
  }
} // inferred return type is Promise<unknown>

// or this:

async function getTwoResultsWithoutCatcherTwo() {
  try {
    const result1 = faillibleOperation(); // try can fail here
    try {
      const result2 = await fallibleAsyncOperation(result1); // or here
      return [result1, result2];
    } catch (e) {
      return e; // handle second error here
    }
  } catch (e) {
    return e; // handle first error here
  }
} // inferred return type is Promise<unknown>
```

The `catcher` has couple benefits:
* It has better type inferrence for the parent function
* It allows you to specifically handle as many fallible operations as you need without deeply nested try-catch.  

