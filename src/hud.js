import {Lifebar} from "./hud/lifebar";
import {execCallbacks} from "./core/util";

export class Hud {
    constructor(document, max_hp) {
        this._callbacks = {
            onLifeChanged: []
        };
        
        this._lifebar = new Lifebar(document.getElementById('lifebar'), max_hp);
        this._lifebar.setPosition(5, 5);
        this.registerDefaultCallbacks();
    }

    registerDefaultCallbacks() {
        this.onLifeChanged((current_hp) => this._lifebar.update(current_hp));
    }

    /**
     * @description
     * Register a callback to call when the player's life has changed
     * The callback takes current_hp as argument
     *
     * @param {Function} callback
     * @return this
     */
    onLifeChanged(callback) {
        this._callbacks.onLifeChanged.push(callback);
        return this;
    }

    handleLifeChanged(current_hp)
    {
        execCallbacks(this._callbacks.onLifeChanged, current_hp);
    }

    
}
