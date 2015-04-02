/**
 * Copyright (C) 2015 The Proxemy Fighter 3D Team
 * Licensed under the General Public License, see the file gpl.txt at the root for details.
 */

import {StraightBullet} from './straight';

const BULLET_POWER = 1;
const LIFE_SPAN = 0.5;

/**
 * @description
 * The projectile shot by the player ship.
 */
export class ShipBullet extends StraightBullet {

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
            collisionGroup: 'player-shot',
            collisionTargetGroup: 'boss',
            power: BULLET_POWER,
            color: 0xc0c000
        });
    }
}
