import {Lifebar} from "./hud/lifebar";
import {Sights} from "./hud/sights";
import {execCallbacks} from "./core/util";

export class Hud {
    constructor(document, max_hp) {
        this._callbacks = {
            onLifeChanged: [],
            onPointerMoved: []
        };
        
        this._lifebar = new Lifebar(document.getElementById('lifebar'), max_hp);
        this._lifebar.setPosition(5, 5);
        this._sights = new Sights(document.getElementById('sights'), [200,200], 140, 80);
        this.registerDefaultCallbacks();
    }

    registerDefaultCallbacks() {
        this.onLifeChanged((current_hp) => this._lifebar.update(current_hp));
        this.onPointerMoved((dx, dy) => this._sights.handleMove(dx, dy));
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

    onPointerMoved(callback) {
        this._callbacks.onPointerMoved.push(callback);
        return this;
    }

    handleLifeChanged(current_hp)
    {
        execCallbacks(this._callbacks.onLifeChanged, current_hp);
    }

    handlePointerMoved(dx, dy)
    {
        execCallbacks(this._callbacks.onPointerMoved, dx, dy);
    }

    
}
