import withCache from '../src/withCache';
import sleep from '../src/sleep';

const func = (key: string) => Promise.resolve(`key: ${key}, at ${Date.now()}`);

const f = withCache(func, (key) => key, 1000);

// call the function with key `foo` multiple times in 1000ms
// the resolved data will be the same because the whole promise is cached
f('foo').then((data) => {
    console.log('data:', data);
});

f('foo').then((data) => {
    console.log('data:', data);
});

// call the function with key `foo` after 1000ms(ttl)
// the resolved data is changed because the previous cache is outdated
sleep(1200)
    .then(() => f('foo'))
    .then((data) => {
        console.log('data:', data);
    });

// call the function with a different key `bar`
// the resolved data is different because the getKey function makes it a different cache entry
sleep(500)
    .then(() => f('bar'))
    .then((data) => {
        console.log('data:', data);
    });
