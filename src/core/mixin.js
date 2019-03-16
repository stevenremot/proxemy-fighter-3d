/**
 * Copyright (C) 2015 Alexandre Kazmierowski, Steven Rémot
 * Licensed under the General Public License, see the file gpl.txt at the root for details.
 */

/**
 * @description
 * Add mixin behaviour to the target class.
 *
 * @param {Function} classObject
 * @param {Object} mixin
 */
export function addMixin(classObject, mixin) {
  for (let property of Object.getOwnPropertyNames(mixin)) {
    if (property !== "constructor") {
      Object.defineProperty(
        classObject.prototype,
        property,
        Object.getOwnPropertyDescriptor(mixin, property)
      );
    }
  }
}
