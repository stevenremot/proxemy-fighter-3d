/**
 * Copyright (C) 2015 Alexandre Kazmierowski, Steven Rémot
 * Licensed under the General Public License, see the file gpl.txt at the root for details.
 */

import * as THREE from "three";

/**
 * @description
 * Service in charge of loading models.
 */
export class ModelLoader {
  constructor() {
    this._threeObjLoader = new THREE.OBJLoader();
    this._threeMtlLoader = new THREE.MTLLoader();
  }

  /**
   * @description
   * Load a collection of models.
   *
   * @param {Map} models - map whose keys are model names and values are URLs.
   *
   * @returns {Promise} A promise that resolves to a new Map associated model names
   *                    and loaded objects + materials.
   */
  loadModels(models) {
    let promises = [];
    let loadedModels = new Map();

    for (let pair of models) {
      promises.push(
        this.loadModel(pair[1]).then(object =>
          loadedModels.set(pair[0], object)
        )
      );
    }

    return Promise.all(promises).then(() => loadedModels);
  }

  /**
   * @description
   * Load the obj model located at the specified URL.
   *
   * @param {String} url - URL, without *.obj
   *
   * @returns {Promise} A promise that resolves to the 3D object
   *                    representing the obj model.
   */
  loadModel(resource) {
    return new Promise((resolve, reject) => {
      this._threeMtlLoader.load(`${resource.mtl}`, materials => {
        materials.preload();
        this._threeObjLoader.setMaterials(materials);
        this._threeObjLoader.load(`${resource.obj}`, resolve, () => {}, reject);
      });
    });
  }
}
