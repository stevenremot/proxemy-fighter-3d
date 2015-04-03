/**
 * Copyright (C) 2015 Alexandre Kazmierowski, Steven Rémot
 * Licensed under the General Public License, see the file gpl.txt at the root for details.
 */

import THREE from "mrdoob/three.js";

import {addMixin}from 'src/core/mixin';
import {SphericalVector, sphericalToCartesian, glToSpherical, sphericalToGl} from "src/math/utils";
import {WorldObject} from "src/world/object";
import {Cannon} from "src/world/weapons/cannon";
import {Sphere} from "src/collision/sphere";
import {Ship} from "src/world/ship";
import {GatlingBullet} from "src/world/bullet/gatling";
import {LifeContainer} from 'src/world/life-container';

const ORIGIN = new THREE.Vector3();
const RADIUS = 10;
const SHOOT_PERIOD = 0.1;
const BULLET_SPEED = 350;
const NOT_SHOOTING_SWITCH_PERIOD = 1.5;
const SHOOTING_SWITCH_PERIOD = 0.5;
const SHOOTING_CONE = 0.1;

let tmpSphericalVector = new SphericalVector();
let tmpCartesianVector = new THREE.Vector3();

let tmpUp = new THREE.Vector3();
let tmpPosition = new THREE.Vector3();

/**
 * @description
 * Gatling gun attached to the boss.
 *
 * Aims the player when it see it.
 */
export class Gatling extends WorldObject {

    /**
     * @param {World} world
     * @param {Module} bossModule
     * @param {Number} theta
     * @param {Number} phi
     */
    constructor(world, bossModule, theta, phi) {
        super(world);
        this._bossModule = bossModule;
        this.model = 'gatling-base';
        this.model.scale.set(5, 5, 5);
        this.model.position.add(this.position.clone().normalize());

        tmpSphericalVector.set(bossModule.boss.radius, theta, phi);
        sphericalToGl(tmpSphericalVector, this.model.position);

        this.collisionBody = new Sphere(this.model.position, RADIUS);
        let cannonModel = this.getModelFromCollection('gatling-cannon').clone();
        cannonModel.scale.set(5, 5, 5);
        this.cannon = world.createObject(Cannon, this, [0, 0], cannonModel);
        this.forward = new THREE.Vector3(
            this.position.y,
            this.position.x,
            this.position.z
        );
        this.up = this.position.clone().normalize();
        this.right = this.up.clone().cross(this.forward);
        this._shootCount = 0;
        this._modeCount = 0;
        this.life = 20;
        this._ship = null;
        this.onLifeChanged(
            () => {
                if (!this.isAlive()) this._bossModule.removeWeapon(this);
            }
        );

        this._isShooting = false;
    }

    update(dt) {
        let ship = this._ship || this.world.getObjectOfType(Ship);
        let shipRelativePosition = tmpCartesianVector.copy(ship.position)
                .sub(this.position);

        // As boss is at origin, position direction = up
        if (this.position.dot(shipRelativePosition) > 0) {
            tmpCartesianVector.copy(shipRelativePosition).sub(
                tmpUp.copy(this.up).multiplyScalar(this.up.dot(shipRelativePosition))
            );
            tmpCartesianVector.cross(this.up);
            this.model.lookAt(
                tmpPosition.copy(this.position).add(tmpCartesianVector)
            );

            this.cannon.updatePosition();
            this.cannon.lookAt(ship.position);

            this._modeCount += dt;
            let switchMode = false;
            let switchPeriod = this._isShooting ?
                    SHOOTING_SWITCH_PERIOD : NOT_SHOOTING_SWITCH_PERIOD;

            while (this._modeCount > switchPeriod) {
                this._modeCount -= switchPeriod;
                switchMode = true;
            }

            if (switchMode && Math.random() > 0.5) {
                this._isShooting = !this._isShooting;
            }

            if (this._isShooting) {
                this._shootCount += dt;
                while (this._shootCount > SHOOT_PERIOD) {
                    this._shootBullet();
                    this._shootCount -= SHOOT_PERIOD;
                }
            }
        }
        this._ship = ship;
    }

    canCollideWith(object) {
        return object.collisionGroup === 'player-shot';
    }

    onCollisionWith(object) {
        this.hurt(object.power);
    }

    _shootBullet() {
        glToSpherical(this.cannon.forward, tmpSphericalVector);
        tmpSphericalVector.addPhi((Math.random() * 2 - 1) * SHOOTING_CONE);
        tmpSphericalVector.addTheta((Math.random() * 2 - 1) * SHOOTING_CONE);
        tmpSphericalVector.r = BULLET_SPEED;
        sphericalToGl(tmpSphericalVector, tmpCartesianVector);
        this.world.createObject(
            GatlingBullet,
            this.cannon.shootPosition,
            // This clone is important, please do not remove it!
            tmpCartesianVector.clone()
        );
    }

    onDestroy() {
        this.cannon.destroy();
        this._bossModule.startReviveWeaponTimeout();
    }
}

addMixin(Gatling, LifeContainer);
