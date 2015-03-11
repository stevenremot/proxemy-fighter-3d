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

        this._model = model;

        if (model) {
            this.world.renderContext.addModel(this._model);
        }
    }

    get position() {
        return this._model && this._model.position;
    }

    set position(position) {
        if (this._model) {
            this._model.position.copy(position);
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
        }
    }

    /**
     * @description
     * Function to override when creating a live object.
     *
     * @param {Number} dt - time elapsed in seconds since the last update
     */
    update(dt) {

    }

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
        return this;
    }
}
