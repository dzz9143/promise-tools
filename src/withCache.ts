import { AsyncFunction, ResolveType } from './types';

type CacheEntry<T> = {
    rt: T;
    createdAt: number;
};

function withCache<T extends AsyncFunction>(func: T, getKey: (...args: Parameters<T>) => string, ttl: number) {
    const _cache = new Map<string, CacheEntry<Promise<ResolveType<T>>>>();

    return (...args: Parameters<T>): Promise<ResolveType<T>> => {
        const key = getKey(...args);
        const ent = _cache.get(key);

        if (ent && Date.now() - ent.createdAt <= ttl) {
            // cache exists and is valid
            return ent.rt;
        }

        const rt = func(...args);
        _cache.set(key, {
            rt,
            createdAt: Date.now(),
        });

        return rt;
    };
}

export default withCache;
