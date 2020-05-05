import { createError } from './utils';
import { AsyncFunction, ResolveType } from './types';

function withTimeout<T extends AsyncFunction>(func: T, timeout: number) {
    return (...args: Parameters<T>): Promise<ResolveType<T>> => {
        const rejectOnTimeout = new Promise<ResolveType<T>>((_, reject) =>
            setTimeout(() => reject(createError('ExecutionTimeoutError', 'execution timeout')), timeout),
        );
        const execution = func(...args);
        return Promise.race([rejectOnTimeout, execution]);
    };
}

export default withTimeout;
