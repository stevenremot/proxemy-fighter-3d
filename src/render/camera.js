import THREE from "mrdoob/three.js";

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

    setPosition(position) {
        this._threeCamera.position = position;
    }

    /**
     * @description
     * initialize the camera behind and slightly above the ship
     * @param shipPosition: Vector3
     * @param shipOrientation: EulerAngles? Quaternion?
     */
    setup(shipPosition, shipOrientation) {
        this.setPosition(shipPosition);

        // todo: define/compute intelligentOffset
        let intelligentOffset = new THREE.Vector3(0,0,0);
        this.move(intelligentOffset);

        // todo: manage orientation
    }
}
