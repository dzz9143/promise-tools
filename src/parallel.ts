import { constant } from "./utils";

interface ParallelOptions {
    concurrency?: number;
    onSuccess?: any;
    onError?: any;
}

interface ParallelResult {
    finished: number;
    failed: number;
}

type AsyncFunction = () => Promise<any>;

const defaults: ParallelOptions = {
    concurrency: 10,
    onSuccess: constant,
    onError: constant,
};

export default function parallel(fns: AsyncFunction[], options: ParallelOptions): Promise<ParallelResult> {
    let idx = 0;
    let finished = 0;
    let failed = 0;
    let running = 0;
    const opts = Object.assign({}, defaults, options);
    const len = fns.length;

    return new Promise((resolve) => {
        const nextBatch = () => {
            if (finished + failed >= len) {
                return resolve({
                    finished,
                    failed,
                });
            }

            while (running < opts.concurrency && idx < len) {
                running++;
                const fn = fns[idx++];
                fn().then(data => {
                    finished++;
                    return opts.onSuccess.call(null, data);
                }, err => {
                    failed++;
                    return opts.onError.call(null, err);
                }).catch(constant /* swallow the possible error to avoid affect other running task*/).finally(() => {
                    running--;
                    nextBatch();
                });
            }
        };
        nextBatch();
    });
}