import {WorldObject} from "./object";
import {SphericalObject} from "src/math/spherical-object";
import {addMixin}from "src/core/mixin";
import THREE from "mrdoob/three.js";

const ORIGIN = new THREE.Vector3(0, 0, 0);

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
    }

    update(dt) {
        this.moveOnSphere(
            this.horizontalSpeed * dt,
            this.verticalSpeed * dt
        ).lookAt(ORIGIN);
    }
}

addMixin(Ship, SphericalObject);
