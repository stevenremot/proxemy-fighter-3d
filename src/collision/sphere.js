import THREE from 'mrdoob/three.js';

import {Box} from './box';
import {WorldObject} from 'src/world/object';

let tmpVector = new THREE.Vector3();
let tmpRelativePosition = new THREE.Vector3();
let tmpProjection = new THREE.Vector3();

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
        this._position = position;
        this._radius = radius;
        this.boundingBox = new THREE.Box3();
        this._updateBox();
        this._sphere = new THREE.Sphere();
    }

    _updateBox() {
        tmpVector.set(this._radius, this._radius, this._radius);
        this.boundingBox.setFromCenterAndSize(this._position, this._radius);
    }

    _updateSphere() {
        this._sphere.set(this._position, this._radius);
    }

    get position() {
        return this._position;
    }

    set position(position) {
        this._position = position;
        this._updateBox();
        this._updateSphere();
    }

    get radius() {
        return this._radius;
    }

    set radius(radius) {
        this._radius = radius;
        this._updateBox();
        this._updateSphere();
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
        box.ensureBboxNotDirty();

        if (!this.boundingBox.isIntersectionBox(box.boundingBox)) return false;

        tmpRelativePosition.copy(this.position)
                .sub(box.position)
                .applyQuaternion(box.quaternion);

        tmpProjection.copy(tmpRelativePosition);

        for (let axis of ['x', 'y', 'z']) {
            let halfSize = box.size[axis]/2;
            tmpProjection[axis] = Math.min(
                Math.max(tmpProjection[axis], -halfSize),
                halfSize
            );
        }

        return tmpProjection.sub(tmpRelativePosition).length() <= this.radius;
    }

    pick(ray, intersectionPoint) {
        ray.intersectSphere(this._sphere, intersectionPoint);
    }
}

export class SphereDebugView extends WorldObject {
    constructor(world, sphere) {
        super(world);
        this.sphere = sphere;
        
        let geometry = new THREE.SphereGeometry(sphere.radius);
        let material = new THREE.MeshBasicMaterial(
            {color: 0xffffff, wireframe: true}
        );
        this.model = new THREE.Mesh(geometry, material);
    }

    update(dt) {
        this.position.copy(this.sphere.position);
    }
}
