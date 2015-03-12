import THREE from "mrdoob/three.js";

import {WorldObject} from "./object";
import {SphericalObject} from "src/math/spherical-object";
import {addMixin} from "src/core/mixin";
import {ShipBullet} from "./bullet/ship";

const ORIGIN = new THREE.Vector3(0, 0, 0);
const SHOOT_FREQUENCY = 1 / 10;
const BULLET_SPEED = 200;
const BULLET_LIFE_SPAN = 2;

export class Ship extends WorldObject {
    constructor(world, sphereRadius, angularSpeed) {
        super(world);

        let geometry = new THREE.BoxGeometry(32, 4, 8);
        let material = new THREE.MeshBasicMaterial({ color: 0xc0c0c0 });
        this.model = new THREE.Mesh(geometry, material);

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
        this.aimedPoint = new THREE.Vector3();
    }

    update(dt) {
        this.moveOnSphere(
            this.horizontalSpeed * dt,
            this.verticalSpeed * dt
        ).lookAt(ORIGIN);

        if (this.isShooting) {
            this._shootCount += dt;
            while (this._shootCount > SHOOT_FREQUENCY) {
                this._shootCount -= SHOOT_FREQUENCY;
                this._shootOneBullet();
            }
        }
    }

    _shootOneBullet() {
        let shootPosition = this.position.clone().add(
            this.forward.clone().cross(this.up).multiplyScalar(this._shootOffset)
        );
        let forward = this.aimedPoint.clone().sub(shootPosition).normalize();

        this.world.createObject(
            ShipBullet,
            shootPosition,
            forward.clone().multiplyScalar(BULLET_SPEED),
            BULLET_LIFE_SPAN
        );

        this._shootOffset = -this._shootOffset;
    }
}

addMixin(Ship, SphericalObject);
