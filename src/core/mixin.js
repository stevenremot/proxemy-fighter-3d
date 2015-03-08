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
