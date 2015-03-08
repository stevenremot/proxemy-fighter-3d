import * as MathUtils from "src/math/utils";
import THREE from "mrdoob/three.js";

let position = new THREE.Vector3(0, 0, 0);

/**
 * @description
 * A mixin for objects that can move around a sphere.
 *
 * An object wanting to use this mixin must have the following properties
 * available for reading and writing :
 *   - {THREE.Vector3} position
 *   - {THREE.Vector3} up
 */
export var SphericalObject = {
    _lookUp: true,

    /**
     * @description
     * Apply a elementary spherical movement to the camera.
     *
     * Update object's position and up
     *
     * @param {Number} dtheta: up(>0) or down(<0) rotation
     *                         from the viewer perspective
     * @param {Number} dphi: right(>0) or left(<0) rotation
     *                       from the viewer perspective
     */
    moveOnSphere(dtheta, dphi) {
        if (!("_worldPosition" in this)) {
            this._worldPosition = new THREE.Vector3(0, 0, 0);
        }

        if (!("_sphericalPosition" in this)) {
            this._sphericalPosition = new MathUtils.SphericalVector(0, 0, 0);
        }

        // convert to spherical coordinates
        MathUtils.fromGlCoordinates(
            this.position,
            this._worldPosition
        );
        if (!this._lookUp)
            MathUtils.invertZAxis(this._worldPosition);
        MathUtils.cartesianToSpherical(
            this._worldPosition,
            this._sphericalPosition
        );

        // apply theta rotation
        // if it is around a pole, theta dynamics change
        // and the camera up vector must be inversed
        let lastPhi = this._sphericalPosition.phi;
        this._sphericalPosition.addTheta(this._thetaMultiplier*dtheta);
        let changeUp = lastPhi != this._sphericalPosition.phi;
        // apply phi rotation, no problem here
        this._sphericalPosition.addPhi(dphi);

        // give the newly computed position to the camera
        // update its orientation through lookAt
        MathUtils.sphericalToCartesian(
            this._sphericalPosition,
            this._worldPosition
        );
        if (!this._lookUp)
            MathUtils.invertZAxis(this._worldPosition);
        MathUtils.toGlCoordinates(
            this._worldPosition,
            position
        );

        // Set it externaly in case there is a setter function
        this.position = position;

        if (changeUp)
        {
           this._lookUp = !this._lookUp;
           this.up = this.up.multiplyScalar(-1);
        }
    }
};
