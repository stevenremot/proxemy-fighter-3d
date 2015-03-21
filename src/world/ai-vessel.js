import {WorldObject} from "./object";
import {Steerings} from "src/ai/steerings";
import {LifeContainer} from "./life-container";
import {addMixin} from "src/core/mixin";

// for BuddyCube
import {Box} from "src/collision/box";

const DEFAULT_SPEED = 20;

export class AiVessel extends WorldObject {
    constructor(world, life) {
        super(world);
        
        this._steerings = new Steerings(this, world.detector);
        this._speed = DEFAULT_SPEED;

        this.life = life;

        this.collisionGroup = "ai";

        this._onDeadCallbacks = [];
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

    onCollisionWith(object) {
        if (object.collisionGroup === 'player-shot') {
            this.hurt(object.power);
            
            if (!this.isAlive())
                this._triggerOnDead();
        }
    }

    onDead(callback) {
        this._onDeadCallbacks.push(callback);
        return this;
    }

    _triggerOnDead() {
        for (let callback of this._onDeadCallbacks) {
            callback();
        }
    }
}

addMixin(AiVessel, LifeContainer);

/**
 * Example for testing purpose
 */
export class BuddyCube extends AiVessel {
    constructor(world, life, ship) {
        super(world, life);

        let geometry = new THREE.BoxGeometry(10,10,10);
        let material = new THREE.MeshBasicMaterial({color: 0xff00ff});
        this.model = new THREE.Mesh(geometry, material);
        this.position = new THREE.Vector3(50,0,0);
        this.target = ship;

        this.collisionBody = new Box(
            this.position,
            new THREE.Vector3(10,10,10),
            this.model.quaternion
        );
    }
}
