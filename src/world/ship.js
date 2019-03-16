/**
 * Copyright (C) 2015 Alexandre Kazmierowski, Steven Rémot
 * Licensed under the General Public License, see the file gpl.txt at the root for details.
 */

import * as THREE from "three";

import { WorldObject } from "./object";
import { SphericalObject } from "/src/math/spherical-object";
import { addMixin } from "/src/core/mixin";
import { ShipBullet } from "./bullet/ship";
import { Cannon } from "./weapons/cannon";
import { Pattern } from "./weapons/pattern";
import { LifeContainer } from "./life-container";
import { Box, BoxDebugView } from "/src/collision/box";
import { Explosion } from "./explosion";

const ORIGIN = new THREE.Vector3(0, 0, 0);
const SHOOT_FREQUENCY = 1 / 10;
const BULLET_SPEED = 350;
const ANGULAR_SPEED = 0.75;

let tmpAimedPoint = new THREE.Vector3();

export class ShipTurret extends WorldObject {
  constructor(world) {
    super(world);
    this.model = "ship-turret";
    this.model.scale.set(2, 2, 2);

    this._plane = new THREE.Plane();
  }

  lookAt(position) {
    this._plane.setFromNormalAndCoplanarPoint(this.up, this.position);
    this._plane.projectPoint(position, tmpAimedPoint);
    super.lookAt(tmpAimedPoint);
  }
}

export class Ship extends WorldObject {
  constructor(world, angularSpeed, maxLife) {
    super(world);

    this.model = "ship";
    this.model.scale.set(2, 2, 2);
    this.collisionBody = new Box(
      this.position,
      new THREE.Vector3(32, 4, 8),
      this.model.quaternion
    );

    this.collisionGroup = "player";

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

    this._turret = world.createObject(ShipTurret);
    this._cannon = world.createObject(Cannon, this, [0, 7.5], "ship-shotgun");
    this._cannon.model.scale.set(2, 2, 2);
    this._pattern = new Pattern(2 * SHOOT_FREQUENCY)
      .addShoot([-2, 0], 0)
      .addShoot([2, 0], SHOOT_FREQUENCY);

    this.maxLife = maxLife;
    this.life = maxLife;
    this.onLifeChanged(() => {
      if (!this.isAlive()) {
        this.world.createObject(Explosion, {
          position: this.position,
          minRadius: 1,
          maxRadius: 20,
          color: 0xffff00,
          lifeSpan: 1,
          maxOpacity: 0.9
        });
        this.destroy();
      }
    });
  }

  update(dt) {
    this.moveOnSphere(
      this.horizontalSpeed * dt * ANGULAR_SPEED,
      this.verticalSpeed * dt * ANGULAR_SPEED
    ).lookAt(ORIGIN);

    this._turret.position.copy(this.position);
    this._turret.up.copy(this.up);
    this._cannon.updatePosition();
    this._cannon.up.copy(this.up);
    this.updateCannonOrientation();

    if (this.isShooting) {
      this._shootBullets(this._pattern.update(dt));
    }
  }

  updateCannonOrientation() {
    this._turret.lookAt(this.aimedPoint);
    this._cannon.lookAt(this.aimedPoint);
  }

  canCollideWith(object) {
    return object.collisionGroup === "boss_shot";
  }

  onCollisionWith(object) {
    this.hurt(object.power);
  }

  _shootOneBullet() {
    this.world.createObject(
      ShipBullet,
      this._cannon.shootPosition,
      this._cannon.forward.clone().multiplyScalar(BULLET_SPEED)
    );

    this._shootOffset = -this._shootOffset;
  }

  _shootBullets(positions) {
    for (let pos of positions) {
      this.world.createObject(
        ShipBullet,
        this._cannon.offsetedShootPosition(pos),
        this._cannon.forward.clone().multiplyScalar(BULLET_SPEED)
      );
    }
  }

  onDestroy() {
    this._turret.destroy();
    this._cannon.destroy();
  }
}

addMixin(Ship, SphericalObject);
addMixin(Ship, LifeContainer);
