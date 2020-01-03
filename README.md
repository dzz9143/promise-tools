## Promise Tools
A set of helper and high order functions to simplify the use of promise and async function.

It contains:
1. np - normalize the return of promise and avoid try_catch block
2. sleep - a promise version of setTimeout, used to delay operation
3. parallel - a promise.all with a concurrent limit and a set of hooks


## np
`np` stands for `normalize promise` which is a function that receives a promise and return a normalized promise

It will handle the error `automatically` and normalize the resolved value.

When in async function, instead of handling promise in a `try catch` block, you can handle the possible error and data in a much more straight forward way, check the code sample below

`Without np`, when you await a promise, you will probably handle the promise error like this:
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

`With np`, you can do it like this:
```javascript
async function do() {
    const [err, data] = await np(aPromise);
    if(err) {
        // prcoess with error
    } 

    // prcoess with data
}
```

As you can see, you can get more control over error handling without messing your code


## sleep
`sleep` is a promisified setTimeout which can be used to delay some operations

```javascript
async function do() {
    await sleep(2000);

    // do something after 2000ms
}
```
