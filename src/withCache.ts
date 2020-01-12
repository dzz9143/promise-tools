
type AsyncFunction<T> = () => Promise<T>;

export default function withCache<T>(asyncFn: AsyncFunction<T>) {
    let cache: Promise<T>;
    return async function wrapped(...args: any[]) {
        if(cache) {
            return cache;
        }

        cache = asyncFn().finally(() => {
            cache = null;
        });
        return cache;
    }
}