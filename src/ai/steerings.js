import {Detector} from "./detection";
import {Boss} from "src/world/boss";
import {AiVessel} from "src/world/ai-vessel";

let orthoPoint = new THREE.Vector3();
let temporaryOrthoPoint = new THREE.Vector3();
let tmpVelocity = new THREE.Vector3();

let tmpTargetPos = new THREE.Vector3();
let tmpVector = new THREE.Vector3();

/*
 * Steerings that drive the movement of an AI vessel
 *
 */
const EPSILON = 0.001;

const FOLLOW_MIN = 50;
const FOLLOW_MAX = 80;

const AVOIDANCE_MIN = 8;
const AVOIDANCE_MAX = 15;

export class Steerings {
    constructor(object, detector) {
        this._object = object;
        this._detector = detector;
        
        // behaviour steerings that create a desired velocity
        this._behaviour = new Map();
        // steerings to avoid boss or other vessels
        this._avoidance = new Map();
        
        this._target = null;
        this._followTarget = new THREE.Vector3();
        this.followIntensity = 1;
        this.followX = 0;
        this.followY = 0;

        this._behaviour.set(
            "follow",
            {vector: new THREE.Vector3(), update: () => this.follow()}
        );
        /*this._behaviour.set(
            "stayVisible",
            {vector: new THREE.Vector3(), update: () => this.stayVisible()}
        );*/

        this._avoidance.set(
            "avoidBoss",
            {vector: new THREE.Vector3(), update: () => this.avoidBoss()}
        );
        this._avoidance.set(
            "avoidVessels",
            {vector: new THREE.Vector3(), update: () => this.avoidVessels()}
        );
    }

    get target() {
        return this._target;
    }
    
    set target(target) {
        this._target = target;
    }

    computeFollowTarget() {
        this._followTarget.copy(this._target.position);
        tmpTargetPos.copy(this._target.right).multiplyScalar(this.followX);
        tmpVector.copy(this._target.up).multiplyScalar(this.followY);
        this._followTarget.add(tmpTargetPos).add(tmpVector);
    }

    follow() {
        this.computeFollowTarget();
        tmpTargetPos.copy(this._followTarget).add(
            this._target.forward.clone().multiplyScalar(FOLLOW_MIN));

        let distance = this._object.position.distanceTo(tmpTargetPos);
        let intensity = 1;
        if (distance < FOLLOW_MAX)
            intensity = distance / FOLLOW_MAX;

        tmpTargetPos.sub(this._object.position).normalize().multiplyScalar(intensity);
        this.followIntensity = intensity;
        this._behaviour.get("follow").vector.copy(tmpTargetPos);
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
        // this is ugly
        let radius = this._object.world.getObjectOfType(Boss).radius;
        let dist = Math.max(0, this._object.position.length()-radius);
        
        let intensity = 1;
        if (dist > AVOIDANCE_MIN && dist < AVOIDANCE_MAX)
            intensity = (AVOIDANCE_MAX - dist) / (AVOIDANCE_MAX - AVOIDANCE_MIN);
        else if (dist >= AVOIDANCE_MAX)
            intensity = 0;

        this._avoidance.get("avoidBoss").vector.copy(this._object.position).normalize().multiplyScalar(intensity);
    }

    avoidVessels() {
        // this is ugly :D
        let vessels = this._object.world.getObjectsOfType(AiVessel);
        let intensity = 0;
        tmpTargetPos.set(0,0,0);

        for (let vessel of vessels) {
            if (vessel != this._object) {
                let dist = this._object.position.distanceTo(vessel.position);

                let localIntensity = 1;
                if (dist > AVOIDANCE_MIN && dist < AVOIDANCE_MAX)
                    localIntensity = (AVOIDANCE_MAX - dist) / (AVOIDANCE_MAX - AVOIDANCE_MIN);
                else if (dist >= AVOIDANCE_MAX)
                    localIntensity = 0;

                tmpVector.copy(this._object.position).sub(vessel.position).multiplyScalar(localIntensity);
                tmpTargetPos.add(tmpVector);
                if (intensity < localIntensity)
                    intensity = localIntensity;
            }
        }

        if (tmpTargetPos.length() > EPSILON) {
            tmpTargetPos.normalize().multiplyScalar(intensity);
        }
        this._avoidance.get("avoidVessels").vector.copy(tmpTargetPos);
    }
    
    computeDesiredVelocity() {
        tmpVelocity.set(0,0,0);
        for (let s of this._behaviour.values()) {
            s.update();
            tmpVelocity.add(s.vector);
        }
        if (tmpVelocity.lengthSq() > 1)
            tmpVelocity.normalize();
        
        return tmpVelocity;
    }

    computeAvoidance() {
        tmpVelocity.set(0,0,0);
        for (let s of this._avoidance.values()) {
            s.update();
            tmpVelocity.add(s.vector);
        }
        if (tmpVelocity.lengthSq() > 1)
            tmpVelocity.normalize();
        
        return tmpVelocity;
    }
}
