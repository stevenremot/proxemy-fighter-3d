import THREE from 'mrdoob/three.js';

import {Module} from "./boss/module";
import {WorldObject} from "./object";
import {Box} from "src/collision/box";

export class Boss extends WorldObject {
    constructor(world, radius)
    {
        super(world);

        this.radius = radius;

        let widthSegments = 24; //default value
        let heightSegments = 18; //default value
        let geometry = new THREE.SphereGeometry(radius, widthSegments, heightSegments);
        let material = new THREE.MeshBasicMaterial({color: 0x999999});
        this.model = new THREE.Mesh(geometry, material);

        this.collisionBody = new Box(
            this.model.position.clone(),
            new THREE.Vector3(radius, radius, radius),
            this.model.quaternion.clone()
        );
        this.collisionGroup = "boss";

        this.modules = [];
    }

    onCollisionWith(object) {
        if (object.collisionGroup === "player-shot") {
            console.log('Ouch!');
        }
    }

    addModule(thetaRange, phiRange, c)
    {
        let life = 100 * Math.random();
        let material = new THREE.MeshBasicMaterial({color: c});
        this.modules.push(
            new Module(this.world,
                       this.radius+0.1,
                       thetaRange,
                       phiRange,
                       material,
                       life)
        );
        return this;
    }
}
