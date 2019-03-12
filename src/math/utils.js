/**
 * Copyright (C) 2015 Alexandre Kazmierowski, Steven Rémot
 * Licensed under the General Public License, see the file gpl.txt at the root for details.
 */

import * as THREE from "three";

const EPSILON = 1e-6;

/**
 * @description
 * Spherical coordinates: r radius, theta colatitude [0, PI], phi longitude [0, 2PI]
 */
export class SphericalVector {
    constructor(r, theta, phi) {
        this.r = r;
        this.theta = theta;
        this.phi = phi;
    }

    set(r, theta, phi) {
        this.r = r;
        this.theta = theta;
        this.phi = phi;
    }

    _regularizePhi() {
        if (this.phi < 0)
            this.phi += Math.PI * 2;
        if (this.phi >= 2 * Math.PI)
            this.phi -= 2 * Math.PI;
    }

    _regularizeTheta() {
        if(this.theta < 0) {
            this.theta = - this.theta;
            this.phi += Math.PI;
            this._regularizePhi();
        }
        else if (this.theta > Math.PI) {
            this.theta = 2 * Math.PI - this.theta;
            this.phi += Math.PI;
            this._regularizePhi();
        }
    }

    addPhi(dphi) {
        let lastPhi = this.phi;
        this.phi += dphi;
        this._regularizePhi();
    }

    addTheta(dtheta) {
        this.theta += dtheta;
        this._regularizeTheta();
    }
}

export function fromGlCoordinates(glVector, vector) {
    vector.set(glVector.z, glVector.x, glVector.y);
}

export function toGlCoordinates(vector, glVector) {
    glVector.set(vector.y, vector.z, vector.x);
}

export function invertZAxis(vector) {
    vector.setZ(-vector.z);
}

/**
 * @param[in] {THREE.Vector3} cartesian coordinates (x, y, z). z is up coordinate
 *
 * @param[out] {SphericalVector} spherical coordinates (r, theta, phi). theta is colatitude, phi is longitude
 */
export function cartesianToSpherical(vector, spherical) {
    let r = vector.length();

    let theta = 0;
    if (Math.abs(r) > EPSILON)
        theta = Math.acos(vector.z / r);

    let phi = Math.atan2(vector.y, vector.x);
    if (phi < 0)
        phi += 2*Math.PI;

    spherical.set(r, theta, phi);
}

/**
 * @param[in] {SphericalVector} spherical coordinates (r, theta, phi). theta is colatitude, phi is longitude
 *
 * @param[out] {THREE.Vector3} cartesian coordinates (x, y, z). z is up coordinate
 */
export function sphericalToCartesian(spherical, cartesian) {
    cartesian.x = spherical.r * Math.sin(spherical.theta) * Math.cos(spherical.phi);
    cartesian.y = spherical.r * Math.sin(spherical.theta) * Math.sin(spherical.phi);
    cartesian.z = spherical.r * Math.cos(spherical.theta);
}

export function sphericalToGl(spherical, gl) {
    gl.y = spherical.r * Math.sin(spherical.theta) * Math.cos(spherical.phi);
    gl.z = spherical.r * Math.sin(spherical.theta) * Math.sin(spherical.phi);
    gl.x = spherical.r * Math.cos(spherical.theta);
}

export function glToSpherical(gl, spherical) {
    let r = gl.length();

    let theta = 0;
    if (Math.abs(r) > EPSILON)
        theta = Math.acos(gl.x / r);

    let phi = Math.atan2(gl.z, gl.y);
    if (phi < 0)
        phi += 2*Math.PI;

    spherical.set(r, theta, phi);
}
