import THREE from "mrdoob/three.js";

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

export function fromGlCoordinates(vector) {
    return new THREE.Vector3(vector.z, vector.x, vector.y);
}

export function toGlCoordinates(vector) {
    return new THREE.Vector3(vector.y, vector.z, vector.x);
}

/**
 * @param {THREE.Vector3} cartesian coordinates (x, y, z). z is up coordinate
 * 
 * @return {SphericalVector} spherical coordinates (r, theta, phi). theta is colatitude, phi is longitude
 */
export function cartesianToSpherical(vector) {
    let r = vector.length();
    
    let theta = 0;
    if (Math.abs(r) > EPSILON)
        theta = Math.acos(vector.z / r);
    
    let phi = Math.atan2(vector.y, vector.x);
    if (phi < 0)
        phi += 2*Math.PI;

    return new SphericalVector(r, theta, phi);
}

/**
 * @param {SphericalVector} spherical coordinates (r, theta, phi). theta is colatitude, phi is longitude
 *
 * @return {THREE.Vector3} cartesian coordinates (x, y, z). z is up coordinate
 */
export function sphericalToCartesian(spherical) {
    cartesian = new THREE.Vector3();
    cartesian.x = spherical.r * Math.sin(spherical.theta) * Math.cos(spherical.phi);
    cartesian.y = spherical.r * Math.sin(spherical.theta) * Math.sin(spherical.phi);
    cartesian.z = spherical.r * Math.cos(spherical.theta);

    return cartesian;
}
