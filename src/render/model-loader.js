import THREE from 'mrdoob/three.js';

/**
 * @description
 * Service in charge of loading models.
 */
export class ModelLoader {
    constructor() {
        this._threeLoader = new THREE.OBJLoader();
    }

    /**
     * @description
     * Load a collection of models.
     *
     * @param {Map} models - map whose keys are model names and values are URLs.
     *
     * @returns {Promise} A promise that resolves to a new Map associated model names
     *                    and loaded objects.
     */
    loadModels(models) {
        let promises = [];
        let loadedModels = new Map();

        for (let pair of models) {
            promises.push(
                this.loadModel(pair[1]).then(
                    (object) => loadedModels.set(pair[0], object)
                )
            );
        }

        return Promise.all(promises).then(() => loadedModels);
    }

    /**
     * @description
     * Load the obj model located at the specified URL.
     *
     * @returns {Promise} A promise that resolves to the 3D object
     *                    representing the obj model.
     */
    loadModel(url) {
        return new Promise((resolve, reject) => {
            this._threeLoader.load(url, resolve, () => {}, reject);
        });
    }
}
