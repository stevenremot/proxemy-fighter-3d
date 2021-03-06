/**
 * Copyright (C) 2015 Alexandre Kazmierowski, Steven Rémot
 * Licensed under the General Public License, see the file gpl.txt at the root for details.
 */

/**
 * @description
 * Game object linked to a world.
 *
 * It can be displayed and have collisions.
 */
export class WorldObject {
  constructor(world) {
    this.world = world;
    this._model = null;
    this._collisionBody = null;

    /**
     * @param {Number} collisionGroup
     */
    this.collisionGroup = null;

    this.pickable = false;
  }

  /**
   * @property {bool} pickable
   */
  get pickable() {
    return this._pickable;
  }

  set pickable(bool) {
    this._pickable = bool;
    if (this._pickable) this.world.renderContext.camera.addPickingObject(this);
  }

  /**
   * @property {THREE.Mesh} model
   */
  get model() {
    return this._model;
  }

  set model(model) {
    if (this._model) {
      this.world.renderContext.removeModel(this._model);
    }

    if (typeof model === "string") {
      let modelObject = this.getModelFromCollection(model);
      if (modelObject === undefined) {
        throw new Error(`Could not find model "${model} in collection"`);
      }
      this._model = modelObject.clone();
    } else {
      this._model = model;
    }

    if (model) {
      this.world.renderContext.addModel(this._model);
    }
  }

  /**
   * @property {Object} collisionBody
   *
   * Has a function property collidesWith with takes another body as
   * parameter and returns a boolean.
   */
  get collisionBody() {
    return this._collisionBody;
  }

  set collisionBody(body) {
    this._collisionBody = body;
  }

  /**
   * @description
   * Return true if the object can collide with the
   * provided object, false otherwise.
   *
   * This method is called before checking collision to avoid doing
   * heavy maths when not necesary.
   *
   * @param {WorldObject} object
   *
   * @returns {Boolean}
   */
  canCollideWith(object) {
    return true;
  }

  /**
   * @description
   * Function called when the object enters in collision with
   * another object.
   *
   * @param {WorldObject} object
   */
  onCollisionWith(object) {}

  /**
   * @returns {Boolean}
   */
  hasCollisionBody() {
    return this._collisionBody !== null;
  }

  get position() {
    return this._model && this._model.position;
  }

  set position(position) {
    if (this._model) {
      this._model.position.copy(position);
    }
    if (this._collisionBody) {
      this._collisionBody.position = this.position;
    }
  }

  get up() {
    return this._model && this._model.up;
  }

  set up(up) {
    if (this._model) {
      this._model.up.copy(up);
    }
  }

  get matrix() {
    return this._model.matrix;
  }

  lookAt(position) {
    if (this._model) {
      this._model.lookAt(position);

      this._updateCollisionBodyQuaternion();
    }
  }

  /**
   * @description
   * Function to override when creating a live object.
   *
   * @param {Number} dt - time elapsed in seconds since the last update
   */
  update(dt) {}

  /**
   * @description
   * Rotate the object in space.
   *
   * Will apply rotations in the order X, Y, Z.
   *
   * @param {Number} x
   * @param {Number} y
   * @param {Number} z
   *
   * @returns this
   */
  rotate(x, y, z) {
    this.model.rotation.x += x;
    this.model.rotation.y += y;
    this.model.rotation.z += z;

    this._updateCollisionBodyQuaternion();

    return this;
  }

  destroy() {
    if (this.pickable)
      this.world.renderContext.camera.removePickingObject(this);
    this.world.destroy(this);
  }

  _updateCollisionBodyQuaternion() {
    if (this._collisionBody && "quaternion" in this._collisionBody) {
      this._collisionBody.quaternion = this._model.quaternion;
    }
  }

  /**
   * @description
   * Method to call when an objet is destroyed by the world.
   */
  onDestroy() {}

  getModelFromCollection(modelName) {
    return this.world.renderContext.modelCollection.get(modelName);
  }
}
