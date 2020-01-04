## Promise Tools
A set of helper and high order functions to simplify the use of promise and async function.

It contains:
1. `np` - normalize the return of promise and avoid try_catch block
2. `sleep` - a promise version of setTimeout, used to delay operation
3. `parallel` - run a collection of async function in parallel with fine control over concurrency


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

## sleep(ms):Promise&lt;void&gt;
* ms - [Number] number of millisecond to sleep

`sleep` is a promisified setTimeout which can be used to delay some operations

```javascript
async function do() {
    await sleep(2000);

    // do something after 2000ms
}
```
