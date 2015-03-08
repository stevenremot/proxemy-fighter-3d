import THREE from "mrdoob/three.js"

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
}

/**
 * @param {THREE.Vector3} cartesian coordinates (x, y, z). z is up coordinate
 * 
 * @return {SphericalVector} spherical coordinates (r, theta, phi). theta is colatitude, phi is longitude
 */
export cartesianToSpherical(vector) {
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
export sphericalToCartesian(vector) {
    cartesian = new THREE.Vector3();
    cartesian.x = spherical.r * Math.sin(spherical.theta) * Math.cos(spherical.phi);
    cartesian.y = spherical.r * Math.sin(spherical.theta) * Math.sin(spherical.phi);
    cartesian.z = spherical.r * Math.cos(spherical.theta);
}
