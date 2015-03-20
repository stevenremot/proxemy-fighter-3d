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
            let closestDistance = intersections[0].distance;
            if (closestDistance < dist)
                return true;
        }

        return false;
    }

    _raycast(origin, dir) {
        this._raycaster.set(origin, dir);
        return this._raycaster.intersectObjects(this._scene.children);
    }

}
