import THREE from "mrdoob/three.js";

/**
 * @description
 * Camera
 */
export class Camera {
    constructor(threeCamera) {
	_threeCamera = threeCamera
    };

    get threeCamera() {
	return _threeCamera;
    };

    lookAt(vector) {
	_threeCamera.lookAt(vector)
    };

    move(vector) {
	_threeCamera.position.x += vector.x
	_threeCamera.position.y += vector.y
	_threeCamera.position.z += vector.z
    };

    setPosition(position) {
	_threeCamera.position = position
    };
    
    /**
     * @description
     * initialize the camera behind and slightly above the ship
     * @param shipPosition: Vector3
     * @param shipOrientation: EulerAngles? Quaternion?
    */
    setup(shipPosition, shipOrientation) {
	setPosition(shipPosition)

	// todo: define/compute intelligentOffset
	let intelligentOffset = new THREE.Vector3(0,0,0)
	move(intelligentOffset)

	// todo: manage orientation
    };
};
