import THREE from "mrdoob/three.js";

import {WorldObject} from "./object";
import {Steerings} from "src/ai/steerings";
import {LifeContainer} from "./life-container";
import {SphericalObject} from "src/math/spherical-object";
import {addMixin} from "src/core/mixin";
import {FiniteStateMachine} from "src/core/fsm";
import {SphericalVector, fromGlCoordinates, cartesianToSpherical} from "src/math/utils";
import {Boss} from "src/world/boss";

// for BuddyCube
import {Box} from "src/collision/box";

const ORIGIN = new THREE.Vector3(0,0,0);
const EPSILON = 0.1;
const DEFAULT_SPEED = 20;

let tmpDirection = new THREE.Vector3();
let tmpPosition = new THREE.Vector3();
let tmpSphericalVector = new SphericalVector();

export class AiVessel extends WorldObject {
    constructor(world, life) {
        super(world);
        
        this._steerings = new Steerings(this, world.detector);
        this._speed = DEFAULT_SPEED;
        this._sphericalVelocity = new THREE.Vector2();
        this._sphericalTarget = new SphericalVector();

        this.life = life;

        this.collisionGroup = "ai";

        this._onDeadCallbacks = [];

        this.createFsm();
    }

    createFsm() {
        this._fsm = new FiniteStateMachine();
        this._fsm.addState("Detect");
        this._fsm.addState("Spherical");
        this._fsm.addState("Chase");

        this._fsm.setState("Detect");
    }

    get target() {
        return this._steerings.target;
    }

    set target(target) {
        this._steerings.target = target;
    }

    get speed() {
        return this._speed;
    }

    set speed(speed) {
        this._speed = speed;
    }

    computeSphericalVelocity() {
        fromGlCoordinates(this.position, tmpPosition);
        cartesianToSpherical(tmpPosition, tmpSphericalVector);
        fromGlCoordinates(this.target.position, tmpPosition);
        cartesianToSpherical(tmpPosition, this._sphericalTarget);

        let thetaSign = 1;
        if (tmpSphericalVector.theta > this._sphericalTarget.theta)
            thetaSign = -1;
        let phiSign = 1;
        if (tmpSphericalVector.phi > this._sphericalTarget.phi)
            phiSign = -1;
        let deltaTheta = Math.abs(tmpSphericalVector.theta - this._sphericalTarget.theta);
        let deltaPhi = Math.abs(tmpSphericalVector.phi - this._sphericalTarget.phi);

        this._sphericalVelocity.set(thetaSign*deltaTheta, phiSign*deltaPhi).normalize();
    }

    hasReachedSphericalTarget() {
        fromGlCoordinates(this.position, tmpPosition);
        cartesianToSpherical(tmpPosition, tmpSphericalVector);
         let deltaTheta = Math.abs(tmpSphericalVector.theta - this._sphericalTarget.theta);
        let deltaPhi = Math.abs(tmpSphericalVector.phi - this._sphericalTarget.phi);
        return deltaTheta < EPSILON && deltaPhi < EPSILON;
    }

    update(dt) {
        if (this._fsm.currentState == "Detect") {
            tmpDirection.copy(this.target.position).sub(this.position).normalize();
            let boss = this.world.getObjectOfType(Boss);
            let intersections = this.world.detector.raycastToObject(
                this.position, tmpDirection, boss);
            if (intersections.length > 0) {
                let distance = intersections[0].distance;
                if (distance < this.position.distanceTo(this.target.position)) {
                    this.computeSphericalVelocity();
                    this._fsm.setState("Spherical");
                    return;
                }
            }
            this._fsm.setState("Chase");
        }
        else if (this._fsm.currentState == "Spherical") {
            this.moveOnSphere(
                this._sphericalVelocity.x * dt,
                this._sphericalVelocity.y * dt
            ).lookAt(ORIGIN);
            if (this.hasReachedSphericalTarget())
                this._fsm.setState("Chase");
        }
        else if (this._fsm.currentState == "Chase") {
            let velocity = this._steerings.computeSpeed();
            this.position.add(velocity.multiplyScalar(dt*this._speed));

            this.lookAt(this.position.clone().add(velocity));
        }
    }

    onCollisionWith(object) {
        if (object.collisionGroup === 'player-shot') {
            this.hurt(object.power);
            
            if (!this.isAlive())
                this._triggerOnDead();
        }
    }

    onDead(callback) {
        this._onDeadCallbacks.push(callback);
        return this;
    }

    _triggerOnDead() {
        for (let callback of this._onDeadCallbacks) {
            callback();
        }
    }
}

addMixin(AiVessel, SphericalObject);
addMixin(AiVessel, LifeContainer);

/**
 * Example for testing purpose
 */
export class BuddyCube extends AiVessel {
    constructor(world, life, ship) {
        super(world, life);

        let geometry = new THREE.BoxGeometry(10,10,10);
        let material = new THREE.MeshBasicMaterial({color: 0xff00ff});
        this.model = new THREE.Mesh(geometry, material);
        this.position = new THREE.Vector3(-50,30,0);
        this.target = ship;
        this.forward = new THREE.Vector3(1,0,0);

        this.collisionBody = new Box(
            this.position,
            new THREE.Vector3(10,10,10),
            this.model.quaternion
        );
    }
}
