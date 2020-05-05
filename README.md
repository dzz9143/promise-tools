## Promise Tools
A set of helper and high order functions to simplify the use of promise and async function.

It contains:
1. `np` - normalize the return of promise and avoid try_catch block
2. `sleep` - a promise version of setTimeout, used to delay operation
3. `parallel` - run a collection of async function in parallel with fine
 control over concurrency
4. `withCache` - a high order function which implements `promise cache` pattern, 


## np(promise): Promise&lt;NormalizedResult&gt;
* `promise` - [Promise] a promise or promise like(thenable)
* `NormalizedResult` - [Array] a normalized result which is a two elements array `[reason: any, data: T]`
    * `reason` - [any] first element of array is the possible rejected value
    * `data` - [T] second element of array is the possible resolved value
* Returns: Promise&lt;NormalizedResult&gt;

np let you handle promise error in a clean way, which results in a more readable code.

Instead of using `try_catch` block: 
```javascript
async function do() {
    try {
        const data = await aProimse;
        // process with data
    } catch(err) {
        // process with err
    }

}
```

You can do it like this:
```javascript
async function do() {
    const [err, data] = await np(aPromise);
    if(err) {
        // prcoess with error
    } 

    // prcoess with data
}
```

## sleep(ms):Promise&lt;void&gt;
* ms - [Number] number of millisecond to sleep

`sleep` is a promisified setTimeout which can be used to delay some operations

```javascript
async function do() {
    await sleep(2000);

    // do something after 2000ms
}
```

## withCache(asyncFunc, getKey, ttl) => asyncFuncWithCache
A high order function to give an async function ability to cache the returned promise.

Instead of caching the resolved value of promise, this function will cache the whole promise returned by the async function.

### Arguments
* `asyncFunc` - [Function] The original async function
* `getKey` - [Function] The function to determine cache key
* `ttl` - [Number] Time-to-live in millisecond for cache entry

### Return 
* `asyncFuncWithCache` - [Function] The decorated function with the ability to cache returned promise based on certain strategy

### Example
```typescript
import fetch from "node-fetch";

const fetchWithCache = withCache(fetch, (url) => url, 3000);

/**
 * Instead of firing 1000 requests, this function will only fire one request.
 * Only the very first function call will trigger the request and the promise returned by the first call will be cached,
 * Each subsequential call will get the cached promise as long as the cache is not outdated 
 */
for(let i = 0; i < 1000; i++) {
    fetchWitchCache('http://localhost:3000/api/v1/users')
    .then(resp => {
        console.log('resp:', resp);
    });
}

```

## withTimeout(asyncFunc, timeout) => asyncFuncWithTimeout
A high order function to give an async function ability to throw an error if execution time exceed certain millisecond.

### Arguments
* `asyncFunc` - [Function] The original async function.
* `timeout` - [Function] Execution timeout in milliseconds.

### Return
* `asyncFuncWithRetry` - [Function] The decorated function with the ability to throw if execution time exceed certain timeout

### Example
```javascript
/*
 * Example: fetch the resource but throw an error if its execution time is greater than 1000ms
 */
import fetch from "node-fetch";

const fetchWithTimeout = withTimeout(fetch, 1000);

fetchWithTimeout("http://localhost:3000/api/v1/users")
    .then(resp => {
        console.log("resp:", resp);
    }).catch(err => {
        console.error("error:", err);
    });

```

## withRetry(asyncFunc, shouldRetry, retryOptions) => asyncFuncWithRetry
A high order function to give an async function ability to retry based on certain condition.

### Arguments
* `asyncFunc` - [Function] The original async function.
* `shouldRetry` - [Function] A predicte function to determine in which condition `asyncFunc` will retry. 
```javascript
// example: retry if asyncFunc rejects with an error
// shouldRetry is an error first function, the first argument is the rejected reason, and the second arg is the resolved value from asyncFunc
// will retry if this function return true
function shouldRetry(err, value) {
    if(err) {
        return true;
    }

    return false;
}
```
* `retryOptions` - [Object] 
  * `limit` - [Number] Retry limit, how many times should it retry based on the predicate. Default: 10.
  * `timeout` - [Number] Retry timeout in ms, specify 0 to disable timeout. Default: 100ms.

### Return Value
* `asyncFuncWithRetry` - [Function] The decorated function with the ability to auto retry based on predicate, note this function will return a promise

### Example:
Give `fetch` the ability to retry if it reject with `ECONNREFUSED` error

```javascript
import fetch from "node-fetch";

const predicate = (err) => {
    console.warn("fail to fetch:", err.name, err.message);
    return err && err.code === "ECONNREFUSED";
};

const fetchWithRetry = withRetry(fetch, predicate, { limit: 3, timeout: 1000 });

fetchWithRetry("http://localhost:3000/api/v1/users")
    .then(resp => {
        console.log("resp:", resp);
    }).catch(err => {
        console.error("error:", err);
    });
```


## parallel (asyncFnArray[, options]): Promise&lt;ParallelResult&gt;
* `asyncFnArray` - [Array] collection of async functions to run
* `options` - [Object]
    * `concurrency` - [Number] specifies concurrency limit, default to 10
    * `onSuccess` - [Function] optional, callback function to run after each async function resolve
    * `onError` - [Function], optional, callback function to run after each async function reject
* `ParallelResult`:
    * `finished` - [Number] number of finished resolved async function
    * `failed` - [Number] number of failed rejected async function
* Returns: Promise&lt;ParallelResult&gt;

Run a set of async functions in parallel with fine control over concurrency limit and reject/resolve hook.

example:
```javascript

parallel([asyncFn1, asyncFn2, asyncFn3], {
    concurrency: 2,
}).then(res => {
    console.log(res)    // { finsihed: 3,  failed: 0 }
});
```