/**
 * Copyright (C) 2015 The Proxemy Fighter 3D Team
 * Licensed under the General Public License, see the file gpl.txt at the root for details.
 */

import {Lifebar} from "./hud/lifebar";
import {Sights} from "./hud/sights";
import {Score} from "./hud/score";
import {execCallbacks} from "./core/util";

export class Hud {
    constructor(window, max_hp) {
        this._callbacks = {
            onLifeChanged: [],
            onPointerMoved: [],
            onPointsAdded: []
        };
        let document = window.document;

        this._lifebar = new Lifebar(document.getElementById('lifebar'), max_hp);
        this._lifebar.setPosition(5, 5);
        this._sights = new Sights(document.getElementById('sights'), window);
        this._score = new Score(document.getElementById('score'));
        this.registerDefaultCallbacks();
    }

    registerDefaultCallbacks() {
        this.onLifeChanged((current_hp) => this._lifebar.update(current_hp));
        this.onPointerMoved((dx, dy) => this._sights.handleMove(dx, dy));
        this.onPointsAdded((points) => this._score.add(points));
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

    onPointsAdded(callback) {
        this._callbacks.onPointsAdded.push(callback);
    }

    handleLifeChanged(current_hp) {
        execCallbacks(this._callbacks.onLifeChanged, current_hp);
    }

    handlePointerMoved(dx, dy) {
        execCallbacks(this._callbacks.onPointerMoved, dx, dy);
    }

    handlePointsAdded(points) {
        execCallbacks(this._callbacks.onPointsAdded, points);
    }

    get sights() {
        return this._sights;
    }

}
