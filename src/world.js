/**
 * Copyright (C) 2015 Alexandre Kazmierowski, Steven Rémot
 * Licensed under the General Public License, see the file gpl.txt at the root for details.
 */

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
        this.objects = new Set();
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
        this.objects.add(object);
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
        this._handleCollisions();
        this.objects.forEach((object) => object.update(dt));
        return this;
    }

    _handleCollisions() {
        let objects = [...this.objects];
        for (let i = 0; i < objects.length; i++) {
            let o1 = objects[i];

            for (let j = i+1; j < objects.length; j++) {
                let o2 = objects[j];
                let objectsCanCollide = (o1.canCollideWith(o2) || o2.canCollideWith(o1));

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

    /**
     * @description
     * Destroy object with provided id
     *
     * @param {Id} id
     *
     * @returns this
     */
    destroy(object) {
        if (this.objects.has(object)) {
            object.model = null;
            object.onDestroy();
            this.objects.delete(object);
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
        for (let object of this.objects) {
            this.destroy(object);
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
        for (let object of this.objects) {
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
        for (let object of this.objects) {
            if (object instanceof Type) {
                result.push(object);
            }
        }
        return result;
    }
}
