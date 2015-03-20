
/*
 * Steerings that drive the movement of an AI vessel
 *
 */
const MIN_DISTANCE = 20;
const REF_DISTANCE = 40;
const BASE_SPEED = 20;

export class Steerings {
    constructor(object) {
        this._object = object;
        this._components = new Map();
        this._steeringSpeed = new THREE.Vector3();

        this._components.set("follow", new THREE.Vector3());
    }

    follow(target) {
        let distance = this._object.position.distanceTo(target);
        let intensity = 1;
        if (distance > MIN_DISTANCE && distance < REF_DISTANCE)
            intensity = (distance - MIN_DISTANCE) / (REF_DISTANCE - MIN_DISTANCE);
        else if(distance < MIN_DISTANCE)
            intensity = 0;

        let follow = target.clone().sub(this._object.position).normalize().multiplyScalar(intensity*BASE_SPEED);
        this._components.get("follow").copy(follow);
    }
    
    computeSpeed() {
        this._steeringSpeed.set(0,0,0);
        for (let s of this._components.values()) {
            this._steeringSpeed.add(s);
        }
    }
}
