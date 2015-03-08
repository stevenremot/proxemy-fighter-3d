import THREE from "mrdoob/three.js";
import * as MathUtils from "src/math/utils";
import {addMixin} from "src/core/mixin";

let SphericalObject = {
    _thetaMultiplier: 1,

    _recomputeMultiplier(phi) {
        if (phi < Math.PI/2 || phi > 3*Math.PI/2)
            this._thetaMultiplier = -1;
        else
            this._thetaMultiplier = 1;
    },

    /**
     * @description
     * Apply a elementary spherical movement to the camera
     *
     * @param {Number} dtheta: up(>0) or down(<0) rotation
     *                         from the viewer perspective
     * @param {Number} dphi: right(>0) or left(<0) rotation
     *                       from the viewer perspective
     */
    moveOnSphere(dtheta, dphi) {
        if (!("worldPosition" in this)) {
            this._worldPosition = new THREE.Vector3(0, 0, 0);
        }

        if (!("sphericalPosition" in this)) {
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
        this.lookAt(new THREE.Vector3(0,0,0));
    }
};

/**
 * @description
 * Camera
 */
export class Camera {
    constructor(threeCamera) {
        this._threeCamera = threeCamera;
    }

    get threeCamera() {
        return this._threeCamera;
    }

    lookAt(vector) {
        this._threeCamera.lookAt(vector);
    }

    move(vector) {
        this._threeCamera.position.x += vector.x;
        this._threeCamera.position.y += vector.y;
        this._threeCamera.position.z += vector.z;
    }

    get position() {
        return this._threeCamera.position;
    }

    set position(position) {
        this._threeCamera.position.copy(position);
    }

    get up() {
        return this._threeCamera.up;
    }

    /**
     * @description
     * initialize the camera behind and slightly above the ship
     * @param shipPosition: Vector3
     * @param shipOrientation: EulerAngles? Quaternion?
     */
    setup(shipPosition, shipOrientation) {
        this.position = shipPosition;

        // todo: define/compute intelligentOffset
        let intelligentOffset = new THREE.Vector3(0,0,0);
        this.move(intelligentOffset);

        // todo: manage orientation
    }
}

addMixin(Camera, SphericalObject);
