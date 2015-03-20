import THREE from "mrdoob/three.js";

import {cartesianToSpherical, SphericalVector, fromGlCoordinates}
    from "src/math/utils";
import {WorldObject} from "src/world/object";
import {FiniteStateMachine} from "src/core/fsm";
import {Gatling} from "./turret/gatling";

// Temporary vectors allocated in order not to create them at runtime.
let temporaryPosition = new THREE.Vector3();
let temporarySphericalVector = new SphericalVector(0, 0, 0);

export class Module extends WorldObject {
    constructor(
        world,
        {
            radius,
            thetaRange,
            phiRange,
            material,
            life,
            boss
        }
    ) {
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
        this.weapons = new Set();

        this.maxLife = life;
        this.life = life;
        this.boss = boss;

        this.createFsm();

        for (let i = 0; i < 4; i++) {
            this.addWeapon(Math.random(), Math.random());
        }
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

    /**
     * @description
     * Add a new weapon to the module.
     *
     * @param {Number} thetaRatio - Weapon's theta position, between 0 and 1
     * @param {Number} phiRatio   - Weapon's phi position, between 0 and 1
     *
     * @returns this
     */
    addWeapon(thetaRatio, phiRatio) {
        let theta = this._thetaRange[0] +
                (this._thetaRange[1] - this._thetaRange[0]) * thetaRatio;
        let phi = this._phiRange[0] +
                (this._phiRange[1] - this._phiRange[0]) * phiRatio;
        this.weapons.add(this.world.createObject(Gatling, this, theta, phi));
    }

    /**
     * @description
     * Remove a weapon from the module.
     *
     * @param {WorldObject} weapon
     *
     * @returns this
     */
    removeWeapon(weapon) {
        weapon.destroy();
        this.weapons.delete(weapon);
    }
}
