/**
 * Copyright (C) 2015 Alexandre Kazmierowski, Steven Rémot
 * Licensed under the General Public License, see the file gpl.txt at the root for details.
 */

import THREE from 'mrdoob/three.js';

import {Module} from "./boss/module";
import {WorldObject} from "./object";
import {Sphere} from "src/collision/sphere";
import {Explosion} from './explosion';

export class Boss extends WorldObject {
    constructor(world, radius) {
        super(world);

        this.radius = radius;

        let widthSegments = 24; //default value
        let heightSegments = 18; //default value
        let geometry = new THREE.SphereGeometry(radius, widthSegments, heightSegments);
        let material = new THREE.MeshBasicMaterial({color: 0x999999});
        this.model = new THREE.Mesh(geometry, material);

        this.collisionBody = new Sphere(
            this.model.position.clone(),
            radius
        );
        this.collisionGroup = "boss";
        this.pickable = true;

        this.modules = [];
        this._onDeadCallbacks = [];
    }

    get hud() {
        return this._hud;
    }

    set hud(hud) {
        this._hud = hud;
    }

    canCollideWith(object) {
        return object.collisionGroup === "player-shot";
    }

    onCollisionWith(object) {
        this._hud.handlePointsAdded(1);
        // Using object position to check collision is not the
        // most precise method, but it should be sufficient in our
        // case.
        let position = object.position;

        for (let bossModule of this.modules) {
            if (bossModule.isAlive() &&
                bossModule.isPointInAngularRange(position)) {
                bossModule.hurt(object.power);
                break;
            }
        }

        if (!this.isAlive()) {
            this._triggerOnDead();
            this.world.createObject(Explosion, {
                position: this.position,
                minRadius: 1,
                maxRadius: 150,
                maxOpacity: 1,
                color: 0xff00ff,
                lifeSpan: 2
            });
            this.destroy();
        }
    }

    addModule(thetaRange, phiRange, c) {
        let life = 100;
        let material = new THREE.MeshLambertMaterial({color: c});
        this.modules.push(
            this.world.createObject(
                Module,
                {
                    radius: this.radius+0.1,
                    thetaRange: thetaRange,
                    phiRange: phiRange,
                    material: material,
                    life: life,
                    boss: this
                }
            )
        );
        return this;
    }

    /**
     * @description
     * Register a callback to call when boss is dead.
     *
     * @returns this
     */
    onDead(callback) {
        this._onDeadCallbacks.push(callback);
        return this;
    }

    _triggerOnDead() {
        for (let callback of this._onDeadCallbacks) {
            callback();
        }
    }

    /**
     * @description
     * Return true if at least one module is alive, false otherwise.
     *
     * @returns {Boolean}
     */
    isAlive() {
        for (let bossModule of this.modules) {
            if (bossModule.isAlive()) {
                return true;
            }
        }
        return false;
    }

    onDestroy() {
        for (let bossModule of this.modules) {
            bossModule.destroy();
        }
    }
}
