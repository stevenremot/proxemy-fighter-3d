/**
 * Copyright (C) 2015 Alexandre Kazmierowski, Steven Rémot
 * Licensed under the General Public License, see the file gpl.txt at the root for details.
 */

import * as THREE from "three";

import {WorldObject} from "../object";
import {Box} from "/src/collision/box";
import {Explosion} from '../explosion';

const BULLET_POWER = 1;

let tmpPosition = new THREE.Vector3();

let texture = THREE.ImageUtils.loadTexture('assets/laser_test.png');
let uniforms = {
    laserColor: {type: "c", value: new THREE.Color(0xffff00)},
    uTex: {type: "t", value: texture},
    exponent: {type: "f", value: 8},
    alphaMin: {type: "f", value: 0.2}
};


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
    constructor(world) {
        super(world);

        this.direction = null;
        this.lifeSpan = 0;
        this.power = BULLET_POWER;

        let geometry = new THREE.BoxGeometry(1, 1, 4);
        //let material = new THREE.MeshBasicMaterial({color: 0xc0c000});
        let material = new THREE.ShaderMaterial({
            vertexShader: document.getElementById('laser-vertex').textContent,
            fragmentShader: document.getElementById('laser-fragment').textContent,
            uniforms: uniforms,
            transparent: true
        });

        this.model = new THREE.Mesh(geometry, material);

        this.collisionBody = new Box(
            this.position.clone(),
            new THREE.Vector3(1, 1, 4),
            this.model.quaternion.clone()
        );

        // Attributes to override
        this.collisionGroup = null;
        this.collisionTargetGroup = null;
        this.power = null;
    }

    init({
        position,
        direction,
        lifeSpan,
        collisionGroup,
        collisionTargetGroup,
        power,
        color
    }) {
        this.position = position;
        this.lookAt(tmpPosition.copy(position).add(direction));
        this.direction = direction;
        this.lifeSpan = lifeSpan;

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
        this.world.createObject(Explosion, {
            position: this.position,
            minRadius: 1,
            maxRadius: 3,
            maxOpacity: 0.75,
            color: 0xffff00,
            lifeSpan: 0.25
        });
        this.destroy();
    }

    canCollideWith(object) {
        return object.collisionGroup === this.collisionTargetGroup;
    }

    update(dt) {
        this.position = this.position.add(this.direction.clone().multiplyScalar(dt));
        this.lifeSpan -= dt;
        if (this.lifeSpan < 0) {
            this.destroy();
        }
    }
}
