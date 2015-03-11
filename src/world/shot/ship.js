import THREE from "mrdoob/three.js";

import {WorldObject} from "../object";

/**
 * @description
 * The projectile shot by the player ship.
 */
export class ShipShot extends WorldObject {

    /**
     * @constructor
     *
     * @param {World} world
     * @param {THREE.Vector3} position
     * @param {THREE.Vector3} direction
     * @param {Number} lifeSpan
     */
    constructor(world, position, direction, lifeSpan) {
        super(world);

        let geometry = new THREE.BoxGeometry(1, 1, 4);
        let material = new THREE.MeshBasicMaterial({color: 0xc0c000});
        this.model = new THREE.Mesh(geometry, material);
        this.position = position;
        this.lookAt(position.clone().add(direction));
        this.direction = direction;
        this.lifeSpan = lifeSpan;
    }

    update(dt) {
        this.position = this.position.add(this.direction.clone().multiplyScalar(dt));
        this.lifeSpan -= dt;
        if (this.lifeSpan < 0) {
            this.destroy();
        }
    }
}
