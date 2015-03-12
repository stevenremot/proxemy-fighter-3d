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

        this.x_relative = 0.5;
        this.y_relative = 0.5;
        this._precomputeFarPlaneDimensions();
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

    _precomputeFarPlaneDimensions() {
        let fov = this._threeCamera.fov * Math.PI / 180;
        let aspect = this._threeCamera.aspect;
        this.far = this._threeCamera.far;

        this.halfFarHeight = Math.tan(fov / 2) * this.far;
        this.halfFarWidth = this.halfFarHeight * aspect;

        this._topLeft = new THREE.Vector3(-this.halfFarWidth, this.halfFarHeight, -this.far);
        this._topRight = new THREE.Vector3(this.halfFarWidth, this.halfFarHeight, -this.far);
        this._bottomLeft = new THREE.Vector3(-this.halfFarWidth, -this.halfFarHeight, -this.far);
    }

    updateAimedPoint() {
        // compute far plane
        this._topLeft.set(-this.halfFarWidth, this.halfFarHeight, -this.far);
        this._topRight.set(this.halfFarWidth, this.halfFarHeight, -this.far);
        this._bottomLeft.set(-this.halfFarWidth, -this.halfFarHeight, -this.far);
        
        this._threeCamera.updateMatrixWorld();
        let matrixWorld = this._threeCamera.matrixWorld;
        this._topLeft.applyMatrix4(matrixWorld);
        this._topRight.applyMatrix4(matrixWorld);
        this._bottomLeft.applyMatrix4(matrixWorld);

        this.target.aimedPoint.copy(
            this._topLeft.clone().add(
                this._topRight.sub(this._topLeft)
                    .multiplyScalar(this.x_relative)
            )
                .add(
                    this._bottomLeft.sub(this._topLeft)
                        .multiplyScalar(this.y_relative)
                )
        );
    }
}

addMixin(Camera, SphericalObject);
