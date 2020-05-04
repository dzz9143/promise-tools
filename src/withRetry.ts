export type RetryOptions = {
    timeout?: number;
    limit?: number;
}

function createError(name: string, message: string): Error {
    const err = new Error(message);
    err.name = name;
    return err;
}

const defaultOptions = {
    timeout: 100,
    limit: 10,
};

function withRetry<T extends (...args: any[]) => any>(
    func: T,
    predicate: (err: any, data: ReturnType<T> extends Promise<infer U> ? U : ReturnType<T>) => boolean,
    opts: RetryOptions = {},
): (...funcArgs: Parameters<T>) => ReturnType<T> extends Promise<infer U> ? Promise<U> : Promise<ReturnType<T>> {
    const options = Object.assign({}, defaultOptions, opts);

    if (isNaN(options.limit) || options.limit <= 0) {
        throw createError("InvalidRetryOptions", "withRetry options.limit must greater than 0");
    }

    if (isNaN(options.timeout) || options.timeout < 0) {
        throw createError("InvalidRetryOptions", "withRetry options.timeout must greater than or equal to 0 ms");
    }

    return (...args: Parameters<T>): ReturnType<T> extends Promise<infer U> ? Promise<U> : Promise<ReturnType<T>> => {
        return new Promise((resolve, reject) => {
            const process = (
                err: any,
                data: ReturnType<T> extends Promise<infer U> ? U : ReturnType<T>,
                count: number,
                fire: (count: number) => any,
            ) => {
                if (predicate(err, data)) {
                    return count < options.limit ? setTimeout(() => fire(count + 1), options.timeout) : reject(createError("RetryFailed", "fail after retry"));
                }
                err ? reject(err) : resolve(data);
            };

            const fire = (count: number) => {
                Promise.resolve()
                    .then(() => func(...args))
                    .then(data => process(null, data, count, fire))
                    .catch(err => process(err, null, count, fire));
            };

            fire(0);
        }) as ReturnType<T> extends Promise<infer U> ? Promise<U> : Promise<ReturnType<T>>;
    };
}

export default withRetry;