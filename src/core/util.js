/**
 * Copyright (C) 2015 Alexandre Kazmierowski, Steven Rémot
 * Licensed under the General Public License, see the file gpl.txt at the root for details.
 */

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
