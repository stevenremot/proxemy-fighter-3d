/**
 * Copyright (C) 2015 Alexandre Kazmierowski, Steven Rémot
 * Licensed under the General Public License, see the file gpl.txt at the root for details.
 */

const JOYSTICK_SIZE = 150; // Magic value, I can't get it when joystick is hidden

function restrainRadius(x, y, squareAmplitude) {
    let squareRadius = x * x + y * y;
    let angle = Math.atan2(y, x);


    let restrainedRadius = Math.sqrt(
        Math.min(Math.max(squareRadius, -squareAmplitude), squareAmplitude)
    );

    return [
        Math.cos(angle) * restrainedRadius,
        Math.sin(angle) * restrainedRadius,
    ];
}

/**
 * @description
 * UI element for touch joystick.
 */
export class Joystick {

    /**
     * @param {SVGElement} domElement
     */
    constructor(domElement) {
        this.domElement = domElement;
        this._head = domElement.querySelector('.joystick-head');

        let size = JOYSTICK_SIZE;
        let localSize = +domElement.viewBox.animVal.width;
        this._halfSize = size / 2;
        this._amplitude =  localSize / 2 - this._head.getAttribute('r');
        this._squareAmplitude = this._amplitude * this._amplitude;
        this._ratio = localSize / size;

        this._position = null;
    }

    /**
     * @returns this
     */
    show() {
        this.domElement.style.display = "block";
        return this;
    }

    /**
     * @returns this
     */
    hide() {
        this.domElement.style.display = "none";
        return this;
    }

    /**
     * @returns this
     */
    resetHead() {
        this._head.setAttribute('cx', '0');
        this._head.setAttribute('cy', '0');
        return this;
    }

    /**
     * @property {Array} position
     *
     * @description
     * Joystick's base position [x, y] in pixels.
     */
    set position(pos) {
        this.domElement.style.left = `${pos[0] - this._halfSize}px`;
        this.domElement.style.top = `${pos[1] - this._halfSize}px`;
        this._position = pos;
        return this;
    }

    get position() {
        return this._position;
    }

    /**
     * @property {Array} direction
     *
     * @description
     * Current direction pointed with the joystick.
     * [dx, dy]
     */
    get direction() {
        return [
            +this._head.getAttribute('cx') / this._amplitude,
            -this._head.getAttribute('cy') / this._amplitude
        ];
    }

    /**
     * @description
     * Move the joystick head at the position [x, y] in px.
     *
     * Restrain the joystick head when it is too far.
     *
     * @param {Number} x
     * @param {Number} y
     *
     * @returns this
     */
    setHeadPosition(x, y) {
        let [headX, headY] = restrainRadius(
            (x - this._position[0]) * this._ratio,
            (y - this._position[1]) * this._ratio,
            this._squareAmplitude
        );

        this._head.setAttribute('cx', headX);
        this._head.setAttribute('cy', headY);
    }
}
