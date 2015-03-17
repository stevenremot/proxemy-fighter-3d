import THREE from 'mrdoob/three.js';

import {Box} from './box';

/**
 * @description
 * A sphere collision body.
 */
export class Sphere {
    /**
     * @param {THREE.Vector3} position
     * @param {Number}        radius
     */
    constructor(position, radius) {
        this.position = position;
        this.radius = radius;
    }

    /**
     * @description
     * Returns true if it is in collision with the object, false otherwise.
     *
     * @param {Object} object
     *
     * @returns {Boolean}
     */
    collidesWith(object) {
        if (object instanceof Sphere) {
            return this._collideWithSphere(object);
        } else if (object instanceof Box) {
            return this._collideWithBox(object);
        } else {
            return object.collidesWith(this);
        }
    }

    _collideWithSphere(sphere) {
        return this.position.clone().sub(sphere.position).length() <= this.radius + sphere.radius;
    }

    _collideWithBox(box) {
        box.ensureNotDirty();

        let relativePosition = this.position.clone()
                .sub(box.position)
                .applyQuaternion(box.quaternion);

        let projection = relativePosition.clone();

        for (let axis of ['x', 'y', 'z']) {
            let halfSize = box.size[axis]/2;
            projection[axis] = Math.min(
                Math.max(projection[axis], -halfSize),
                halfSize
            );
        }

        return projection.sub(relativePosition).length() <= this.radius;
    }
}
