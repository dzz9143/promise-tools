import withCache from '../src/withCache';
import sleep from '../src/sleep';

describe('withCache should', () => {
    it('be able to cache the promise returned by async function', async () => {
        const func = jest.fn();
        func.mockResolvedValueOnce('foo');

        const f = withCache(func, () => 'dummy', 1000);
        for (let i = 0; i < 10; i++) {
            const data = await f();
            expect(data).toEqual('foo');
        }
        expect(func.mock.calls.length).toEqual(1);
        await sleep(1200);
        await f();
        expect(func.mock.calls.length).toEqual(2);
    });

    it('be able to use getKey function to create different cache entry', async () => {
        const func = jest.fn();
        func.mockImplementation((x) => Promise.resolve(x));
        const getKey = (key) => key;
        const f = withCache(func, getKey, 1000);
        let rt = await f(10);
        expect(rt).toEqual(10);
        await f(10);
        await f(10);
        rt = await f(100);
        await f(100);
        await f(100);
        expect(rt).toEqual(100);
        expect(func.mock.calls.length).toEqual(2);
    });
});
