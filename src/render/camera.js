/**
 * Copyright (C) 2015 Alexandre Kazmierowski, Steven Rémot
 * Licensed under the General Public License, see the file gpl.txt at the root for details.
 */

import * as THREE from "three";
import { addMixin } from "/src/core/mixin";
import { SphericalObject } from "/src/math/spherical-object";

const FOLLOWING_COEFFICIENT = 0.25;

let tmpTarget = new THREE.Vector3();
let tmpDistance = new THREE.Vector3();

/**
 * @description
 * Camera
 */
export class Camera {
  constructor(threeCamera) {
    this._threeCamera = threeCamera;

    /**
     * @property {WorldObject}
     *
     * @description
     * The target object to follow
     */
    this.target = null;

    /**
     * @property {THREE.Vector3}
     *
     * @description
     * The position relative to the target in its [right, up,
     * forward] base.
     *
     * Actually, right is not took in account for now.
     */
    this.targetRelativePosition = null;

    this.x_relative = 0.5;
    this.y_relative = 0.5;

    this._globalTransformMatrix = new THREE.Matrix4();
    this.frustum = new THREE.Frustum();
    this._rayCaster = new THREE.Raycaster();

    this.pickingObjects = new Map();
    this._pickingObjectsArray = [];
  }

  get threeCamera() {
    return this._threeCamera;
  }

  lookAt(vector) {
    this._threeCamera.lookAt(vector);
  }

  move(vector) {
    this._threeCamera.position.x += vector.x;
    this._threeCamera.position.y += vector.y;
    this._threeCamera.position.z += vector.z;
  }

  get position() {
    return this._threeCamera.position;
  }

  set position(position) {
    this._threeCamera.position.copy(position);
  }

  get up() {
    return this._threeCamera.up;
  }

  /**
   * @description
   * Update camera's relative position to its target if it has one.
   *
   * @returns this
   */
  updateRelativePosition() {
    if (this.target && this.targetRelativePosition) {
      tmpTarget
        .copy(this.target.position)
        .add(
          this.target.forward
            .clone()
            .multiplyScalar(this.targetRelativePosition.z)
        )
        .add(
          this.target.up.clone().multiplyScalar(this.targetRelativePosition.y)
        );

      tmpDistance.copy(tmpTarget).sub(this.position);
      this.position = this.position.add(
        tmpDistance.multiplyScalar(FOLLOWING_COEFFICIENT)
      );

      this._threeCamera.up = this.target.up;
      this._threeCamera.updateMatrixWorld();
    }
    return this;
  }

  /**
   * @description
   * initialize the camera behind and slightly above the ship
   * @param shipPosition: Vector3
   * @param shipOrientation: EulerAngles? Quaternion?
   */
  setup(shipPosition, shipOrientation) {
    this.position = shipPosition;

    // todo: define/compute intelligentOffset
    let intelligentOffset = new THREE.Vector3(0, 0, 0);
    this.move(intelligentOffset);

    // todo: manage orientation
  }

  computeFrustum() {
    this._threeCamera.updateMatrix();
    this._threeCamera.updateMatrixWorld();
    this._globalTransformMatrix
      .set(this._threeCamera.projectionMatrix)
      .multiply(this._threeCamera.matrixWorldInverse);
    this.frustum.setFromMatrix(this._globalTransformMatrix);
  }

  getAimedPointForPosition(x, y, depth, vector) {
    this._rayCaster.setFromCamera({ x: x, y: -y }, this._threeCamera);

    if (!this.pickObjects(this._rayCaster.ray, vector))
      this._rayCaster.ray.at(depth, vector);
  }

  addPickingObject(object) {
    if (object.collisionBody) {
      this.pickingObjects.set(object, object.collisionBody);
      this._pickingObjectsArray.push(object.collisionBody);
    }
  }

  removePickingObject(object) {
    this.pickingObjects.delete(object);
    // recompute array
    this._pickingObjectsArray = [];
    for (let v of this.pickingObjects.values())
      this._pickingObjectsArray.push(v);
  }

  pickObjects(ray, vector) {
    let distance = -1;

    for (let o in this.pickingObjectsArray) {
      if (o.pick(ray, tmpDistance)) {
        let d = ray.origin.distanceTo(tmpDistance);
        if (d < distance || distance < 0) {
          distance = d;
          tmpTarget.copy(tmpDistance);
        }
      }
    }

    if (distance > 0) vector.copy(tmpTarget);
    return distance > 0;
  }

  /**
   * @property {Number}
   */
  get aspect() {
    return this._threeCamera.aspect;
  }

  set aspect(aspect) {
    this._threeCamera.aspect = aspect;
    this._threeCamera.updateProjectionMatrix();
  }
}

addMixin(Camera, SphericalObject);
