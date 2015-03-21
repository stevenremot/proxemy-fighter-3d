import {Detector} from "./detection";

let orthoPoint = new THREE.Vector3();
let temporaryOrthoPoint = new THREE.Vector3();

/*
 * Steerings that drive the movement of an AI vessel
 *
 */
const MIN_DISTANCE = 20;
const REF_DISTANCE = 40;
const BASE_SPEED = 20;

export class Steerings {
    constructor(object, detector) {
        this._object = object;
        this._detector = detector;
        this._components = new Map();
        this._steeringSpeed = new THREE.Vector3();
        
        this._target = null;

        this._components.set("follow", {vector: new THREE.Vector3(), update: () => this.follow()});
        this._components.set("stayVisible", {vector: new THREE.Vector3(), update: () => this.stayVisible()});
    }

    get target() {
        return this._target;
    }
    
    set target(target) {
        this._target = target;
    }

    follow() {
        let targetPos = this._target.position.clone().add(
            this._target.forward.clone().multiplyScalar(MIN_DISTANCE));

        let distance = this._object.position.distanceTo(targetPos);
        let intensity = 1;
        if (distance < REF_DISTANCE)
            intensity = distance / REF_DISTANCE;

        targetPos.sub(this._object.position).normalize().multiplyScalar(intensity*BASE_SPEED);
        this._components.get("follow").vector.copy(targetPos);
    }

    stayVisible() {
        if (this._detector.isVisible(this._object))
            this._components.get("stayVisible").vector.set(0,0,0);
        else {
            let frustum = this._detector.frustum;
            let intersectionDistance = NaN;
            
            // find closest frustum plane intersection
            for (let p of frustum.planes) {
                p.orthoPoint(this._object.position, temporaryOrthoPoint);
                let dist = this._object.position.distanceTo(temporaryOrthoPoint);
                if (dist < intersectionDistance) {
                    intersectionDistance = dist;
                    orthoPoint.copy(temporaryOrthoPoint);
                }
            }

            // go for it
            this._components.get("stayVisible").vector.copy(
                orthoPoint.normalize().multiplyScalar(BASE_SPEED)
            );
        }
    }
    
    computeSpeed() {
        this._steeringSpeed.set(0,0,0);
        for (let s of this._components.values()) {
            s.update();
            this._steeringSpeed.add(s.vector);
        }
    }
}
