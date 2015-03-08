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
        let spherical = MathUtils.cartesianToSpherical(
            MathUtils.fromGlCoordinates(this._threeCamera.position)
        );
        
        // apply theta rotation
        // if it is around a pole, theta dynamics change 
        // and the camera up vector must be inversed
        let lastPhi = spherical.phi;
        spherical.addTheta(this._thetaMultiplier*dtheta);
        if (lastPhi != spherical.phi)
        {
            let lastMultiplier = this._thetaMultiplier;
            this._recomputeMultiplier(spherical.phi);
            if (lastMultiplier != this._thetaMultiplier)
                this._threeCamera.up.multiplyScalar(-1);
        }
        
        // apply phi rotation, no problem here
        spherical.addPhi(dphi);
        
        // give the newly computed position to the camera
        // update its orientation through lookAt
        this.setPosition(
            MathUtils.toGlCoordinates(
                MathUtils.sphericalToCartesian(spherical))
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
