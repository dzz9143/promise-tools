// a queue to run async function sequentially and concurrently
// an easy way to process a lot of async functions with control of concurrency

interface QueueOptions {
    concurrency: number;
    onFinish: any; 
    onError: any;
}

export default function queue(arrOfFns: any, options: QueueOptions) {
    let idx = 0;
    let finished = 0;
    let failed = 0;
    let running = 0;
    const len = arrOfFns.length;
    return new Promise((resolve) => {
        const nextBatch = () => {
            while (running < options.concurrency && idx < len) {
                const fn = arrOfFns[idx++];
                running++;
                fn().then((data: any) => {
                    finished++;
                    running--;
                    options.onFinish.call(null, data);
                }).catch((err: any) => {
                    failed++;
                    running--;
                    options.onError.call(null, err);
                });
            }
    
            if(finished + failed === len) {
                return resolve();
            }
        };
        nextBatch();
    });
}