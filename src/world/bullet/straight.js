import THREE from "mrdoob/three.js";

import {WorldObject} from "../object";
import {Box} from "src/collision/box";

const BULLET_POWER = 1;

/**
 * @description
 * The projectile shot by the player ship.
 */
export class StraightBullet extends WorldObject {

    /**
     * @constructor
     *
     * @param {World}         world
     * @param {THREE.Vector3} position
     * @param {THREE.Vector3} direction
     * @param {Number}        lifeSpan
     * @param {String}        collisionGroup
     * @param {String}        collisionTargetGroup
     * @param {Number}        power
     * @param {Number}        color
     */
    constructor(world, {
        position,
        direction,
        lifeSpan,
        collisionGroup,
        collisionTargetGroup,
        power,
        color
    }) {
        super(world);

        let geometry = new THREE.BoxGeometry(1, 1, 4);
        let material = new THREE.MeshBasicMaterial({color: 0xc0c000});
        this.model = new THREE.Mesh(geometry, material);

        this.position = position;
        this.lookAt(position.clone().add(direction));
        this.direction = direction;
        this.lifeSpan = lifeSpan;
        this.power = BULLET_POWER;

        this.collisionBody = new Box(
            this.position.clone(),
            new THREE.Vector3(1, 1, 4),
            this.model.quaternion.clone()
        );

        // Attributes to override
        this.collisionGroup = collisionGroup;
        this.collisionTargetGroup = collisionTargetGroup;
        this.power = power;
    }

    onCollisionWith(object) {
        if (object.collisionGroup === this.collisionTargetGroup) {
            this.destroy();
        }
    }

    update(dt) {
        this.position = this.position.add(this.direction.clone().multiplyScalar(dt));
        this.lifeSpan -= dt;
        if (this.lifeSpan < 0) {
            this.destroy();
        }
    }
}