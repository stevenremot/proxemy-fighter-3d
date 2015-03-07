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
