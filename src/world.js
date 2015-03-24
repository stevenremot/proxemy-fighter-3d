import {WorldObject} from "./world/object";

/**
 * @description
 * Represent a game world.
 *
 * Contains all systems: rendering, GUI, input and collision
 */
export class World {
    constructor(renderContext, detector) {
        this.renderContext = renderContext;
        this.detector = detector;
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
        this._handleCollisions();
        return this;
    }

    _handleCollisions() {
        let keys = [...this.objects.keys()];
        for (let i = 0; i < keys.length; i++) {
            let o1 = this.objects.get(keys[i]);

            if (o1 !== undefined) {
                for (let j = i+1; j < keys.length; j++) {
                    let o2 = this.objects.get(keys[j]);
                    let objectsCanCollide = o2 !== undefined &&
                            (o1.canCollideWith(o2) || o2.canCollideWith(o1));

                    if (o1.hasCollisionBody() &&
                        objectsCanCollide &&
                        o2.hasCollisionBody() &&
                        o1.collisionBody.collidesWith(o2.collisionBody)) {
                        o1.onCollisionWith(o2);
                        o2.onCollisionWith(o1);
                    }
                }
            }
        }
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
        let object = this.objects.get(id);
        if (object) {
            object.model = null;
            object.onDestroy();
            this.objects.delete(id);
        }
        return this;
    }

    /**
     * @description
     * Destory all world objects.
     *
     * @returns this
     */
    clear() {
        for (let pair of this.objects) {
            this.destroy(pair[0]);
        }
        return this;
    }

    /**
     * @description
     * Return the object of the provided type in the world.
     *
     * If there are more than one object of this type, any one may be
     * returned.
     *
     * @param {Function} Type
     *
     * @returns {WorldObject|null}
     */
    getObjectOfType(Type) {
        for (let object of this.objects.values()) {
            if (object instanceof Type) {
                return object;
            }
        }
        return null;
    }

    /**
     * @description
     * Return all objects of the provided type in the world in an Array.
     *
     * @param {Function} Type
     *
     * @returns {WorldObject|null}
     */
    getObjectsOfType(Type) {
        let result = [];
        for (let object of this.objects.values()) {
            if (object instanceof Type) {
                result.push(object);
            }
        }
        return result;
    }
}
