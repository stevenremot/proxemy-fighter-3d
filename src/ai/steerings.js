import {Detector} from "./detection";

let orthoPoint = new THREE.Vector3();
let temporaryOrthoPoint = new THREE.Vector3();
let tmpVelocity = new THREE.Vector3();

/*
 * Steerings that drive the movement of an AI vessel
 *
 */
const MIN_DISTANCE = 20;
const REF_DISTANCE = 40;

export class Steerings {
    constructor(object, detector) {
        this._object = object;
        this._detector = detector;
        
        // behaviour steerings that create a desired velocity
        this._behaviour = new Map();
        // steerings to avoid boss or other vessels
        this._avoidance = new Map();
        
        this._target = null;

        this._behaviour.set(
            "follow",
            {vector: new THREE.Vector3(), update: () => this.follow()}
        );
        this._behaviour.set(
            "stayVisible",
            {vector: new THREE.Vector3(), update: () => this.stayVisible()}
        );

        this._avoidance.set(
            "avoidBoss",
            {vector: new THREE.Vector3(), update: () => this.avoidBoss()}
        );
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

        targetPos.sub(this._object.position).normalize().multiplyScalar(intensity);
        this._behaviour.get("follow").vector.copy(targetPos);
    }

    stayVisible() {
        if (this._detector.isVisible(this._object))
            this._behaviour.get("stayVisible").vector.set(0,0,0);
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
            this._behaviour.get("stayVisible").vector.copy(
                orthoPoint.normalize()
            );
        }
    }

    avoidBoss() {
        
    }
    
    computeDesiredVelocity() {
        tmpVelocity.set(0,0,0);
        for (let s of this._behaviour.values()) {
            s.update();
            tmpVelocity.add(s.vector);
        }
        return tmpVelocity;
    }

    computeAvoidance() {
        tmpVelocity.set(0,0,0);
        for (let s of this._avoidance.values()) {
            s.update();
            tmpVelocity.add(s.vector);
        }
        return tmpVelocity;
    }
}
