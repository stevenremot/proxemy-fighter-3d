import {WorldObject} from "./object";
import {Steerings} from "src/ai/steerings";

const DEFAULT_SPEED = 20;

export class AiVessel extends WorldObject {
    constructor(world) {
        super(world);
        
        this._steerings = new Steerings(this, world.detector);
        this._speed = DEFAULT_SPEED;
    }

    get target() {
        return this._steerings.target;
    }

    set target(target) {
        this._steerings.target = target;
    }

    get speed() {
        return this._speed;
    }

    set speed(speed) {
        this._speed = speed;
    }

    update(dt) {
        let velocity = this._steerings.computeSpeed();
        this.position.add(velocity.multiplyScalar(dt*this._speed));

        this.lookAt(this.position.clone().add(velocity));
    }
}
