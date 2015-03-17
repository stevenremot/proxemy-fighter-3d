import THREE from "mrdoob/three.js";

import {cartesianToSpherical, SphericalVector, fromGlCoordinates} from "src/math/utils";
import {WorldObject} from "src/world/object";
import {FiniteStateMachine} from "src/core/fsm";

// Temporary vectors allocated in order not to create them at runtime.
let temporaryPosition = new THREE.Vector3();
let temporarySphericalVector = new SphericalVector(0, 0, 0);

export class Module extends WorldObject {
    constructor(world,
                radius,
                thetaRange,
                phiRange,
                material,
                life) {
        super(world);

        let widthSegments = 24; //default value
        let heightSegments = 18; //default value
        let geometry = new THREE.SphereGeometry(radius,
                                                widthSegments,
                                                heightSegments,
                                                phiRange[0],
                                                phiRange[1]-phiRange[0],
                                                thetaRange[0],
                                                thetaRange[1]-thetaRange[0]);
        this.model = new THREE.Mesh(geometry, material);
        this._thetaRange = thetaRange;
        this._phiRange = phiRange;
        this._radius = radius;

        this.maxLife = life;
        this.life = life;

        this.createFsm();
    }

    createFsm() {
        this._fsm = new FiniteStateMachine();
        this._fsm.addState("FullLife");
        this._fsm.addState("HalfBroken").addCallback(
            () => {this.model.material.wireframe = true;}
        );
        this._fsm.addState("Broken").addCallback(
            () => {this.model.material.visible = false;}
        );
        this._fsm.setState("FullLife");
        this._fsm.addTransition("FullLife","HalfBroken");
        this._fsm.addTransition("HalfBroken","Broken");
    }

    handleLifeChanged(damage) {
        this.life -= damage;

        if (this.life < this.maxLife/2)
            this._fsm.callTransition("HalfBroken");

        if (this.life < 0)
            this._fsm.callTransition("Broken");
    }

    /**
     * @description
     * Return true if the module still has life.
     *
     * @returns {Boolean}
     */
    isAlive() {
        return this.life >= 0;
    }

    /**
     * @description
     * Return true if the provided position is inside the module's angular range.
     *
     * @param {THREE.Vector3} position
     *
     * @returns {Boolean}
     */
    isPointInAngularRange(position) {
        fromGlCoordinates(position, temporaryPosition);
        cartesianToSpherical(temporaryPosition, temporarySphericalVector);
        let theta = temporarySphericalVector.theta,
            phi  =(temporarySphericalVector.phi + Math.PI / 2) % (Math.PI * 2) ;
        return theta >= this._thetaRange[0] && theta <= this._thetaRange[1] &&
            phi >= this._phiRange[0] && phi <= this._phiRange[1];
    }
}
