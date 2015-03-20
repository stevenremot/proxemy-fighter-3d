import THREE from "mrdoob/three.js";

import {SphericalVector, sphericalToCartesian, toGlCoordinates} from "src/math/utils";
import {WorldObject} from "src/world/object";
import {Cannon} from "src/world/weapons/cannon";
import {Sphere} from "src/collision/sphere";
import {Ship} from "src/world/ship";

const ORIGIN = new THREE.Vector3();
const RADIUS = 4;
const SEGMENTS = 32;

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
        let geometry = new THREE.SphereGeometry(RADIUS, SEGMENTS, SEGMENTS);
        let material = new THREE.MeshBasicMaterial({ color: 0xaaaaaa });
        this.model = new THREE.Mesh(geometry, material);

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
    }

    update() {
        let ship = this.world.getObjectOfType(Ship);
        let shipRelativePosition = tmpCartesianVector.copy(ship.position)
                .sub(this.position);

        // As boss is at origin, position direction = up
        if (this.position.dot(shipRelativePosition) > 0) {
            this.cannon.updatePosition();
            this.cannon.lookAt(ship.position);
        }
    }

    onDestroy() {
        this.cannon.destroy();
    }
}
