import {WorldObject} from "./world/object";

/**
 * @description
 * Represent a game world.
 *
 * Contains all systems: rendering, GUI, input and collision
 */
export class World {
    constructor(renderContext) {
        this.renderContext = renderContext;
    }

    /**
     * @description
     * Create a new object linked to the world.
     *
     * @returns {WorldObject}
     */
    createObject() {
        return new WorldObject(this);
    }
}
