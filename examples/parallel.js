const { parallel } = require('../');

const fn1 = () => Promise.resolve(1);

const fn2 = () => Promise.resolve(2);

const fn3 = () => Promise.reject(new Error('bad'));

parallel([fn1, fn2, fn3]).then(res => {
    console.log('res:', res);   // finished: 2, failed: 1
});

parallel([fn1, fn2, fn3], { concurrency: 1 }).then(res => {
    console.log('res:', res);   // finished: 2, failed: 1
});

const data = [];
const err = [];
parallel([fn1, fn2, fn3], {
    concurrency: 1,
    onSuccess: (v) =>{
        data.push(v);
    },
    onError: (e) => {
        err.push(e);
    },
}).then(() => {
    console.log('data:', data); // [1, 2]
    console.log('err:', err);   // [ { Error: bad } ]
});