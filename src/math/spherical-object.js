import * as MathUtils from "src/math/utils";
import THREE from "mrdoob/three.js";

/**
 * @description
 * A mixin for objects that can move around a sphere.
 *
 * An object wanting to use this mixin must have the following properties
 * available for reading :
 *   - {THREE.Vector3} position
 *   - {THREE.Vector3} up
 */
export var SphericalObject = {
    _thetaMultiplier: 1,

    _recomputeMultiplier(phi) {
        if (phi < Math.PI/2 || phi > 3*Math.PI/2)
            this._thetaMultiplier = -1;
        else
            this._thetaMultiplier = 1;
    },

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
        MathUtils.cartesianToSpherical(
            this._worldPosition,
            this._sphericalPosition
        );

        // apply theta rotation
        // if it is around a pole, theta dynamics change
        // and the camera up vector must be inversed
        let lastPhi = this._sphericalPosition.phi;
        this._sphericalPosition.addTheta(this._thetaMultiplier*dtheta);
        if (lastPhi != this._sphericalPosition.phi)
        {
            let lastMultiplier = this._thetaMultiplier;
            this._recomputeMultiplier(this._sphericalPosition.phi);
            if (lastMultiplier != this._thetaMultiplier)
                this.up.multiplyScalar(-1);
        }

        // apply phi rotation, no problem here
        this._sphericalPosition.addPhi(dphi);

        // give the newly computed position to the camera
        // update its orientation through lookAt
        MathUtils.sphericalToCartesian(
            this._sphericalPosition,
            this._worldPosition
        );
        MathUtils.toGlCoordinates(
            this._worldPosition,
            this._threeCamera.position
        );
    }
};
