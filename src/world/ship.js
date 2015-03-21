import THREE from "mrdoob/three.js";

import {WorldObject} from "./object";
import {SphericalObject} from "src/math/spherical-object";
import {addMixin} from "src/core/mixin";
import {ShipBullet} from "./bullet/ship";
import {Cannon} from "./weapons/cannon";
import {LifeContainer} from './life-container';
import {Box} from 'src/collision/box';

const ORIGIN = new THREE.Vector3(0, 0, 0);
const SHOOT_FREQUENCY = 1 / 10;
const BULLET_SPEED = 200;

export class Ship extends WorldObject {
    constructor(world, sphereRadius, angularSpeed, maxLife) {
        super(world);

        let geometry = new THREE.BoxGeometry(32, 4, 8);
        let material = new THREE.MeshBasicMaterial({ color: 0xc0c0c0 });
        this.model = new THREE.Mesh(geometry, material);
        this.collisionBody = new Box(
            this.position,
            new THREE.Vector3(32, 4, 8),
            this.model.quaternion
        );

        this.collisionGroup = 'player';

        /**
         * @property {Number}
         */
        this.verticalSpeed = 0;

        /**
         * @property {Number}
         */
        this.horizontalSpeed = 0;

        /**
         * @property {Boolean}
         */
        this.isShooting = false;

        this._shootCount = 0;
        this._shootOffset = -2;
        this.aimedPoint = ORIGIN.clone();

        this._leftCannon = world.createObject(Cannon, this, [-2,0]);
        this._rightCannon = world.createObject(Cannon, this, [2,0]);

        this.maxLife = maxLife;
        this.life = maxLife;
    }

    update(dt) {
        this.moveOnSphere(
            this.horizontalSpeed * dt,
            this.verticalSpeed * dt
        ).lookAt(ORIGIN);

        this._leftCannon.updatePosition();
        this._rightCannon.updatePosition();
        this._leftCannon.lookAt(this.aimedPoint);
        this._rightCannon.lookAt(this.aimedPoint);

        if (this.isShooting) {
            this._shootCount += dt;
            while (this._shootCount > SHOOT_FREQUENCY) {
                this._shootCount -= SHOOT_FREQUENCY;
                this._shootOneBullet();
            }
        }
    }

    canCollideWith(object) {
        return object.collisionGroup === 'boss_shot';
    }

    onCollisionWith(object) {
        this.hurt(object.power);
    }

    _shootOneBullet() {
        let cannon = this._leftCannon;
        if (this._shootOffset < 0)
            cannon = this._rightCannon;

        this.world.createObject(
            ShipBullet,
            cannon.shootPosition,
            cannon.forward.clone().multiplyScalar(BULLET_SPEED)
        );

        this._shootOffset = -this._shootOffset;
    }

    onDestroy() {
        this._leftCannon.destroy();
        this._rightCannon.destroy();
    }
}

addMixin(Ship, SphericalObject);
addMixin(Ship, LifeContainer);
