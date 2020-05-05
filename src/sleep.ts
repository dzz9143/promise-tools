/**
 * sleep for certain millisecond
 * usage:
 *
 * sleep(1000).then(() => {
 *  doSomething();
 * });
 *
 * or
 *
 * async () => {
 *   await sleep(1000);
 *   doSomething();
 * }
 */

export default function sleep(ms: number) {
    return new Promise((resolve) => {
        setTimeout(resolve, ms);
    });
}
