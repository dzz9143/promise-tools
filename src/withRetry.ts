import { createError } from "./utils";
import { AsyncFunction, ResolveType } from "./types";

export type RetryOptions = {
    timeout?: number;
    limit?: number;
}

const defaultOptions = {
    timeout: 100,
    limit: 10,
};

function withRetry<T extends AsyncFunction>(
    func: T,
    predicate: (err: any, data: ResolveType<T>) => boolean,
    opts: RetryOptions = {},
): (...funcArgs: Parameters<T>) => Promise<ResolveType<T>> {
    const options = Object.assign({}, defaultOptions, opts);

    if (isNaN(options.limit) || options.limit <= 0) {
        throw createError("InvalidRetryOptions", "withRetry options.limit must greater than 0");
    }

    if (isNaN(options.timeout) || options.timeout < 0) {
        throw createError("InvalidRetryOptions", "withRetry options.timeout must greater than or equal to 0 ms");
    }

    return (...args: Parameters<T>): Promise<ResolveType<T>> => {
        return new Promise<ResolveType<T>>((resolve, reject) => {
            const process = (
                err: any,
                data: ResolveType<T>,
                count: number,
                fire: (count: number) => any,
            ) => {
                if (predicate(err, data)) {
                    return count < options.limit
                        ? setTimeout(() => fire(count + 1), options.timeout)
                        : reject(createError("RetryLimitExceedError", "fail after retry"));
                }
                err ? reject(err) : resolve(data);
            };

            const fire = (count: number) => {
                func(...args)
                    .then(data => process(null, data, count, fire))
                    .catch(err => process(err, null, count, fire));
            };

            fire(0);
        });
    };
}

export default withRetry;