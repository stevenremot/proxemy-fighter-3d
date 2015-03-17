import THREE from "mrdoob/three.js";
import {WorldObject} from "src/world/object";

const ORIGIN = new THREE.Vector3();
const LENGTH = 25;
/*
 * Orientable cannon modelisation
 * relativePosition is [rightOffset, upOffset]
 * parent is a spherical object
 */
export class Cannon extends WorldObject {
    constructor(world, parent, relativePosition) {
        super(world);
        
        let geometry = new THREE.CylinderGeometry(2, 2, LENGTH, 32, 1, false);
        let m = new THREE.Matrix4();
        m.makeTranslation(0,LENGTH/2,0);
        geometry.applyMatrix(m);
        m.makeRotationX(Math.PI/2);
        geometry.applyMatrix(m);

        let material = new THREE.MeshBasicMaterial({ color: 0xff1111 });
        this.model = new THREE.Mesh(geometry, material);

        this._parent = parent;

        this._rightOffset = relativePosition[0];
        this._upOffset = relativePosition[1];

        this._shootPosition = new THREE.Vector3();
        this.forward = new THREE.Vector3(-1,0,0);
        this.lookAt(ORIGIN);
    }

    updatePosition() {
        let ppos = this._parent.position.clone();
        let pright = this._parent.right.clone();
        let pup = this._parent.up.clone();

        this.position.copy(
           ppos.add(
                pright.multiplyScalar(this._rightOffset))
                .add(
                    pup.multiplyScalar(this._upOffset))
        );
    }

    lookAt(position) {
        this.forward.copy(
            position.clone().sub(this.position).normalize()
        );
        super.lookAt(position);
    }

    get shootPosition() {
        this._shootPosition.copy(this.position).add(this.forward.clone().multiplyScalar(LENGTH));
        return this._shootPosition;
    }
}
