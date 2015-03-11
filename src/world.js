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
        this.objects = {};
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
        this.objects[object.id] = object;
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
        for (let id in this.objects) {
            this.objects[id].update(dt);
        }
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
        this.objects[id].model = null;
        delete this.objects[id];
        return this;
    }
}
