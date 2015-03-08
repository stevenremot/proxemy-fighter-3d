import THREE from "mrdoob/three.js";
import * as MathUtils from "src/math/utils";

/**
 * @description
 * Camera
 */
export class Camera {
    constructor(threeCamera) {
        this._threeCamera = threeCamera;
        this._thetaMultiplier = 1;
        
        this._worldPosition = new THREE.Vector3(0,0,0);
        this._sphericalPosition = new MathUtils.SphericalVector(0,0,0);
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
        this._threeCamera.position.copy(position);
    }

    _recomputeMultiplier(phi) {
        if (phi < Math.PI/2 || phi > 3*Math.PI/2)
            this._thetaMultiplier = -1;
        else
            this._thetaMultiplier = 1;
    }
    
    /**
     * @description
     * Apply a elementary spherical movement to the camera
     * @param dtheta: up(>0) or down(<0) rotation from the viewer perspective
     * @param dphi: right(>0) or left(<0) rotation from the viewer perspective
     */
    sphericalMove(dtheta, dphi) {
        // convert to spherical coordinates
        MathUtils.fromGlCoordinates(
            this._threeCamera.position,
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
                this._threeCamera.up.multiplyScalar(-1);
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
