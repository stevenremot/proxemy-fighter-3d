/**
 * Copyright (C) 2015 The Proxemy Fighter 3D Team
 * Licensed under the General Public License, see the file gpl.txt at the root for details.
 */

import * as MathUtils from "src/math/utils";
import THREE from "mrdoob/three.js";

let position = new THREE.Vector3(0, 0, 0);

/**
 * @description
 * A mixin for objects that can move around a sphere.
 *
 * An object wanting to use this mixin must have the following properties
 * available for reading and writing :
 *   - {THREE.Matrix4} matrix
 *   - {THREE.Vector3} position
 *   - {THREE.Vector3} up
 *  -  {THREE.Vector3} forward
 */
export var SphericalObject = {
    _lookUp: true,

    /**
     * @description
     * Apply a elementary spherical movement to the camera.
     *
     * Update object's position, forward and up
     *
     * @param {Number} dtheta: up(>0) or down(<0) rotation
     *                         from the viewer perspective
     * @param {Number} dphi: right(>0) or left(<0) rotation
     *                       from the viewer perspective
     *
     * @returns this
     */
    moveOnSphere(dtheta, dphi) {
        if (!("_sphericalObject" in this)) {
            this._sphericalObject = {
                forward: new THREE.Vector3(),
                up: new THREE.Vector3(),
                right: new THREE.Vector3(),
                position: new THREE.Vector3(),
                matrix: new THREE.Matrix4(),
                rotationMatrix: new THREE.Matrix4(),
                eulerAngle: new THREE.Euler()
            };
        }

        let s = this._sphericalObject;
        s.forward.copy(this.forward);
        s.up.copy(this.up);
        s.right.crossVectors(s.forward, s.up);
        s.position.copy(this.position);

        let l = s.position.length();

        s.eulerAngle.set(0, dtheta, dphi);
        s.rotationMatrix.makeRotationFromEuler(s.eulerAngle);
        s.matrix
            .makeBasis(
                s.forward,
                s.up,
                s.right
            )
            .multiply(s.rotationMatrix);

        s.up.set(0, 1, 0).applyMatrix4(s.matrix).normalize();
        s.position.set(-1, 0, 0).applyMatrix4(s.matrix).setLength(l);
        s.forward.set(1, 0, 0).applyMatrix4(s.matrix).normalize();
        this.position = s.position;
        this.forward = s.forward;
        this.up = s.up;
        this.right = s.right;

        return this;
    }
};
