import {WorldObject} from "./world/object";

/**
 * @description
 * Represent a game world.
 *
 * Contains all systems: rendering, GUI, input and collision
 */
export class World {
    constructor(renderContext) {
        this.renderContext = renderContext;
        this.objects = new Map();
        this._count = 0;
    }

    /**
     * @description
     * Create a new object linked to the world.
     *
     * @param {Function} objectClass - type of the object to create (constructor)
     * @param {Array}   args - arguments to provide to the constructor after the world
     *
     * @returns {WorldObject}
     */
    createObject(objectClass, ...args) {
        let object = new objectClass(this, ...args);
        object.id = this._count++;
        this.objects.set(object.id, object);
        return object;
    }

    /**
     * @description
     * Update all world objects.
     *
     * @param {Number} dt - time elapsed in seconds since the last update
     *
     * @returns this
     */
    update(dt) {
        this.objects.forEach((object) => object.update(dt));
        return this;
    }

    /**
     * @description
     * Destroy object with provided id
     *
     * @param {Id} id
     *
     * @returns this
     */
    destroy(id) {
        this.objects.get(id).model = null;
        this.objects.delete(id);
        return this;
    }
}
