/**
 * @description
 * Class containing all global objects related to a 3D context:
 * - renderer
 * - camera
 * - scene
 */
export class Context {
    constructor(renderer, camera, scene) {
        /**
         * @description
         * Scene renderer
         */
        this.renderer = renderer;

        /**
         * @description
         * Scene graph
         */
        this.scene = scene;

        /**
         * @description
         * Well... camera
         */
        this.camera = camera;
    }

    addModel(model) {
        this.scene.add(model);
    }

    removeModel(model) {
        this.scene.remove(model);
    }

    render() {
        this.renderer.render(this.scene, this.camera);
    }

    get domElement() {
        return this.renderer.domElement;
    }
}
