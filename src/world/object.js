export class WorldObject {
    constructor(world) {
        this.world = world;
        this._model = null;
    }

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

    rotate(x, y, z) {
        this.model.rotation.x += x;
        this.model.rotation.y += y;
        this.model.rotation.z += z;
        return this;
    }
}
