/**
 * Copyright (C) 2015 The Proxemy Fighter 3D Team
 * Licensed under the General Public License, see the file gpl.txt at the root for details.
 */

import {execCallbacks} from "src/core/util";

export class Sights {

    constructor(domElement, window, pos, w, h) {
        this.domElement = domElement;
        this._w = w;
        this._h = h;
        this._window = window;
        let clientRect = domElement.getBoundingClientRect();
        this._halfWidth = null;
        this._halfHeight = null;
        this._position = [
            clientRect.left,
            clientRect.top
        ];

        this._positionChangedCallbacks = [];
    }

    handleMove(dx, dy) {
        if (this._halfWidth === null && this._halfHeight === null) {
            let clientRect = this.domElement.getBoundingClientRect();
            this._halfWidth = clientRect.width / 2;
            this._halfHeight = clientRect.height / 2;
        }

        this._position[0] =  Math.min(
            Math.max(this._position[0] + dx + this._halfWidth, 0),
            this._window.innerWidth
        ) - this._halfWidth;

        this._position[1] = Math.min(
            Math.max(this._position[1] - dy + this._halfHeight, 0),
            this._window.innerHeight
        ) - this._halfHeight;

        this.domElement.style.left = `${this._position[0]}px`;
        this.domElement.style.top = `${this._position[1]}px`;

        let x = (this._position[0] + this._halfWidth) / this._window.innerWidth;
        x = (2*x-1);

        let y = (this._position[1] + this._halfHeight) / this._window.innerHeight;
        y = (2*y-1);

        execCallbacks(this._positionChangedCallbacks, x, y);
    }

    onPositionChanged(callback) {
        this._positionChangedCallbacks.push(callback);
    }
}
