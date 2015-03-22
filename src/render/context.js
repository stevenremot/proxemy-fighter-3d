import {Camera} from "./camera";

/**
 * @description
 * Class containing all global objects related to a 3D context:
 * - renderer
 * - camera
 * - scene
 */
export class Context {
    constructor(renderer, threeCamera, scene, modelCollection) {
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

        this.modelCollection = modelCollection;
    }

    /**
     * @description
     * Add a THREE model to the scene.
     *
     * @param {THREE.Mesh} model
     *
     * @returns this
     */
    addModel(model) {
        this.scene.add(model);
        return this;
    }

    /**
     * @description
     * Remove a THREE model from the scene.
     *
     * @param {THREE.Mesh} model
     *
     * @returns this
     */
    removeModel(model) {
        this.scene.remove(model);
        return this;
    }

    /**
     * @description
     * Render the current scene.
     *
     * @returns this
     */
    render() {
        this.renderer.render(this.scene, this.camera.threeCamera);
        return this;
    }

    /**
     * Return the canvas in which the rendering is done.
     *
     * @returns {HTMLCanvasElement}
     */
    get domElement() {
        return this.renderer.domElement;
    }

    /**
     * @description
     * Resize the rendering area.
     */
    setSize(width, height) {
        this.renderer.setSize(width, height);
        this.camera.aspect = width / height;
    }
}
