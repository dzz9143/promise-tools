/**
 * normalize promise result
 * avoid usage of try catch which makes error handling easier and code more readable
 *  
 * usage:
 * 
 * for promse `p`:
 * 
 * instead of
 * try {
 *  const data = await p;
 *  // process with data
 * } catch(err) {
 *  // process with err
 * }
 * 
 * np can avoid try catch by:
 * 
 * const [err, data] = await np(p);
 * if(err) {
 *    // process with err
 * }
 * 
 * // process with data
 */
export default function normalizePromise<T>(p: Promise<T>) {
    return p.then(data => {
        return [null, data];
    }).catch(err => {
        return [err, null];
    });
}
