import THREE from "mrdoob/three.js";

import {addMixin}from 'src/core/mixin';
import {SphericalVector, sphericalToCartesian, toGlCoordinates} from "src/math/utils";
import {WorldObject} from "src/world/object";
import {Cannon} from "src/world/weapons/cannon";
import {Sphere} from "src/collision/sphere";
import {Ship} from "src/world/ship";
import {GatlingBullet} from "src/world/bullet/gatling";
import {LifeContainer} from 'src/world/life-container';

const ORIGIN = new THREE.Vector3();
const RADIUS = 4;
const SEGMENTS = 32;
const SHOOT_PERIOD = 0.5;
const BULLET_SPEED = 200;

let tmpSphericalVector = new SphericalVector();
let tmpCartesianVector = new THREE.Vector3();

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
        sphericalToCartesian(tmpSphericalVector, tmpCartesianVector);
        toGlCoordinates(tmpCartesianVector, this.model.position);

        this.collisionBody = new Sphere(this.model.position, RADIUS);
        this.cannon = world.createObject(Cannon, this, [0, 0]);
        this.forward = new THREE.Vector3(
            this.position.y,
            this.position.x,
            this.position.z
        );
        this.right = this.position.clone().cross(this.forward);
        this.model.lookAt(this.right);
        this._count = 0;
        this.life = 20;
        this.onLifeChanged(
            () => {
                if (!this.isAlive()) this._bossModule.removeWeapon(this);
            }
        );
    }

    update(dt) {
        let ship = this.world.getObjectOfType(Ship);
        let shipRelativePosition = tmpCartesianVector.copy(ship.position)
                .sub(this.position);

        // As boss is at origin, position direction = up
        if (this.position.dot(shipRelativePosition) > 0) {
            this.cannon.updatePosition();
            this.cannon.lookAt(ship.position);

            this._count += dt;
            while (this._count > SHOOT_PERIOD) {
                this._shootBullet();
                this._count -= SHOOT_PERIOD;
            }
        }
    }

    canCollideWith(object) {
        return object.collisionGroup === 'player-shot';
    }

    onCollisionWith(object) {
        this.hurt(object.power);
    }

    _shootBullet() {
        this.world.createObject(
            GatlingBullet,
            this.cannon.shootPosition,
            this.cannon.forward.clone().multiplyScalar(BULLET_SPEED)
        );
    }

    onDestroy() {
        this.cannon.destroy();
    }
}

addMixin(Gatling, LifeContainer);
