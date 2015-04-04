/**
 * Copyright (C) 2015 Alexandre Kazmierowski, Steven Rémot
 * Licensed under the General Public License, see the file gpl.txt at the root for details.
 */


import THREE from 'mrdoob/three.js';

import {WorldObject}from './object';

/**
 * @description
 * THIS IS THE EXPLOSION
 */
export class Explosion extends WorldObject {
    constructor(world) {
        super(world);
        let geometry = new THREE.SphereGeometry(1, 32, 32);
        this._material = new THREE.MeshBasicMaterial({
            color: 0x0000ff
        });
        this._material.transparent = true;
        this.model = new THREE.Mesh(geometry, this._material);

        this._minRadius = 0;
        this._maxRadius = 0;
        this._lifeSpan = 0;
        this._lifeTime = 0;
        this._maxOpacity = 0;
    }

    /**
     * @param {THREE.Vector3} position
     * @param {Number}        minRadius
     * @param {Number}        maxRadius
     * @param {Number}        lifeSpan
     * @param {Number}        color
     */
    init({position, minRadius, maxRadius, lifeSpan, color, maxOpacity}) {
        this._lifeTime = 0;
        this._material.color.setHex(color);
        this.position = position;
        this._lifeSpan = lifeSpan;
        this._maxRadius = maxRadius;
        this._minRadius = minRadius;
        this._maxOpacity = maxOpacity;
        this.model.scale.set(minRadius, minRadius, minRadius);
    }

    update(dt) {
        this._lifeTime += dt;

        if (this._lifeTime >= this._lifeSpan) {
            this.destroy();
        } else {
            let ratio = this._lifeTime / this._lifeSpan;
            let radius = this._minRadius + (this._maxRadius - this._minRadius) * ratio;
            this.model.scale.set(radius, radius, radius);
            this._material.opacity = this._maxOpacity * ratio;
            this._material.needsUpdate = true;
        }
    }
}
