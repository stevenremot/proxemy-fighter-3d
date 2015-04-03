/**
 * Copyright (C) 2015 Alexandre Kazmierowski, Steven Rémot
 * Licensed under the General Public License, see the file gpl.txt at the root for details.
 */

import THREE from "mrdoob/three.js";

export class Detector {
    constructor(camera, scene) {
        this._raycaster = new THREE.Raycaster();
        this._camera = camera;
        this._scene = scene;
    }

    isVisible(object) {
        return this._camera.frustum.intersectsObject(object.model);
    }

    isOccluded(object) {
        // cast 1 ray in each direction to avoid backface culling
        let origin = object.position;
        let dest = this._camera.position;
        let dist = origin.distanceTo(dest);
        let dir = dest.clone().sub(origin).normalize();

        let intersections = this._raycast(origin, dir);
        if (intersections.length > 0) {
            let closestDistance = intersections[0].distance;
            if (closestDistance < dist)
                return true;
        }

        dir = origin.clone().sub(dest).normalize();
        intersections = this._raycast(dest, dir);
        if (intersections.length > 0) {
            if (intersections[0].object.id != object.model.id)
            {
                let closestDistance = intersections[0].distance;
                if (closestDistance < dist)
                    return true;
            }
        }

        return false;
    }

    raycast(origin, dir) {
        this._raycaster.set(origin, dir);
        return this._raycaster.intersectObjects(this._scene.children);
    }

    raycastToObject(origin, dir, object) {
        this._raycaster.set(origin, dir);
        return this._raycaster.intersectObject(object.model);
    }

    get frustum() {
        return this._camera.frustum;
    }

}
