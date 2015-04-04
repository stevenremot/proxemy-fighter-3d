/**
 * Copyright (C) 2015 Alexandre Kazmierowski, Steven Rémot
 * Licensed under the General Public License, see the file gpl.txt at the root for details.
 */

import {KeyboardInput} from "./keyboard";
import {TouchInput} from "./touch";

/**
 * @description
 * Class in charge of aggregating all inputs so that outside code does
 * not have to deal with different input sources.
 */
export class Aggregate {
    constructor(document, canvas) {
        this.inputs = [
            new KeyboardInput(document, canvas),
            new TouchInput(document, canvas)
        ];
    }

    lock() {
        this.inputs[0].lock();
    }

    /**
     * @description
     * Register a callback to call when the 2D movement is changing.
     *
     * The callback takes dx and dy as arguments, with values between
     * -1 and 1.
     *
     * @param {Function} callback
     *
     * @returns this
     */
    onDirectionChanged(callback) {
        this.inputs.forEach((input) => input.onDirectionChanged(callback));
        return this;
    }

    /**
     * @description
     * Register a callback to call when the user is trying to move the
     * pointer.
     *
     * The callbacks takes dx and dy as arguments, which are not
     * bounded values.
     *
     * @param {Function} callback
     *
     * @returns this
     */
    onPointerMoved(callback) {
        this.inputs.forEach((input) => input.onPointerMoved(callback));
        return this;
    }

    /**
     * @description
     * Register a callback to call when the user is starting fire.
     *
     * @param {Function} callback
     *
     * @returns this
     */
    onFireStart(callback) {
        this.inputs.forEach((input) => input.onFireStart(callback));
        return this;
    }

    /**
     * @description
     * Register a callback to call when the user is ending fire.
     *
     * @param {Function} callback
     *
     * @returns this
     */
    onFireEnd(callback) {
        this.inputs.forEach((input) => input.onFireEnd(callback));
        return this;
    }
}
