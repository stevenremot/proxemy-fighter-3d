import {StraightBullet} from "./straight";

const BULLET_POWER = 1;
const LIFE_SPAN = 1.5;

/**
 * @description
 * The projectile shot by the gatling.
 */
export class GatlingBullet extends StraightBullet {

    /**
     * @constructor
     *
     * @param {World} world
     * @param {THREE.Vector3} position
     * @param {THREE.Vector3} direction
     */
    constructor(world, position, direction) {
        super(world, {
            position: position,
            direction: direction,
            lifeSpan: LIFE_SPAN,
            collisionGroup: 'boss',
            collisionTargetGroup: 'player',
            power: BULLET_POWER,
            color: 0x00c0c0
        });
    }
}