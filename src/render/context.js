import {Camera} from "./camera"

/**
 * @description
 * Class containing all global objects related to a 3D context:
 * - renderer
 * - camera
 * - scene
 */
export class Context {
    constructor(renderer, threeCamera, scene) {
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
        this.camera = new Camera(threeCamera);
    }

    addModel(model) {
        this.scene.add(model);
    }

    removeModel(model) {
        this.scene.remove(model);
    }

    render() {
        this.renderer.render(this.scene, this.camera.threeCamera);
    }

    get domElement() {
        return this.renderer.domElement;
    }
}
