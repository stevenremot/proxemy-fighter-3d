/**
 * @description
 * Execute all callbacks, passing them args as arguments.
 *
 * @param {Function[]} callbacks
 * @param {...Any}     args
 */
export function execCallbacks(callbacks, ...args) {
    for (let callback of callbacks) {
        callback(...args);
    }
}
