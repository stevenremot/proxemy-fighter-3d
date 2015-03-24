import THREE from "mrdoob/three.js";

import {addMixin} from 'src/core/mixin';
import {cartesianToSpherical, SphericalVector, fromGlCoordinates}
    from "src/math/utils";
import {WorldObject} from "src/world/object";
import {FiniteStateMachine} from "src/core/fsm";
import {Gatling} from "./turret/gatling";
import {LifeContainer} from "src/world/life-container";

const WEAPON_REVIVE_TIMEOUT = 20;

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
        let geometry = new THREE.SphereGeometry(radius + 0.05,
                                                widthSegments,
                                                heightSegments,
                                                phiRange[0] - 0.05,
                                                phiRange[1]-phiRange[0] + 0.1,
                                                thetaRange[0] - 0.05,
                                                thetaRange[1]-thetaRange[0] + 0.1);
        this.model = new THREE.Mesh(geometry, material);
        this._thetaRange = thetaRange;
        this._phiRange = phiRange;
        this._radius = radius;
        this.weapons = new Set();

        this.maxLife = life;
        this.life = life;
        this.boss = boss;

        this.createFsm();
        this.weaponReviveTimeouts = new Set();

        for (let i = 0; i < 4; i++) {
            this.addWeapon(Math.random(), Math.random());
        }

        this.onLifeChanged(
            () => {
                if (this.life < this.maxLife/2)
                    this._fsm.callTransition("HalfBroken");

                if (this.life <= 0)
                    this._fsm.callTransition("Broken");
            }
        );
    }

    createFsm() {
        this._fsm = new FiniteStateMachine();
        this._fsm.addState("FullLife");
        this._fsm.addState("HalfBroken").addCallback(
            () => {this.model.material.wireframe = true;}
        );
        this._fsm.addState("Broken").addCallback(
            () => this.destroy()
        );
        this._fsm.setState("FullLife");
        this._fsm.addTransition("FullLife","HalfBroken");
        this._fsm.addTransition("HalfBroken","Broken");
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
            phi = (temporarySphericalVector.phi + Math.PI / 2) % (Math.PI * 2) ;
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
                (this._phiRange[1] - this._phiRange[0]) * phiRatio - Math.PI / 2;
        this.weapons.add(this.world.createObject(Gatling, this, theta, phi));
    }

    startReviveWeaponTimeout() {
        this.weaponReviveTimeouts.add({ count: WEAPON_REVIVE_TIMEOUT});
    }

    update(dt) {
        // Using values() to avoid iterating and deleting in the same object
        for (let reviveObject of this.weaponReviveTimeouts.values()) {
            reviveObject.count -= dt;
            if (reviveObject.count < 0) {
                this.addWeapon(Math.random(), Math.random());
                this.weaponReviveTimeouts.delete(reviveObject);
            }
        }
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

    onDestroy() {
        this.weapons.forEach((w) => w.destroy());
    }
}

addMixin(Module, LifeContainer);
