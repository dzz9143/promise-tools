const { np } = require('../');

async function asyncMain() {
    let err, data;
    const p1 = Promise.reject(new Error('something is wrong'));
    [err, data] = await np(p1);
    if (err) {
        console.log('err:', err.message);
    }

    const p2 = Promise.resolve(10);
    [err, data] = await np(p2);
    console.log('data:', data);
}

asyncMain();