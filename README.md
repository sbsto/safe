# catcher

A library to help save people from try-catch hell. 

## Example

Imagine you have a function with a return that depends on two fallible operations.

Here's how you'd use `catcher` to manage this.

```ts
import { catcher } from "catcher";

function fallibleOperation() {
  return "hello world";
}

function fallibleAsyncOperation(data: string) {
  return Promise.resolve("hello world");
}

async function getTwoResultsExample() {
  const result1 = catcher(fallibleOperation);
  if (!result1.ok) {
    return result1.error; // handle first error here
  }

  const result2 = await catcher(() => fallibleAsyncOperation(result1.data));
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
    const result1 = fallibleOperation(); // try can fail here
    const result2 = await fallibleAsyncOperation(result1); // or here
    return [result1, result2];
  } catch (e) {
    return e; // so we can't handle the error differently for each operation
  }
} // inferred return type is Promise<unknown>

// or this:

async function getTwoResultsWithoutCatcherTwo() {
  try {
    const result1 = fallibleOperation(); // try can fail here
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

## Safes

In typescript, it can be difficult to manage handling different types of error. For example, you might want to handle an `IncorrectPassword` error differently to a `UserNotFound` error. 

```ts
enum SignInError {
    IncorrectPassword = "IncorrectPassword",
    UserNotFound = "UserNotFound"
}

const signInSafe = safe<SignInError>();

async function signIn(email: string, password: string) => {
    const user = await db.select(user).where({ email: "someone@something.com" });
    if (!user) {
        return signInSafe.fail(SignInError.UserNotFound);
    }

    if (user.passwordHash !== hashPassword(password)) {
        return signInSafe.fail(SignInError.IncorrectPassword);
    }

    return userSafe.ok(input);
};

// Then, we can handle these accordingly & type-safely, e.g. in a route handler
export const handler = (req: Request) => {
    const signInResult = await signIn(req.body.email, req.body.password);
    
    // First, we check if it's OK
    if (signInResult.ok) {
        return redirect('/dashboard');
    }


    // Then, we know it's one of two errors
    if (signInResult.error === SignInError.UserNotFound) {
        return redirect('signup');
    }

    // Here, we know they entered the wrong password
    return response(403);
}
```

The above is probably bad security. But you get the idea. This might seem trivial here (it probably wouldn't be so bad to just do with with functions, e.g. trying to find the user, doing something if that fails, then verifying the password, doing something if that fails, otherwise continuing. But I like to encapsulate all of that in the parent function, without giving up a type-safe way to handle each error variant. This also becomes useful when you r errors can propogate through many functions (e.g. a parent's safe can account for the error types from multiple children's safes). 
