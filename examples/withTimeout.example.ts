import withTimeout from '../src/withTimeout';
import sleep from '../src/sleep';

const func = async () => {
    await sleep(3000);
    return 'hello';
};

const f1 = withTimeout(func, 1000);
let startTs = Date.now();
f1()
    .then((data) => {
        console.log(`f1 data after ${Date.now() - startTs} ms:`, data);
    })
    .catch((err) => {
        console.error(`f1 error after ${Date.now() - startTs} ms:`, err);
    });

const f2 = withTimeout(func, 5000);
startTs = Date.now();
f2()
    .then((data) => {
        console.log(`f2 data after ${Date.now() - startTs} ms:`, data);
    })
    .catch((err) => {
        console.error(`f2 error after ${Date.now() - startTs} ms:`, err);
    });
