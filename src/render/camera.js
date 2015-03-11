import THREE from "mrdoob/three.js";
import {addMixin} from "src/core/mixin";
import {SphericalObject} from "src/math/spherical-object";

/**
 * @description
 * Camera
 */
export class Camera {
    constructor(threeCamera) {
        this._threeCamera = threeCamera;

        /**
         * @property {WorldObject}
         *
         * @description
         * The target object to follow
         */
        this.target = null;

        /**
         * @property {THREE.Vector3}
         *
         * @description
         * The position relative to the target in its [right, up,
         * forward] base.
         *
         * Actually, right is not took in account for now.
         */
        this.targetRelativePosition = null;
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
     * Update camera's relative position to its target if it has one.
     *
     * @returns this
     */
    updateRelativePosition() {
        if (this.target && this.targetRelativePosition) {
            this.position = this.position
                .copy(this.target.position)
                .add(this.target.forward
                         .clone()
                         .multiplyScalar(this.targetRelativePosition.z)
                )
                .add(
                    this.target.up
                        .clone()
                        .multiplyScalar(this.targetRelativePosition.y)
                );
            this._threeCamera.up = this.target.up;
        }
        return this;
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
