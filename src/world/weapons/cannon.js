import THREE from "mrdoob/three.js";
import {WorldObject} from "src/world/object";

const ORIGIN = new THREE.Vector3();
const LENGTH = 20;

let tmpUp = new THREE.Vector3();
let tmpRight = new THREE.Vector3();
let tmpOffsetedPosition = new THREE.Vector3();

let tmpParentPos = new THREE.Vector3();
let tmpParentRight = new THREE.Vector3();
let tmpParentUp = new THREE.Vector3();

/*
 * Orientable cannon modelisation
 * relativePosition is [rightOffset, upOffset]
 * parent is a spherical object
 */
export class Cannon extends WorldObject {
    constructor(world, parent, [ relativeX, relativeY ], model) {
        super(world);

        if (!model) {
            let geometry = new THREE.CylinderGeometry(2, 2, LENGTH, 32, 1, false);
            let m = new THREE.Matrix4();
            m.makeTranslation(0,LENGTH/2,0);
            geometry.applyMatrix(m);
            m.makeRotationX(Math.PI/2);
            geometry.applyMatrix(m);

            let material = new THREE.MeshBasicMaterial({ color: 0xff1111 });
            this.model = new THREE.Mesh(geometry, material);
        } else {
            this.model = model;
        }

        this._parent = parent;

        this._rightOffset = relativeX;
        this._upOffset = relativeY;

        this._shootPosition = new THREE.Vector3();
        this.forward = new THREE.Vector3(-1,0,0);
        this.lookAt(ORIGIN);
    }

    updatePosition() {
        tmpParentPos.copy(this._parent.position);
        tmpParentRight.copy(this._parent.right);
        tmpParentUp.copy(this._parent.up);

        this.position.copy(
           tmpParentPos.add(
                tmpParentRight.multiplyScalar(this._rightOffset))
                .add(
                    tmpParentUp.multiplyScalar(this._upOffset))
        );
    }

    lookAt(position) {
        this.forward.copy(
            tmpParentPos.copy(position).sub(this.position).normalize()
        );
        super.lookAt(position);
        this.model.updateMatrixWorld();
    }

    get shootPosition() {
        this._shootPosition.copy(this.position).add(this.forward.clone().multiplyScalar(LENGTH));
        return this._shootPosition;
    }

    offsetedShootPosition(offset) {
        let rightOffset = offset[0];
        let upOffset = offset[1];
        tmpUp.set(0,1,0);
        this.model.localToWorld(tmpUp);
        tmpRight.set(1,0,0);
        this.model.localToWorld(tmpRight);

        this._shootPosition.copy(this.position).add(this.forward.clone().multiplyScalar(LENGTH));
        tmpOffsetedPosition.copy(this._shootPosition)
            .add(tmpRight.normalize().multiplyScalar(rightOffset))
            .add(tmpUp.normalize().multiplyScalar(upOffset));
        return tmpOffsetedPosition;
    }
}
