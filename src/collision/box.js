import THREE from 'mrdoob/three.js';

let sqrt2 = Math.sqrt(2);

/**
 * @description
 * Computes the range of the projection of points on edge.
 *
 * @param {THREE.Vector3} edge
 * @param {THREE.Vector3[]} points
 *
 * @returns {Array} [min, max]
 */
function getPointsProjectionRange(edge, points) {
    let min = null, max = null;

    for (let point of points) {
        let projection = edge.dot(point);
        if (min === null || projection < min) {
            min = projection;
        }
        if (max === null || projection > max) {
            max = projection;
        }
    }

    return [min, max];
}

/**
 * @description
 * A box collision body.
 */
export class Box {
    /**
     * @param {THREE.Vector3}    position
     * @param {THREE.Vector3}    size
     * @param {THREE.Quaternion} rotation
     */
    constructor(position, size, quaternion) {
        this._position = position;
        this._size = size;
        this._quaternion = quaternion;
        this._points = [];
        this._edges = [
            new THREE.Vector3(),
            new THREE.Vector3(),
            new THREE.Vector3()
        ];
        this.boundingBox = new THREE.Box3();
        this._boundingBoxDirty = true;
        this._dirty = true;
        this._bboxDirty = true;
    }

    updateBoundingBox() {
        let boxSize = Math.max(this._size.x, this._size.y, this._size.z) * sqrt2;
        this.boundingBox.setFromCenterAndSize(
            this._position,
            new THREE.Vector3(boxSize, boxSize, boxSize)
        );

        this._bboxDirty = false;
    }

    _updateElements() {
        this.updateBoundingBox();
        this._updatePoints();
        this._updateEdges();
        this._dirty = false;
    }

    _updateEdges() {
        this._edges[0].set(1, 0, 0).applyQuaternion(this._quaternion);
        this._edges[1].set(0, 1, 0).applyQuaternion(this._quaternion);
        this._edges[2].set(0, 0, 1).applyQuaternion(this._quaternion);
    }

    _updatePoints() {
        this._points.length = 0;
        let offset = new THREE.Vector3();

        for (var x = -1; x <= 1; x += 2) {
            for (var y = -1; y <= 1; y += 2) {
                for (var z = -1; z <= 1; z += 2) {
                    let point = this._position.clone();
                    offset.set(this._size.x * x / 2, this._size.y * y / 2, this._size.z * z / 2)
                        .applyQuaternion(this._quaternion);
                    this._points.push(point.add(offset));
                }
            }
        }
    }

    /**
     * @property {THREE.Vector3}
     */
    get position() {
        return this._position;
    }

    set position(position) {
        this._position.copy(position);
        this._dirty = true;
        this._bboxDirty = true;
    }

    /**
     * @property {THREE.Vector3}
     */
    get size() {
        return this._size;
    }

    set size(size) {
        this._size.set(size);
        this._dirty = true;
        this._bboxDirty = true;
    }

    /**
     * @property {THREE.Quaternion}
     */
    get quaternion() {
        return this._quaternion;
    }

    set quaternion(quaternion) {
        this._quaternion = quaternion;
        this._dirty = true;
    }

    ensureBboxNotDirty() {
        if (this._bboxDirty) this.updateBoundingBox();
    }

    ensureNotDirty() {
        this.ensureBboxNotDirty();
        if (this._dirty) this._updateElements();
    }

    /**
     * @description
     * Returns true if it is in collision with the object, false otherwise.
     *
     * @param {Object} object
     *
     * @returns {Boolean}
     */
    collidesWith(object) {
        this.ensureBboxNotDirty();

        if (object instanceof Box) {
            return this._collidesWithBox(object);
        } else {
            return object.collidesWith(this);
        }
    }

    _collidesWithBox(box) {
        box.ensureBboxNotDirty();
        if (!this.boundingBox.isIntersectionBox(box.boundingBox)) {
            return false;
        }

        this.ensureNotDirty();
        box.ensureNotDirty();

        let edges = this._edges.concat(box._edges);

        for (let edge of edges) {
            let [thisMin, thisMax] = getPointsProjectionRange(edge, this._points);
            let [otherMin, otherMax] = getPointsProjectionRange(edge, box._points);

            if (thisMin > otherMax || thisMax < otherMin) {
                return false;
            }
        }

        return true;
    }
}
